"""Copy published engine documentation from a local Git checkout, never its working tree."""
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
commit = subprocess.check_output(["git", "-C", str(checkout), "rev-parse", ref], text=True).strip()
paths = ["docs", "knowledge/architecture.md", "knowledge/maintainers/resources.md", "knowledge/maintainers/testing.md", "README.md", "LICENSE", "THIRD_PARTY_NOTICES.md", "runtime/README.md", "runtime/THIRD_PARTY_NOTICES.md", "examples/rpg-2-5d-demo/README.md", "examples/rpg-2-5d-demo/preview.png", "resources/branding/epok.png", "resources/branding/epok-lockup.png", "resources/branding/README.md"]
paths.append("examples/timeline-spell/README.md")
# These captures predate the public identity and contain obsolete UI branding.
retired_captures = {"editor.png", "blueprint-editor.png", "mcp-preferences.png", "skeletal-preview.png", "third-person-arena.png"}

def public_document(text):
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
previous.write_text(json.dumps({"repository": "https://github.com/franadoriv/epok-engine", "commit": commit, "files": sorted(files)}, indent=2) + "\n", encoding="utf-8")
print(f"Synced {len(files)} files from {commit[:12]}")
