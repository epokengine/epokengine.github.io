# Native PSX performance

`epok::performance_stats` contains the last completed frame. Timings use the runtime scanline counter (approximately 64 microseconds per unit), rather than Windows or editor FPS. `epok::time.frame_microseconds` measures the interval between runtime frames. GPU rasterization and presentation are not independently measured.

## Counters and timing

The counters cover simulation, world synchronization, collision synchronization, mesh rendering, vertex transformation/projection, polygon processing, shading, fog and emission.

Timings are nested: simulation includes its world/collision queries, collision includes world synchronization, rendering includes vertices and polygons, and polygons include shading/fog/emission. Do not sum nested fields. The 16-bit timer difference wraps after approximately 4.2 seconds per scope.

Work counters report simulation steps, synchronization calls, local/world matrix rebuilds, collider-bound rebuilds and GTE/software vertex counts. A synchronization call does not imply a matrix rebuild.

The general profiler also reads linked `sequence_stats`, `effect_stats` and
`particle_stats`. Its `playback` report includes active/alive and peak counts,
completed/cancelled work, skipped bindings/events, dropped effects/particles and
diagnostic overflow. Unlinked services are reported as unavailable. Counts come
from each sampled RAM snapshot; they are not separate completed-frame timers.
The report separates current gauges from cumulative counters, preserves startup
totals, reports capture deltas and flags observed resets and saturation. Sampled
maxima can miss activity between samples; runtime peak counters retain their own
high-water marks. A saturated drop counter cannot quantify further lost work.

Additional fields report mesh chunks tested/visible, backfaces, clipped polygons, emitted triangles, frame work before and after mesh rendering (`prepare`, `finish`), retained triangles and retained-packet rebuilds. With `EPOK_PROFILE_DETAIL=1`, per-quad shade/fog/emit timers, chunk setup and camera/sprite/HUD timers are also populated. Release builds leave those detail fields at zero. Reading extra timers adds work, so detail-build timings are not release measurements.

The descriptive `streamed_chunks` counter is collected only with
`EPOK_PROFILE_DETAIL=1` (`tools/profile_runtime.py --detail`). Ordinary builds
store `UINT32_MAX` in its existing field; profiler JSON exposes this as `null`
(not collected), not zero streamed chunks. This preserves the runtime ABI.
Read, failure, timeout and dropped-geometry counters remain active independently
of this diagnostic. Compare builds with matching instrumentation; `--detail`
adds timing and counter overhead and is not a release FPS measurement.

GTE validation counters are populated only with `EPOK_VALIDATE_GTE=1`. Validation compares GTE and software results within the runtime's coordinate and screen tolerances; its extra work also affects timing.

## Precomputed chunk visibility

Enable **Precomputed Visibility** under **Project Settings > Engine > Rendering**
to add conservative chunk selection. It is experimental, disabled by default
and may lower FPS. Camera and object transforms remain supported; the setting
does not add occlusion or increase the visible range.

## Retained HUD and geometry

The runtime reuses unchanged HUD and eligible static-mesh packets. Enable
**Retained Packets** in Project Settings to use static geometry retention; it is
on by default. Material, lighting, geometry and transform changes refresh the
packets automatically. Skeletal meshes and scrolling textures use per-frame
packets. Turning retention off provides a comparison and can save RAM.

Streaming bounds retention by the configured triangle budget. Objects that do
not fit use per-frame packets. Monitor native frame timings when adjusting these
options for a game.

## Geometry streaming and frame budgets

**Project Settings > Engine > Streaming** controls geometry CD pages, the RAM
pool, the per-frame triangle budget and preloading. Streaming is experimental,
disabled by default and may lower FPS or stall frames. See
[Geometry streaming](streaming.md) for usage and [Project Settings](settings.md)
for defaults and ranges. Lower triangle budgets save RAM but can omit triangles;
inspect dropped-triangle counters when changing the budget.

## Compilation and measurement

Release builds optimize the runtime's `main.o` with `-O2`; PsyQo and game scripts retain their configured options. `EPOK_RUNTIME_OPT=-Os` permits comparison. Rebuild `main.o` after changing optimization, detail or validation flags.

When using the editor, rebuild it after runtime source changes because it embeds those sources. Standalone C++ exports contain their own runtime snapshot and are rebuilt with their included Makefile.

Use the same scene, input sequence, resolution, build mode and instrumentation for comparisons. Track dropped simulation steps and primitives alongside timings, and inspect rendered frames for regressions. Changing camera position, visible geometry, HUD content or particles can change the measured workload.

Capacity limits are not frame-rate guarantees. Emulator measurements describe the tested workload; physical-console timing and GPU/presentation costs require separate validation. No scene-specific benchmark results are bundled with this guide.
