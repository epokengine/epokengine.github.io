# Epok API: Interaction

> **Header:** `"interaction.hpp"` · **Tier:** Epok runtime API · **Source:** [open header](../../../runtime/interaction.hpp)

This module covers the interaction module. It documents 63 public callables declared directly in this header.

## Declared types

`epok::InteractableComponent`, `epok::interaction::Link`, `epok::interaction::List`, `epok::InteractionPrompt`, `epok::InteractionPromptComponent`, `epok::InteractionResult`, `epok::InteractionSensor2DComponent`, `epok::InteractionSensor3DComponent`, `epok::InteractorComponent`, `epok::TriggerArea2D`, `epok::TriggerBox3D`

## Callable index

- [`epok::InteractableComponent::availability`](#epok-interactablecomponent-availability-1) — Performs `availability` as part of the interaction module.
- [`epok::InteractableComponent::can_interact`](#epok-interactablecomponent-can-interact-1) — Performs `can interact` as part of the interaction module.
- [`epok::InteractableComponent::class_id`](#epok-interactablecomponent-class-id-1) — Performs `class id` as part of the interaction module.
- [`epok::InteractableComponent::complete`](#epok-interactablecomponent-complete-1) — Performs `complete` as part of the interaction module.
- [`epok::InteractableComponent::focus_gained`](#epok-interactablecomponent-focus-gained-1) — Performs `focus gained` as part of the interaction module.
- [`epok::InteractableComponent::focus_lost`](#epok-interactablecomponent-focus-lost-1) — Performs `focus lost` as part of the interaction module.
- [`epok::InteractableComponent::hold_open`](#epok-interactablecomponent-hold-open-1) — Performs `hold open` as part of the interaction module.
- [`epok::InteractableComponent::interaction_finished`](#epok-interactablecomponent-interaction-finished-1) — Performs `interaction finished` as part of the interaction module.
- [`epok::InteractableComponent::interaction_started`](#epok-interactablecomponent-interaction-started-1) — Performs `interaction started` as part of the interaction module.
- [`epok::InteractableComponent::is_busy`](#epok-interactablecomponent-is-busy-1) — Reports whether busy as part of the interaction module.
- [`epok::InteractableComponent::level_attached`](#epok-interactablecomponent-level-attached-1) — Performs `level attached` as part of the interaction module.
- [`epok::InteractableComponent::prune_lifetime`](#epok-interactablecomponent-prune-lifetime-1) — Performs `prune lifetime` as part of the interaction module.
- [`epok::InteractableComponent::request`](#epok-interactablecomponent-request-1) — Requests request as part of the interaction module.
- [`epok::InteractableComponent::set_enabled`](#epok-interactablecomponent-set-enabled-1) — Sets enabled as part of the interaction module.
- [`epok::InteractableComponent::~InteractableComponent`](#epok-interactablecomponent-interactablecomponent-1) — Releases the resources owned by `epok::InteractableComponent`.
- [`epok::interaction::activation_changed`](#epok-interaction-activation-changed-1) — Performs `activation changed` as part of the interaction module.
- [`epok::interaction::actor`](#epok-interaction-actor-1) — Performs `actor` as part of the interaction module.
- [`epok::interaction::distance_squared`](#epok-interaction-distance-squared-1) — Performs `distance squared` as part of the interaction module.
- [`epok::interaction::domain`](#epok-interaction-domain-1) — Performs `domain` as part of the interaction module.
- [`epok::interaction::forget_sensor`](#epok-interaction-forget-sensor-1) — Performs `forget sensor` as part of the interaction module.
- [`epok::interaction::Link::Link<T>`](#epok-interaction-link-link-t-1) — Constructs `epok::interaction::Link` for the interaction module.
- [`epok::interaction::Link::Link<T>`](#epok-interaction-link-link-t-2) — Constructs `epok::interaction::Link` for the interaction module.
- [`epok::interaction::Link::operator=`](#epok-interaction-link-operator-1) — Performs `operator =` as part of the interaction module.
- [`epok::interaction::List::add`](#epok-interaction-list-add-1) — Adds add as part of the interaction module.
- [`epok::interaction::List::remove`](#epok-interaction-list-remove-1) — Removes remove as part of the interaction module.
- [`epok::interaction::live`](#epok-interaction-live-1) — Performs `live` as part of the interaction module.
- [`epok::interaction::position`](#epok-interaction-position-1) — Performs `position` as part of the interaction module.
- [`epok::interaction::radius_squared`](#epok-interaction-radius-squared-1) — Performs `radius squared` as part of the interaction module.
- [`epok::interaction::sensor_binding`](#epok-interaction-sensor-binding-1) — Performs `sensor binding` as part of the interaction module.
- [`epok::interaction::sensor_event`](#epok-interaction-sensor-event-1) — Performs `sensor event` as part of the interaction module.
- [`epok::interaction::source_live`](#epok-interaction-source-live-1) — Performs `source live` as part of the interaction module.
- [`epok::InteractionPrompt::class_id`](#epok-interactionprompt-class-id-1) — Performs `class id` as part of the interaction module.
- [`epok::InteractionPromptComponent::class_id`](#epok-interactionpromptcomponent-class-id-1) — Performs `class id` as part of the interaction module.
- [`epok::InteractionPromptComponent::frame_update`](#epok-interactionpromptcomponent-frame-update-1) — Performs `frame update` as part of the interaction module.
- [`epok::InteractionSensor2DComponent::binding_status`](#epok-interactionsensor2dcomponent-binding-status-1) — Performs `binding status` as part of the interaction module.
- [`epok::InteractionSensor2DComponent::class_id`](#epok-interactionsensor2dcomponent-class-id-1) — Performs `class id` as part of the interaction module.
- [`epok::InteractionSensor2DComponent::configure`](#epok-interactionsensor2dcomponent-configure-1) — Performs `configure` as part of the interaction module.
- [`epok::InteractionSensor2DComponent::frame_update`](#epok-interactionsensor2dcomponent-frame-update-1) — Performs `frame update` as part of the interaction module.
- [`epok::InteractionSensor2DComponent::level_attached`](#epok-interactionsensor2dcomponent-level-attached-1) — Performs `level attached` as part of the interaction module.
- [`epok::InteractionSensor2DComponent::set_monitoring`](#epok-interactionsensor2dcomponent-set-monitoring-1) — Sets monitoring as part of the interaction module.
- [`epok::InteractionSensor2DComponent::trigger_event`](#epok-interactionsensor2dcomponent-trigger-event-1) — Performs `trigger event` as part of the interaction module.
- [`epok::InteractionSensor3DComponent::binding_status`](#epok-interactionsensor3dcomponent-binding-status-1) — Performs `binding status` as part of the interaction module.
- [`epok::InteractionSensor3DComponent::class_id`](#epok-interactionsensor3dcomponent-class-id-1) — Performs `class id` as part of the interaction module.
- [`epok::InteractionSensor3DComponent::configure`](#epok-interactionsensor3dcomponent-configure-1) — Performs `configure` as part of the interaction module.
- [`epok::InteractionSensor3DComponent::frame_update`](#epok-interactionsensor3dcomponent-frame-update-1) — Performs `frame update` as part of the interaction module.
- [`epok::InteractionSensor3DComponent::set_monitoring`](#epok-interactionsensor3dcomponent-set-monitoring-1) — Sets monitoring as part of the interaction module.
- [`epok::InteractionSensor3DComponent::trigger_event`](#epok-interactionsensor3dcomponent-trigger-event-1) — Performs `trigger event` as part of the interaction module.
- [`epok::InteractorComponent::candidate_count`](#epok-interactorcomponent-candidate-count-1) — Performs `candidate count` as part of the interaction module.
- [`epok::InteractorComponent::class_id`](#epok-interactorcomponent-class-id-1) — Performs `class id` as part of the interaction module.
- [`epok::InteractorComponent::focus_changed`](#epok-interactorcomponent-focus-changed-1) — Performs `focus changed` as part of the interaction module.
- [`epok::InteractorComponent::focused_target`](#epok-interactorcomponent-focused-target-1) — Performs `focused target` as part of the interaction module.
- [`epok::InteractorComponent::forget_sensor`](#epok-interactorcomponent-forget-sensor-1) — Performs `forget sensor` as part of the interaction module.
- [`epok::InteractorComponent::frame_update`](#epok-interactorcomponent-frame-update-1) — Framework work precedes the extensible on_frame event, including in Lua/BP subclasses.
- [`epok::InteractorComponent::interact`](#epok-interactorcomponent-interact-1) — Performs `interact` as part of the interaction module.
- [`epok::InteractorComponent::level_attached`](#epok-interactorcomponent-level-attached-1) — Performs `level attached` as part of the interaction module.
- [`epok::InteractorComponent::overflow_count`](#epok-interactorcomponent-overflow-count-1) — Performs `overflow count` as part of the interaction module.
- [`epok::InteractorComponent::prune_lifetime`](#epok-interactorcomponent-prune-lifetime-1) — Performs `prune lifetime` as part of the interaction module.
- [`epok::InteractorComponent::refresh`](#epok-interactorcomponent-refresh-1) — Performs `refresh` as part of the interaction module.
- [`epok::InteractorComponent::register_candidate`](#epok-interactorcomponent-register-candidate-1) — Performs `register candidate` as part of the interaction module.
- [`epok::InteractorComponent::unregister_candidate`](#epok-interactorcomponent-unregister-candidate-1) — Performs `unregister candidate` as part of the interaction module.
- [`epok::InteractorComponent::~InteractorComponent`](#epok-interactorcomponent-interactorcomponent-1) — Releases the resources owned by `epok::InteractorComponent`.
- [`epok::TriggerArea2D::class_id`](#epok-triggerarea2d-class-id-1) — Performs `class id` as part of the interaction module.
- [`epok::TriggerBox3D::class_id`](#epok-triggerbox3d-class-id-1) — Performs `class id` as part of the interaction module.

<a id="epok-interactablecomponent-availability-1"></a>

## `epok::InteractableComponent::availability`

**Purpose.** Performs `availability` as part of the interaction module.

**Exact declaration**

```cpp
InteractionResult availability(ObjectId initiator) const
```

- **Declared at:** [line 118](../../../runtime/interaction.hpp#L118)
- **Kind:** `cxx method`; qualifiers: `const`

**Parameters**

| Name | Type | Role | Meaning |
| --- | --- | --- | --- |
| `initiator` | `ObjectId` | Input | Value supplied for `initiator`. See the exact type and module contract. |

**Returns.** Returns `InteractionResult`. Check the purpose and failure notes before using the value.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

// Assume these named values have been initialized with valid data:
// ObjectId initiator

epok::InteractableComponent& object = /* obtain a valid instance */;

auto result = object.availability(initiator);
```

**Why choose it.** The method is `const`, so it does not mutate the object through this API surface.

**Trade-offs and warnings.** Call it only in the lifecycle phase described by the module. Validate indices, capacities and object state before use.

<a id="epok-interactablecomponent-can-interact-1"></a>

## `epok::InteractableComponent::can_interact`

**Purpose.** Performs `can interact` as part of the interaction module.

**Exact declaration**

```cpp
virtual bool can_interact(ObjectId initiator) const
```

- **Declared at:** [line 112](../../../runtime/interaction.hpp#L112)
- **Kind:** `cxx method`; qualifiers: `const, virtual`

**Parameters**

| Name | Type | Role | Meaning |
| --- | --- | --- | --- |
| `initiator` | `ObjectId` | Input | Value supplied for `initiator`. See the exact type and module contract. |

**Returns.** Returns `bool`. Check the purpose and failure notes before using the value.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

// Assume these named values have been initialized with valid data:
// ObjectId initiator

epok::InteractableComponent& object = /* obtain a valid instance */;

auto result = object.can_interact(initiator);
```

**Why choose it.** The method is `const`, so it does not mutate the object through this API surface. The boolean result makes success, availability or state explicit without exceptions.

**Trade-offs and warnings.** Check the return value; `false` is part of normal control flow for many PSX resource operations.

<a id="epok-interactablecomponent-class-id-1"></a>

## `epok::InteractableComponent::class_id`

**Purpose.** Performs `class id` as part of the interaction module.

**Exact declaration**

```cpp
uint64_t class_id() const override
```

- **Declared at:** [line 101](../../../runtime/interaction.hpp#L101)
- **Kind:** `cxx method`; qualifiers: `const`

**Returns.** Returns `uint64_t`. Check the purpose and failure notes before using the value.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

epok::InteractableComponent& object = /* obtain a valid instance */;

auto result = object.class_id();
```

**Why choose it.** The method is `const`, so it does not mutate the object through this API surface.

**Trade-offs and warnings.** Call it only in the lifecycle phase described by the module. Validate indices, capacities and object state before use.

<a id="epok-interactablecomponent-complete-1"></a>

## `epok::InteractableComponent::complete`

**Purpose.** Performs `complete` as part of the interaction module.

**Exact declaration**

```cpp
bool complete(InteractionResult result)
```

- **Declared at:** [line 148](../../../runtime/interaction.hpp#L148)
- **Kind:** `cxx method`

**Parameters**

| Name | Type | Role | Meaning |
| --- | --- | --- | --- |
| `result` | `InteractionResult` | Input | Value supplied for `result`. See the exact type and module contract. |

**Returns.** Returns `bool`. Check the purpose and failure notes before using the value.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

// Assume these named values have been initialized with valid data:
// InteractionResult result

epok::InteractableComponent& object = /* obtain a valid instance */;

auto result = object.complete(result);
```

**Why choose it.** The boolean result makes success, availability or state explicit without exceptions.

**Trade-offs and warnings.** Check the return value; `false` is part of normal control flow for many PSX resource operations.

<a id="epok-interactablecomponent-focus-gained-1"></a>

## `epok::InteractableComponent::focus_gained`

**Purpose.** Performs `focus gained` as part of the interaction module.

**Exact declaration**

```cpp
virtual void focus_gained(ObjectId initiator,uint32_t port)
```

- **Declared at:** [line 113](../../../runtime/interaction.hpp#L113)
- **Kind:** `cxx method`; qualifiers: `virtual`

**Parameters**

| Name | Type | Role | Meaning |
| --- | --- | --- | --- |
| `initiator` | `ObjectId` | Input | Value supplied for `initiator`. See the exact type and module contract. |
| `port` | `uint32_t` | Input | Value supplied for `port`. See the exact type and module contract. |

**Returns.** No value is returned; observe the documented state change or callback.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

// Assume these named values have been initialized with valid data:
// ObjectId initiator
// uint32_t port

epok::InteractableComponent& object = /* obtain a valid instance */;

object.focus_gained(initiator, port);
```

**Why choose it.** It provides direct, allocation-conscious access to the interaction module. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Call it only in the lifecycle phase described by the module. Validate indices, capacities and object state before use.

<a id="epok-interactablecomponent-focus-lost-1"></a>

## `epok::InteractableComponent::focus_lost`

**Purpose.** Performs `focus lost` as part of the interaction module.

**Exact declaration**

```cpp
virtual void focus_lost(ObjectId initiator,uint32_t port)
```

- **Declared at:** [line 114](../../../runtime/interaction.hpp#L114)
- **Kind:** `cxx method`; qualifiers: `virtual`

**Parameters**

| Name | Type | Role | Meaning |
| --- | --- | --- | --- |
| `initiator` | `ObjectId` | Input | Value supplied for `initiator`. See the exact type and module contract. |
| `port` | `uint32_t` | Input | Value supplied for `port`. See the exact type and module contract. |

**Returns.** No value is returned; observe the documented state change or callback.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

// Assume these named values have been initialized with valid data:
// ObjectId initiator
// uint32_t port

epok::InteractableComponent& object = /* obtain a valid instance */;

object.focus_lost(initiator, port);
```

**Why choose it.** It provides direct, allocation-conscious access to the interaction module. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Call it only in the lifecycle phase described by the module. Validate indices, capacities and object state before use.

<a id="epok-interactablecomponent-hold-open-1"></a>

## `epok::InteractableComponent::hold_open`

**Purpose.** Performs `hold open` as part of the interaction module.

**Exact declaration**

```cpp
bool hold_open()
```

- **Declared at:** [line 147](../../../runtime/interaction.hpp#L147)
- **Kind:** `cxx method`

**Returns.** Returns `bool`. Check the purpose and failure notes before using the value.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

epok::InteractableComponent& object = /* obtain a valid instance */;

auto result = object.hold_open();
```

**Why choose it.** The boolean result makes success, availability or state explicit without exceptions.

**Trade-offs and warnings.** Check the return value; `false` is part of normal control flow for many PSX resource operations.

<a id="epok-interactablecomponent-interaction-finished-1"></a>

## `epok::InteractableComponent::interaction_finished`

**Purpose.** Performs `interaction finished` as part of the interaction module.

**Exact declaration**

```cpp
virtual void interaction_finished(ObjectId initiator,uint32_t port,InteractionResult result)
```

- **Declared at:** [line 116](../../../runtime/interaction.hpp#L116)
- **Kind:** `cxx method`; qualifiers: `virtual`

**Parameters**

| Name | Type | Role | Meaning |
| --- | --- | --- | --- |
| `initiator` | `ObjectId` | Input | Value supplied for `initiator`. See the exact type and module contract. |
| `port` | `uint32_t` | Input | Value supplied for `port`. See the exact type and module contract. |
| `result` | `InteractionResult` | Input | Value supplied for `result`. See the exact type and module contract. |

**Returns.** No value is returned; observe the documented state change or callback.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

// Assume these named values have been initialized with valid data:
// ObjectId initiator
// uint32_t port
// InteractionResult result

epok::InteractableComponent& object = /* obtain a valid instance */;

object.interaction_finished(initiator, port, result);
```

**Why choose it.** It provides direct, allocation-conscious access to the interaction module. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Call it only in the lifecycle phase described by the module. Validate indices, capacities and object state before use.

<a id="epok-interactablecomponent-interaction-started-1"></a>

## `epok::InteractableComponent::interaction_started`

**Purpose.** Performs `interaction started` as part of the interaction module.

**Exact declaration**

```cpp
virtual void interaction_started(ObjectId initiator,uint32_t port)
```

- **Declared at:** [line 115](../../../runtime/interaction.hpp#L115)
- **Kind:** `cxx method`; qualifiers: `virtual`

**Parameters**

| Name | Type | Role | Meaning |
| --- | --- | --- | --- |
| `initiator` | `ObjectId` | Input | Value supplied for `initiator`. See the exact type and module contract. |
| `port` | `uint32_t` | Input | Value supplied for `port`. See the exact type and module contract. |

**Returns.** No value is returned; observe the documented state change or callback.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

// Assume these named values have been initialized with valid data:
// ObjectId initiator
// uint32_t port

epok::InteractableComponent& object = /* obtain a valid instance */;

object.interaction_started(initiator, port);
```

**Why choose it.** It provides direct, allocation-conscious access to the interaction module. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Call it only in the lifecycle phase described by the module. Validate indices, capacities and object state before use.

<a id="epok-interactablecomponent-is-busy-1"></a>

## `epok::InteractableComponent::is_busy`

**Purpose.** Reports whether busy as part of the interaction module.

**Exact declaration**

```cpp
bool is_busy() const
```

- **Declared at:** [line 117](../../../runtime/interaction.hpp#L117)
- **Kind:** `cxx method`; qualifiers: `const`

**Returns.** Returns `bool`. Check the purpose and failure notes before using the value.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

epok::InteractableComponent& object = /* obtain a valid instance */;

auto result = object.is_busy();
```

**Why choose it.** The method is `const`, so it does not mutate the object through this API surface. The boolean result makes success, availability or state explicit without exceptions.

**Trade-offs and warnings.** Check the return value; `false` is part of normal control flow for many PSX resource operations.

<a id="epok-interactablecomponent-level-attached-1"></a>

## `epok::InteractableComponent::level_attached`

**Purpose.** Performs `level attached` as part of the interaction module.

**Exact declaration**

```cpp
void level_attached() override
```

- **Declared at:** [line 103](../../../runtime/interaction.hpp#L103)
- **Kind:** `cxx method`

**Returns.** No value is returned; observe the documented state change or callback.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

epok::InteractableComponent& object = /* obtain a valid instance */;

object.level_attached();
```

**Why choose it.** It provides direct, allocation-conscious access to the interaction module. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Call it only in the lifecycle phase described by the module. Validate indices, capacities and object state before use.

<a id="epok-interactablecomponent-prune-lifetime-1"></a>

## `epok::InteractableComponent::prune_lifetime`

**Purpose.** Performs `prune lifetime` as part of the interaction module.

**Exact declaration**

```cpp
void prune_lifetime()
```

- **Declared at:** [line 157](../../../runtime/interaction.hpp#L157)
- **Kind:** `cxx method`

**Returns.** No value is returned; observe the documented state change or callback.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

epok::InteractableComponent& object = /* obtain a valid instance */;

object.prune_lifetime();
```

**Why choose it.** It provides direct, allocation-conscious access to the interaction module. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Call it only in the lifecycle phase described by the module. Validate indices, capacities and object state before use.

<a id="epok-interactablecomponent-request-1"></a>

## `epok::InteractableComponent::request`

**Purpose.** Requests request as part of the interaction module.

**Exact declaration**

```cpp
InteractionResult request(ObjectId initiator,uint32_t port)
```

- **Declared at:** [line 135](../../../runtime/interaction.hpp#L135)
- **Kind:** `cxx method`

**Parameters**

| Name | Type | Role | Meaning |
| --- | --- | --- | --- |
| `initiator` | `ObjectId` | Input | Value supplied for `initiator`. See the exact type and module contract. |
| `port` | `uint32_t` | Input | Value supplied for `port`. See the exact type and module contract. |

**Returns.** Returns `InteractionResult`. Check the purpose and failure notes before using the value.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

// Assume these named values have been initialized with valid data:
// ObjectId initiator
// uint32_t port

epok::InteractableComponent& object = /* obtain a valid instance */;

auto result = object.request(initiator, port);
```

**Why choose it.** It provides direct, allocation-conscious access to the interaction module. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Call it only in the lifecycle phase described by the module. Validate indices, capacities and object state before use.

<a id="epok-interactablecomponent-set-enabled-1"></a>

## `epok::InteractableComponent::set_enabled`

**Purpose.** Sets enabled as part of the interaction module.

**Exact declaration**

```cpp
void set_enabled(bool value)
```

- **Declared at:** [line 156](../../../runtime/interaction.hpp#L156)
- **Kind:** `cxx method`

**Parameters**

| Name | Type | Role | Meaning |
| --- | --- | --- | --- |
| `value` | `bool` | Input | Value supplied for `value`. See the exact type and module contract. |

**Returns.** No value is returned; observe the documented state change or callback.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

// Assume these named values have been initialized with valid data:
// bool value

epok::InteractableComponent& object = /* obtain a valid instance */;

object.set_enabled(value);
```

**Why choose it.** It provides direct, allocation-conscious access to the interaction module. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Call it only in the lifecycle phase described by the module. Validate indices, capacities and object state before use.

<a id="epok-interactablecomponent-interactablecomponent-1"></a>

## `epok::InteractableComponent::~InteractableComponent`

**Purpose.** Releases the resources owned by `epok::InteractableComponent`.

**Exact declaration**

```cpp
~InteractableComponent() override
```

- **Declared at:** [line 104](../../../runtime/interaction.hpp#L104)
- **Kind:** `destructor`

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

// `epok::InteractableComponent` cleans up when its owning scope ends.
```

**Why choose it.** It provides direct, allocation-conscious access to the interaction module. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Call it only in the lifecycle phase described by the module. Validate indices, capacities and object state before use.

<a id="epok-interaction-activation-changed-1"></a>

## `epok::interaction::activation_changed`

**Purpose.** Performs `activation changed` as part of the interaction module.

**Exact declaration**

```cpp
void activation_changed()
```

- **Declared at:** [line 92](../../../runtime/interaction.hpp#L92)
- **Kind:** `function decl`

**Returns.** No value is returned; observe the documented state change or callback.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

epok::interaction::activation_changed();
```

**Why choose it.** It provides direct, allocation-conscious access to the interaction module. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Call it only in the lifecycle phase described by the module. Validate indices, capacities and object state before use.

<a id="epok-interaction-actor-1"></a>

## `epok::interaction::actor`

**Purpose.** Performs `actor` as part of the interaction module.

**Exact declaration**

```cpp
inline Actor* actor(ObjectId id)
```

- **Declared at:** [line 19](../../../runtime/interaction.hpp#L19)
- **Kind:** `function decl`

**Parameters**

| Name | Type | Role | Meaning |
| --- | --- | --- | --- |
| `id` | `ObjectId` | Input | Value supplied for `id`. See the exact type and module contract. |

**Returns.** Returns `Actor *`. Check the purpose and failure notes before using the value.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

// Assume these named values have been initialized with valid data:
// ObjectId id

auto result = epok::interaction::actor(id);
```

**Why choose it.** It provides direct, allocation-conscious access to the interaction module. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Call it only in the lifecycle phase described by the module. Validate indices, capacities and object state before use.

<a id="epok-interaction-distance-squared-1"></a>

## `epok::interaction::distance_squared`

**Purpose.** Performs `distance squared` as part of the interaction module.

**Exact declaration**

```cpp
inline uint64_t distance_squared(const Fixed* first,const Fixed* second)
```

- **Declared at:** [line 51](../../../runtime/interaction.hpp#L51)
- **Kind:** `function decl`

**Parameters**

| Name | Type | Role | Meaning |
| --- | --- | --- | --- |
| `first` | `const Fixed *` | Input | Value supplied for `first`. See the exact type and module contract. |
| `second` | `const Fixed *` | Input | Value supplied for `second`. See the exact type and module contract. |

**Returns.** Returns `uint64_t`. Check the purpose and failure notes before using the value.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

// Assume these named values have been initialized with valid data:
// const Fixed * first
// const Fixed * second

auto result = epok::interaction::distance_squared(first, second);
```

**Why choose it.** It provides direct, allocation-conscious access to the interaction module. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Pointer/reference arguments are borrowed unless the source contract says otherwise; keep them valid for the complete operation and never assume null is accepted.

<a id="epok-interaction-domain-1"></a>

## `epok::interaction::domain`

**Purpose.** Performs `domain` as part of the interaction module.

**Exact declaration**

```cpp
inline ObjectDomain domain(Actor* value)
```

- **Declared at:** [line 25](../../../runtime/interaction.hpp#L25)
- **Kind:** `function decl`

**Parameters**

| Name | Type | Role | Meaning |
| --- | --- | --- | --- |
| `value` | `Actor *` | Input/output; inspect the function contract | Value supplied for `value`. See the exact type and module contract. |

**Returns.** Returns `ObjectDomain`. Check the purpose and failure notes before using the value.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

// Assume these named values have been initialized with valid data:
// Actor * value

auto result = epok::interaction::domain(value);
```

**Why choose it.** It provides direct, allocation-conscious access to the interaction module. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Pointer/reference arguments are borrowed unless the source contract says otherwise; keep them valid for the complete operation and never assume null is accepted.

<a id="epok-interaction-forget-sensor-1"></a>

## `epok::interaction::forget_sensor`

**Purpose.** Performs `forget sensor` as part of the interaction module.

**Exact declaration**

```cpp
inline void forget_sensor(ObjectId sensor)
```

- **Declared at:** [line 280](../../../runtime/interaction.hpp#L280)
- **Kind:** `function decl`

**Parameters**

| Name | Type | Role | Meaning |
| --- | --- | --- | --- |
| `sensor` | `ObjectId` | Input | Value supplied for `sensor`. See the exact type and module contract. |

**Returns.** No value is returned; observe the documented state change or callback.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

// Assume these named values have been initialized with valid data:
// ObjectId sensor

epok::interaction::forget_sensor(sensor);
```

**Why choose it.** It provides direct, allocation-conscious access to the interaction module. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Call it only in the lifecycle phase described by the module. Validate indices, capacities and object state before use.

<a id="epok-interaction-link-link-t-1"></a>

## `epok::interaction::Link::Link<T>`

**Purpose.** Constructs `epok::interaction::Link` for the interaction module.

**Exact declaration**

```cpp
Link()=default
```

- **Declared at:** [line 73](../../../runtime/interaction.hpp#L73)
- **Kind:** `constructor`

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

epok::interaction::Link value();
```

**Why choose it.** It provides direct, allocation-conscious access to the interaction module. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Call it only in the lifecycle phase described by the module. Validate indices, capacities and object state before use.

<a id="epok-interaction-link-link-t-2"></a>

## `epok::interaction::Link::Link<T>`

**Purpose.** Constructs `epok::interaction::Link` for the interaction module.

**Exact declaration**

```cpp
Link(const Link&)
```

- **Declared at:** [line 73](../../../runtime/interaction.hpp#L73)
- **Kind:** `constructor`

**Parameters**

| Name | Type | Role | Meaning |
| --- | --- | --- | --- |
| `arg1` | `const Link<T> &` | Input | Value supplied for `arg1`. See the exact type and module contract. |

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

// Assume these named values have been initialized with valid data:
// const Link<T> & arg1

epok::interaction::Link value(arg1);
```

**Why choose it.** It provides direct, allocation-conscious access to the interaction module. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Pointer/reference arguments are borrowed unless the source contract says otherwise; keep them valid for the complete operation and never assume null is accepted.

<a id="epok-interaction-link-operator-1"></a>

## `epok::interaction::Link::operator=`

**Purpose.** Performs `operator =` as part of the interaction module.

**Exact declaration**

```cpp
Link& operator=(const Link&)
```

- **Declared at:** [line 74](../../../runtime/interaction.hpp#L74)
- **Kind:** `cxx method`

**Parameters**

| Name | Type | Role | Meaning |
| --- | --- | --- | --- |
| `arg1` | `const Link<T> &` | Input | Value supplied for `arg1`. See the exact type and module contract. |

**Returns.** Returns `Link<T> &`. Check the purpose and failure notes before using the value.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

// Assume these named values have been initialized with valid data:
// const Link<T> & arg1

epok::interaction::Link& object = /* obtain a valid instance */;

auto result = object.operator=(arg1);
```

**Why choose it.** It provides direct, allocation-conscious access to the interaction module. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Pointer/reference arguments are borrowed unless the source contract says otherwise; keep them valid for the complete operation and never assume null is accepted.

<a id="epok-interaction-list-add-1"></a>

## `epok::interaction::List::add`

**Purpose.** Adds add as part of the interaction module.

**Exact declaration**

```cpp
void add(T* item)
```

- **Declared at:** [line 78](../../../runtime/interaction.hpp#L78)
- **Kind:** `cxx method`

**Parameters**

| Name | Type | Role | Meaning |
| --- | --- | --- | --- |
| `item` | `T *` | Input/output; inspect the function contract | Value supplied for `item`. See the exact type and module contract. |

**Returns.** No value is returned; observe the documented state change or callback.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

// Assume these named values have been initialized with valid data:
// T * item

epok::interaction::List& object = /* obtain a valid instance */;

object.add(item);
```

**Why choose it.** It provides direct, allocation-conscious access to the interaction module. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Pointer/reference arguments are borrowed unless the source contract says otherwise; keep them valid for the complete operation and never assume null is accepted.

<a id="epok-interaction-list-remove-1"></a>

## `epok::interaction::List::remove`

**Purpose.** Removes remove as part of the interaction module.

**Exact declaration**

```cpp
void remove(T* item)
```

- **Declared at:** [line 83](../../../runtime/interaction.hpp#L83)
- **Kind:** `cxx method`

**Parameters**

| Name | Type | Role | Meaning |
| --- | --- | --- | --- |
| `item` | `T *` | Input/output; inspect the function contract | Value supplied for `item`. See the exact type and module contract. |

**Returns.** No value is returned; observe the documented state change or callback.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

// Assume these named values have been initialized with valid data:
// T * item

epok::interaction::List& object = /* obtain a valid instance */;

object.remove(item);
```

**Why choose it.** It provides direct, allocation-conscious access to the interaction module. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Pointer/reference arguments are borrowed unless the source contract says otherwise; keep them valid for the complete operation and never assume null is accepted.

<a id="epok-interaction-live-1"></a>

## `epok::interaction::live`

**Purpose.** Performs `live` as part of the interaction module.

**Exact declaration**

```cpp
inline bool live(ObjectId id)
```

- **Declared at:** [line 15](../../../runtime/interaction.hpp#L15)
- **Kind:** `function decl`

**Parameters**

| Name | Type | Role | Meaning |
| --- | --- | --- | --- |
| `id` | `ObjectId` | Input | Value supplied for `id`. See the exact type and module contract. |

**Returns.** Returns `bool`. Check the purpose and failure notes before using the value.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

// Assume these named values have been initialized with valid data:
// ObjectId id

auto result = epok::interaction::live(id);
```

**Why choose it.** The boolean result makes success, availability or state explicit without exceptions.

**Trade-offs and warnings.** Check the return value; `false` is part of normal control flow for many PSX resource operations.

<a id="epok-interaction-position-1"></a>

## `epok::interaction::position`

**Purpose.** Performs `position` as part of the interaction module.

**Exact declaration**

```cpp
inline bool position(Actor* value,Fixed* output)
```

- **Declared at:** [line 29](../../../runtime/interaction.hpp#L29)
- **Kind:** `function decl`

**Parameters**

| Name | Type | Role | Meaning |
| --- | --- | --- | --- |
| `value` | `Actor *` | Input/output; inspect the function contract | Value supplied for `value`. See the exact type and module contract. |
| `output` | `Fixed *` | Input/output; inspect the function contract | Value supplied for `output`. See the exact type and module contract. |

**Returns.** Returns `bool`. Check the purpose and failure notes before using the value.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

// Assume these named values have been initialized with valid data:
// Actor * value
// Fixed * output

auto result = epok::interaction::position(value, output);
```

**Why choose it.** The boolean result makes success, availability or state explicit without exceptions.

**Trade-offs and warnings.** Check the return value; `false` is part of normal control flow for many PSX resource operations. Pointer/reference arguments are borrowed unless the source contract says otherwise; keep them valid for the complete operation and never assume null is accepted.

<a id="epok-interaction-radius-squared-1"></a>

## `epok::interaction::radius_squared`

**Purpose.** Performs `radius squared` as part of the interaction module.

**Exact declaration**

```cpp
inline uint64_t radius_squared(Fixed radius)
```

- **Declared at:** [line 61](../../../runtime/interaction.hpp#L61)
- **Kind:** `function decl`

**Parameters**

| Name | Type | Role | Meaning |
| --- | --- | --- | --- |
| `radius` | `Fixed` | Input | Value supplied for `radius`. See the exact type and module contract. |

**Returns.** Returns `uint64_t`. Check the purpose and failure notes before using the value.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

// Assume these named values have been initialized with valid data:
// Fixed radius

auto result = epok::interaction::radius_squared(radius);
```

**Why choose it.** It provides direct, allocation-conscious access to the interaction module. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Call it only in the lifecycle phase described by the module. Validate indices, capacities and object state before use.

<a id="epok-interaction-sensor-binding-1"></a>

## `epok::interaction::sensor_binding`

**Purpose.** Performs `sensor binding` as part of the interaction module.

**Exact declaration**

```cpp
inline InteractionResult sensor_binding(ActorComponent& sensor,ObjectId target,ObjectId accepted)
```

- **Declared at:** [line 286](../../../runtime/interaction.hpp#L286)
- **Kind:** `function decl`

**Parameters**

| Name | Type | Role | Meaning |
| --- | --- | --- | --- |
| `sensor` | `ActorComponent &` | Input/output; inspect the function contract | Value supplied for `sensor`. See the exact type and module contract. |
| `target` | `ObjectId` | Input | Value supplied for `target`. See the exact type and module contract. |
| `accepted` | `ObjectId` | Input | Value supplied for `accepted`. See the exact type and module contract. |

**Returns.** Returns `InteractionResult`. Check the purpose and failure notes before using the value.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

// Assume these named values have been initialized with valid data:
// ActorComponent & sensor
// ObjectId target
// ObjectId accepted

auto result = epok::interaction::sensor_binding(sensor, target, accepted);
```

**Why choose it.** It provides direct, allocation-conscious access to the interaction module. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Pointer/reference arguments are borrowed unless the source contract says otherwise; keep them valid for the complete operation and never assume null is accepted.

<a id="epok-interaction-sensor-event-1"></a>

## `epok::interaction::sensor_event`

**Purpose.** Performs `sensor event` as part of the interaction module.

**Exact declaration**

```cpp
inline void sensor_event(ActorComponent& sensor,ObjectId target,ObjectId accepted,ObjectId other,TriggerPhase phase)
```

- **Declared at:** [line 309](../../../runtime/interaction.hpp#L309)
- **Kind:** `function decl`

**Parameters**

| Name | Type | Role | Meaning |
| --- | --- | --- | --- |
| `sensor` | `ActorComponent &` | Input/output; inspect the function contract | Value supplied for `sensor`. See the exact type and module contract. |
| `target` | `ObjectId` | Input | Value supplied for `target`. See the exact type and module contract. |
| `accepted` | `ObjectId` | Input | Value supplied for `accepted`. See the exact type and module contract. |
| `other` | `ObjectId` | Input | Value supplied for `other`. See the exact type and module contract. |
| `phase` | `TriggerPhase` | Input | Value supplied for `phase`. See the exact type and module contract. |

**Returns.** No value is returned; observe the documented state change or callback.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

// Assume these named values have been initialized with valid data:
// ActorComponent & sensor
// ObjectId target
// ObjectId accepted
// ObjectId other
// TriggerPhase phase

epok::interaction::sensor_event(sensor, target, accepted, other, phase);
```

**Why choose it.** It provides direct, allocation-conscious access to the interaction module. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Pointer/reference arguments are borrowed unless the source contract says otherwise; keep them valid for the complete operation and never assume null is accepted.

<a id="epok-interaction-source-live-1"></a>

## `epok::interaction::source_live`

**Purpose.** Performs `source live` as part of the interaction module.

**Exact declaration**

```cpp
inline bool source_live(ObjectId id)
```

- **Declared at:** [line 64](../../../runtime/interaction.hpp#L64)
- **Kind:** `function decl`

**Parameters**

| Name | Type | Role | Meaning |
| --- | --- | --- | --- |
| `id` | `ObjectId` | Input | Value supplied for `id`. See the exact type and module contract. |

**Returns.** Returns `bool`. Check the purpose and failure notes before using the value.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

// Assume these named values have been initialized with valid data:
// ObjectId id

auto result = epok::interaction::source_live(id);
```

**Why choose it.** The boolean result makes success, availability or state explicit without exceptions.

**Trade-offs and warnings.** Check the return value; `false` is part of normal control flow for many PSX resource operations.

<a id="epok-interactionprompt-class-id-1"></a>

## `epok::InteractionPrompt::class_id`

**Purpose.** Performs `class id` as part of the interaction module.

**Exact declaration**

```cpp
uint64_t class_id() const override
```

- **Declared at:** [line 412](../../../runtime/interaction.hpp#L412)
- **Kind:** `cxx method`; qualifiers: `const`

**Returns.** Returns `uint64_t`. Check the purpose and failure notes before using the value.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

epok::InteractionPrompt& object = /* obtain a valid instance */;

auto result = object.class_id();
```

**Why choose it.** The method is `const`, so it does not mutate the object through this API surface.

**Trade-offs and warnings.** Call it only in the lifecycle phase described by the module. Validate indices, capacities and object state before use.

<a id="epok-interactionpromptcomponent-class-id-1"></a>

## `epok::InteractionPromptComponent::class_id`

**Purpose.** Performs `class id` as part of the interaction module.

**Exact declaration**

```cpp
uint64_t class_id() const override
```

- **Declared at:** [line 394](../../../runtime/interaction.hpp#L394)
- **Kind:** `cxx method`; qualifiers: `const`

**Returns.** Returns `uint64_t`. Check the purpose and failure notes before using the value.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

epok::InteractionPromptComponent& object = /* obtain a valid instance */;

auto result = object.class_id();
```

**Why choose it.** The method is `const`, so it does not mutate the object through this API surface.

**Trade-offs and warnings.** Call it only in the lifecycle phase described by the module. Validate indices, capacities and object state before use.

<a id="epok-interactionpromptcomponent-frame-update-1"></a>

## `epok::InteractionPromptComponent::frame_update`

**Purpose.** Performs `frame update` as part of the interaction module.

**Exact declaration**

```cpp
void frame_update(uint32_t elapsed) override
```

- **Declared at:** [line 397](../../../runtime/interaction.hpp#L397)
- **Kind:** `cxx method`

**Parameters**

| Name | Type | Role | Meaning |
| --- | --- | --- | --- |
| `elapsed` | `uint32_t` | Input | Value supplied for `elapsed`. See the exact type and module contract. |

**Returns.** No value is returned; observe the documented state change or callback.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

// Assume these named values have been initialized with valid data:
// uint32_t elapsed

epok::InteractionPromptComponent& object = /* obtain a valid instance */;

object.frame_update(elapsed);
```

**Why choose it.** It provides direct, allocation-conscious access to the interaction module. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Call it only in the lifecycle phase described by the module. Validate indices, capacities and object state before use.

<a id="epok-interactionsensor2dcomponent-binding-status-1"></a>

## `epok::InteractionSensor2DComponent::binding_status`

**Purpose.** Performs `binding status` as part of the interaction module.

**Exact declaration**

```cpp
InteractionResult binding_status() const
```

- **Declared at:** [line 366](../../../runtime/interaction.hpp#L366)
- **Kind:** `cxx method`; qualifiers: `const`

**Returns.** Returns `InteractionResult`. Check the purpose and failure notes before using the value.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

epok::InteractionSensor2DComponent& object = /* obtain a valid instance */;

auto result = object.binding_status();
```

**Why choose it.** The method is `const`, so it does not mutate the object through this API surface.

**Trade-offs and warnings.** Call it only in the lifecycle phase described by the module. Validate indices, capacities and object state before use.

<a id="epok-interactionsensor2dcomponent-class-id-1"></a>

## `epok::InteractionSensor2DComponent::class_id`

**Purpose.** Performs `class id` as part of the interaction module.

**Exact declaration**

```cpp
uint64_t class_id() const override
```

- **Declared at:** [line 359](../../../runtime/interaction.hpp#L359)
- **Kind:** `cxx method`; qualifiers: `const`

**Returns.** Returns `uint64_t`. Check the purpose and failure notes before using the value.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

epok::InteractionSensor2DComponent& object = /* obtain a valid instance */;

auto result = object.class_id();
```

**Why choose it.** The method is `const`, so it does not mutate the object through this API surface.

**Trade-offs and warnings.** Call it only in the lifecycle phase described by the module. Validate indices, capacities and object state before use.

<a id="epok-interactionsensor2dcomponent-configure-1"></a>

## `epok::InteractionSensor2DComponent::configure`

**Purpose.** Performs `configure` as part of the interaction module.

**Exact declaration**

```cpp
void configure()
```

- **Declared at:** [line 368](../../../runtime/interaction.hpp#L368)
- **Kind:** `cxx method`

**Returns.** No value is returned; observe the documented state change or callback.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

epok::InteractionSensor2DComponent& object = /* obtain a valid instance */;

object.configure();
```

**Why choose it.** It provides direct, allocation-conscious access to the interaction module. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Call it only in the lifecycle phase described by the module. Validate indices, capacities and object state before use.

<a id="epok-interactionsensor2dcomponent-frame-update-1"></a>

## `epok::InteractionSensor2DComponent::frame_update`

**Purpose.** Performs `frame update` as part of the interaction module.

**Exact declaration**

```cpp
void frame_update(uint32_t elapsed) override
```

- **Declared at:** [line 376](../../../runtime/interaction.hpp#L376)
- **Kind:** `cxx method`

**Parameters**

| Name | Type | Role | Meaning |
| --- | --- | --- | --- |
| `elapsed` | `uint32_t` | Input | Value supplied for `elapsed`. See the exact type and module contract. |

**Returns.** No value is returned; observe the documented state change or callback.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

// Assume these named values have been initialized with valid data:
// uint32_t elapsed

epok::InteractionSensor2DComponent& object = /* obtain a valid instance */;

object.frame_update(elapsed);
```

**Why choose it.** It provides direct, allocation-conscious access to the interaction module. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Call it only in the lifecycle phase described by the module. Validate indices, capacities and object state before use.

<a id="epok-interactionsensor2dcomponent-level-attached-1"></a>

## `epok::InteractionSensor2DComponent::level_attached`

**Purpose.** Performs `level attached` as part of the interaction module.

**Exact declaration**

```cpp
void level_attached() override
```

- **Declared at:** [line 367](../../../runtime/interaction.hpp#L367)
- **Kind:** `cxx method`

**Returns.** No value is returned; observe the documented state change or callback.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

epok::InteractionSensor2DComponent& object = /* obtain a valid instance */;

object.level_attached();
```

**Why choose it.** It provides direct, allocation-conscious access to the interaction module. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Call it only in the lifecycle phase described by the module. Validate indices, capacities and object state before use.

<a id="epok-interactionsensor2dcomponent-set-monitoring-1"></a>

## `epok::InteractionSensor2DComponent::set_monitoring`

**Purpose.** Sets monitoring as part of the interaction module.

**Exact declaration**

```cpp
void set_monitoring(bool value)
```

- **Declared at:** [line 365](../../../runtime/interaction.hpp#L365)
- **Kind:** `cxx method`

**Parameters**

| Name | Type | Role | Meaning |
| --- | --- | --- | --- |
| `value` | `bool` | Input | Value supplied for `value`. See the exact type and module contract. |

**Returns.** No value is returned; observe the documented state change or callback.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

// Assume these named values have been initialized with valid data:
// bool value

epok::InteractionSensor2DComponent& object = /* obtain a valid instance */;

object.set_monitoring(value);
```

**Why choose it.** It provides direct, allocation-conscious access to the interaction module. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Call it only in the lifecycle phase described by the module. Validate indices, capacities and object state before use.

<a id="epok-interactionsensor2dcomponent-trigger-event-1"></a>

## `epok::InteractionSensor2DComponent::trigger_event`

**Purpose.** Performs `trigger event` as part of the interaction module.

**Exact declaration**

```cpp
void trigger_event(ObjectId other,TriggerPhase phase) override
```

- **Declared at:** [line 377](../../../runtime/interaction.hpp#L377)
- **Kind:** `cxx method`

**Parameters**

| Name | Type | Role | Meaning |
| --- | --- | --- | --- |
| `other` | `ObjectId` | Input | Value supplied for `other`. See the exact type and module contract. |
| `phase` | `TriggerPhase` | Input | Value supplied for `phase`. See the exact type and module contract. |

**Returns.** No value is returned; observe the documented state change or callback.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

// Assume these named values have been initialized with valid data:
// ObjectId other
// TriggerPhase phase

epok::InteractionSensor2DComponent& object = /* obtain a valid instance */;

object.trigger_event(other, phase);
```

**Why choose it.** It provides direct, allocation-conscious access to the interaction module. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Call it only in the lifecycle phase described by the module. Validate indices, capacities and object state before use.

<a id="epok-interactionsensor3dcomponent-binding-status-1"></a>

## `epok::InteractionSensor3DComponent::binding_status`

**Purpose.** Performs `binding status` as part of the interaction module.

**Exact declaration**

```cpp
InteractionResult binding_status() const
```

- **Declared at:** [line 335](../../../runtime/interaction.hpp#L335)
- **Kind:** `cxx method`; qualifiers: `const`

**Returns.** Returns `InteractionResult`. Check the purpose and failure notes before using the value.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

epok::InteractionSensor3DComponent& object = /* obtain a valid instance */;

auto result = object.binding_status();
```

**Why choose it.** The method is `const`, so it does not mutate the object through this API surface.

**Trade-offs and warnings.** Call it only in the lifecycle phase described by the module. Validate indices, capacities and object state before use.

<a id="epok-interactionsensor3dcomponent-class-id-1"></a>

## `epok::InteractionSensor3DComponent::class_id`

**Purpose.** Performs `class id` as part of the interaction module.

**Exact declaration**

```cpp
uint64_t class_id() const override
```

- **Declared at:** [line 327](../../../runtime/interaction.hpp#L327)
- **Kind:** `cxx method`; qualifiers: `const`

**Returns.** Returns `uint64_t`. Check the purpose and failure notes before using the value.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

epok::InteractionSensor3DComponent& object = /* obtain a valid instance */;

auto result = object.class_id();
```

**Why choose it.** The method is `const`, so it does not mutate the object through this API surface.

**Trade-offs and warnings.** Call it only in the lifecycle phase described by the module. Validate indices, capacities and object state before use.

<a id="epok-interactionsensor3dcomponent-configure-1"></a>

## `epok::InteractionSensor3DComponent::configure`

**Purpose.** Performs `configure` as part of the interaction module.

**Exact declaration**

```cpp
void configure()
```

- **Declared at:** [line 336](../../../runtime/interaction.hpp#L336)
- **Kind:** `cxx method`

**Returns.** No value is returned; observe the documented state change or callback.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

epok::InteractionSensor3DComponent& object = /* obtain a valid instance */;

object.configure();
```

**Why choose it.** It provides direct, allocation-conscious access to the interaction module. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Call it only in the lifecycle phase described by the module. Validate indices, capacities and object state before use.

<a id="epok-interactionsensor3dcomponent-frame-update-1"></a>

## `epok::InteractionSensor3DComponent::frame_update`

**Purpose.** Performs `frame update` as part of the interaction module.

**Exact declaration**

```cpp
void frame_update(uint32_t elapsed) override
```

- **Declared at:** [line 348](../../../runtime/interaction.hpp#L348)
- **Kind:** `cxx method`

**Parameters**

| Name | Type | Role | Meaning |
| --- | --- | --- | --- |
| `elapsed` | `uint32_t` | Input | Value supplied for `elapsed`. See the exact type and module contract. |

**Returns.** No value is returned; observe the documented state change or callback.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

// Assume these named values have been initialized with valid data:
// uint32_t elapsed

epok::InteractionSensor3DComponent& object = /* obtain a valid instance */;

object.frame_update(elapsed);
```

**Why choose it.** It provides direct, allocation-conscious access to the interaction module. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Call it only in the lifecycle phase described by the module. Validate indices, capacities and object state before use.

<a id="epok-interactionsensor3dcomponent-set-monitoring-1"></a>

## `epok::InteractionSensor3DComponent::set_monitoring`

**Purpose.** Sets monitoring as part of the interaction module.

**Exact declaration**

```cpp
void set_monitoring(bool value)
```

- **Declared at:** [line 334](../../../runtime/interaction.hpp#L334)
- **Kind:** `cxx method`

**Parameters**

| Name | Type | Role | Meaning |
| --- | --- | --- | --- |
| `value` | `bool` | Input | Value supplied for `value`. See the exact type and module contract. |

**Returns.** No value is returned; observe the documented state change or callback.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

// Assume these named values have been initialized with valid data:
// bool value

epok::InteractionSensor3DComponent& object = /* obtain a valid instance */;

object.set_monitoring(value);
```

**Why choose it.** It provides direct, allocation-conscious access to the interaction module. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Call it only in the lifecycle phase described by the module. Validate indices, capacities and object state before use.

<a id="epok-interactionsensor3dcomponent-trigger-event-1"></a>

## `epok::InteractionSensor3DComponent::trigger_event`

**Purpose.** Performs `trigger event` as part of the interaction module.

**Exact declaration**

```cpp
void trigger_event(ObjectId other,TriggerPhase phase) override
```

- **Declared at:** [line 352](../../../runtime/interaction.hpp#L352)
- **Kind:** `cxx method`

**Parameters**

| Name | Type | Role | Meaning |
| --- | --- | --- | --- |
| `other` | `ObjectId` | Input | Value supplied for `other`. See the exact type and module contract. |
| `phase` | `TriggerPhase` | Input | Value supplied for `phase`. See the exact type and module contract. |

**Returns.** No value is returned; observe the documented state change or callback.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

// Assume these named values have been initialized with valid data:
// ObjectId other
// TriggerPhase phase

epok::InteractionSensor3DComponent& object = /* obtain a valid instance */;

object.trigger_event(other, phase);
```

**Why choose it.** It provides direct, allocation-conscious access to the interaction module. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Call it only in the lifecycle phase described by the module. Validate indices, capacities and object state before use.

<a id="epok-interactorcomponent-candidate-count-1"></a>

## `epok::InteractorComponent::candidate_count`

**Purpose.** Performs `candidate count` as part of the interaction module.

**Exact declaration**

```cpp
uint32_t candidate_count() const
```

- **Declared at:** [line 224](../../../runtime/interaction.hpp#L224)
- **Kind:** `cxx method`; qualifiers: `const`

**Returns.** Returns `uint32_t`. Check the purpose and failure notes before using the value.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

epok::InteractorComponent& object = /* obtain a valid instance */;

auto result = object.candidate_count();
```

**Why choose it.** The method is `const`, so it does not mutate the object through this API surface.

**Trade-offs and warnings.** Call it only in the lifecycle phase described by the module. Validate indices, capacities and object state before use.

<a id="epok-interactorcomponent-class-id-1"></a>

## `epok::InteractorComponent::class_id`

**Purpose.** Performs `class id` as part of the interaction module.

**Exact declaration**

```cpp
uint64_t class_id() const override
```

- **Declared at:** [line 209](../../../runtime/interaction.hpp#L209)
- **Kind:** `cxx method`; qualifiers: `const`

**Returns.** Returns `uint64_t`. Check the purpose and failure notes before using the value.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

epok::InteractorComponent& object = /* obtain a valid instance */;

auto result = object.class_id();
```

**Why choose it.** The method is `const`, so it does not mutate the object through this API surface.

**Trade-offs and warnings.** Call it only in the lifecycle phase described by the module. Validate indices, capacities and object state before use.

<a id="epok-interactorcomponent-focus-changed-1"></a>

## `epok::InteractorComponent::focus_changed`

**Purpose.** Performs `focus changed` as part of the interaction module.

**Exact declaration**

```cpp
virtual void focus_changed(ObjectId previous,ObjectId current)
```

- **Declared at:** [line 219](../../../runtime/interaction.hpp#L219)
- **Kind:** `cxx method`; qualifiers: `virtual`

**Parameters**

| Name | Type | Role | Meaning |
| --- | --- | --- | --- |
| `previous` | `ObjectId` | Input | Value supplied for `previous`. See the exact type and module contract. |
| `current` | `ObjectId` | Input | Value supplied for `current`. See the exact type and module contract. |

**Returns.** No value is returned; observe the documented state change or callback.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

// Assume these named values have been initialized with valid data:
// ObjectId previous
// ObjectId current

epok::InteractorComponent& object = /* obtain a valid instance */;

object.focus_changed(previous, current);
```

**Why choose it.** It provides direct, allocation-conscious access to the interaction module. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Call it only in the lifecycle phase described by the module. Validate indices, capacities and object state before use.

<a id="epok-interactorcomponent-focused-target-1"></a>

## `epok::InteractorComponent::focused_target`

**Purpose.** Performs `focused target` as part of the interaction module.

**Exact declaration**

```cpp
ObjectId focused_target() const
```

- **Declared at:** [line 220](../../../runtime/interaction.hpp#L220)
- **Kind:** `cxx method`; qualifiers: `const`

**Returns.** Returns `ObjectId`. Check the purpose and failure notes before using the value.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

epok::InteractorComponent& object = /* obtain a valid instance */;

auto result = object.focused_target();
```

**Why choose it.** The method is `const`, so it does not mutate the object through this API surface.

**Trade-offs and warnings.** Call it only in the lifecycle phase described by the module. Validate indices, capacities and object state before use.

<a id="epok-interactorcomponent-forget-sensor-1"></a>

## `epok::InteractorComponent::forget_sensor`

**Purpose.** Performs `forget sensor` as part of the interaction module.

**Exact declaration**

```cpp
void forget_sensor(ObjectId sensor)
```

- **Declared at:** [line 238](../../../runtime/interaction.hpp#L238)
- **Kind:** `cxx method`

**Parameters**

| Name | Type | Role | Meaning |
| --- | --- | --- | --- |
| `sensor` | `ObjectId` | Input | Value supplied for `sensor`. See the exact type and module contract. |

**Returns.** No value is returned; observe the documented state change or callback.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

// Assume these named values have been initialized with valid data:
// ObjectId sensor

epok::InteractorComponent& object = /* obtain a valid instance */;

object.forget_sensor(sensor);
```

**Why choose it.** It provides direct, allocation-conscious access to the interaction module. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Call it only in the lifecycle phase described by the module. Validate indices, capacities and object state before use.

<a id="epok-interactorcomponent-frame-update-1"></a>

## `epok::InteractorComponent::frame_update`

**Purpose.** Framework work precedes the extensible on_frame event, including in Lua/BP subclasses.

**Exact declaration**

```cpp
void frame_update(uint32_t elapsed) override
```

- **Declared at:** [line 265](../../../runtime/interaction.hpp#L265)
- **Kind:** `cxx method`

**Parameters**

| Name | Type | Role | Meaning |
| --- | --- | --- | --- |
| `elapsed` | `uint32_t` | Input | Value supplied for `elapsed`. See the exact type and module contract. |

**Returns.** No value is returned; observe the documented state change or callback.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

// Assume these named values have been initialized with valid data:
// uint32_t elapsed

epok::InteractorComponent& object = /* obtain a valid instance */;

object.frame_update(elapsed);
```

**Why choose it.** It provides direct, allocation-conscious access to the interaction module. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Call it only in the lifecycle phase described by the module. Validate indices, capacities and object state before use.

<a id="epok-interactorcomponent-interact-1"></a>

## `epok::InteractorComponent::interact`

**Purpose.** Performs `interact` as part of the interaction module.

**Exact declaration**

```cpp
InteractionResult interact()
```

- **Declared at:** [line 257](../../../runtime/interaction.hpp#L257)
- **Kind:** `cxx method`

**Returns.** Returns `InteractionResult`. Check the purpose and failure notes before using the value.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

epok::InteractorComponent& object = /* obtain a valid instance */;

auto result = object.interact();
```

**Why choose it.** It provides direct, allocation-conscious access to the interaction module. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Call it only in the lifecycle phase described by the module. Validate indices, capacities and object state before use.

<a id="epok-interactorcomponent-level-attached-1"></a>

## `epok::InteractorComponent::level_attached`

**Purpose.** Performs `level attached` as part of the interaction module.

**Exact declaration**

```cpp
void level_attached() override
```

- **Declared at:** [line 211](../../../runtime/interaction.hpp#L211)
- **Kind:** `cxx method`

**Returns.** No value is returned; observe the documented state change or callback.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

epok::InteractorComponent& object = /* obtain a valid instance */;

object.level_attached();
```

**Why choose it.** It provides direct, allocation-conscious access to the interaction module. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Call it only in the lifecycle phase described by the module. Validate indices, capacities and object state before use.

<a id="epok-interactorcomponent-overflow-count-1"></a>

## `epok::InteractorComponent::overflow_count`

**Purpose.** Performs `overflow count` as part of the interaction module.

**Exact declaration**

```cpp
uint32_t overflow_count() const
```

- **Declared at:** [line 225](../../../runtime/interaction.hpp#L225)
- **Kind:** `cxx method`; qualifiers: `const`

**Returns.** Returns `uint32_t`. Check the purpose and failure notes before using the value.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

epok::InteractorComponent& object = /* obtain a valid instance */;

auto result = object.overflow_count();
```

**Why choose it.** The method is `const`, so it does not mutate the object through this API surface.

**Trade-offs and warnings.** Call it only in the lifecycle phase described by the module. Validate indices, capacities and object state before use.

<a id="epok-interactorcomponent-prune-lifetime-1"></a>

## `epok::InteractorComponent::prune_lifetime`

**Purpose.** Performs `prune lifetime` as part of the interaction module.

**Exact declaration**

```cpp
void prune_lifetime()
```

- **Declared at:** [line 271](../../../runtime/interaction.hpp#L271)
- **Kind:** `cxx method`

**Returns.** No value is returned; observe the documented state change or callback.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

epok::InteractorComponent& object = /* obtain a valid instance */;

object.prune_lifetime();
```

**Why choose it.** It provides direct, allocation-conscious access to the interaction module. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Call it only in the lifecycle phase described by the module. Validate indices, capacities and object state before use.

<a id="epok-interactorcomponent-refresh-1"></a>

## `epok::InteractorComponent::refresh`

**Purpose.** Performs `refresh` as part of the interaction module.

**Exact declaration**

```cpp
void refresh()
```

- **Declared at:** [line 243](../../../runtime/interaction.hpp#L243)
- **Kind:** `cxx method`

**Returns.** No value is returned; observe the documented state change or callback.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

epok::InteractorComponent& object = /* obtain a valid instance */;

object.refresh();
```

**Why choose it.** It provides direct, allocation-conscious access to the interaction module. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Call it only in the lifecycle phase described by the module. Validate indices, capacities and object state before use.

<a id="epok-interactorcomponent-register-candidate-1"></a>

## `epok::InteractorComponent::register_candidate`

**Purpose.** Performs `register candidate` as part of the interaction module.

**Exact declaration**

```cpp
bool register_candidate(ObjectId value,ObjectId sensor)
```

- **Declared at:** [line 226](../../../runtime/interaction.hpp#L226)
- **Kind:** `cxx method`

**Parameters**

| Name | Type | Role | Meaning |
| --- | --- | --- | --- |
| `value` | `ObjectId` | Input | Value supplied for `value`. See the exact type and module contract. |
| `sensor` | `ObjectId` | Input | Value supplied for `sensor`. See the exact type and module contract. |

**Returns.** Returns `bool`. Check the purpose and failure notes before using the value.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

// Assume these named values have been initialized with valid data:
// ObjectId value
// ObjectId sensor

epok::InteractorComponent& object = /* obtain a valid instance */;

auto result = object.register_candidate(value, sensor);
```

**Why choose it.** The boolean result makes success, availability or state explicit without exceptions.

**Trade-offs and warnings.** Check the return value; `false` is part of normal control flow for many PSX resource operations.

<a id="epok-interactorcomponent-unregister-candidate-1"></a>

## `epok::InteractorComponent::unregister_candidate`

**Purpose.** Performs `unregister candidate` as part of the interaction module.

**Exact declaration**

```cpp
bool unregister_candidate(ObjectId value,ObjectId sensor)
```

- **Declared at:** [line 235](../../../runtime/interaction.hpp#L235)
- **Kind:** `cxx method`

**Parameters**

| Name | Type | Role | Meaning |
| --- | --- | --- | --- |
| `value` | `ObjectId` | Input | Value supplied for `value`. See the exact type and module contract. |
| `sensor` | `ObjectId` | Input | Value supplied for `sensor`. See the exact type and module contract. |

**Returns.** Returns `bool`. Check the purpose and failure notes before using the value.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

// Assume these named values have been initialized with valid data:
// ObjectId value
// ObjectId sensor

epok::InteractorComponent& object = /* obtain a valid instance */;

auto result = object.unregister_candidate(value, sensor);
```

**Why choose it.** The boolean result makes success, availability or state explicit without exceptions.

**Trade-offs and warnings.** Check the return value; `false` is part of normal control flow for many PSX resource operations.

<a id="epok-interactorcomponent-interactorcomponent-1"></a>

## `epok::InteractorComponent::~InteractorComponent`

**Purpose.** Releases the resources owned by `epok::InteractorComponent`.

**Exact declaration**

```cpp
~InteractorComponent() override
```

- **Declared at:** [line 212](../../../runtime/interaction.hpp#L212)
- **Kind:** `destructor`

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

// `epok::InteractorComponent` cleans up when its owning scope ends.
```

**Why choose it.** It provides direct, allocation-conscious access to the interaction module. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Call it only in the lifecycle phase described by the module. Validate indices, capacities and object state before use.

<a id="epok-triggerarea2d-class-id-1"></a>

## `epok::TriggerArea2D::class_id`

**Purpose.** Performs `class id` as part of the interaction module.

**Exact declaration**

```cpp
uint64_t class_id() const override
```

- **Declared at:** [line 388](../../../runtime/interaction.hpp#L388)
- **Kind:** `cxx method`; qualifiers: `const`

**Returns.** Returns `uint64_t`. Check the purpose and failure notes before using the value.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

epok::TriggerArea2D& object = /* obtain a valid instance */;

auto result = object.class_id();
```

**Why choose it.** The method is `const`, so it does not mutate the object through this API surface.

**Trade-offs and warnings.** Call it only in the lifecycle phase described by the module. Validate indices, capacities and object state before use.

<a id="epok-triggerbox3d-class-id-1"></a>

## `epok::TriggerBox3D::class_id`

**Purpose.** Performs `class id` as part of the interaction module.

**Exact declaration**

```cpp
uint64_t class_id() const override
```

- **Declared at:** [line 382](../../../runtime/interaction.hpp#L382)
- **Kind:** `cxx method`; qualifiers: `const`

**Returns.** Returns `uint64_t`. Check the purpose and failure notes before using the value.

**Use it when.** You need the interaction module and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "interaction.hpp"

epok::TriggerBox3D& object = /* obtain a valid instance */;

auto result = object.class_id();
```

**Why choose it.** The method is `const`, so it does not mutate the object through this API surface.

**Trade-offs and warnings.** Call it only in the lifecycle phase described by the module. Validate indices, capacities and object state before use.
