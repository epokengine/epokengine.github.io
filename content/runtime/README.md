# UniQo C++ runtime

This runtime executes exported scenes and C++ components natively on PlayStation using PsyQo, Q12 fixed-point arithmetic, Gouraud triangles and ordering tables.

See [native performance](docs/performance.md) in a standalone export for frame
counters, transform/collision caching, GTE geometry, clipping paths and profiling.

Inside the UniQo repository, build through the editor or `cargo run --locked -- --project examples/sample-game --build-psx`. The instructions below apply to a **generated standalone export**, which includes `scene.hh`, `sources.mk`, `scene.uniqo.json` and a `scripts/` directory. The unexported runtime directory alone is not a complete game project.

## Build an exported project

Install GCC MIPS 16.2.0 and Make, and put their binaries on PATH for the current shell. Use a path without spaces.

From the export directory:

```sh
git clone --no-checkout https://github.com/pcsx-redux/nugget.git third_party/nugget
git -C third_party/nugget checkout --detach 6186b131aacc5853a9161fb076ed34ffe504552d
make BUILD=Release NUGGET_DIR=third_party/nugget
```

Do not initialize Nugget's nested submodules recursively. They are not required by this PsyQo build, and this mirror revision contains an unrelated invalid submodule path.

Output is `uniqo.ps-exe`. The ELF and map files support debugging. The exported Makefile requires an explicit `NUGGET_DIR` when the SDK is elsewhere. For an existing portable UniQo setup, prepend its `.tools/mips/bin` to the current shell's PATH and point `NUGGET_DIR` to its `third_party/nugget`.

The exported game does not require the Rust editor or Lua. Run the PS-X executable using a compatible emulator or a suitable console loading method. Music-enabled exports require the generated CD image as described below. Hardware validation is still pending.

## Scene and scripts

The first active Camera defines the view unless selected through `set_active_camera`; a default view is used if absent. Cameras expose FOV and `camera_project` converts world points to framebuffer coordinates. Transform values are local to the parent. After script updates, the runtime composes parent-first matrices and reuses them for rendering. Empty entities participate in the hierarchy without emitting geometry. Cameras use the inverse of their inherited transform.

Properties are assigned before `start`. Measured elapsed time drives a fixed 60 Hz simulation, with at most eight recovery steps per frame. Q12 steps alternate 68/69 raw units to preserve elapsed simulation time. `time.set_paused` pauses simulation; `frame_update` still runs for pause-menu input. Keep transforms inside the Q12 renderer bounds, and do not modify parent indices or create cycles manually.

`entity()` returns the Behaviour's owner. `get<T>()`, `add<T>()` and `remove<T>()` access, enable and disable supported components. Transform remains available. `find_entity(name)` returns the first matching entity.

`create_entity(name, parent)` returns an entity pointer or null when the 32 additional slots are occupied. `destroy_entity` and `set_active` operate on subtrees. Use `EntityHandle` for references that must detect destruction and slot reuse. Do not modify `object_count` directly.

## Display

The generated `display.hh` selects the native NTSC output dimensions. The default is 640 x 480 interlaced; Project Settings also offers 256/320/368/512/640 widths at 240 progressive or 480 interlaced lines. Projection preserves the 4:3 camera view. High-resolution output costs more GPU fill work and interlacing may flicker on a CRT.

## Materials and lighting

Each object has an RGB material. Unlit uses that color directly. Baked Vertex uses colors prepared by the editor; Realtime uses bounded GTE lighting with one directional and one point light per object. Mixed lights contribute to the bake or realtime receivers without doubling their contribution.

`Light`, `MeshLighting` and `BlobShadow` are available through the component API. Ambient lighting is held in `lighting_environment`. `lighting_stats` reports the last complete frame's counters and CPU timing in video scanlines (approximately 64 microseconds), excluding the final GPU wait.

Baked receivers and their ancestors must remain static. C++ light changes do not regenerate baked shadows or geometry. Blob shadows use eight triangles on an axis-aligned horizontal floor, with up to 32 visible shadows. Textured meshes preserve baked and GTE lighting. Materials support color modulation, cutout and the four PSX semitransparency modes.

## Editable geometry

EditableMesh assets compile into linked spatial `MeshGeometry` chunks with relative Q12 positions, bounds, face normals, material colors and baked-color offsets. The runtime rejects chunk bounds before vertex transformation, then clips triangles against the frustum and rejects backfaces. Group names and editable source data stay on the host. Scene material overrides are compiled into face materials; the legacy cube tint is initialized to white for these objects.

`mesh_stats` reports tested/visible chunks, transformed vertices, rejected backfaces and clipped input triangles. Use it with `lighting_stats.dropped_triangles` and frame timing to profile a level. The clipping reserve is bounded; capacity limits do not guarantee frame rate. See the editor's Blockout guide for authoring limits.

## HUD

Canvas, RectTransform, Image, Text and ProgressBar belong to the same scene entities. HUD rendering follows the 3D world at the configured output resolution. Anchors and pivots are 0..1; position and Size Delta use Q12 native pixels with +Y up. The 3D Transform does not affect UI layout. Text remains 8 x 16 pixels.

Add RectTransform before graphics, beneath a Canvas or another RectTransform. Text uses the attributed mig68000 8 x 16 bitmap plus derived Spanish glyphs, supports 511 UTF-8 bytes, explicit newlines and optional wrapping.

Image uses a texture index and atlas region; optional nine-slice borders preserve corners. `hud-config.hh` sets layout/rectangle/text/glyph budgets validated by the editor. Excess dynamic draws are counted in `hud_stats`. `utility.hpp` supplies focus, navigation, lists and event queues. Parent masks, text rotation/scaling and world-space Canvas remain outside this profile.

## Textures, sprites and particles

Imported PNGs compile into 8-bit PSX palettes and texture banks. Transparent texels use palette index zero; visible black stays opaque. Framebuffer and bitmap-font space are reserved, and each scene bank's VRAM occupancy is validated. Shared source pixels remain in main RAM and are uploaded when their bank becomes active.

`Sprite` supports atlas regions, pivot, size, flips, fixed/upright/spherical orientation, tint, lighting, blending and ordering bias. `SpriteAnimator` supports timed clips, looping, completion and a bounded event FIFO. Sprites share the world's ordering table and frustum clipping.

`ParticleEmitter` drives an independent 256-particle pool, with continuous/burst emission, seeded spread, velocity/gravity, finite lifetime, size/color interpolation, local/world space and flipbooks. Limits and dropped work are observable through particle and sprite statistics.

`resource_usage` reports slots, active VRAM, resident texture sources and rendering work. `fog_environment` applies vertex depth cueing; materials can scroll UVs with seam subdivision, and `PaletteAnimator` cycles a shared texture's nontransparent CLUT range. See `docs/camera-resources.md`, `docs/environment-effects.md` and `docs/palette-animation.md` for the measurement scope and effect limits.

## Input, world queries and scene lifetime

`input` exposes held/pressed/released states on both physical controller ports. AdvancedPad shares the bus safely with the Memory Card service. Collider queries include overlap, segment raycast, ground and swept kinematic movement, plus trigger enter/stay/exit callbacks.

`request_scene(name)` or `request_scene(size_t(index))` queues one of the exported scene banks. A switch stops outgoing audio, waits for XA callbacks, invalidates handles, clears simulation pools and initializes incoming components/scripts. Banks share one reusable object pool and immutable resources. Their source data is prelinked and must fit main RAM; this is not arbitrary CD map streaming.

`memory_card` offers asynchronous probe/read/write/list with service-owned buffers, paired recovery records and readback verification. It never formats cards automatically. The game's progress format remains project-owned.

`utility.hpp` also supplies value tweens, easing, bounded events and timed sequences. See the exported `docs/` directory for full API examples and limits.

## Licensing

UniQo runtime sources are MIT licensed. A generated export includes `LICENSE`, `THIRD_PARTY_NOTICES.md` and `licenses/`. User-authored game scripts/assets retain their owners' chosen licenses. SDK components and the system font retain their own notices.

PsyQo: https://github.com/pcsx-redux/nugget/tree/main/psyqo
UniQo: https://github.com/franadoriv/UniQo

## Audio

Exports include `audio.hpp`, `music.hpp` and a generated `audio-bank.hh`. SFX clips are resident mono SPU-ADPCM; the editor rejects banks above 508 KiB. Music clips are XA files in `music/` and do not consume that bank. Source recordings and editor import packages are not shipped to the console.

Access an assigned source with `entity().get<uniqo::AudioSource>()`. Both profiles support play/stop, looping, volume and priority. SFX provides 24 voices and pitch control. XA provides one CD stream at fixed pitch; a higher/equal-priority music request can switch tracks. Music loops and changes include a CD seek, so seamless playback is not guaranteed. The CD controller is owned by the music service. `uniqo::music_stats` reports playback state and errors.

When the export contains `disc.xml`, first compile the executable, then use [mkpsxiso 2.30](https://github.com/Lameguy64/mkpsxiso/releases/tag/v2.30) in the export directory:

```sh
mkpsxiso -y disc.xml
```

Outputs are `uniqo.bin` and `uniqo.cue`. Boot the CUE in a compatible emulator, retaining the neighboring BIN. This image uses `SYSTEM.CNF` to load `UNIQO.EXE`; OpenBIOS boot and XA playback are covered by integration tests. No proprietary Sony license sectors or BIOS are distributed; real-console boot depends on the user's loading setup and is not verified. The XA converter is only needed when importing/regenerating assets, not when building a complete export.


Skeletal meshes use `Animator` for clip selection/play/pause/resume/stop. Geometry, skeletons and quantized 30 Hz clips are shared; one bone transforms each vertex. No FBX parser runs on the console. See the editor repository `docs/skeletal.md` for the profile and authoring limits.
