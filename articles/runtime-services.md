# Runtime services and scene banks

Use the scene services to request transitions, the Actor API to manage object
lifetimes, and the timing helpers to coordinate gameplay. These services share
the game's memory and frame budgets; check the relevant return values and
capacity diagnostics.

## Scene selection and residency

The Play profile selects the current scene, the whole game, or a set of scenes
with an initial scene. Builds support up to 16 scene banks. An included open
map contributes its unsaved snapshot; requests for excluded scenes fail.
See [Play targets and loading](play.md) for ordering, selection and build reuse.

Scene selection and memory residency are separate choices. Resident scene data
is linked into the executable. With a compatible CD or PC data path, scenes
whose **In EXE** box is off use `SCENEnn.BIN` files and share a loading region
sized for the largest external scene. Engine code and scripts stay resident.
See [Scenes outside the executable](scene-files.md).

Editable-mesh geometry streaming uses its own bounded page pool. It is a separate
mechanism from loading scene files, and required reads can stall rendering.
See [Geometry streaming](streaming.md).

## Transitions

`request_scene` queues a scene transition; `current_scene` and `scene_loading`
report its state. Transitions coordinate picture and audio fades, outgoing
audio, asynchronous work and scene teardown before initializing the incoming
map. Loading can also require geometry reads from CD or PC. Configure the
loading presentation and supported data source in the [Play guide](play.md).

Game-owned C++ globals can outlive a scene. Scene-owned Actors, components and
their references follow the current scene's lifetime instead. Do not retain a
raw pointer to an outgoing scene object and use it after a transition.

## Actor lifecycle and references

Actors and ActorComponents use `begin_play`, `tick` and `end_play`. Their
identities, components, references and property overrides are prepared before
scene startup. Use the [Actor guide](actors.md) for ownership and attachment,
and the [gameplay API](gameplay-api.md) for the shared C++, Blueprint and Lua
surface.

An `ObjectId` is resolved through the object registry. Check the result before
using it: a destroyed object or retired scene can invalidate a reference.
Prefer keeping a checked identity and resolving it when needed over assuming
a stored pointer remains valid indefinitely. Activation and destruction use the
Actor/component contracts and their bounded runtime pools.

Previous Entity/Behaviour maps must be recreated for the current Actor
architecture. Their old `start`/`update` authoring examples should not be used as
the class template for new gameplay. See [C++ scripting](scripting.md) and
[Recreating older projects](migration-actors.md).

## Timing and utilities

Simulation uses fixed steps with bounded catch-up. See [Input and collision](input-collision.md)
for timing, pause and controller behavior. Helpers in `utility.hpp` include:

- `Tween` for bounded interpolation, delay, looping and completion.
- `EventQueue<N>` for a fixed-capacity event queue with overflow accounting.
- `Sequence` for ordered timed steps and cancellation.
- `Focus<N>` and layout helpers for UI navigation.

Advance and poll the helpers from the relevant gameplay lifecycle; they do not
schedule themselves. Recheck any referenced object's lifetime when consuming a
queued event.

Memory Card operations use a process-owned asynchronous service and can survive
scene transitions. See [Memory Card](memory-card.md) for operation status,
payloads and persistence.
