# Third Person: a playable starting point

The Third Person template now includes a native movement controller, a following/orbiting camera, jumping and collision. It is no longer only a static level placeholder. The simple mannequin still uses rigid boxes: this update adds gameplay, not a skeletal animation state machine.

## Create and play

Choose **New project > Third Person** in the Hub. From a configured source checkout, you can also create it with:

```powershell
cargo run --locked -- --create-project D:/Games/ThirdPerson --template third-person
```

Open `assets/scenes/ThirdPersonArena.epokmap`, build and press Play. Give the Game view input focus before testing. The editor's scene-navigation keys are not the same as gamepad input; see [Play targets](/docs/play/) for the active input mapping.

| PSX input | Action |
| --- | --- |
| D-pad | Move relative to the camera |
| Cross | Jump when grounded |
| L1 / R1 | Orbit the camera left / right |
| L2 / R2 | Adjust camera elevation |

The character turns toward travel instead of always facing the camera. Diagonal movement is normalized, acceleration and braking soften direction changes, and air control is weaker than grounded movement. The camera can drift behind forward travel while still allowing manual orbit.

Think of the familiar exploration controls of a PSX/N64-era 3D platformer: move around a little arena, jump onto something and discover whether the camera likes that corner. The template is a place to tune those basics before building an entire kingdom.

## What the project contains

The 32 × 32-unit greybox has perimeter walls, a raised central deck, long and round platforms, access ramps and three blue cubes. Seven independent EditableMesh packages keep the geometry editable in [Blockout](/docs/blockout/). Named groups and material slots let you reshape the level without importing a new model.

Project creation also writes:

```text
assets/scripts/ThirdPersonController.epokscript
assets/scripts/ThirdPersonController.hpp
assets/scripts/ThirdPersonController.cpp
assets/scenes/ThirdPersonArena.epokmap
```

The Player has the controller binding and collider; the **Follow Camera** is selected by the controller. Renaming that camera without updating the controller's lookup will break the connection. Existing projects made from an older template are not automatically rewritten: create a new project to inspect the updated template, then bring across changes deliberately.

## Tune the feel in C++

`ThirdPersonController.cpp` keeps its main tuning constants together. For example, the shipped values include:

```cpp
constexpr epok::Fixed walk_speed = 6.0;
constexpr epok::Fixed turn_rate = 540.0;
constexpr epok::Fixed boom_length = 8.0;
constexpr epok::Fixed gravity = 24.0;
constexpr epok::Fixed jump_speed = 9.0;
constexpr epok::Fixed air_control = 0.35;
```

Edit the existing declarations in your generated controller; do not paste duplicate declarations into the same scope. These are compile-time settings, not Inspector sliders. Rebuild after changing them.

Movement uses Q12 fixed point and a small eight-direction heading table. The digital PSX pad cannot supply arbitrary analog headings, so the controller does not need an expensive per-frame inverse-trigonometry calculation for direction. The controller derives ground contact from `move_and_slide` and applies a small downward bias to keep standing contact stable.

## Walkable ramps

Colliders now support a ramp surface through `slope_rise` and `slope_axis`. A zero rise is an ordinary box. Axis **0** means world X and **2** means world Z; the surface rises from that axis's minimum toward its maximum across the collider bounds.

The solver computes a standing height from horizontal position and lifts the mover onto the ramp. It deliberately treats ramps as walkable height-field surfaces, not solid inclined planes with full contact normals. Side entry is possible. The template configures the appropriate ramp colliders; ordinary ledges still use the controller's bounded step-up behavior.

A sloped mesh alone is not a ramp collider. Match the visible slope, collider bounds, axis and rise. If the character floats, inspect those values before changing gravity. See [Input and collision](/docs/input-collision/) for the underlying movement contract.

## Performance and boundaries

The arena's grid is vertex-colored geometry, not overlapping decal layers. The updated generation reduces unnecessary subdivision so a simple greybox is less expensive to draw. Runtime projection can stage a chunk's projected vertices in the PSX scratchpad, avoiding repeated projection work within that chunk. These are implementation optimizations, not a promised frame rate on every view or console.

The template still has no skeletal walk/jump animation, general rigid-body solver or camera-obstacle avoidance. It uses a digital controller, not analog-stick movement. The basic mannequin and blue props are intentionally simple; add art after testing movement, collision and memory. The separate [skeletal import guide](/docs/skeletal/) explains the current rigid-bone pipeline.
