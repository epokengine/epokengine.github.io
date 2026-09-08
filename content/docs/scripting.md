# C++ scripting and exports

Each component has three original files under the game project's `assets/scripts/`:

- `Spinner.hpp`: a class derived from `uniqo::Behaviour` and its public fields.
- `Spinner.cpp`: implementations of `start(Transform&)` and `update(Transform&, Fixed dt)`.
- `Spinner.script.json`: the class name and exposed properties with defaults.

Use Add Component > New C++ Script to create and attach a component. One Behaviour is supported per entity. Each entity gets its own instance and property values, which are saved with the scene.

## Exposed properties

Metadata is explicit; the editor does not parse C++ classes or provide reflection. To expose a property, declare a public `uniqo::Fixed` member in the header and add its name/default to the JSON metadata.

```json
{
  "name": "Spinner",
  "properties": [
    { "name": "speed", "default": 90.0 }
  ]
}
```

If a persisted property is removed from metadata, reattach the component to reset its fields. Stale bindings produce a build error.

```cpp
void Spinner::update(uniqo::Transform& transform, uniqo::Fixed dt) {
    transform.rotation[1] += speed * dt;
    if (transform.rotation[1] >= 360.0)
        transform.rotation[1] -= 360.0;
}
```

## Runtime semantics

Positions, rotations and scales are local to the parent. Rotations are in degrees and numeric values use Q12 fixed point on PSX.

Properties are assigned before `start`. Measured elapsed time drives fixed 60 Hz `update` steps, with at most eight catch-up steps per rendered frame; Q12 deltas alternate 68/69 raw units to preserve elapsed time. `frame_update` runs once per rendered frame, including while simulation is paused. Use `time.set_paused` and the input API for pause menus; see [input and collision](input-collision.md).

A script on an Empty entity can animate a hierarchy. Scripts must preserve valid transforms and parent relationships. Zero or negative scales, cycles and manually edited runtime parent indices are unsupported.

Activation, destruction, safe handles, scene transitions, tweens and event helpers are documented in [runtime services](runtime-services.md). Additional APIs are documented under [sprites and particles](sprites-particles.md), [cameras](camera-resources.md), [HUD](hud.md) and [Memory Card](memory-card.md).

`entity()` returns a Behaviour's owning entity. `get<T>()` returns null for a disabled component, `add<T>()` enables it and `remove<T>()` disables it. Transform is always available. `find_entity(name)` returns the first match. See [HUD](hud.md) and [Lighting](lighting.md) for component APIs.

## Standalone export

Use the editor's File menu to export a C++ project. Export writes a new timestamped folder under `exports/`, containing runtime sources, scripts, scene data, a Makefile, instructions and license notices.

The exported project can be built with Make, the pinned Nugget SDK and a MIPS toolchain. See the [runtime build instructions](../runtime/README.md). Generated scene data is a snapshot; continue authoring original scenes and scripts in the game project.

Only the UniQo runtime is covered by the included UniQo MIT license. User-authored game scripts and assets retain their owners' chosen licenses. Third-party runtime notices accompany the export.
