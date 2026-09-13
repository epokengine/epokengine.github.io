# Epok API: Actor Tables

> **Header:** `"actor_tables.hpp"` · **Tier:** Epok runtime API · **Source:** [open header](../../../runtime/actor_tables.hpp)

This module covers the actor tables module. It documents 11 public callables declared directly in this header.

## Declared types

`epok::ActorComponentRecord`, `epok::ActorRecord`, `epok::ActorStats`, `epok::ActorTable`, `epok::SceneLevel`, `epok::SceneReferenceRecord`, `epok::SceneRefKind`

## Callable index

- [`epok::actor_for_slot`](#epok-actor-for-slot-1) — ---- trigger fan-out --------------------------------------------------------------- The collision service reports legacy slot indices; the object model speaks ObjectIds.
- [`epok::collect_object_quarantine`](#epok-collect-object-quarantine-1) — Retries the slots an asynchronous service still points at.
- [`epok::dispatch_slot_trigger`](#epok-dispatch-slot-trigger-1) — One event, one delivery: the collision service calls this once per colliding slot, and epok::dispatch_trigger skips any component the legacy `bindings` table already notified (see component_trigger_filtered, installed by scene_service.hpp).
- [`epok::load_actor_bank`](#epok-load-actor-bank-1) — Called by the generated load_bank_N() before the legacy initialize_scripts().
- [`epok::SceneLevel::add_component_by_class`](#epok-scenelevel-add-component-by-class-1) — Adds a component named by its cooked class id.
- [`epok::SceneLevel::bind_scene_references`](#epok-scenelevel-bind-scene-references-1) — Binds the bank's resolved map-scoped references into the scene script instance.
- [`epok::SceneLevel::create_bank_scene_script`](#epok-scenelevel-create-bank-scene-script-1) — Cooked scene script for the bank.
- [`epok::SceneLevel::ensure_bound`](#epok-scenelevel-ensure-bound-1) — Binds the slot table once.
- [`epok::SceneLevel::load_bank`](#epok-scenelevel-load-bank-1) — Loads one cooked bank.
- [`epok::SceneLevel::refresh_stats`](#epok-scenelevel-refresh-stats-1) — Snapshot of the registry and level counters for tools/profile_runtime.py.
- [`epok::unload_actor_bank`](#epok-unload-actor-bank-1) — Called by scene_tick() before the legacy binding teardown, while the actors and their legacy slots are still alive.

<a id="epok-actor-for-slot-1"></a>

## `epok::actor_for_slot`

**Purpose.** ---- trigger fan-out --------------------------------------------------------------- The collision service reports legacy slot indices; the object model speaks ObjectIds.

**Details.** An actor participates in a trigger event when its *root* component is bound to the colliding slot -- that root is the canonical transform the collision world read.

**Exact declaration**

```cpp
inline ObjectId actor_for_slot(const Entity* slot)
```

- **Declared at:** [line 373](../../../runtime/actor_tables.hpp#L373)
- **Kind:** `function decl`

**Parameters**

| Name | Type | Role | Meaning |
| --- | --- | --- | --- |
| `slot` | `const Entity *` | Input | Value supplied for `slot`. See the exact type and module contract. |

**Returns.** Returns `ObjectId`. Check the purpose and failure notes before using the value.

**Use it when.** An actor participates in a trigger event when its *root* component is bound to the colliding slot -- that root is the canonical transform the collision world read.

**Usage pattern**

```cpp
#include "actor_tables.hpp"

// Assume these named values have been initialized with valid data:
// const Entity * slot

auto result = epok::actor_for_slot(slot);
```

**Why choose it.** It provides direct, allocation-conscious access to the actor tables module. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Pointer/reference arguments are borrowed unless the source contract says otherwise; keep them valid for the complete operation and never assume null is accepted.

<a id="epok-collect-object-quarantine-1"></a>

## `epok::collect_object_quarantine`

**Purpose.** Retries the slots an asynchronous service still points at.

**Details.** main.cpp calls it once per frame, next to the point where the legacy path re-checks music_active.

**Exact declaration**

```cpp
inline void collect_object_quarantine()
```

- **Declared at:** [line 367](../../../runtime/actor_tables.hpp#L367)
- **Kind:** `function decl`

**Returns.** No value is returned; observe the documented state change or callback.

**Use it when.** main.cpp calls it once per frame, next to the point where the legacy path re-checks music_active.

**Usage pattern**

```cpp
#include "actor_tables.hpp"

epok::collect_object_quarantine();
```

**Why choose it.** It provides direct, allocation-conscious access to the actor tables module. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Call it only in the lifecycle phase described by the module. Validate indices, capacities and object state before use.

<a id="epok-dispatch-slot-trigger-1"></a>

## `epok::dispatch_slot_trigger`

**Purpose.** One event, one delivery: the collision service calls this once per colliding slot, and epok::dispatch_trigger skips any component the legacy `bindings` table already notified (see component_trigger_filtered, installed by scene_service.hpp).

**Exact declaration**

```cpp
inline size_t dispatch_slot_trigger(EntityHandle self, EntityHandle other, TriggerPhase phase)
```

- **Declared at:** [line 391](../../../runtime/actor_tables.hpp#L391)
- **Kind:** `function decl`

**Parameters**

| Name | Type | Role | Meaning |
| --- | --- | --- | --- |
| `self` | `EntityHandle` | Input | Value supplied for `self`. See the exact type and module contract. |
| `other` | `EntityHandle` | Input | Value supplied for `other`. See the exact type and module contract. |
| `phase` | `TriggerPhase` | Input | Value supplied for `phase`. See the exact type and module contract. |

**Returns.** Returns `size_t`. Check the purpose and failure notes before using the value.

**Use it when.** You need the actor tables module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "actor_tables.hpp"

// Assume these named values have been initialized with valid data:
// EntityHandle self
// EntityHandle other
// TriggerPhase phase

auto result = epok::dispatch_slot_trigger(self, other, phase);
```

**Why choose it.** It provides direct, allocation-conscious access to the actor tables module. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Call it only in the lifecycle phase described by the module. Validate indices, capacities and object state before use.

<a id="epok-load-actor-bank-1"></a>

## `epok::load_actor_bank`

**Purpose.** Called by the generated load_bank_N() before the legacy initialize_scripts().

**Exact declaration**

```cpp
inline size_t load_actor_bank(const ActorTable& table, Entity* slots, size_t slot_count)
```

- **Declared at:** [line 355](../../../runtime/actor_tables.hpp#L355)
- **Kind:** `function decl`

**Parameters**

| Name | Type | Role | Meaning |
| --- | --- | --- | --- |
| `table` | `const ActorTable &` | Input | Value supplied for `table`. See the exact type and module contract. |
| `slots` | `Entity *` | Input/output; inspect the function contract | Value supplied for `slots`. See the exact type and module contract. |
| `slot_count` | `size_t` | Input | Value supplied for `slot_count`. See the exact type and module contract. |

**Returns.** Returns `size_t`. Check the purpose and failure notes before using the value.

**Use it when.** You need the actor tables module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "actor_tables.hpp"

// Assume these named values have been initialized with valid data:
// const ActorTable & table
// Entity * slots
// size_t slot_count

auto result = epok::load_actor_bank(table, slots, slot_count);
```

**Why choose it.** It provides direct, allocation-conscious access to the actor tables module. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Pointer/reference arguments are borrowed unless the source contract says otherwise; keep them valid for the complete operation and never assume null is accepted.

<a id="epok-scenelevel-add-component-by-class-1"></a>

## `epok::SceneLevel::add_component_by_class`

**Purpose.** Adds a component named by its cooked class id.

**Details.** Mirrors Level::add_component<T> (same owner-domain, cardinality, abstractness and capacity rules) without needing the C++ type at the call site. begin_play is deferred to finish_components().

**Exact declaration**

```cpp
ObjectId add_component_by_class(Actor& owner, const ClassDescriptor& type, const char* name)
```

- **Declared at:** [line 112](../../../runtime/actor_tables.hpp#L112)
- **Kind:** `cxx method`

**Parameters**

| Name | Type | Role | Meaning |
| --- | --- | --- | --- |
| `owner` | `Actor &` | Input/output; inspect the function contract | Value supplied for `owner`. See the exact type and module contract. |
| `type` | `const ClassDescriptor &` | Input | Value supplied for `type`. See the exact type and module contract. |
| `name` | `const char *` | Input | Value supplied for `name`. See the exact type and module contract. |

**Returns.** Returns `ObjectId`. Check the purpose and failure notes before using the value.

**Use it when.** Mirrors Level::add_component<T> (same owner-domain, cardinality, abstractness and capacity rules) without needing the C++ type at the call site. begin_play is deferred to finish_components().

**Usage pattern**

```cpp
#include "actor_tables.hpp"

// Assume these named values have been initialized with valid data:
// Actor & owner
// const ClassDescriptor & type
// const char * name

epok::SceneLevel& object = /* obtain a valid instance */;

auto result = object.add_component_by_class(owner, type, name);
```

**Why choose it.** It provides direct, allocation-conscious access to the actor tables module. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Pointer/reference arguments are borrowed unless the source contract says otherwise; keep them valid for the complete operation and never assume null is accepted.

<a id="epok-scenelevel-bind-scene-references-1"></a>

## `epok::SceneLevel::bind_scene_references`

**Purpose.** Binds the bank's resolved map-scoped references into the scene script instance.

**Details.** Every target is a table index the cook resolved by UUID and scope (P6); this turns it into a live identity and hands it to the generated writer.

**Exact declaration**

```cpp
size_t bind_scene_references(const ActorTable& table, ObjectId owner)
```

- **Declared at:** [line 215](../../../runtime/actor_tables.hpp#L215)
- **Kind:** `cxx method`

**Parameters**

| Name | Type | Role | Meaning |
| --- | --- | --- | --- |
| `table` | `const ActorTable &` | Input | Value supplied for `table`. See the exact type and module contract. |
| `owner` | `ObjectId` | Input | Value supplied for `owner`. See the exact type and module contract. |

**Returns.** Returns `size_t`. Check the purpose and failure notes before using the value.

**Use it when.** Every target is a table index the cook resolved by UUID and scope (P6); this turns it into a live identity and hands it to the generated writer.

**Usage pattern**

```cpp
#include "actor_tables.hpp"

// Assume these named values have been initialized with valid data:
// const ActorTable & table
// ObjectId owner

epok::SceneLevel& object = /* obtain a valid instance */;

auto result = object.bind_scene_references(table, owner);
```

**Why choose it.** It provides direct, allocation-conscious access to the actor tables module. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Pointer/reference arguments are borrowed unless the source contract says otherwise; keep them valid for the complete operation and never assume null is accepted.

<a id="epok-scenelevel-create-bank-scene-script-1"></a>

## `epok::SceneLevel::create_bank_scene_script`

**Purpose.** Cooked scene script for the bank.

**Details.** Exactly one per loaded level: the cooked class when the map authored a scene Blueprint, the runtime base otherwise.

**Exact declaration**

```cpp
ObjectId create_bank_scene_script(const ActorTable& table)
```

- **Declared at:** [line 196](../../../runtime/actor_tables.hpp#L196)
- **Kind:** `cxx method`

**Parameters**

| Name | Type | Role | Meaning |
| --- | --- | --- | --- |
| `table` | `const ActorTable &` | Input | Value supplied for `table`. See the exact type and module contract. |

**Returns.** Returns `ObjectId`. Check the purpose and failure notes before using the value.

**Use it when.** Exactly one per loaded level: the cooked class when the map authored a scene Blueprint, the runtime base otherwise.

**Usage pattern**

```cpp
#include "actor_tables.hpp"

// Assume these named values have been initialized with valid data:
// const ActorTable & table

epok::SceneLevel& object = /* obtain a valid instance */;

auto result = object.create_bank_scene_script(table);
```

**Why choose it.** It provides direct, allocation-conscious access to the actor tables module. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Pointer/reference arguments are borrowed unless the source contract says otherwise; keep them valid for the complete operation and never assume null is accepted.

<a id="epok-scenelevel-ensure-bound-1"></a>

## `epok::SceneLevel::ensure_bound`

**Purpose.** Binds the slot table once.

**Details.** Calling it again is a no-op, so a scene transition reuses the same registry and the same Level identity.

**Exact declaration**

```cpp
bool ensure_bound(ObjectRegistry& registry)
```

- **Declared at:** [line 104](../../../runtime/actor_tables.hpp#L104)
- **Kind:** `cxx method`

**Parameters**

| Name | Type | Role | Meaning |
| --- | --- | --- | --- |
| `registry` | `ObjectRegistry &` | Input/output; inspect the function contract | Value supplied for `registry`. See the exact type and module contract. |

**Returns.** Returns `bool`. Check the purpose and failure notes before using the value.

**Use it when.** Calling it again is a no-op, so a scene transition reuses the same registry and the same Level identity.

**Usage pattern**

```cpp
#include "actor_tables.hpp"

// Assume these named values have been initialized with valid data:
// ObjectRegistry & registry

epok::SceneLevel& object = /* obtain a valid instance */;

auto result = object.ensure_bound(registry);
```

**Why choose it.** The boolean result makes success, availability or state explicit without exceptions.

**Trade-offs and warnings.** Check the return value; `false` is part of normal control flow for many PSX resource operations. Pointer/reference arguments are borrowed unless the source contract says otherwise; keep them valid for the complete operation and never assume null is accepted.

<a id="epok-scenelevel-load-bank-1"></a>

## `epok::SceneLevel::load_bank`

**Purpose.** Loads one cooked bank.

**Details.** Returns the number of actors instantiated. Order (design.md section 6; the P10 deviation is closed): 1. Level::spawn_batch -> reserve, defaults, roots, owners, register; 2. the prepare hook, per actor of the batch: authored components, legacy slot binding, attachment and the generated property overrides; 3. begin_play -- components first, then the owning actor -- so an actor's own begin_play already sees its per-instance overrides and components; 4. the bank's single SceneScriptActor: created, its map-scoped references bound, then begin_play. The scene script therefore always observes fully configured actors.

**Exact declaration**

```cpp
size_t load_bank(const ActorTable& table, Entity* slots, size_t slot_count)
```

- **Declared at:** [line 141](../../../runtime/actor_tables.hpp#L141)
- **Kind:** `cxx method`

**Parameters**

| Name | Type | Role | Meaning |
| --- | --- | --- | --- |
| `table` | `const ActorTable &` | Input | Value supplied for `table`. See the exact type and module contract. |
| `slots` | `Entity *` | Input/output; inspect the function contract | Value supplied for `slots`. See the exact type and module contract. |
| `slot_count` | `size_t` | Input | Value supplied for `slot_count`. See the exact type and module contract. |

**Returns.** Returns `size_t`. Check the purpose and failure notes before using the value.

**Use it when.** Returns the number of actors instantiated. Order (design.md section 6; the P10 deviation is closed): 1. Level::spawn_batch -> reserve, defaults, roots, owners, register; 2. the prepare hook, per actor of the batch: authored components, legacy slot binding, attachment and the generated property overrides; 3. begin_play -- components first, then the owning actor -- so an actor's own begin_play already sees its per-instance overrides and components; 4. the bank's single SceneScriptActor: created, its map-scoped references bound, then begin_play. The scene script therefore always observes fully configured actors.

**Usage pattern**

```cpp
#include "actor_tables.hpp"

// Assume these named values have been initialized with valid data:
// const ActorTable & table
// Entity * slots
// size_t slot_count

epok::SceneLevel& object = /* obtain a valid instance */;

auto result = object.load_bank(table, slots, slot_count);
```

**Why choose it.** It provides direct, allocation-conscious access to the actor tables module. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Pointer/reference arguments are borrowed unless the source contract says otherwise; keep them valid for the complete operation and never assume null is accepted.

<a id="epok-scenelevel-refresh-stats-1"></a>

## `epok::SceneLevel::refresh_stats`

**Purpose.** Snapshot of the registry and level counters for tools/profile_runtime.py.

**Exact declaration**

```cpp
void refresh_stats()
```

- **Declared at:** [line 249](../../../runtime/actor_tables.hpp#L249)
- **Kind:** `cxx method`

**Returns.** No value is returned; observe the documented state change or callback.

**Use it when.** You need the actor tables module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "actor_tables.hpp"

epok::SceneLevel& object = /* obtain a valid instance */;

object.refresh_stats();
```

**Why choose it.** It provides direct, allocation-conscious access to the actor tables module. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Call it only in the lifecycle phase described by the module. Validate indices, capacities and object state before use.

<a id="epok-unload-actor-bank-1"></a>

## `epok::unload_actor_bank`

**Purpose.** Called by scene_tick() before the legacy binding teardown, while the actors and their legacy slots are still alive.

**Exact declaration**

```cpp
inline void unload_actor_bank()
```

- **Declared at:** [line 361](../../../runtime/actor_tables.hpp#L361)
- **Kind:** `function decl`

**Returns.** No value is returned; observe the documented state change or callback.

**Use it when.** You need the actor tables module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "actor_tables.hpp"

epok::unload_actor_bank();
```

**Why choose it.** It provides direct, allocation-conscious access to the actor tables module. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Call it only in the lifecycle phase described by the module. Validate indices, capacities and object state before use.
