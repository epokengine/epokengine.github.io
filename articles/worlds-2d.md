# 2D worlds, 3D worlds and UI

The Scene window has three modes: **3D**, **2D** and **UI**. They are three editing
contexts, not three export targets: whatever you build, the game runs on the original
PlayStation, and one map can hold a 3D world, a 2D world and a HUD at once.

## Choose a space before choosing coordinates

| Mode | Use it for | How placement works |
| --- | --- | --- |
| 3D | Environments, characters, cameras, props, generated dungeons | World units: position, rotation and scale in three axes |
| 2D | Sprites, tile maps, 2D cameras, bodies, paths, particles | Pixels with Y pointing down, rotations in degrees, a Camera2D of its own |
| UI | Menus, health bars, text and screen layout | Canvas, anchors and rectangles |

Think of a side-scroller: the character moves through a world while the health display
stays on the screen. The world is 2D, the health bar is UI, and they live in different
spaces on purpose.

Switching modes filters the Hierarchy by domain. It does not delete hidden objects or
convert them, and unresolved classes stay visible with their diagnostics.

## The 2D world

2D content is made of `Actor2D` nodes: a 2D transform plus components such as Sprite2D,
TileMapLayer, Collider2D, CharacterBody2D, Camera2D, Parallax2D, Path2D, Line2D,
Particles2D, Skeleton2D, NavigationAgent2D, RigidBody2D and Joint2D, beside any C++,
Blueprint or Lua component of your own. A 16 × 16 sprite covers 16 × 16 screen pixels at
zoom 1, and positions, collider sizes, velocities and camera limits all use the same
unit. On the console the 2D world is drawn after the 3D world and before the HUD, and a
project without 2D nodes compiles none of it.

The fastest way in is **New Project > Platformer 2D**, then
[Your first 2D platformer](/docs/platformer-tutorial/). Every node, tool and limit is in
[2D worlds](/docs/2d/).

## UI remains its own workflow

Choose **UI** for Canvas and RectTransform editing: anchors, layout containers, focus
navigation, check boxes, sliders and keyed texts. Native C++ UI construction also appears
in the [procedural preview](/docs/native-hud-preview/) without starting the emulator.

Use [HUD and UI](/docs/hud/) for anchors and widgets, [Actors and Components](/docs/actors/)
for class contracts and [the API reference](/docs/api/) for exact native signatures. Start
with one space and a tiny example before combining all three. Your coordinate system
should not be the game's final boss.
