# Local testing for Epok maintainers

Run checks from the repository root. GitHub Actions is not configured; validation is performed locally.

`make check` runs the four editor checks below sequentially and stops on the first failure. On Windows after setup, use `.\.tools\mips\bin\make.exe check` if Make is not on PATH. The root Makefile also exposes `test`, `lint`, `fmt-check`, `build` and `release` individually; native emulator checks remain separate.

## Editor checks

Rustup selects the pinned toolchain. These checks do not launch the emulator:

```powershell
cargo fmt --all -- --check
cargo test --locked
cargo clippy --locked --all-targets -- -D warnings
cargo build --locked
```

Unit tests cover scene hierarchy, transforms, export generation, lighting, HUD, picking, transport decoding, asset recovery/import transactions, WAV/MP3/ADPCM quality and XA sector spacing and Dear ImGui interaction without a desktop window. Tests requiring a graphics adapter or real emulator are explicitly ignored by the default run.

After SDK setup, `python tools/extract_hud_font.py --check` verifies that the committed editor HUD font matches the pinned PsyQo font. Omit `--check` to regenerate the bitmap when intentionally updating that resource.

## MCP integration

After `cargo build --locked`, run `python tests/integration/mcp.py` to launch an isolated editor project and exercise HTTP/stdio negotiation, scene edits, Undo/Redo, camera changes, real Scene/HUD/editor screenshots and audio import. Add `--emulator` to compile and run the sample in PCSX-Redux, send controller input, Pause/Step, capture Game and Stop. `--editor <path>` selects an alternate binary, including a release build. These checks need a desktop GPU; the emulator option also requires SDK setup. Preferences and captures stay in the test's `.epok/mcp-integration-*/` directory, leaving the user's MCP preference unchanged.

Unit tests also cover disabled defaults, key migration, port conflicts, Host/Origin/authentication rejection, listener shutdown, stale edits, atomic batch failure, file backups and cancelled/expired queued requests. `--screenshot-mcp-settings` opens the AI / MCP preference page for visual checks.

## Native PSX checks

Blueprint foundation checks after `cargo build --locked --bins` and SDK setup:

```powershell
cargo test --locked blueprint_creation_dialog_reflects_inherits_attaches_and_undoes -- --ignored --nocapture
python tests/integration/verify_reflection.py --emulator
python tests/integration/verify_projects.py
python tests/integration/verify_project_registration.py
```

The ImGui test creates/attaches inherited native classes through production controls using real Clang. Reflection acceptance rebuilds a standalone export and checks inherited behavior, independent properties and scene-bank resets in emulator RAM; do not run it alongside another Play session on 8077. `--keep` retains its isolated temporary project for diagnosis. Registration tests use a unique HKCU test subtree and do not alter live file associations. Capture the real dialog with `--screenshot-script-dialog --screenshot <path>`; live Windows click-through and double-click launch still need an unlocked desktop.

For runtime features, run the host C++ suites and emulator acceptance checks:

```powershell
python tests/runtime/verify_spatial.py
python tests/runtime/verify_sprites_particles.py
python tests/runtime/test_compare_runtime.py
python tests/runtime/test_stream_pool_layout.py
python tests/integration/verify_rpg.py
python tests/integration/verify_streaming.py
python tests/integration/verify_streaming_xa.py
```

The two host runners cover input, time, collision, transform caching, lifecycle,
Memory Card recovery, utility services, palettes, frustum/polygon processing and
sprite/particle pools. They require a C++20 compiler and the pinned Nugget sources.
Streaming checks use isolated projects on ports 8092 and 8093 and require the
configured CD authoring tools. For diagnostic assertions, benchmark methodology
and regression gates, see the internal
[performance validation workflow](../performance-testing.md).
All native acceptance checks require a built editor, configured MIPS tools and PCSX-Redux;
run them sequentially. The RPG check covers sprite depth/blending,
camera projection, resource counters, palette animation, scene transitions,
object handles, particle capacity/expiry and input/timing behavior. Feature limits
are documented under [Sprites and particles](../../docs/sprites-particles.md),
[Cameras and resources](../../docs/camera-resources.md), [Runtime services](../../docs/runtime-services.md)
and [Input and collision](../../docs/input-collision.md).

Run dependency setup first. Integration scripts use Python 3.10 or newer and its standard library; no Python packages are required. The scripts default to `target/debug/epok-editor.exe`. Close a running editor before rebuilding that executable.

```powershell
cargo run --locked -- --project examples/sample-game --build-psx
python tests/integration/verify_projects.py
python tests/integration/verify_audio_assets.py
python tests/integration/verify_bgm.py
python tests/integration/verify_pipeline.py
python tests/integration/verify_hierarchy.py
python tests/integration/verify_hud.py
python tests/integration/verify_display.py
python tests/integration/verify_lighting.py
python tests/integration/verify_blockout.py
cargo test --locked live_video_input_pause_step_and_cleanup -- --ignored --nocapture
```

Run these **sequentially**, with no other Play session using port 8077.

| Check | Evidence |
| --- | --- |
| Projects | External folders with spaces, creation, version rejection, overwrite protection, relocation, startup scene, cache regeneration and basic/sample builds |
| Audio/assets | Closed-project moves, source/cache loss, UUID conflicts, snapshot reimport, actual SPU decoded samples, loops, stop/play, volume/pitch and 24-voice priority |
| Pipeline | PS-X EXE output, incremental script objects, C++ failure/recovery, animation, pause/resume and cleanup |
| Hierarchy | VRAM comparison of nested and equivalent world transforms, parented cameras and animated parents |
| HUD | Pixel equality for authored and C++-created HUDs; runtime component updates |
| Display | All ten native output modes, default 640 x 480, projection aspect, HUD corners/font and emulator filtering |
| Lighting | Baked/GTE agreement, normals, light budgets, range, shadows, native creation and saved bake caches |
| Blockout | Mesh UUID relocation/conflicts, material slots and instance overrides, window openings, chunk rejection, near-plane clipping, backface rejection and sloped baked/GTE normal agreement measured from native VRAM/RAM |
| Live bridge | Changing video, controller press/release, stable pause, one-VBlank step and process cleanup |

Hierarchy, HUD and lighting accept `--exe <path>` for an alternate editor build. Verification creates isolated temporary game projects under `.epok/`; the pipeline check also builds the sample project. Reports, screenshots and memory captures go to ignored `artifacts/`.

## Blueprint acceptance

Build both editor and reflection extractor with `cargo build --locked --bins`.
The ordinary Rust suite covers schema/IR/compiler, stable identities, linked
templates, typed references, editing transactions, and debug protocol validation.
Additional target and native UI checks are:

```powershell
python tests/runtime/verify_blueprint_runtime.py
python tests/runtime/verify_blueprint_bridge.py
cargo test graph_canvas_creates_connects_drags_and_undoes_using_imgui_events -- --ignored --nocapture
python tests/integration/verify_blueprints.py --keep --emulator
python tests/integration/verify_blueprint_features.py --keep --emulator
python tests/integration/verify_blueprint_performance.py --keep --emulator
```

Serialize emulator tests. The runtime harness runs host contract assertions and
compiles actual pinned MIPS/PsyQo/EASTL headers; the Lua protocol harness mocks
emulator services and is not a real-breakpoint acceptance substitute.
For that acceptance, set `EPOK_BP_DEBUG_PROJECT` to the retained inheritance
fixture's relocated project, then run
`cargo test live_blueprint_breakpoint_snapshot_step_resume_and_cleanup -- --ignored --nocapture`.

The performance fixture compares equivalent arithmetic at 1/16/64 instances
under common `-Os` optimization, verifies native RAM results, and reports linked
sections, the measured function's prologue frame, and guest interpreter cycles.
It does not measure peak stack/RAM, hardware timing, or FPS. Native/debug builds
are kept separate. See `docs/blueprints.md` for reproducible example generation
and `design-qa.md` for actual desktop evidence.

## Screenshots and profiling

```powershell
cargo run --locked -- --screenshot artifacts/projects-hub.png
cargo run --locked -- --project examples/sample-game --screenshot artifacts/editor.png
cargo run --locked -- --project examples/sample-game --screenshot-game --screenshot artifacts/editor-game.png
cargo run --locked -- --project examples/sample-game --profile-editor
cargo run --locked -- --project examples/sample-game --profile-scene
cargo run --locked -- --project examples/sample-game --profile-scene-cpu
```

These commands need a desktop graphics adapter. Game screenshots also need the emulator. Captures are taken from application/emulator rendering. Inspect them before copying selected product images to `docs/images/`; keep machine paths and logs out of published screenshots.

Add `--window-size 1024x720` (or `1280x720`, `1440x900`) to reproduce compact and wide layouts. Check Scene/Game toolbars, Inspector fields, asset columns, settings footers and floating tools at each size. `--screenshot-hud`, `--screenshot-lighting`, `--screenshot-imports`, `--screenshot-import-dialog`, `--screenshot-project-settings` and `--screenshot-editor-preferences` open their respective views. Audio captures need an imported AudioClip in the project.

The ImGui interaction check includes a real modal regression: it verifies that normalizing reordered draw indices for imgui-wgpu 0.25 preserves each command's geometry, preventing modal dimming from covering dialog controls.

Timing depends on the scene, machine and build mode. GPU preview timings do not measure native PSX game performance.

For a project containing an EditableMesh, add `--screenshot-blockout --screenshot artifacts/blockout.png` to open and capture its Blockout panel. Unit tests also exercise primitive winding, welded corners, ramp/triangle extrusion and subdivision, validation, stale-write protection, shared editing, extraction Undo/Redo, same-asset baked shadow occlusion and real ImGui editing buttons.

Blockout keyboard tests cover E/Q extrusion, inward displacement, edge picking, Q bevel and navigation shortcut suppression. Topology tests verify watertight bevel/ramp generation and atomic rejection of unsupported cuts. Camera tests check in-place free look, movement directions and frame-rate-independent flight; mouse capture also needs desktop verification on the target window system.

## Native runtime profiling

The included profiler defaults to `examples/rpg-2-5d-demo`. It uses that project's optional `Local.epokconfig`, otherwise the engine's local or default tool configuration. Build the editor first and keep the selected project and emulator port free during each run.

```powershell
cargo build --locked
python tools/profile_runtime.py --output artifacts/performance/demo
python tools/profile_runtime.py --output artifacts/performance/demo-detail --detail
python tools/profile_runtime.py --output artifacts/performance/demo-validation --validate-gte
python tools/compare_vram.py artifacts/performance/demo/vram.bin artifacts/performance/demo-validation/vram.bin --png artifacts/performance/diff.png
```

Run these commands from the engine checkout. `--project` selects a different game project; `--optimization Os` or `--optimization O2` compares runtime compilation options. Detail and validation timers add work, so do not interpret their frame times as release performance. The helper invalidates the instrumented runtime object after a run so the next normal build can rebuild it.

The profiler generates `profile.json`, `vram.bin` and logs in the requested output directory. VRAM comparisons require matching scene state and display settings; animated effects can differ between captures. See [Performance](../../docs/performance.md) for counter semantics and measurement limits.

## Clean-checkout verification

Before publishing structural or dependency changes, validate a separate checkout or source snapshot containing only publishable files. Run setup with an empty `.tools/`, initialize the pinned SDK without nested recursion, and build with a fresh Cargo target directory.

Compile the sample PS-X EXE with no pre-existing SDK objects. Check the standalone C++ export and its README/license files. Finish with the runtime integration checks. Cargo's downloaded dependency cache may be reused, but previous compiled project/SDK outputs must not be needed.

After validation, verify that generated files remain ignored and Nugget source remains clean.

`verify_bgm.py` imports a generated stereo MP3 as SFX and XA, removes the source/cache and moves the package while closed, then builds/boots BIN/CUE. It DMA-reads the emulated SPU CD capture buffers and checks stereo decoding alongside a sample voice, loops, stop/restart/retrigger, music priority, switching and mono one-shot completion. Evidence is saved as `artifacts/bgm-*`. It needs the complete setup tools and port 8077. Physical-console XA timing/audio remains unverified.


Skeletal validation: `cargo test --locked skeletal_tests` compares quantized poses with the FBX evaluator and checks reimport consistency. `python tests/integration/verify_skeletal.py` compiles for MIPS, compares native poses, verifies changing GPU output in PCSX-Redux and captures the UI.

Python validation and migration tools require `python -m pip install -r tools/requirements.txt`. See [document formats](../../docs/formats.md) for YAML and the UniQo-to-Epok migration.
