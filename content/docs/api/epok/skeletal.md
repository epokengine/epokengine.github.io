# Epok API: Skeletal

> **Header:** `"skeletal.hpp"` · **Tier:** Epok runtime API · **Source:** [open header](../../../runtime/skeletal.hpp)

This module covers rigid skeletal animation and pose evaluation. It documents 6 public callables declared directly in this header.

## Declared types

`epok::skeletal_detail::Scratch`

## Callable index

- [`epok::skeletal_detail::pose_matrix`](#epok-skeletal-detail-pose-matrix-1) — Performs `pose matrix` as part of rigid skeletal animation and pose evaluation.
- [`epok::skeletal_detail::Scratch::decode_vertices`](#epok-skeletal-detail-scratch-decode-vertices-1) — Performs `decode vertices` as part of rigid skeletal animation and pose evaluation.
- [`epok::skeletal_detail::Scratch::frame_index`](#epok-skeletal-detail-scratch-frame-index-1) — Performs `frame index` as part of rigid skeletal animation and pose evaluation.
- [`epok::skeletal_detail::Scratch::pose`](#epok-skeletal-detail-scratch-pose-1) — Performs `pose` as part of rigid skeletal animation and pose evaluation.
- [`epok::skeletal_detail::Scratch::pose_bones`](#epok-skeletal-detail-scratch-pose-bones-1) — Performs `pose bones` as part of rigid skeletal animation and pose evaluation.
- [`epok::skeletal_detail::Scratch::skin_vertices`](#epok-skeletal-detail-scratch-skin-vertices-1) — Performs `skin vertices` as part of rigid skeletal animation and pose evaluation.

<a id="epok-skeletal-detail-pose-matrix-1"></a>

## `epok::skeletal_detail::pose_matrix`

**Purpose.** Performs `pose matrix` as part of rigid skeletal animation and pose evaluation.

**Exact declaration**

```cpp
inline Affine<Fixed> pose_matrix(const BonePose& p)
```

- **Declared at:** [line 8](../../../runtime/skeletal.hpp#L8)
- **Kind:** `function decl`

**Parameters**

| Name | Type | Role | Meaning |
| --- | --- | --- | --- |
| `p` | `const BonePose &` | Input | Value supplied for `p`. See the exact type and module contract. |

**Returns.** Returns `Affine<Fixed>`. Check the purpose and failure notes before using the value.

**Use it when.** You need rigid skeletal animation and pose evaluation and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "skeletal.hpp"

// Assume these named values have been initialized with valid data:
// const BonePose & p

auto result = epok::skeletal_detail::pose_matrix(p);
```

**Why choose it.** It provides direct, allocation-conscious access to rigid skeletal animation and pose evaluation. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Pointer/reference arguments are borrowed unless the source contract says otherwise; keep them valid for the complete operation and never assume null is accepted.

<a id="epok-skeletal-detail-scratch-decode-vertices-1"></a>

## `epok::skeletal_detail::Scratch::decode_vertices`

**Purpose.** Performs `decode vertices` as part of rigid skeletal animation and pose evaluation.

**Exact declaration**

```cpp
void decode_vertices(const SkeletalMesh& model,const Animator& animator)
```

- **Declared at:** [line 47](../../../runtime/skeletal.hpp#L47)
- **Kind:** `cxx method`

**Parameters**

| Name | Type | Role | Meaning |
| --- | --- | --- | --- |
| `model` | `const SkeletalMesh &` | Input | Value supplied for `model`. See the exact type and module contract. |
| `animator` | `const Animator &` | Input | Value supplied for `animator`. See the exact type and module contract. |

**Returns.** No value is returned; observe the documented state change or callback.

**Use it when.** You need rigid skeletal animation and pose evaluation and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "skeletal.hpp"

// Assume these named values have been initialized with valid data:
// const SkeletalMesh & model
// const Animator & animator

epok::skeletal_detail::Scratch& object = /* obtain a valid instance */;

object.decode_vertices(model, animator);
```

**Why choose it.** It provides direct, allocation-conscious access to rigid skeletal animation and pose evaluation. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Pointer/reference arguments are borrowed unless the source contract says otherwise; keep them valid for the complete operation and never assume null is accepted.

<a id="epok-skeletal-detail-scratch-frame-index-1"></a>

## `epok::skeletal_detail::Scratch::frame_index`

**Purpose.** Performs `frame index` as part of rigid skeletal animation and pose evaluation.

**Exact declaration**

```cpp
static uint32_t frame_index(const AnimationClip* clip,const Animator& animator)
```

- **Declared at:** [line 22](../../../runtime/skeletal.hpp#L22)
- **Kind:** `cxx method`; qualifiers: `static`

**Parameters**

| Name | Type | Role | Meaning |
| --- | --- | --- | --- |
| `clip` | `const AnimationClip *` | Input | Value supplied for `clip`. See the exact type and module contract. |
| `animator` | `const Animator &` | Input | Value supplied for `animator`. See the exact type and module contract. |

**Returns.** Returns `uint32_t`. Check the purpose and failure notes before using the value.

**Use it when.** You need rigid skeletal animation and pose evaluation and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "skeletal.hpp"

// Assume these named values have been initialized with valid data:
// const AnimationClip * clip
// const Animator & animator

auto result = epok::skeletal_detail::Scratch::frame_index(clip, animator);
```

**Why choose it.** It provides direct, allocation-conscious access to rigid skeletal animation and pose evaluation. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Pointer/reference arguments are borrowed unless the source contract says otherwise; keep them valid for the complete operation and never assume null is accepted.

<a id="epok-skeletal-detail-scratch-pose-1"></a>

## `epok::skeletal_detail::Scratch::pose`

**Purpose.** Performs `pose` as part of rigid skeletal animation and pose evaluation.

**Exact declaration**

```cpp
void pose(const SkeletalMesh& model,const Animator& animator)
```

- **Declared at:** [line 63](../../../runtime/skeletal.hpp#L63)
- **Kind:** `cxx method`

**Parameters**

| Name | Type | Role | Meaning |
| --- | --- | --- | --- |
| `model` | `const SkeletalMesh &` | Input | Value supplied for `model`. See the exact type and module contract. |
| `animator` | `const Animator &` | Input | Value supplied for `animator`. See the exact type and module contract. |

**Returns.** No value is returned; observe the documented state change or callback.

**Use it when.** You need rigid skeletal animation and pose evaluation and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "skeletal.hpp"

// Assume these named values have been initialized with valid data:
// const SkeletalMesh & model
// const Animator & animator

epok::skeletal_detail::Scratch& object = /* obtain a valid instance */;

object.pose(model, animator);
```

**Why choose it.** It provides direct, allocation-conscious access to rigid skeletal animation and pose evaluation. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Pointer/reference arguments are borrowed unless the source contract says otherwise; keep them valid for the complete operation and never assume null is accepted.

<a id="epok-skeletal-detail-scratch-pose-bones-1"></a>

## `epok::skeletal_detail::Scratch::pose_bones`

**Purpose.** Performs `pose bones` as part of rigid skeletal animation and pose evaluation.

**Exact declaration**

```cpp
void pose_bones(const SkeletalMesh& model,const Animator& animator)
```

- **Declared at:** [line 30](../../../runtime/skeletal.hpp#L30)
- **Kind:** `cxx method`

**Parameters**

| Name | Type | Role | Meaning |
| --- | --- | --- | --- |
| `model` | `const SkeletalMesh &` | Input | Value supplied for `model`. See the exact type and module contract. |
| `animator` | `const Animator &` | Input | Value supplied for `animator`. See the exact type and module contract. |

**Returns.** No value is returned; observe the documented state change or callback.

**Use it when.** You need rigid skeletal animation and pose evaluation and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "skeletal.hpp"

// Assume these named values have been initialized with valid data:
// const SkeletalMesh & model
// const Animator & animator

epok::skeletal_detail::Scratch& object = /* obtain a valid instance */;

object.pose_bones(model, animator);
```

**Why choose it.** It provides direct, allocation-conscious access to rigid skeletal animation and pose evaluation. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Pointer/reference arguments are borrowed unless the source contract says otherwise; keep them valid for the complete operation and never assume null is accepted.

<a id="epok-skeletal-detail-scratch-skin-vertices-1"></a>

## `epok::skeletal_detail::Scratch::skin_vertices`

**Purpose.** Performs `skin vertices` as part of rigid skeletal animation and pose evaluation.

**Exact declaration**

```cpp
void skin_vertices(const SkeletalMesh& model)
```

- **Declared at:** [line 39](../../../runtime/skeletal.hpp#L39)
- **Kind:** `cxx method`

**Parameters**

| Name | Type | Role | Meaning |
| --- | --- | --- | --- |
| `model` | `const SkeletalMesh &` | Input | Value supplied for `model`. See the exact type and module contract. |

**Returns.** No value is returned; observe the documented state change or callback.

**Use it when.** You need rigid skeletal animation and pose evaluation and the preconditions in the declaration are already satisfied.

**Usage pattern**

```cpp
#include "skeletal.hpp"

// Assume these named values have been initialized with valid data:
// const SkeletalMesh & model

epok::skeletal_detail::Scratch& object = /* obtain a valid instance */;

object.skin_vertices(model);
```

**Why choose it.** It provides direct, allocation-conscious access to rigid skeletal animation and pose evaluation. No exception-based error path is implied by the signature.

**Trade-offs and warnings.** Pointer/reference arguments are borrowed unless the source contract says otherwise; keep them valid for the complete operation and never assume null is accepted.
