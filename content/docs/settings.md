# Project Settings and Editor Preferences

Open **Edit > Project Settings...** or **Edit > Editor Preferences...**. Both windows use a dark category sidebar, searchable property sections and an **Apply** button. Search spans all categories. Changes remain drafts until applied; close the window and reopen it to discard a draft. Apply is disabled while compiling or playing.

## Project Settings

These settings live in `ProjectSettings/project.json` and travel with the game project.

| Category | Options |
| --- | --- |
| Project / Description | Project name shown in the Hub |
| Project / Maps & Build | Startup scene and automatic compilation |
| Engine / Rendering | Native output resolution, scan mode and retained geometry packets |

The default is **640 x 480 interlaced NTSC**, including existing projects that do not yet have a `rendering` entry. Widths of 256, 320, 368, 512 and 640 are available at 240 progressive or 480 interlaced lines. PAL output is not exposed by this runtime yet.

```json
"rendering": {
  "width": 640,
  "height": 480,
  "retained_geometry": true
}
```

**Retained Packets** (`retained_geometry`, default on) keeps the GPU packets of
static meshes alive between frames: corner colours, page UVs and texture words
are written once and rebuilt only when the material, lighting, texture bank,
transform basis or entity generation changes. Each frame writes screen
coordinates, links the packet into the ordering table and refreshes colours only
where fog applies. Animated (skeletal) meshes and materials with UV scrolling
always use the per-frame path. The switch reaches the runtime through
`display.hh` and changes nothing in the image; see
[performance](performance.md) for the measured effect. Turn it off to compare
against the per-frame path or when RAM is tight: the pool holds one record per
scene quad.

Resolution changes apply on the next build. The generated `display.hh` travels with standalone C++ exports; runtime GPU setup, projection, clipping and blob-shadow projection use that configuration. The image keeps the same camera field of view and is presented at 4:3, including modes with nonsquare pixels.

HUD coordinates are native output pixels. Anchors follow the selected canvas size; text remains an 8 x 16 bitmap font. A centered panel stays centered when resolution changes, but an authored 100-pixel width remains 100 pixels. The editor's 2D HUD canvas follows the selected resolution too.

640 x 480 contains four times the pixels of 320 x 240. The higher mode costs more GPU fill work; it does not increase geometry or animation budgets. Interlaced modes can flicker on a CRT. Measured elapsed time drives fixed 60 Hz simulation with at most eight catch-up steps per rendered frame; see [input and time](input-collision.md). Hardware validation is pending.

**Reset Rendering** restores the 640 x 480 draft without changing project identity or the startup scene. A startup-scene change takes effect when the project is reopened.

## Editor Preferences

Preferences are stored in the user's UniQo data directory (`%LOCALAPPDATA%/UniQo/editor-preferences.json` on Windows). They apply across projects and are not included in game exports.

| Category | Options |
| --- | --- |
| General / Viewports | Default grid visibility and flight speed |
| General / Play | Integer scaling in Game and smoothing in the external emulator window |
| General / AI / MCP | Enable the local MCP server, choose its port, rotate the access key and copy HTTP/stdio client configurations |

Applying viewport preferences updates the current view. A template's saved starting view can override the navigation defaults on opening. Integer scaling uses whole display-scale steps when space allows; smaller Game panels fit the image instead. Game always uses point filtering.

**Smooth Image** controls PCSX-Redux's external debugger window and takes effect on the next Play. It is off by default to keep pixels crisp. Other emulator settings are preserved.

**Enable MCP Server** is off by default. Apply starts or stops the server for the open project; MCP preferences can be applied while Play is running. The access key stays in local editor preferences. See [AI assistants / MCP](mcp.md) for available tools, screenshots and connection instructions.
