"""Copy guides from a Git revision and optionally import its regenerated API."""
import io
import json
import re
from pathlib import Path, PurePosixPath
import subprocess
import sys
import tarfile

root = Path(__file__).resolve().parent.parent
checkout = Path(sys.argv[1]).resolve()
ref = sys.argv[2] if len(sys.argv) > 2 else "origin/develop"
commit = subprocess.check_output(["git", "-C", str(checkout), "rev-parse", "--verify", f"{ref}^{{commit}}"], text=True).strip()
nugget_revision = subprocess.check_output(
    ["git", "-C", str(checkout), "rev-parse", f"{commit}:third_party/nugget"], text=True
).strip()
api_checkout = Path(sys.argv[3]).resolve() if len(sys.argv) > 3 else None
paths = ["docs", "knowledge/architecture.md", "knowledge/maintainers/resources.md", "knowledge/maintainers/testing.md", "README.md", "LICENSE", "THIRD_PARTY_NOTICES.md", "runtime/README.md", "runtime/THIRD_PARTY_NOTICES.md", "examples/rpg-2-5d-demo/README.md", "examples/rpg-2-5d-demo/preview.png", "resources/branding/epok.png", "resources/branding/epok-lockup.png", "resources/branding/README.md"]
paths += ["VERSION", "examples/timeline-spell/README.md", "resources/templates/dungeon-complete/README.md"]
# Some examples were removed from newer engine revisions. Only archive paths
# present in the selected commit; callers must retire routes for removed guides.
paths = [p for p in paths if subprocess.run(
    ["git", "-C", str(checkout), "cat-file", "-e", f"{commit}:{p}"],
    stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
).returncode == 0]
# These captures predate the public identity and contain obsolete UI branding.
retired_captures = {"editor.png", "blueprint-editor.png", "mcp-preferences.png", "skeletal-preview.png", "third-person-arena.png"}

def public_document(text):
    text = text.replace("https://github.com/franadoriv/epok-engine", "https://github.com/epokengine/epok-engine")
    text = re.sub(r"!\[[^\]]*\]\(([^\n)]+)\)", lambda match: "" if PurePosixPath(match.group(1).split("#", 1)[0]).name in retired_captures else match.group(), text)
    text = re.sub(r"UniQo-to-Epok migration", "migration to Epok Engine", text, flags=re.I)
    text = re.sub(r"Migrating a UniQo game", "Migrating an existing game", text, flags=re.I)
    text = text.replace("The website will be linked when published.", "The website is https://epokengine.github.io/.")
    return text
archive = subprocess.check_output(["git", "-C", str(checkout), "archive", "--format=tar", commit, "--", *paths])
content = root / "content"
content.mkdir(exist_ok=True)
previous = root / "content-manifest.json"
prepared = []
with tarfile.open(fileobj=io.BytesIO(archive)) as tar:
    for member in tar:
        if not member.isfile():
            continue
        relative = PurePosixPath(member.name)
        if relative.is_absolute() or ".." in relative.parts:
            raise ValueError("Invalid archive path")
        if relative.name in retired_captures and relative.parent == PurePosixPath("docs/images"):
            continue
        data = tar.extractfile(member).read()
        if relative.suffix == ".md":
            data = public_document(data.decode("utf-8")).encode("utf-8")
        prepared.append((member.name, relative, data))

if api_checkout:
    api_commit = subprocess.check_output(
        ["git", "-C", str(api_checkout), "rev-parse", "HEAD"], text=True
    ).strip()
    if api_commit != commit:
        raise ValueError("The regenerated API checkout must use the selected engine commit")
    api_directory = api_checkout / "docs/api"
    for name in ("catalog.json", "coverage.json"):
        data = json.loads((api_directory / name).read_text(encoding="utf-8"))
        if data["nugget_revision"] != nugget_revision:
            raise ValueError(f"{name} must use the selected engine's Nugget revision")
    prepared = [item for item in prepared if not item[1].is_relative_to(PurePosixPath("docs/api"))]
    for source in sorted(api_directory.rglob("*")):
        if source.is_file() and source.suffix in {".md", ".json"}:
            relative = PurePosixPath(source.relative_to(api_checkout).as_posix())
            data = source.read_bytes()
            if source.suffix == ".md":
                data = public_document(data.decode("utf-8")).encode("utf-8")
            prepared.append((relative.as_posix(), relative, data))

# Validate and adapt the complete archive before replacing the previous snapshot.
# A malformed Markdown file must leave the last publishable content intact.
if previous.exists():
    for item in json.loads(previous.read_text(encoding="utf-8"))["files"]:
        target = (content / item).resolve()
        if not target.is_relative_to(content.resolve()):
            raise ValueError("Invalid previous content path")
        target.unlink(missing_ok=True)
files = []
for name, relative, data in prepared:
    target = content.joinpath(*relative.parts)
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(data)
    files.append(name)
previous.write_text(json.dumps({"repository": "https://github.com/epokengine/epok-engine", "commit": commit, "nugget_revision": nugget_revision, "files": sorted(files)}, indent=2) + "\n", encoding="utf-8")
print(f"Synced {len(files)} files from {commit[:12]}")
