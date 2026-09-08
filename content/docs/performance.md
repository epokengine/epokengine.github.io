# Native PSX performance

`uniqo::performance_stats` contains the last completed frame. Timings use the runtime scanline counter (approximately 64 microseconds per unit), rather than Windows or editor FPS. `uniqo::time.frame_microseconds` measures the interval between runtime frames. GPU rasterization and presentation are not independently measured.

## Counters and timing

The counters cover simulation, world synchronization, collision synchronization, mesh rendering, vertex transformation/projection, polygon processing, shading, fog and emission.

Timings are nested: simulation includes its world/collision queries, collision includes world synchronization, rendering includes vertices and polygons, and polygons include shading/fog/emission. Do not sum nested fields. The 16-bit timer difference wraps after approximately 4.2 seconds per scope.

Work counters report simulation steps, synchronization calls, local/world matrix rebuilds, collider-bound rebuilds and GTE/software vertex counts. A synchronization call does not imply a matrix rebuild.

Additional fields report mesh chunks tested/visible, backfaces, clipped polygons, emitted triangles, frame work before and after mesh rendering (`prepare`, `finish`), retained triangles and retained-packet rebuilds. With `UNIQO_PROFILE_DETAIL=1`, per-quad shade/fog/emit timers, chunk setup and camera/sprite/HUD timers are also populated. Release builds leave those detail fields at zero. Reading extra timers adds work, so detail-build timings are not release measurements.

GTE validation counters are populated only with `UNIQO_VALIDATE_GTE=1`. Validation compares GTE and software results within the runtime's coordinate and screen tolerances; its extra work also affects timing.

## Transform and collision reuse

The transform cache compares nine local scalar values at synchronization boundaries. Direct script writes remain supported, including immediate spatial queries within a simulation tick. Changes propagate through parent chains regardless of slot order; generation changes, scene resets and invalid/cyclic ancestry are handled. The runtime still scans transforms because scripts expose mutable fields.

Collider AABBs are reused by world revision and local box values. Layer/mask, trigger, activation and generation metadata remain live. Conservative swept bounds reject unreachable candidates before the Q24 collision calculation; exact endpoint contacts and thin-obstacle sweeps remain supported.

Contiguous entity slots allow pointer validation and index lookup. Collision queries stop at the highest enabled slot, and trigger pairing is skipped when no enabled trigger exists while preserving exit events. Empty particle systems do not request an extra world synchronization per tick.

## Mesh rendering

Object/view composition is shared by an object's mesh chunks. Zero Euler rotations bypass trigonometry. Normal cofactor matrices are shared within an object's draw, preserving non-uniform scale and shear.

Six-bit frustum outcodes discard fully invisible polygons before shading and avoid irrelevant clipping planes. Eligible backfaces and degenerate triangles are discarded before attribute work.

The GPU drawing area handles lateral pixel clipping when projected vertices are valid and spans fit hardware limits: 1023 horizontally and 511 vertically. Near/far intersections and oversized spans retain software clipping. Edge texture interpolation and ordering can differ from software subdivision.

The polygon loop classifies triangles, prepares packed packet attributes and submits GPU primitive words. Material page words are reused until texture or blend mode changes; unlit face colors and modulated packet values are cached per material color. The exporter bakes eight-bit page UVs for editable meshes, with a Q12 fallback for other geometry.

Vertex projection uses GTE RTPS. Local vertices use Q8 coordinates, Q12 rotation remains exact, and row Y is negated for the GPU. Saturation and divider overflow select a software fallback. Each object uses one GTE matrix with chunk origins added to vertices, so vertices shared between chunks receive identical inputs.

For uniformly scaled rotations within the runtime tolerance, lighting rotates its matrix into object space and shades stored normals with GTE NCS. Shear and non-uniform scale retain the cofactor normal transform.

## Retained HUD and geometry

The HUD retains its fragment block per display parity. A layout key includes hierarchy, canvas/rect, image, progress and text state. An unchanged block is re-chained between no-op bookends; changes and scene resets rebuild it.

Static geometry retention is controlled by `rendering.retained_geometry`, enabled by default. Each retained quad owns two fixed fragment slots per parity buffer. The per-frame path allocates from the opposite end of that capacity to avoid overlap.

Rebuilds write packet attributes for one parity while the other parity is transferred. Each frame still classifies triangles, updates screen coordinates and links ordering-table fragments. Rebuild keys include geometry, textures, baked colors, entity generation, material state, lighting flags, world basis and the current light data.

Skeletal meshes and scrolling quads use the per-frame path. An object containing both static and scrolling quads runs both paths. Fog updates packet colors while active and restores retained colors when it stops.

Retention uses one 28-byte record per scene quad (`render_capacity / 2` records), plus keys per entity slot, in static memory. Fragment buffers already exist. Ranges are reclaimed on scene reset; a reused entity slot with different geometry allocates a new range.

## Compilation and measurement

Release builds optimize the runtime's `main.o` with `-O2`; PsyQo and game scripts retain their configured options. `UNIQO_RUNTIME_OPT=-Os` permits comparison. Rebuild `main.o` after changing optimization, detail or validation flags.

When using the editor, rebuild it after runtime source changes because it embeds those sources. Standalone C++ exports contain their own runtime snapshot and are rebuilt with their included Makefile.

Use the same scene, input sequence, resolution, build mode and instrumentation for comparisons. Track dropped simulation steps and primitives alongside timings, and inspect rendered frames for regressions. Changing camera position, visible geometry, HUD content or particles can change the measured workload.

Capacity limits are not frame-rate guarantees. Emulator measurements describe the tested workload; physical-console timing and GPU/presentation costs require separate validation. No scene-specific benchmark results are bundled with this guide.
