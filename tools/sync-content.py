"""Copy published engine documentation from a local Git checkout, never its working tree."""
import io
import json
from pathlib import Path, PurePosixPath
import subprocess
import sys
import tarfile

root = Path(__file__).resolve().parent.parent
checkout = Path(sys.argv[1]).resolve()
ref = sys.argv[2] if len(sys.argv) > 2 else "origin/main"
commit = subprocess.check_output(["git", "-C", str(checkout), "rev-parse", ref], text=True).strip()
paths = ["docs", "README.md", "LICENSE", "THIRD_PARTY_NOTICES.md", "runtime/README.md", "runtime/THIRD_PARTY_NOTICES.md", "examples/rpg-2-5d-demo/README.md", "examples/rpg-2-5d-demo/preview.png", "resources/branding/uniqo.png", "resources/branding/README.md"]
archive = subprocess.check_output(["git", "-C", str(checkout), "archive", "--format=tar", commit, "--", *paths])
content = root / "content"
content.mkdir(exist_ok=True)
previous = root / "content-manifest.json"
if previous.exists():
    for item in json.loads(previous.read_text())["files"]:
        target = (content / item).resolve()
        if not target.is_relative_to(content.resolve()):
            raise ValueError("Invalid previous content path")
        target.unlink(missing_ok=True)
files = []
with tarfile.open(fileobj=io.BytesIO(archive)) as tar:
    for member in tar:
        if not member.isfile():
            continue
        relative = PurePosixPath(member.name)
        if relative.is_absolute() or ".." in relative.parts:
            raise ValueError("Invalid archive path")
        target = content.joinpath(*relative.parts)
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(tar.extractfile(member).read())
        files.append(member.name)
previous.write_text(json.dumps({"repository": "https://github.com/franadoriv/UniQo", "commit": commit, "files": sorted(files)}, indent=2) + "\n", encoding="utf-8")
print(f"Synced {len(files)} files from {commit[:12]}")
