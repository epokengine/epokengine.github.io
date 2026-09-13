# Scene Blueprints: logic owned by a map

A reusable Actor Blueprint describes what one kind of object does. A **Scene Blueprint** describes what happens in this particular map: the opening cue, a door-and-switch sequence, or a transition after an encounter.

Each map owns one `SceneScriptActor` class. The Level loader creates its instance. You do not place it as another character in the Hierarchy or spawn copies of it at runtime.

## Open the map's graph

1. Select the map root in Hierarchy to open **Map Settings**.
2. Inspect the Scene Blueprint assignment, open its graph or create/assign an appropriate class.
3. Build the graph using **Begin Play**, **Tick** and **End Play** and the project's reflected operations.
4. Compile the project and resolve diagnostics before Play. Save the graph and map when you want those edits persisted.

The editor can prepare a default map Blueprint while opening a project. That in-memory preparation is not permission to rewrite your files: persistence follows the explicit save flow. Only subclasses of `SceneScriptActor` can be assigned as the map script. Changing a parent is validated/compiled transactionally; an invalid class does not become a valid map script merely by renaming it.

## Example: an arena introduction

Imagine a small encounter inspired by a Ratchet & Clank arena. The reusable gate Actor knows how to open. The map script decides *when this particular gate should open*.

An illustrative graph design is:

1. **Begin Play**: obtain references to the gate and an opening Timeline in this map.
2. Start the opening cue through the available reflected Timeline/gameplay functions.
3. On the cue's marker or completion, call the gate class's own exposed function.

The gate function is project code you provide, not a built-in “Arena Gate” node. See the [Timeline reference](/docs/timelines/) and [spell tutorial](/docs/spell-tutorial/) for concrete playback/wait workflows using implemented nodes.

This division lets you reuse the gate class in another level without carrying the arena's entire introduction with it.

## References use identity, not a name search

Scene Blueprint values can refer to Actors, Components and legacy entities belonging to the same map. The editor/compiler validate identity, type and map ownership. Names make objects readable; stable IDs make references resolvable.

If you delete a referenced object, repair the graph. Do not assume an identically named replacement is the same instance. Cross-map scene references are not supported by pretending the other level is already loaded. Use the scene service to request a transition and let the destination map initialize its own objects.

## Where should this logic live?

| Put it here | When |
| --- | --- |
| Actor/Component class | Every instance of a door, pickup or controller needs the same behavior |
| Scene Blueprint | One map coordinates specific objects and timing |
| Shared runtime service | State or work must outlive a scene, such as the Memory Card service |

Prefer event-driven work for one-time cues. A Tick graph runs repeatedly, so avoid using it as an expensive substitute for a single Begin Play action. Visual graphs compile to C++ and native MIPS; they still consume the same console frame and memory budgets as handwritten gameplay.

## Compatibility and limits

Legacy Behaviour Blueprints continue to work with their original callbacks. Scene Blueprints participate in reflection, generated source, per-bank actor tables and dependency invalidation. Their presence does not add a graph interpreter to the console.

Reflection authoring requires the supported Windows/Linux toolchain. The new Actor architecture has host-side implementation/tests, while its dedicated console acceptance remains incomplete in the committed notes. Validate your map's actual Play/export path and consult [Actors and Components](/docs/actors/) for pool and domain restrictions.
