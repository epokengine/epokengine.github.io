# Build, measure and iterate

Recent changes make it easier to tell what is running, what needs rebuilding, and where the PlayStation budget is going. The important distinction is **editing**, **compiling**, and **launching**: related actions, but not the same action.

## Compile when you choose

PSX builds are manual. Source observation still notices changes and refreshes editor resources, but editing a property does not automatically launch the MIPS compiler. Build explicitly, or let Play build when there is no matching valid result.

The editor saves a build receipt in `.epok/build/PlayBuild.epokcache`. A subsequent Play can reuse the executable/disc only when its scene snapshot, profile, scripts, resources and other tracked build inputs match. Relevant changes invalidate reuse. Unsaved current-scene edits participate in the snapshot; an old successful file is not automatically today's valid output.

Automatic [native UI preview](/docs/native-hud-preview/) is a separate desktop workflow and can still refresh while editing.

## Build a useful slice of your game

The Play profile separates destination, scene scope and data source:

| Choice | Options / purpose |
| --- | --- |
| Destination | Embedded emulator, separate emulator window, or physical PSX over serial |
| Scenes | Current scene, whole game, or selected scenes with an initial scene |
| Data source | In executable, CD on demand, or PCDrv host on demand |

The selected-scenes UI has inclusion checkboxes and an initial-scene choice. Up to **16 banks total**, including startup bank zero, can be included. This is useful for a small integration test: build the menu and one arena before adding every map. It does not stream arbitrary assets or bypass the memory budget.

Read [Play targets and loading](/docs/play/) for combinations, save behavior and destination prerequisites.

## Static memory: know what is accounted for

Builds generate Memory Analyzer reports by default. The report can be opened afterward, rebuilt when necessary, or produced from an existing compilation without launching it. Main RAM, VRAM, SPU audio, scratchpad and generated files have separate views.

Use the treemap to find a large category, drill down into allocation rows and follow symbol/source attribution. The status bar reports executable and external-data sizes when backed by current build provenance; changed inputs leave stale warnings.

The PlayStation budgets remain 2 MiB main RAM, 1 MiB VRAM, 512 KiB SPU RAM and 1 KiB scratchpad. Build-time attribution does **not** measure dynamic heap/stack peaks or the worst moment of a scene transition. “Fits statically” and “runs comfortably” answer different questions.

## Runtime Debug HUD: read the numbers correctly

Project settings offer a **Debug HUD** with independently selectable FPS, CPU, GTE, GPU command DMA and SPU sample-memory displays. All off removes the overlay; enabling it adds a bounded drawing cost.

| Display | What it tells you | Do not read it as |
| --- | --- | --- |
| FPS | Observed rendering cadence | A guarantee that every scene reaches that rate |
| CPU | Measured frame work, including in-frame waits, excluding `flip()` | A hardware-wide profiler with every subsystem separated |
| GTE | Time around projection/setup work | Exact geometry coprocessor busy percentage |
| GPU / DMA | GPU command-transfer timing | Rasterizer utilization or fill rate |
| SPU | Resident sample-memory occupancy | Audio processor utilization |

These intervals can overlap. Do not add them together and conclude the console is using 173% of itself. For precise metric definitions and capture caveats, use [Performance](/docs/performance/).

## Smoother motion is not more simulation

**Position Interpolation** smooths supported entity/camera translations when rendering and fixed 60 Hz simulation do not align. It does not increase FPS or change collision/game logic. It can add up to one simulation step of visual latency and does not interpolate rotation, scale, skeletal poses or particles.

For a teleport, reset the interpolation state after changing the transform so the renderer does not briefly draw the trip between locations:

```cpp
// After your own teleport code changes the transform:
epok::reset_motion_interpolation();
```

The renderer also now stages projected vertices per geometry chunk in the scratchpad. That is an internal optimization, not extra memory you can allocate to arbitrary content. Profile your scene rather than assigning it a universal speedup percentage.

## A persistent serial session

Serial Play keeps an owned developer/debug session for supported resident and PC-on-demand workflows. Pause, Continue and Reset send acknowledged commands; timeouts are visible and can trigger resynchronization. Stop releases the connection/session: it is not firmware installation.

You still need the documented adapter and Unirom setup. Epok does not flash Unirom or provide its firmware. A real PSX still supplies its own video output and controller connection. Check [the Play guide](/docs/play/) before using serial controls, especially after resets or failed handshakes.

## Repair the local tools

**Install / Repair** verifies/restores bundled dependencies through the supported host setup. It is one guarded operation, with progress, cancellation and installation locking; a failed job must not certify a half-installed package as valid. Windows x64, Linux x86_64 and macOS Apple Silicon remain the editor host targets, with their documented experimental/toolchain differences.

macOS development setup/profiling launchers now handle their host paths, and `tools/desktop-shortcuts-macos.sh` provides development-editor Desktop shortcuts. These are development conveniences, not a new packaged macOS app distribution. Consult [Getting started](/docs/getting-started/) and [Settings](/docs/settings/) for exact setup commands and host limitations.

Finally, the Console can follow fresh output automatically and lets you select compiler/runtime messages. Preserve a diagnostic and its build/profile context when reporting a problem: “the red line” is a surprisingly popular but unhelpful bug report.
