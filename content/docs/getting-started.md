# Getting started

## Requirements

Use Windows x64, Git, rustup, Visual Studio Build Tools with the Desktop development with C++ workload, and a Windows SDK. A DirectX 12 graphics adapter is needed for the editor. Python 3.10 or newer is needed only for the local verification scripts. VS Code is optional.

Use a checkout path without spaces. The upstream MIPS Makefiles do not escape every path. Other desktop platforms have not been validated.

## Install and run

```powershell
git clone https://github.com/franadoriv/UniQo.git
cd UniQo
powershell -ExecutionPolicy Bypass -File tools/setup.ps1
cargo run --locked
```

Use a normal clone. Setup initializes only `third_party/nugget`; do not use recursive submodule initialization for this pinned SDK. Nugget's mirror contains an unrelated xmake submodule with an inconsistent path.

Exact SDK and download versions are recorded in [dependencies.json](../tools/dependencies.json). Setup verifies archive SHA-256 hashes and checks installed distribution files against those archives, including DLLs, headers and licenses. Existing source changes or a different Nugget revision produce an error rather than being overwritten.

If an installation was interrupted or its distribution files changed, preserve any intentional edits and run:

```powershell
powershell -ExecutionPolicy Bypass -File tools/setup.ps1 -Repair
```

Repair restores distribution files from verified archives and leaves extra files alone. It does not reset SDK source changes. If an archive checksum is wrong, move that archive aside and rerun setup to download it again. Keep the archives in `.tools/` so later validation does not need to download them.

Source ZIP downloads omit submodule content. Setup can fetch the same pinned Nugget revision when run from an extracted source archive.

## Common development commands

The root `Makefile` provides the same Cargo-based commands across host systems. GNU Make is a convenience for developers; direct Cargo commands remain supported. Windows is still the only validated editor/PSX environment. The common targets do not supply macOS/Linux graphics integration, native build prerequisites or PSX tools.

After setup, Windows already has GNU Make under `.tools/mips/bin/`. Use it directly, or add a session-local PowerShell alias:

```powershell
Set-Alias make (Resolve-Path .tools/mips/bin/make.exe).Path
make help
make run
make run PROJECT=examples/sample-game
make release
make check
```

The alias only affects the current PowerShell session. Before the first setup, use the PowerShell setup command above, or `make setup` if GNU Make is already installed. On macOS/Linux the common targets use GNU Make and Cargo from PATH; `make setup` reports that dependency provisioning is not implemented for those hosts.

| Command | Result |
| --- | --- |
| `make run` | Build and open the debug editor Hub |
| `make run-release` | Build and open the optimized editor |
| `make build` | Compile the debug editor |
| `make release` | Compile the optimized editor binary |
| `make check` | Check formatting, run default tests, strict Clippy and a debug build, stopping on failure |
| `make test` / `make lint` | Run default tests or strict Clippy separately |
| `make fmt` / `make fmt-check` | Apply formatting or check it without edits |
| `make setup` / `make setup-repair` | Verify/install Windows PSX dependencies or repair their distribution files |
| `make build-psx` | Compile the sample game for PSX; override with `PROJECT=...` |

`PROJECT` is optional for `run` and `run-release`; quote the assignment for a project path containing spaces. `ARGS` forwards additional editor arguments. For example:

```powershell
make run "PROJECT=D:/Games/My Game"
make run PROJECT=examples/sample-game "ARGS=--window-size 1024x720 --screenshot artifacts/editor.png"
make build-psx PROJECT=examples/sample-game
```

Run Make from the repository root, or use `make -C <checkout> ...`. Relative project and capture paths resolve from that root. Cargo's normal environment configuration remains available, including `CARGO_TARGET_DIR`.

With the default Cargo target directory, `make release` writes `target/release/uniqo-editor.exe` on Windows. Unix host builds use `target/release/uniqo-editor` without `.exe`. This command builds the editor for the current host; it does not cross-compile or assemble a portable release ZIP, bundle PSX tools or create an installer. Those packaging steps are separate future work.

## First session

1. In **Projects**, choose a name/location, select **Sample game**, and click **Create project**. Then select **Cube** in Hierarchy. The sample attaches **Spinner** to it.
2. Use **Edit Script** in Inspector to open its original C++ source in VS Code.
3. Save a change. With Auto compile enabled, the editor waits 700 ms after a write and compiles in the background.
4. Double-click a compiler diagnostic in Console to open the corresponding original script and line.
5. Press **Play** to compile and run in PCSX-Redux. Click Game to send keyboard input to the emulated controller.
6. Use Pause/Resume, Step and Stop, then save scene edits with Ctrl+S.

A failed build does not launch an older executable. Changes made to C++ during Play wait until that session stops. Play does not save over the authored scene.

## Configuration

The checked-in `uniqo.config.json` points to the portable tools. To use machine-specific paths, copy it to `uniqo.local.json` and edit the copy. That file is ignored by Git.

The local file **replaces** the editor installation configuration; the two JSON files are not merged. Missing fields use built-in defaults.

| Field | Purpose |
| --- | --- |
| `make` | Make executable |
| `toolchain_bin` | MIPS tools directory, prepended to the child process PATH |
| `nugget` | Nugget SDK directory |
| `emulator` | PCSX-Redux executable |
| `code` | VS Code executable; empty enables discovery |
| `web_port` | Emulator HTTP port, normally 8077 |
| `auto_build` | Fallback; the game manifest owns the initial Auto compile setting |

Relative paths resolve from the editor installation. An optional game-local `uniqo.local.json` instead resolves its overrides from that game folder. Executable names without separators can be resolved through PATH. Port 8077 must be available; UniQo refuses to control a pre-existing emulator session.

Start without arguments to create/open projects, or use `--project <directory>`. Games contain assets and `ProjectSettings/project.json`; runtime and tools stay with the editor. See [Projects](projects.md) for command-line creation, project versioning and portability.

## Build without opening the editor

```powershell
cargo run --locked -- --project examples/sample-game --build-psx
```

Output is written to the selected project's `.uniqo/build/uniqo.ps-exe`, with ELF and map files beside it. Edit `assets/scripts/`, not the staged copies under `.uniqo/build/`.

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
- **No suitable graphics adapter:** verify DirectX 12 support and graphics drivers. GPU-free unit tests can still run.
