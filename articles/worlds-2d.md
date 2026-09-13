# 2D worlds, 3D worlds and UI

The Scene window now has three modes: **3D**, **2D** and **UI**. These are three editing contexts, not three export targets. Your game still builds for the original PlayStation.

## Choose a space before choosing coordinates

| Mode | Use it for | How to think about placement |
| --- | --- | --- |
| 3D | Environments, characters, cameras and props | World position, rotation and scale |
| 2D | World2D Actor placements | World X/Y, rotation in degrees and a separate 2D camera |
| UI | Menus, health bars, text and screen layout | Canvas, anchors and rectangles |

Think of a side-scrolling game such as Hollow Knight: a character moves through a world while a health display stays on the screen. The analogy explains why world space and UI space are different; it does not imply Epok includes that game's animation, physics or tooling.

Switching modes filters the Hierarchy by domain. It does not delete hidden objects or convert them. Ancestors can remain visible to keep the tree understandable; unresolved classes remain visible with diagnostics rather than disappearing in every mode.

## Author a 2D placement

1. Have a reflected, placeable `Actor2D` subclass in the project. Compile the project if its reflection data is missing.
2. Choose **Hierarchy > + > Actor > 2D** and create a placement.
3. Select **2D** in Scene. The view shows a world-space grid and labeled Actor footprints.
4. Use middle/right mouse drag to pan, the wheel to zoom, and left click to select and move. **Reset View** restores the starting view.
5. Edit the root component's position, rotation, scale and draw order in Inspector. A whole drag becomes one undo step.

At 100% zoom, the editor uses **32 pixels per world unit**. World Y points upward. Zoom changes how much of the world you see; it does not rewrite positions. When footprints overlap, the topmost drawn Actor is picked first.

The current editor draws transformed, labeled unit-quad footprints. This is a real placement editor, **not a textured sprite compositor or tilemap painter**. There is no promise that an arbitrary `Actor2D` automatically renders a finished character on PSX. Add and validate the rendering/gameplay implementation your class needs.

## The native 2D toolkit

`world2d.hpp` provides Q12 transforms, parent-relative affine transforms, deterministic trigonometry, `Camera2D`, world-to-screen and screen-to-world conversion, stable sorting, picking and bounded collision helpers. It is an explicit include, so projects that do not use it need not pull the entire toolkit into their build.

| Quantity | Current contract |
| --- | --- |
| Position | Q12 world units, each axis within ±8,192 |
| Rotation | Degrees, positive counter-clockwise; wrapped to a turn |
| Scale | Greater than zero and at most 64 per axis |
| Base projection | 32 pixels per world unit at camera zoom 1 |
| Sort key | Layer, draw order, then creation identity for a stable tie-break |

One world unit is not one pixel. Negative scale is rejected by this contract; it is not a sprite-flip switch. Attachment traversal is bounded and checks cycles. The 2D camera is independent of the 3D camera.

## Collision is deliberately small

The toolkit includes box and circle overlap tests, layer/mask filtering, raycasts, sliding movement and trigger Enter/Stay/Exit tracking. Trigger overlap uses shape-aware tests; sweeps use conservative axis-aligned bounds. Boxes do not rotate with the displayed sprite, and capacity overflows report dropped pairs.

This is useful for simple obstacles, detection zones and game-owned movement. It is not a general physics simulation with masses, joints, friction or rotating rigid bodies. Circle support in the native toolkit also does not imply every shape has a complete editor-to-console component workflow.

## UI remains its own workflow

Choose **UI** for Canvas/RectTransform editing. Native C++ UI construction can appear automatically through the [procedural preview](/docs/native-hud-preview/) without starting the emulator. The old documentation's “Scene > 2D” instructions referred to this HUD view before world 2D received its own mode; use **UI** for that workflow now.

Use [HUD and UI](/docs/hud/) for anchors and widgets, [Actors and Components](/docs/actors/) for class contracts, and [the API reference](/docs/api/) for exact native signatures. Start with one domain and a tiny example before combining all three. Your coordinate system should not be the game's final boss.
