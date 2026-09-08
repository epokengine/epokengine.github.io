# Using the editor

**Edit > Project Settings** opens project identity, startup scene, automatic compilation and native resolution options. **Edit > Editor Preferences** opens local navigation and Game/emulator display preferences. Both have category navigation, search and explicit Apply. See [Settings](settings.md).

## Scene navigation

The Hierarchy, Scene, Game, Inspector, Project and Console panels can be docked inside the editor window. Layout is stored in the selected project's `UserSettings/editor-layout-v2.ini`. Use Layout > Default or Window > Reset Layout to restore the initial arrangement. Use File > Projects to save/close the current project and create or open another.

Editor panels and tool windows share a charcoal theme with blue selection and focus accents. Toolbars wrap when space is limited; Inspector labels move above their fields in narrow panels. Project lists show asset names and types, with locations in wider panels and full paths on hover. Hover truncated hierarchy names or status messages to read them in full. The skeletal preview expands with its window.

| Input | Scene action |
| --- | --- |
| Q | Selection tool (outside Blockout) |
| W / E / R | Move / rotate / scale gizmo (outside Blockout) |
| Middle mouse drag | Pan |
| Right mouse drag | Look around in place, using captured relative mouse motion |
| Right mouse held + WASD | Fly |
| Right mouse held + Q / E | Fly down / up |
| Shift during flight | Increase speed |
| Alt + left mouse drag | Orbit around the focus point |
| Wheel | Move forward/backward without changing field of view |
| Right mouse held + wheel | Adjust flight speed (also available as Speed in Scene) |
| Escape | Release camera capture |
| 1 / 2 / 3 in Blockout | Faces / edges / vertices |
| E / Q in Blockout, without right mouse | Extrude / push inward; Q bevels selected edges |
| F | Frame the selected entity |

Gizmo shortcuts are suppressed during flight. Click a mesh to select the nearest visible hit, or click the background to clear selection. Camera and gizmo drags do not change selection. Use Hierarchy to select empty entities and cameras without selectable Scene icons.

Entering camera navigation releases an active text field. Releasing the right mouse button, pressing Escape, or losing application focus releases cursor capture. Geometry shortcuts are suppressed while flying or entering text. See [Blockout](blockout.md) for bevel requirements and editing shortcuts.

Scene is a GPU preview. Game shows the emulated PSX output, including its quantization and ordering-table behavior.

## Hierarchy and materials

Create cubes or empty entities through GameObject or the Hierarchy context menu. A context menu on an entity can create a child; a menu on empty space creates a root. New entities become selected and their parent branches expand.

Rename by double-clicking the name, pressing F2 or using Rename. Enter or leaving the field confirms; Escape cancels. Empty names are rejected. Duplicate and Delete affect the entire branch.

Drag an entity onto another to reparent it while preserving its world transform. Drop it on the scene header or empty hierarchy space to make it a root. The Parent inspector field offers the same relationship control. Parent > Keep Local changes the parent while retaining local values.

Transforms are relative to the parent. Parent motion, rotation and scale affect descendants in Scene and on PSX, including cameras and scripted empty entities. Up to 32 hierarchy levels are supported; cycles are rejected.

Combining rotation and nonuniform scale can create shear. Rendering preserves it, but a world-preserving reparent that cannot be represented as one Transform is rejected. Zero and negative scales are unsupported.

Mesh Renderer offers per-object color and Unlit, Baked Vertex or Realtime lighting. Removing Mesh Renderer preserves the entity, children, Transform and scripts. Cube is the available primitive. See [Lighting](lighting.md) for materials and shadows.

## Game controls

Click Game to give it keyboard focus. Escape, a tab change or loss of focus releases controller buttons.

| Keyboard | PSX controller |
| --- | --- |
| Arrows or WASD | D-pad |
| I / L / K / J | Triangle / Circle / Cross / Square |
| Q / E | L1 / R1 |
| 1 / 3 | L2 / R2 |
| Enter / Backspace | Start / Select |

The bridge delivers these inputs to the emulated controller. The sample Spinner does not use them, and a UniQo C++ input API is not implemented yet.

Pause/Resume controls execution. Step advances one VBlank and pauses the CPU again. A game that renders across several VBlanks may need several steps before its image changes. The emulated image uses nearest filtering and integer scale when space permits.

The external debugger window is hidden after the first frame. Use Debugger or Window > Emulator Debugger to show it. Emulator audio remains handled by PCSX-Redux.

For AI-assisted authoring, enable the optional local server in **Edit > Editor Preferences > AI / MCP**. It exposes scene/component edits, assets, source files, screenshots and emulator controls through MCP. It starts disabled; see [AI assistants / MCP](mcp.md) for connection configuration and revision/Undo behavior.

## Prototype limits

Tags and Layers are not implemented. Entity activation is displayed as a disabled placeholder and does not affect the runtime. Floating panels stay inside the application window. Entity multiselection and global scene undo/redo are not implemented. [Blockout](blockout.md) provides face/edge/vertex selection and geometry Undo/Redo.

The initial renderer limits exported positions to +/-128 and scales to 64. It clips triangles against the camera frustum and uses double-buffered ordering tables. Those tables cannot resolve all intersecting geometry. Lighting and HUD have additional [lighting](lighting.md) and [HUD](hud.md) budgets.

## Imported assets and sound

Drop WAV, MP3, FLAC or Ogg Vorbis files under the project’s `assets/` folder. The detection notification opens **Imports**, where each file can be imported with its own conversion settings or omitted. Imported AudioClips appear in Project; selecting one opens its source state, waveform and move/reimport actions. Add **Audio Source** in Inspector, choose a clip, and press Play. See [Assets and audio](assets.md) for external moves, recovery and PSX budgets.
