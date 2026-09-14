# Your first Lua class

This tutorial builds a small but complete `Spinner` Actor. It exposes editable values in the Inspector, rotates and moves itself every tick, and destroys itself after a configurable lifetime. The same `.lua` file can compile to native C++ or run through either bounded Lua VM mode.

You do not need a C++ helper or a Blueprint for this example.

## What you will build

By the end, you will have:

- one `Spinner.lua` class under `assets/scripts/`;
- three visible Inspector properties: turn speed, sideways drift and lifetime;
- one hidden runtime field used to count elapsed time;
- a placed `Spinner` Actor moving in a 3D scene;
- a project that can switch between Native C++, VM bytecode and VM source without changing the script.

The result stays intentionally small so each line has one clear job.

## Before you start

Open a current Epok project with a 3D map. Make sure the repository setup has completed successfully; the two VM modes need Nugget's pinned `third_party/psxlua` dependency, while Native C++ mode does not link a Lua interpreter.

If you are new to Actors, remember this division:

- the **Actor class** defines reusable behavior and defaults;
- the **placed Actor** has its own identity and may override those defaults;
- the **root component** owns the transform that `position`, `rotation` and `scale` access.

## Step 1: create the class

Use **Assets > Create > Lua Class**. Enter `Spinner` and choose `epok::Actor3D` as the parent.

You can also use the Content Browser's **Add > Lua Class...** action, or run:

```powershell
epok-editor --project MyGame --new-lua-class Spinner --parent epok::Actor3D
```

Epok creates `assets/scripts/Spinner.lua`. Class creation is transactional: the editor compiles the project, and removes the new file again if its initial declaration is invalid.

The three names must agree:

```lua
---@class Spinner : epok.Actor3D
local Spinner = epok.Actor3D:extend()

return Spinner
```

`Spinner.lua`, the local named `Spinner`, and `return Spinner` describe one class. A file cannot declare several classes or execute setup code at file scope.

## Step 2: add Inspector properties

Properties are assignments on the class local, before the first method:

```lua
Spinner.speed = 90.0
Spinner.drift = 0.5
Spinner.lifetime = 3.0
Spinner.age = epok.Hidden(0.0)
```

The values declare both type and default:

| Declaration | Type | Inspector behavior |
| --- | --- | --- |
| `90.0` | `Fixed` | Editable Q12 fixed-point value |
| `3` | `Int32` | Editable signed integer |
| `true` | `Bool` | Editable checkbox |
| `epok.UInt32(3)` | `UInt32` | Editable unsigned integer |
| `epok.Vector3(1.0, 0.0, 0.0)` | `Vector3` | Editable vector components |
| `epok.Hidden(0.0)` | wrapped `Fixed` | Stored runtime field, hidden from Inspector |

File-scope expressions such as `Spinner.speed = 45.0 * 2.0` are rejected. Write the literal default directly and do calculations inside a method. This keeps class discovery static and identical in every execution mode.

## Step 3: move the Actor in `tick`

Add this method before `return Spinner`:

```lua
function Spinner:tick(delta_seconds)
    self.rotation.y = self.rotation.y + self.speed * delta_seconds
    self.position.x = self.position.x + self.drift * delta_seconds
end
```

`tick` is a reflected lifecycle event, so it does not need `---@param`. Its parameter must use the reflected name `delta_seconds`.

`self.rotation` and `self.position` are not properties you declare. Every compatible World3D class receives these intrinsic places through its root component. Profile v1 reads and writes individual components, such as `.x` or `.y`; it deliberately rejects whole-vector assignments like `self.position = epok.Vector3(...)`.

The calculation uses Epok's bounded `Fixed` arithmetic. Both VM backends and the Native C++ backend lower it through the same numeric runtime contract used by Blueprints.

## Step 4: give it a lifetime

Extend the same method:

```lua
function Spinner:tick(delta_seconds)
    self.rotation.y = self.rotation.y + self.speed * delta_seconds
    self.position.x = self.position.x + self.drift * delta_seconds

    self.age = self.age + delta_seconds
    if self.lifetime > 0.0 and self.age >= self.lifetime then
        self:destroy()
    end
end
```

`destroy` is a reflected Actor operation. Lua inherits it from the same engine base as C++ and Blueprints; this is not a Lua-only helper. Destruction is deferred safely by the runtime when called during an event batch.

The `and` expression short-circuits. A lifetime of `0.0` therefore means “run forever.”

## Step 5: use the complete file

Your finished `assets/scripts/Spinner.lua` should be:

```lua
---@class Spinner : epok.Actor3D
local Spinner = epok.Actor3D:extend()

-- Degrees per second around the Actor's Y axis.
Spinner.speed = 90.0
-- World units per second along X.
Spinner.drift = 0.5
-- Seconds before destruction; zero means forever.
Spinner.lifetime = 3.0
-- Runtime state, deliberately hidden from the Inspector.
Spinner.age = epok.Hidden(0.0)

function Spinner:tick(delta_seconds)
    self.rotation.y = self.rotation.y + self.speed * delta_seconds
    self.position.x = self.position.x + self.drift * delta_seconds

    self.age = self.age + delta_seconds
    if self.lifetime > 0.0 and self.age >= self.lifetime then
        self:destroy()
    end
end

return Spinner
```

Save the file. Epok refreshes the reflected registry and reports diagnostics as `path:line:column: message`. A compile failure does not publish a partial class or silently run stale output.

## Step 6: place and tune it

In the 3D Hierarchy or Scene view, choose **Instantiate Actor**, search for `Spinner`, and place it in the map.

Select the new Actor. The Inspector shows `speed`, `drift` and `lifetime`; `age` stays hidden. Editing a value creates an override only for that placement. **Reset to Inherited** removes the override and restores the current class default.

For an easy visual test:

1. set `lifetime` to `0.0` so the Actor stays alive;
2. keep `speed` at `90.0`;
3. reduce `drift` if the Actor leaves the camera too quickly;
4. save the scene and press **Play**.

If the Actor has no visible mesh, attach or configure a compatible mesh component first. The Lua class controls behavior; rendering still comes from components.

## Step 7: choose how Lua runs

Open **Project Settings > Scripting > Lua Execution**.

| Mode | Best first use | Target cost |
| --- | --- | --- |
| **Native C++** | Smallest dependency path and ahead-of-time release builds | Script bodies become C++; no interpreter is linked |
| **Lua VM — bytecode** | VM semantics without shipping the parser | Cooked chunks plus the no-parser archive; 96 KiB arena by default |
| **Lua VM — source** | Testing the source-loading path | Normalized source plus parser archive; 128 KiB arena by default |

Start with **Native C++** while learning. Once the class behaves correctly, switch modes and rebuild. The source, class identity, properties and generated C++ subclass do not change; only method-body execution changes.

The selection is project-wide, not per script or per Play session. Changing it invalidates incompatible staged artifacts and relinks the correct runtime. A missing VM dependency is an error, never an automatic fallback to Native C++.

For memory and ABI details, read [The Lua VM runtime](lua-vm-runtime.md).

## Step 8: add a callable for C++ or Blueprints

A new method with parameters uses the same annotations understood by Lua Language Server:

```lua
---@param new_speed Fixed
function Spinner:set_speed(new_speed)
    self.speed = new_speed
end
```

Place it after the property declarations and before `return Spinner`. The method becomes part of the reflected class contract, so compatible Blueprints and other classes can call it with a typed `Fixed` argument.

Lifecycle overrides such as `begin_play` and `tick` get their signatures from the parent and need no annotation. A non-lifecycle reflected event uses `---@override`.

## Step 9: derive one Lua class from another

Create `FastSpinner.lua` with `Spinner` as its parent:

```lua
---@class FastSpinner : Spinner
local FastSpinner = Spinner:extend()

FastSpinner.forward_speed = 2.0

function FastSpinner:tick(delta_seconds)
    FastSpinner.super.tick(self, delta_seconds)
    self.position.z = self.position.z + self.forward_speed * delta_seconds
end

return FastSpinner
```

`FastSpinner.super.tick(self, delta_seconds)` is an explicit, lexical parent call. It runs `Spinner:tick` once, then applies the derived movement. The running instance is always passed as the first argument.

Do not redeclare `speed` on the child: inherited properties already have one authoritative storage location. Tune inherited defaults per placed instance, or add a new property with a distinct name.

## Editor assistance

After the script catalog refreshes, Epok writes `.epok/lua/epok.d.lua`. It describes reflected C++, Blueprint and Lua classes, their inheritance, properties, functions, events, records, enums and Epok builtins. The editor also creates `.luarc.json` once when it is absent.

Open the project folder—not only `assets/scripts`—in a Lua Language Server-compatible editor so `.luarc.json` and the generated definitions are discovered together. These are tooling outputs; the game runtime never reads them.

## Common mistakes

| Symptom | What to check |
| --- | --- |
| “The class local is named …” | File stem, local class name and returned class must match exactly. |
| “Whole vector values are not supported” | Read or write `.x`, `.y` or `.z`, not the whole `position`, `rotation`, `scale` or vector property. |
| An ordinary Lua construct is rejected | `epok-lua` v1 is a bounded profile. Use `if`, fixed-bound numeric `for`, typed locals and supported calls; there are no dynamic tables, coroutines or metatables. |
| `tick` reports a parameter mismatch | Use the reflected name `delta_seconds`. |
| A class or enum constructor fails | Class operands are unquoted (`epok.ActorRef(EnemyBase)`); enum variant and asset-kind names are quoted. |
| A VM build cannot package scripts | Run the repository setup and verify the pinned Nugget/psxlua sources. The build will not change modes for you. |
| An old script starts with `epok.class {` | Replace the retired development syntax with the code declaration shown in this tutorial. |

## Where to go next

- Read the [complete Lua scripting reference](lua-scripting.md) for every supported type, builtin, diagnostic and limit.
- Read [The Lua VM runtime](lua-vm-runtime.md) before choosing target memory budgets or distributing a VM build.
- Study the [five-file Lua example](https://github.com/epokengine/epok-engine/tree/develop/examples/lua-scripting) for C++ inheritance, Lua-on-Lua inheritance, spawning and event overrides.
- Compare with [Your first Blueprint](blueprints-tutorial.md) and [C++ scripting](scripting.md). All three routes meet in the same reflected Actor and runtime model.
