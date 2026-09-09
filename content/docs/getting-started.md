# Getting started

## Requirements

Use Windows x64 or macOS 11+ on Apple Silicon. Install Git and rustup on either platform. Windows additionally needs Visual Studio Build Tools with the Desktop development with C++ workload and a Windows SDK. macOS additionally needs Xcode Command Line Tools and Homebrew. Python 3.10 or newer is needed only for the local verification scripts. VS Code is optional.

Use a checkout path without spaces. The upstream MIPS Makefiles do not escape every path. Other desktop platforms are not yet supported.

## Install and run

```powershell
git clone https://github.com/franadoriv/epok-engine.git Epok
cd Epok
powershell -ExecutionPolicy Bypass -File tools/setup.ps1
cargo build --locked --bins
cargo run --locked
```

Use a normal clone. Setup initializes only `third_party/nugget`; do not use recursive submodule initialization for this pinned SDK. Nugget's mirror contains an unrelated xmake submodule with an inconsistent path.

On macOS, download the macOS Arm PCSX-Redux release to `/Applications/PCSX-Redux.app`, then run:

```sh
xcode-select --install
./tools/setup-macos.sh
make run
```

The script installs Rust and the MIPS compiler through Homebrew, builds `psxavenc` and mkpsxiso from their pinned source revisions, and writes an ignored `Local.epokconfig` containing the native executable paths. It does not change the shell PATH: use `make run` or `./tools/run-macos.sh` to start the editor.

Exact SDK and download versions are recorded in [dependencies.json](../tools/dependencies.json). Setup verifies archive SHA-256 hashes and checks installed distribution files against those archives, including DLLs, headers and licenses. Existing source changes or a different Nugget revision produce an error rather than being overwritten.

Build/distribute both `epok-editor` and `epok-header-tool`; native reflection uses pinned host libclang from setup. It is not included in PSX games. New projects have a root `.epokproject` descriptor. See [Projects](projects.md) for folder/file opening, explicit legacy migration and optional Windows file association. No registration is required for portable use.

If an installation was interrupted or its distribution files changed, preserve any intentional edits and run:

```powershell
powershell -ExecutionPolicy Bypass -File tools/setup.ps1 -Repair
```

Repair restores distribution files from verified archives and leaves extra files alone. It does not reset SDK source changes. If an archive checksum is wrong, move that archive aside and rerun setup to download it again. Keep the archives in `.tools/` so later validation does not need to download them.

Source ZIP downloads omit submodule content. Setup can fetch the same pinned Nugget revision when run from an extracted source archive.

## Common development commands

The root `Makefile` provides the same Cargo-based commands across host systems. GNU Make is a convenience for developers; direct Cargo commands remain supported. `make setup` provisions Windows or macOS; Linux provisioning is not implemented. macOS support targets Apple Silicon and uses Metal through wgpu.

After setup, Windows already has GNU Make under `.tools/mips/bin/`. Use it directly, or add a session-local PowerShell alias:

```powershell
Set-Alias make (Resolve-Path .tools/mips/bin/make.exe).Path
make help
make run
make run PROJECT=examples/sample-game
make release
make check
```

The alias only affects the current PowerShell session. Before the first setup, use the PowerShell setup command above, or `make setup` if GNU Make is already installed. On macOS, `make setup` runs `tools/setup-macos.sh`; common targets find Cargo through Homebrew when it is not in PATH.

| Command | Result |
| --- | --- |
| `make run` | Build and open the debug editor Hub |
| `make run-release` | Build and open the optimized editor |
| `make build` | Compile the debug editor |
| `make release` | Compile the optimized editor binary |
| `make check` | Check formatting, run default tests, strict Clippy and a debug build, stopping on failure |
| `make test` / `make lint` | Run default tests or strict Clippy separately |
| `make fmt` / `make fmt-check` | Apply formatting or check it without edits |
| `make setup` / `make setup-repair` | Verify/install Windows or macOS PSX dependencies; `setup-repair` rebuilds macOS host tools |
| `make build-psx` | Compile the sample game for PSX; override with `PROJECT=...` |

`PROJECT` is optional for `run` and `run-release`; quote the assignment for a project path containing spaces. `ARGS` forwards additional editor arguments. For example:

```powershell
make run "PROJECT=D:/Games/My Game"
make run PROJECT=examples/sample-game "ARGS=--window-size 1024x720 --screenshot artifacts/editor.png"
make build-psx PROJECT=examples/sample-game
```

Run Make from the repository root, or use `make -C <checkout> ...`. Relative project and capture paths resolve from that root. Cargo's normal environment configuration remains available, including `CARGO_TARGET_DIR`.

With the default Cargo target directory, `make release` writes `target/release/epok-editor.exe` on Windows. Unix host builds use `target/release/epok-editor` without `.exe`. This command builds the editor for the current host; it does not cross-compile or assemble a portable release ZIP, bundle PSX tools or create an installer. Those packaging steps are separate future work.

## First session

1. In **Projects**, choose a name/location, select **Sample game**, and click **Create project**. Then select **Cube** in Hierarchy. The sample attaches **Spinner** to it.
2. Use **Edit Script** in Inspector to open its original C++ source in VS Code.
3. Save a change. With Auto compile enabled, the editor waits 700 ms after a write and compiles in the background.
4. Double-click a compiler diagnostic in Console to open the corresponding original script and line.
5. Press **Play** to compile and run in PCSX-Redux. Click Game to send keyboard input to the emulated controller.
6. Use Pause/Resume, Step and Stop, then save scene edits with Ctrl+S.

A failed build does not launch an older executable. Changes made to C++ during Play wait until that session stops. Play does not save over the authored scene.

## Configuration

The checked-in `Editor.epokconfig` points to the portable tools. To use machine-specific paths, copy it to `Local.epokconfig` and edit the copy. That file is ignored by Git.

The Hub and editor check dependency paths at startup and warn about missing tools,
showing which features need them. Open **Dependencies** in the Hub or
**Edit > Editor Preferences > Dependencies** to inspect the results, edit paths,
or browse for an executable or directory on Windows. **Apply** saves the effective
installation or project `Local.epokconfig`; changes apply to subsequent builds and
imports without restarting. The first replaced local configuration is backed up
under `.epok/dependencies/Local.epokconfig.bak`.

On Windows, **Use bundled paths** selects tools in the current editor installation
and repairs stale path settings after moving a checkout. **Install / Repair**
downloads and verifies only the selected bundled package in the background using
the pinned manifest and SHA-256 checks (Nugget uses its pinned Git revision).
It restores package distribution files, preserves extra local files, and reports
progress or failure in the installation log. Apply the proposed path after a
successful install. Build/Play and dependency changes wait for installation to
finish. On macOS, run `tools/setup-macos.sh`, then **Reload saved paths**.
Repair preserves a package directory junction or symbolic link as a
`.link-backup-*` sibling and installs a real local directory, so links left behind
by a moved installation do not break extraction. Its previous target is untouched.
Installing the MIPS package updates both the GNU Make and compiler path fields.
Discovery checks file presence (and executable permissions on Unix), not binary
compatibility; the build still validates tools when using them.

The local file **replaces** the editor installation configuration; the two JSON files are not merged. Missing fields use built-in defaults.

| Field | Purpose |
| --- | --- |
| `make` | Make executable |
| `toolchain_bin` | MIPS tools directory, prepended to the child process PATH |
| `nugget` | Nugget SDK directory |
| `emulator` | PCSX-Redux executable |
| `psxavenc` | XA audio encoder executable |
| `libclang` | C++ reflection library directory; empty uses the bundled library |
| `mkpsxiso` | CD image builder executable |
| `code` | VS Code executable; empty enables discovery |
| `web_port` | Emulator HTTP port, normally 8077 |
| `auto_build` | Fallback; the game manifest owns the initial Auto compile setting |

Relative paths resolve from the editor installation. An optional game-local `Local.epokconfig` instead resolves its overrides from that game folder. Executable names without separators can be resolved through PATH. Port 8077 must be available; Epok refuses to control a pre-existing emulator session.

Start without arguments to create/open projects, or use `--project <directory>`. Games contain assets and a root `.epokproject` YAML descriptor; runtime and tools stay with the editor. See [Projects](projects.md) for command-line creation, project versioning and portability.

## Build without opening the editor

```powershell
cargo run --locked -- --project examples/sample-game --build-psx
```

Output is written to the selected project's `.epok/build/epok.ps-exe`, with ELF and map files beside it. Edit `assets/scripts/`, not the staged copies under `.epok/build/`.

For a bounded emulator run:

```powershell
cargo run --locked -- --project examples/sample-game --play-psx --stop-after 10
```

## Troubleshooting

- **Host linker missing:** install the Visual Studio C++ workload and Windows SDK.
- **MIPS compiler or SDK missing:** rerun setup and inspect the configuration paths.
- **SDK revision mismatch:** preserve local changes, then update only the Nugget submodule to the recorded revision.
- **Port busy:** stop the other session or choose a free port in the local configuration. Integration scripts currently require 8077.
- **Layout unusable:** use Layout > Default or Window > Reset Layout.
- **Executable locked during compilation:** close the running editor before rebuilding it.
- **No suitable graphics adapter:** on Windows, verify DirectX 12 support and graphics drivers; on macOS, verify Metal support and macOS updates. GPU-free unit tests can still run.

Python validation and migration tools require `python -m pip install -r tools/requirements.txt`. See [document formats](formats.md) for YAML and the migration to Epok Engine.
