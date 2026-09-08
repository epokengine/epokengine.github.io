# Architecture and repository layout

UniQo has two compilation targets: a Rust desktop editor and a native C++ PlayStation runtime. They share scene semantics and are maintained together so changes to serialization, generated code and runtime behavior can be reviewed as one change.

## Ownership

| Path | Owner and purpose |
| --- | --- |
| `src/` | Desktop editor, scene data, preview rendering and build orchestration |
| `resources/editor/` | Editor-owned fonts and icons, embedded in the Rust executable |
| `examples/sample-game/` | Independent demo project and embedded sample-template source |
| `runtime/` | UniQo C++ runtime sources staged into builds and exports |
| `integrations/pcsx-redux/` | Host-side Lua adapter for the external emulator |
| `third_party/nugget/` | Pinned upstream SDK submodule; no local source patches |
| `tools/` | Portable dependency setup and resource regeneration |
| `tests/integration/` | Explicit local checks using the MIPS compiler and emulator |
| `docs/images/` | Curated product screenshots |
| `.tools/` | Ignored downloaded tools and archives |
| `<game>/.uniqo/` | Ignored build staging, emulator state and project lock |
| `<game>/UserSettings/` | Ignored per-project editor layout |
| `artifacts/` | Ignored verification logs, screenshots and memory captures |
| `exports/` | Ignored generated standalone C++ projects |
| `target/` | Ignored Cargo build output |

The repository is the editor installation/development root. New games are identified by one root `.uniqoproject` descriptor; legacy `ProjectSettings/project.json` remains readable and migrates only explicitly. Games own their assets, caches, layout and exports. Folder/file aliases resolve to one canonical root before locking/reflection. Startup without a project shows the Hub.

`reflection_schema`, `header_tool`, `header_extract` and `reflection` define the versioned semantic C++ extraction boundary. libclang runs in a pinned host process, not in the editor or PSX game. `blueprint` exposes the shared picker/Inspector registry; `scripts` adapts legacy metadata and creates native classes; `script_values` handles typed overrides; `script_backend` separates authoring capabilities/artifacts from execution declaration, binding and reset. Non-native/Lua execution remains unavailable with preserved serialized data and explicit diagnostics. See the [foundation status](initiatives/blueprints/foundation-status.md).

`workspace::Project` owns the canonical game root, versioned manifest and OS lock. `Editor` owns that project for the session lifetime. Closing drops the build job before releasing the lock. Runtime sources are embedded in the editor and staged into the selected game's cache. Tool configuration resolves against the editor installation, independently of game paths and the process working directory. See [Projects](../docs/projects.md) for the format and project lifecycle; [Assets and audio](../docs/assets.md) documents portable imported assets and reconciliation.

## Source responsibilities

| Modules | Responsibility |
| --- | --- |
| `workspace`, `hub` | Project creation, validation, locking, recent list and project selection |
| `main`, `platform`, `native` | Entry point, desktop window/GPU and owned emulator window visibility |
| `editor`, `gui`, `hud_editor`, `lighting_editor` | Editor state, actions, panels and interaction |
| `scene`, `transform`, `scripts` | Scene model, hierarchy, persistence and component metadata |
| `viewport`, `scene_gpu`, `picking`, `gizmo` | CPU/GPU previews, selection and transforms |
| `hud`, `lighting`, `shadows` | Layout, baking, lighting and shadow calculations |
| `project`, `export`, `pipeline` | Configuration, generated C++, staging, compilation and process lifecycle |
| `bridge` | Framed emulator video, controller state and transport |
| `mcp`, `mcp_tools`, `mcp_stdio` | Optional loopback MCP server, queued editor operations and stdio compatibility bridge |
| `assets`, `asset_manager`, `asset_ui` | Portable UUID packages, source recovery, import jobs and asset UI |
| `audio_import`, `audio` | AudioSource validation and offline SPU-ADPCM conversion/banks |
| `mesh`, `mesh_editor`, `mesh_compile` | EditableMesh packages, Blockout interaction/history, material slots and spatial PSX geometry compilation |

The Rust editor is one Cargo package. No separate engine crate or runtime repository is required at this stage.

MCP runs an authenticated Streamable HTTP service on a dedicated current-thread Tokio runtime. Network handlers enqueue bounded requests; the window loop performs editor operations and captures textures after rendering. Requests waiting beyond their deadline or cancelled by the client cannot mutate the editor. Server state belongs to the open Editor and is dropped on project close. Preferences enable it explicitly and keep credentials outside game data. The stdio mode only proxies an already running server. See [MCP](../docs/mcp.md) for its public contract.

## Build and execution

1. Resolve the startup scene and registered scene banks, EditableMesh/Texture UUIDs and source documents; validate each bank and prepare stale vertex-lighting bakes.
2. Compile editable faces and UVs into spatial chunks, share immutable texture/audio sources, validate each bank's VRAM and component budgets, stage XA music sectors, and generate `audio-bank.hh`, `scene.hh` and an explicit `sources.mk`.
3. Stage the runtime and original scripts into `.uniqo/build/`.
4. Run Make with the configured MIPS tools and Nugget SDK.
5. Validate the PS-X EXE header, then launch the owned emulator for Play.

Unchanged staged files retain their timestamps, allowing Make to reuse objects. The explicit source list prevents deleted scripts from being linked from an old cache. Nugget may relink even when script objects do not change.

Export stages the same runtime and generated scene into the selected game's `exports/` and includes build instructions and license notices. The exported project uses native C++; it does not need the desktop application to run.

## Preview and emulation

Scene is a wgpu editor preview with depth buffering. Game is the actual emulator display, delivered by the adapter through `PCSX.GPU.takeScreenShot()`, including active-buffer dimensions and 16/24-bit RGB formats.

PCSX-Redux runs externally with OpenBIOS, a software GPU, interpreter CPU and 2 MB RAM. UniQo does not link the emulator into the Rust executable or modify its distribution.

The adapter uses loopback TCP with an OS-assigned port and a per-session identifier. It keeps one request in flight and only the newest video frame. Lua executes on the host inside PCSX-Redux; it is never linked into the PSX game. HTTP controls compilation verification and emulator execution state.

The Game view owns controller focus. Losing focus releases buttons. Stop and cleanup target the emulator process launched by this session.

## Dependency updates

The Nugget gitlink and the revision in `tools/dependencies.json` must agree. Update them together, preserving the selected SDK revision until clean builds and runtime checks pass. Avoid recursive initialization of its unrelated nested submodules.

Keep MIPS tools and emulator versions/hashes in the same manifest. Rust dependencies are resolved by `Cargo.lock`, and the host toolchain is selected by `rust-toolchain.toml`. Do not use floating download URLs or commit build products.

`audio_decode` integrates Symphonia on the host. `music` encodes/interleaves XA with the pinned psxavenc tool. `disc` writes the ISO manifest and invokes mkpsxiso after the native build; music-enabled Play boots the resulting CUE. `runtime/music.hpp` uses PsyQo async CD actions/ISO9660 and leaves sample voices available for SFX.


The [skeletal pipeline](../docs/skeletal.md) converts FBX on the host with ufbx, stores UUID-linked subassets, and emits shared immutable target tables plus independent Animator states. The PSX uses rigid bone transforms and a shared vertex scratch buffer.
