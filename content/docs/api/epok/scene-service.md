# Epok API: Scene Service

> **Header:** `"scene_service.hpp"` · **Tier:** Engine internal · **Source:** [open header](../../../runtime/scene_service.hpp)

This module covers scene lifecycle and scene-stack control. It documents 4 public callables declared directly in this header.

## Declared types

`epok::SceneStats`

## Callable index

- [`epok::install_actor_service_hooks`](#epok-install-actor-service-hooks-1) — Idempotent; main.cpp installs at startup and scene_tick keeps it installed across a transition that replaced the bindings table.
- [`epok::legacy_bindings_notify`](#epok-legacy-bindings-notify-1) — Trigger delivery rule: the legacy `bindings` table wins.
- [`epok::music_retains_audio_source`](#epok-music-retains-audio-source-1) — Component-owned AudioSource storage stays quarantined while the XA consumer still points at it -- exactly the rule create_entity (runtime/lifecycle.hpp) applies to a legacy slot's `audio`.
- [`epok::scene_tick`](#epok-scene-tick-1) — Performs `scene tick` as part of scene lifecycle and scene-stack control.

<a id="epok-install-actor-service-hooks-1"></a>

## `epok::install_actor_service_hooks`

**Purpose.** Idempotent; main.cpp installs at startup and scene_tick keeps it installed across a transition that replaced the bindings table.

**Exact declaration**

```cpp
inline void install_actor_service_hooks()
```

- **Declared at:** [line 37](../../../runtime/scene_service.hpp#L37)
- **Kind:** `function decl`

**Returns.** No value is returned; observe the documented state change or callback.

**Use it when.** You need scene lifecycle and scene-stack control and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "scene_service.hpp"

epok::install_actor_service_hooks();
```

**Why choose it.** It provides direct, allocation-conscious access to scene lifecycle and scene-stack control. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** This is classified as **Engine internal**. Prefer a higher-level Epok service unless you need this exact control.

<a id="epok-legacy-bindings-notify-1"></a>

## `epok::legacy_bindings_notify`

**Purpose.** Trigger delivery rule: the legacy `bindings` table wins.

**Details.** A LegacyBehaviourComponent wrapping a Behaviour that table already notifies is skipped by dispatch_trigger, so a migrated entity never receives on_trigger twice.

**Exact declaration**

```cpp
inline bool legacy_bindings_notify(const ActorComponent* component)
```

- **Declared at:** [line 28](../../../runtime/scene_service.hpp#L28)
- **Kind:** `function decl`

**Parameters**

| Name | Type | Role | Meaning |
| --- | --- | --- | --- |
| `component` | `const ActorComponent *` | Input | Value supplied for `component`. See the exact type and module contract. |

**Returns.** Returns `bool`. Check the purpose and failure notes before using the value.

**Use it when.** A LegacyBehaviourComponent wrapping a Behaviour that table already notifies is skipped by dispatch_trigger, so a migrated entity never receives on_trigger twice.

**Usage pattern**

```cpp
#include "scene_service.hpp"

// Assume these named values have been initialized with valid data:
// const ActorComponent * component

auto result = epok::legacy_bindings_notify(component);
```

**Why choose it.** The boolean result makes success, availability or state explicit without exceptions.

**Trade-offs and warnings.** Check the return value; `false` is part of normal control flow for many PSX resource operations. This is classified as **Engine internal**. Prefer a higher-level Epok service unless you need this exact control. Pointer/reference arguments are borrowed unless the source contract says otherwise; keep them valid for the complete operation and never assume null is accepted.

<a id="epok-music-retains-audio-source-1"></a>

## `epok::music_retains_audio_source`

**Purpose.** Component-owned AudioSource storage stays quarantined while the XA consumer still points at it -- exactly the rule create_entity (runtime/lifecycle.hpp) applies to a legacy slot's `audio`.

**Details.** `music_lookup` means a CD lookup for `music_active` is still in flight, so that source is retained even between requests.

**Exact declaration**

```cpp
inline bool music_retains_audio_source(const AudioSource* source)
```

- **Declared at:** [line 21](../../../runtime/scene_service.hpp#L21)
- **Kind:** `function decl`

**Parameters**

| Name | Type | Role | Meaning |
| --- | --- | --- | --- |
| `source` | `const AudioSource *` | Input | Value supplied for `source`. See the exact type and module contract. |

**Returns.** Returns `bool`. Check the purpose and failure notes before using the value.

**Use it when.** `music_lookup` means a CD lookup for `music_active` is still in flight, so that source is retained even between requests.

**Usage pattern**

```cpp
#include "scene_service.hpp"

// Assume these named values have been initialized with valid data:
// const AudioSource * source

auto result = epok::music_retains_audio_source(source);
```

**Why choose it.** The boolean result makes success, availability or state explicit without exceptions. The API exposes the hardware service without hiding latency or bounded memory.

**Trade-offs and warnings.** Check the return value; `false` is part of normal control flow for many PSX resource operations. Treat device absence, busy state and I/O failure as expected outcomes; do not block the frame loop waiting for hardware. This is classified as **Engine internal**. Prefer a higher-level Epok service unless you need this exact control. Pointer/reference arguments are borrowed unless the source contract says otherwise; keep them valid for the complete operation and never assume null is accepted.

<a id="epok-scene-tick-1"></a>

## `epok::scene_tick`

**Purpose.** Performs `scene tick` as part of scene lifecycle and scene-stack control.

**Exact declaration**

```cpp
inline bool scene_tick(psyqo::GPU& gpu)
```

- **Declared at:** [line 69](../../../runtime/scene_service.hpp#L69)
- **Kind:** `function decl`

**Parameters**

| Name | Type | Role | Meaning |
| --- | --- | --- | --- |
| `gpu` | `psyqo::GPU &` | Input/output; inspect the function contract | Value supplied for `gpu`. See the exact type and module contract. |

**Returns.** Returns `bool`. Check the purpose and failure notes before using the value.

**Use it when.** You need scene lifecycle and scene-stack control and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "scene_service.hpp"

// Assume these named values have been initialized with valid data:
// psyqo::GPU & gpu

auto result = epok::scene_tick(gpu);
```

**Why choose it.** The boolean result makes success, availability or state explicit without exceptions.

**Trade-offs and warnings.** Check the return value; `false` is part of normal control flow for many PSX resource operations. This is classified as **Engine internal**. Prefer a higher-level Epok service unless you need this exact control. Pointer/reference arguments are borrowed unless the source contract says otherwise; keep them valid for the complete operation and never assume null is accepted.
