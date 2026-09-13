# Actors and Components

An Actor is a thing in your map: a door, a camera rig, a character, or a piece of UI. Components give that thing its individual jobs. A door can own a transform and an audio component; opening the door and playing its creak belong to the same object, but do different work.

This is Epok's new reflected object model. It coexists with existing entities and C++ Behaviours. Opening an old project does **not** silently convert it.

## Pick the right kind of Actor

| Class | Where it belongs | Required spatial root | Example use |
| --- | --- | --- | --- |
| `Actor3D` | 3D world | `SceneComponent3D` | A door or a camera rig |
| `Actor2D` | 2D world | `SceneComponent2D` | A moving 2D game object |
| `UIActor` | Screen interface | `RectTransformComponent` | A menu or a health display |
| `SceneScriptActor` | One map | No spatial root | That map's opening sequence |

The base `Actor` is abstract and has no built-in transform. The specialized classes establish a *domain*: the kind of space in which the object lives. A UI rectangle and a world position are not interchangeable just because both contain numbers.

For a familiar mental picture, imagine a Zelda-style door: the door is the Actor; its placement and sound are separate responsibilities. This is an explanation of composition, not a claim that Epok includes Zelda's gameplay systems.

## Create and edit an Actor

1. Compile the project's reflected classes. The Hierarchy's Actor menu is populated from classes marked placeable, not from every C++ class in the repository.
2. Use **Hierarchy > + > Actor**, then choose **3D**, **2D** or **UI** and a class. New Actors are created at the map root.
3. Select it to edit its name, active state, reflected properties and component set in Inspector.
4. Use **Add Component** to choose from compatible classes. Epok checks the owning domain, root rules, required companions, excluded combinations and maximum allowed count.
5. Save the map. Placements, identities and instance overrides are part of the map document.

Hierarchy supports rename, duplicate, delete and logical reparenting by drag/drop. Duplicate and delete include child Actors. Drag an Actor onto the map root to remove its logical parent. Changes are disabled during Play; stop first.

The Inspector now supports adding/removing instance components and editing component properties. The required root and class-declared components have protections; “Remove” is not a way to invalidate the class contract. An authored override is marked, so you can distinguish it from an inherited default.

## Two relationships, not one

| Relationship | What it means | What it does not mean |
| --- | --- | --- |
| Logical Actor parent | Organization and inherited activation | Automatic transform attachment |
| Spatial component attachment | A transform is expressed relative to another component | Permission to mix 2D, 3D and UI domains |

That distinction matters for a camera carried by a character: sharing the logical lifetime does not automatically decide how it moves. Spatial attachments are validated separately and cannot create cycles. Changing `Actor3D` into `UIActor` is an explicit conversion, not an ordinary reparent operation; the conversion UI is not implemented.

## Native classes and Blueprint classes

C++ reflection exposes class identity, parent class, domain, properties and functions. Class annotations describe whether a class can appear in Blueprint inheritance, in the placement menu, and in runtime spawning. `EPOK_COMPONENT` declares default component members; `Root` and `AttachTo` express different contracts and cannot be combined on the same member.

Blueprints can derive from native Actor/Component classes and from other Blueprints. Their lifecycle events are **Begin Play**, **Tick** and **End Play**. Typed `ActorRef`, `ComponentRef` and `ObjectRef` connections allow the compiler to reject incompatible operations before console execution. **Spawn Actor** and **Get Owner** connect the class model to gameplay graphs.

A native C++ class cannot derive from a generated Blueprint class through this workflow. Existing Behaviour graphs retain their existing lifecycle and entity API: they are not secretly Actor graphs with renamed events.

For exact declarations, browse the [API reference](/docs/api/). For a map-owned graph, use [Scene Blueprints](/docs/scene-blueprints/).

## The Scene Blueprint

The map owns one non-placeable `SceneScriptActor`. Open its graph from Map Settings to coordinate local objects and events; see [the Scene Blueprint guide](/docs/scene-blueprints/) for workflow, ownership and reference rules.

## Lifetime, budgets and scene changes

The runtime cooks Actor, Component and Scene Blueprint information into per-scene-bank tables. A bounded registry gives objects checked identities. Fixed pools make the memory cost predictable and refuse allocations when full; they do not grow until the PlayStation runs out of RAM.

The current dynamic Actor pool has **64 slots**, with **8 component slots per pooled Actor**. This is not the same as the legacy **32-slot entity-spawn pool**. Scene-authored objects and registry sizing have their own cooking checks. Inspect `actor_stats` for alive, peak, rejected, spawned and deferred counts, plus Actor/Component/scene-script and bank counters. A capacity error is useful evidence, not something to hide behind a larger marketing number.

Scene loading wires native instances and the per-map script into the Level lifecycle. The editor/compiler/host-test paths exist; the Actor architecture's committed acceptance notes still leave dedicated PSX export/emulator acceptance pending. Do not treat general engine emulator support as proof that every new Actor combination has been tested on hardware.

## What is not included

- No built-in Pawn/Character archetype or general rigid-body physics solver.
- No positional audio attenuation or automatic 2D/3D audio panning. `AudioComponent` is shared across domains, but that does not make it spatial audio.
- No implicit legacy-project conversion and no drag/drop conversion between domains.
- No unlimited runtime spawning.
- Reflection/Blueprint authoring is provisioned on Windows x64 and Linux x86_64; macOS Apple Silicon editor support does not yet include that toolchain.

Read [Existing projects and Actors](/docs/migration-actors/) before adapting a shipped project, and [2D worlds, 3D worlds and UI](/docs/worlds-2d/) before choosing a domain.
