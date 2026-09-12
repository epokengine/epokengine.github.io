# Play targets and loading

The arrow beside Play opens one menu with checkmarked choices for destination,
content and data source. Each section has one active choice, saved immediately
in `.epokproject`. Play uses those saved choices.
New and older projects default to **Embedded emulator**, **Current scene**,
**In executable**. The same fields are editable under **Project Settings >
Maps & Build**, where Apply saves the draft.

| Selector | Choices |
| --- | --- |
| Destination | Embedded PCSX-Redux Game view; separate emulator window; PSX through NOTPSXSerial |
| Content | Current open scene including unsaved edits; whole game starting at the startup scene |
| Data | In executable; CD on demand; PC on demand through PCDrv |

Whole game includes the startup scene and registered maps. An open registered
map contributes its unsaved snapshot. The startup scene is bank zero. Current
scene includes only that map and its resource dependencies; requests for excluded
scenes return false.

**Content selection is separate from memory residency.** Scene definitions,
scripts, textures, collision and resident SFX remain prelinked. Whole game uses
one reusable pool of entity instances, but its prelinked data must fit PSX RAM.
Arbitrary scene packages and texture/audio streaming from PC are not implemented.

CD and PC on demand select the source of external **editable-mesh geometry**.
Enable **Engine > Streaming > Geometry Streaming** to generate `GEOMETRY.BIN`
with checked 64 KiB pages and a bounded RAM pool. CD uses the ISO reader; PC uses
PCDrv in the active build directory. PCSX-Redux starts with that directory as its
PCDrv base. PC reads are synchronous and can stall frames, especially over serial.
Ordinary demand reads do not trigger full-screen transitions. See [streaming](streaming.md).

In executable rejects external geometry and XA music. XA requires the physical
CD decoder and the CD profile. PC supports resident SPU sound effects. Choosing
CD without external data still runs the EXE without creating an empty data disc.

## Physical PSX

Choose **PSX via serial**, then **PSX connection...** in the Play options menu
(also available in **Editor Preferences > Play**). If components are missing or
damaged, Play opens the connection window with **Download components** and
**Download and Play on PSX**. Installation works with the console off.

**In executable** builds and sends directly with `/exe <program> /dest <port>`.
It does not require `/ping`, `/debug`, a monitor, or a runtime TTY message.
The optional Unirom ping is diagnostic: some working loader connections do not
answer it. Play checks that the selected port is accessible before compiling.
**PC on demand** additionally enables the resident handler with `/debug` and keeps
`/exe ... /m` connected to serve PCDrv data.
Epok does not install or flash Unirom.

The adapter list shows available USB names and ports. A unique USB adapter can be
selected automatically. Multiple adapters require a choice; Epok never probes all
serial devices. USB serial numbers allow a remembered adapter to follow a COM/device
path change. A missing remembered device is not silently replaced. Without a USB
serial number, the remembered port is the fallback and may need reselection.

The three selectors travel with the project. Adapter identity and speed stay in
the user's `Editor.epokprefs`. Epok always launches its own verified nops copy.
Old custom executable paths are used only as optional import sources: matching
files are copied into this installation, and the saved path is cleared after
successful preparation. Standard speed is the default;
fast mode also depends on the adapter and Unirom.

| Host | Serial requirements |
| --- | --- |
| Windows x86/x64 | Windows 10 1809+ for the private ConPTY terminal; .NET Framework 4.7.2+; accessible COM port |
| macOS | Compatible Mono runtime and accessible serial adapter; the editor discovers Homebrew/Mono outside PATH and can install Mono through existing Homebrew. The project setup currently targets Apple Silicon. |
| Linux | Experimental: compatible Mono, PTY access and serial-device permissions supplied by the distribution. No automatic sudo, group or driver changes. |

The launcher tests actual runtime/terminal capability before opening the serial
port. Other architectures report missing automatic support and preserve the
selected project destination. macOS uses the `/dev/cu.*` callout devices to avoid
duplicate `/dev/tty.*` entries. Windows errors distinguish a missing runtime,
unavailable terminal and inaccessible port from a console that does not respond.
macOS/Linux hardware paths still need validation on those hosts.

Managed NOTPSXSerial files are pinned in `tools/serial-dependency.json`, verified
with SHA-256 and published together under
`<editor executable directory>/tools/notpsxserial/<revision>/`. This also applies
to debug builds, which keep their components under `target/debug/tools/`.
Failed or
cancelled downloads do not replace an installed package. Repair keeps the previous
package recoverable. An installation lock prevents competing editor installers.
The payload includes licenses and the matching source URL. Distributions can ship
`.tools/serial-bundle` for offline installation (`tools/bundle-serial.py`, Windows
setup `-Dependency serial`, and macOS setup prepare that payload); source builds
offer to download it on first use. The installation directory must be writable;
protected system folders and read-only application images report an actionable
installation error. Framework/Mono installation may still
require OS-specific setup. No project or global PATH changes are needed for nops.

`epok-editor --prepare-serial-tools` verifies/installs the automatic tools without
contacting the console; `--list-serial-ports` only enumerates adapters. Neither
requires a project. The nops terminal remains inside Epok so its console API and
monitor work without an extra visible window.

Serial disables CD on demand. Switching to Serial while CD is selected changes
the source to PC on demand and saves that selection. The monitor serves PCDrv
from `.epok/build` and displays upload/TTY output in Console. Epok waits for its
runtime startup message for PC on-demand sessions. Direct upload requires nops's
`Send finished!` message and a successful process exit; exit status alone is not
enough. The editor then releases the port and unlocks editing. It reports a
completed transfer, not independently observed game execution. Return the PSX to
the Unirom loader before sending another standalone program.

Video and controls stay on the console. Pause, frame stepping and Blueprint
debugging are emulator features. Stop terminates only this session's nops process;
it does not halt or reset the PSX. PC data requires the monitor to remain connected.
A BIOS PCDrv call can remain blocked after transport disconnection; a host timeout
cannot unwind it. Hardware validation is separate from emulator/process tests.

Protocol references: [NOTPSXSerial](https://github.com/JonathanDotCel/NOTPSXSerial)
and its [PCDrv handler](https://github.com/JonathanDotCel/NOTPSXSerial/blob/master/PCDrv.cs).

## Critical operations

Component installation, build, memory analysis, connection checks and upload display
a compact, centered progress modal. The workspace stays visible and is darkened
behind the modal. Upload percentages come from NOTPSXSerial's completed progress
records; phases without a reported percentage show an activity bar. Detailed
compiler/transport output stays in Console. Editing panels, shortcuts, external file drops, project switching,
settings writes and application-close requests are blocked until the operation
finishes. MCP can read status/logs and request Stop but cannot edit project inputs.
External filesystem edits remain subject to the existing build invalidation checks.

Build and serial preparation offer cancellation and keep the editor locked until
the worker has stopped. Downloads cancel between reads/files (a network request
has a 30-second deadline). The existing dependency installer must finish before
the editor can close because it repairs package files in place. Errors restore
the editor and show the failure; unsaved documents are retained. Play's normal
runtime controls become available once the emulator or PSX is running.

## Memory Analyzer

Click the pie-chart button beside Play to compile and analyze the current Play
configuration. This uses the same scene snapshot (including unsaved scene edits),
registered scene selection, dependencies and Blueprint debug setting as Play.
It does not launch an emulator, open a serial port or require a connected PSX.
Unsaved Blueprint/Timeline/ParticleEffect documents follow Play's existing
save-or-discard requirements. Disc analysis counts the external payload without
building an ISO solely to measure memory.

The modal includes a capacity bar, clickable treemap, allocation table and
breadcrumbs. Drill into a category/resource to inspect its linked symbols, byte
counts and scene references; **Show asset in Project** locates supported source
assets. **Recalculate** uses the current profile. Source/profile changes mark
an open report out of date. A failed or cancelled analysis does not present a
previous build as a current result; compiler details remain in Console.

* **Main RAM (2 MiB):** linked allocations, including BSS/NOLOAD pools, link
  alignment and the region below the executable load address. Shared assets and
  reusable pools are counted once. Unassigned memory is the remaining budget for
  heap/stack; their runtime and transition peaks are **not measured**.
* **VRAM (1 MiB):** allocations for each active scene bank, with texture pixels,
  palettes, framebuffers and reserved font/loading/display regions. The optional
  physical layout shows the actual 1024 x 512 word address space. Unallocated
  bytes do not guarantee that another texture fits the allocator's placement rules.
* **Audio / SPU (512 KiB):** selected resident ADPCM samples including DMA padding,
  plus the runtime's 4 KiB reserve. XA files appear under Files.
* **Files:** the PS-X EXE (including its header/padding) and currently selected
  external geometry/XA payloads. Cached but unselected files are excluded. Disc
  filesystem/sector overhead is not included.
* **Scratchpad (1 KiB):** separately linked scratchpad allocations.

The report is written to `.epok/build/memory-report.json` (or
`.epok/build-blueprint-debug/memory-report.json` for Blueprint debug). Human-readable
asset attribution is captured during staging and matched to the final linked
symbols. Unattributed bytes remain visible; they are not silently omitted. PCDrv's
external Unirom handler reservation is not measured by the game ELF and is called
out in the report. A successful static report is not proof of a safe runtime peak.

Headless `--analyze-memory` honors the saved Play profile and uses the startup
scene as the current scene, without launching or uploading. Add
`--blueprint-debug` to measure the instrumented build.

## Scene transitions

`epok::request_scene("Night")` uses project defaults:

1. Fade picture and music/SFX out together over 300 ms.
2. Present a black loading frame with `Now loading...` at the lower right.
3. Stop outgoing audio, wait for pending CD callbacks, retire the scene and
   initialize the incoming scene. Warm its geometry when the working set fits.
4. Fade picture and incoming audio in over 300 ms, then resume updates.

Initial boot starts at the loading frame. Synchronizing the simulation clock
prevents load time becoming catch-up ticks. Transition gain multiplies authored
AudioSource volumes without overwriting them. The loading renderer and VRAM
allocation survive scene teardown. Geometry read errors keep the screen black
and muted and offer START to retry once pending I/O has released.

Configure durations, text and an optional imported image under **Maps & Build >
Scene Transitions**. Text supports 95 printable ASCII characters and wraps inside
a TV-safe margin. Images are resident RGB555, at most 64 × 64 pixels with even
width, stored at VRAM `(960,384)` above the font at `(960,448)`. The image appears
above the text; leave text empty to show only an image.

Override a transition in C++:

```cpp
epok::TransitionOptions options;
options.fade_out_ms = 400;
options.fade_in_ms = 600;
options.loading.text = "Entering forest...";
options.loading.color[0] = 160;
epok::request_scene("Forest", options);
```

For a custom image, assign `options.loading.image` to a resident
`epok::LoadingImage{pixels, width, height}`. Descriptor and RGB555 pixels must
outlive the transition; static storage is suitable. Text is copied at request
time. A null image uses the project default; an empty static descriptor suppresses
it. Lifecycle callback requests queue behind the current fade.

Headless `--build-psx --use-play-profile` and `--play-psx --use-play-profile` honor
the saved profile, using startup as the current scene. Without that flag,
headless tools preserve the existing full-bank build. **Package Disc** builds
the whole game from startup with CD data, independently of the Play destination.
