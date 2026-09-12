# Epok API: Hud

> **Header:** `"hud.hpp"` · **Tier:** Epok runtime API · **Source:** [open header](../../../runtime/hud.hpp)

This module covers native HUD layout, drawing and focus navigation. It documents 3 public callables declared directly in this header.

## Declared types

`epok::HudRenderer`

## Callable index

- [`epok::HudRenderer::draw`](#epok-hudrenderer-draw-1) — Draws draw as part of native HUD layout, drawing and focus navigation.
- [`epok::HudRenderer::initialize`](#epok-hudrenderer-initialize-1) — Performs `initialize` as part of native HUD layout, drawing and focus navigation.
- [`epok::HudRenderer::invalidate`](#epok-hudrenderer-invalidate-1) — Scene switches rebuild both parities; slot reuse alone is covered by the key.

<a id="epok-hudrenderer-draw-1"></a>

## `epok::HudRenderer::draw`

**Purpose.** Draws draw as part of native HUD layout, drawing and focus navigation.

**Exact declaration**

```cpp
template<size_t N>void draw(psyqo::GPU& gpu,std::array<Entity,N>& entities,size_t count)
```

- **Declared at:** [line 138](../../../runtime/hud.hpp#L138)
- **Kind:** `function template`; qualifiers: `template`

**Parameters**

| Name | Type | Role | Meaning |
| --- | --- | --- | --- |
| `gpu` | `psyqo::GPU &` | Input/output; inspect the function contract | Value supplied for `gpu`. See the exact type and module contract. |
| `entities` | `std::array<Entity, N> &` | Input/output; inspect the function contract | Value supplied for `entities`. See the exact type and module contract. |
| `count` | `size_t` | Input | Value supplied for `count`. See the exact type and module contract. |

**Returns.** No value is returned; observe the documented state change or callback.

**Use it when.** You need native HUD layout, drawing and focus navigation and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "hud.hpp"

// Replace these template arguments with types or values accepted by the declaration:
// N

// Assume these named values have been initialized with valid data:
// psyqo::GPU & gpu
// std::array<Entity, N> & entities
// size_t count

epok::HudRenderer& object = /* obtain a valid instance */;

object.draw<N>(gpu, entities, count);
```

**Why choose it.** Template dispatch is resolved at compile time and normally adds no runtime indirection. The API maps closely to PSX GPU work, giving predictable ordering and low overhead.

**Trade-offs and warnings.** Every instantiated type must satisfy the header's compile-time requirements; extra instantiations can increase code size. Respect packet lifetime, ordering-table direction and per-frame GPU/VRAM budgets; submission is not a desktop immediate-mode draw call. Pointer/reference arguments are borrowed unless the source contract says otherwise; keep them valid for the complete operation and never assume null is accepted.

<a id="epok-hudrenderer-initialize-1"></a>

## `epok::HudRenderer::initialize`

**Purpose.** Performs `initialize` as part of native HUD layout, drawing and focus navigation.

**Exact declaration**

```cpp
void initialize(psyqo::GPU& gpu)
```

- **Declared at:** [line 137](../../../runtime/hud.hpp#L137)
- **Kind:** `cxx method`

**Parameters**

| Name | Type | Role | Meaning |
| --- | --- | --- | --- |
| `gpu` | `psyqo::GPU &` | Input/output; inspect the function contract | Value supplied for `gpu`. See the exact type and module contract. |

**Returns.** No value is returned; observe the documented state change or callback.

**Use it when.** You need native HUD layout, drawing and focus navigation and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "hud.hpp"

// Assume these named values have been initialized with valid data:
// psyqo::GPU & gpu

epok::HudRenderer& object = /* obtain a valid instance */;

object.initialize(gpu);
```

**Why choose it.** The API maps closely to PSX GPU work, giving predictable ordering and low overhead.

**Trade-offs and warnings.** Respect packet lifetime, ordering-table direction and per-frame GPU/VRAM budgets; submission is not a desktop immediate-mode draw call. Pointer/reference arguments are borrowed unless the source contract says otherwise; keep them valid for the complete operation and never assume null is accepted.

<a id="epok-hudrenderer-invalidate-1"></a>

## `epok::HudRenderer::invalidate`

**Purpose.** Scene switches rebuild both parities; slot reuse alone is covered by the key.

**Exact declaration**

```cpp
void invalidate()
```

- **Declared at:** [line 156](../../../runtime/hud.hpp#L156)
- **Kind:** `cxx method`

**Returns.** No value is returned; observe the documented state change or callback.

**Use it when.** You need native HUD layout, drawing and focus navigation and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "hud.hpp"

epok::HudRenderer& object = /* obtain a valid instance */;

object.invalidate();
```

**Why choose it.** The API maps closely to PSX GPU work, giving predictable ordering and low overhead.

**Trade-offs and warnings.** Respect packet lifetime, ordering-table direction and per-frame GPU/VRAM budgets; submission is not a desktop immediate-mode draw call.
