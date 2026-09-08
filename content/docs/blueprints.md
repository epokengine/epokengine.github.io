# Blueprints

Blueprints are original `.blueprint.json` class assets, not generated C++ files.
They derive from a reflected native C++ class or another Blueprint. Generated
C++ runs through the native MIPS/PsyQo backend: no graph interpreter, C++ RTTI,
exceptions, Lua VM, or host-computed C++ member offsets are shipped to the PSX.

The current reflection/Blueprint toolchain is provisioned and validated on
Windows x64. It requires the pinned libclang and a built `uniqo-header-tool`
beside the editor. General macOS editor support does not yet provision that
Blueprint extractor runtime; Blueprint authoring is not currently supported
there. Existing legacy-script workflows are separate from this requirement.

## Create and edit

Use **New Blueprint** in the Project browser, or **New Blueprint** in Add
Component. Choose a reflected Blueprintable parent. Abstract parents are valid
authoring parents; implement all abstract events before attachment or spawning.
Final classes and final events cannot be extended.

Double-click the asset to open its canvas. **Edit Script** on a Blueprint
component opens the same asset. Use **Create derived class** to retain its
inheritance instead of copying its data. Native classes and visual descendants
share the class selector, component attachment, and typed Inspector.

The left-hand Components tree browses the class template; My Blueprint groups
graphs, functions and inherited variables with search and Add menus. Selecting
an item opens its controls in the right-hand Details panel. Class Settings and
Class Defaults are available in the toolbar. The type picker also lists enum
types already exposed by the native registry.

The Blueprint editor exposes class defaults, variables, functions, event
overrides, a searchable node catalog, and typed pins. Drag an output pin to an
input, move/select nodes, pan and zoom, and use Frame All to recover the graph.
Copy/paste remaps node/pin/link identities; undo/redo retains document history.
Comments and reroutes are authoring-only. **Compile** checks the current draft,
shows diagnostics with node navigation, and can show generated native code.
Save before building; unsaved drafts are never silently replaced by disk code.

## Inheritance and identity

Class, variable, function, node, pin, and link identities are stable. A class
rename retains its identity; changing its parent is validated transactionally.
Missing parents, members, incompatible types, duplicate IDs, and orphaned
overrides are errors, not permission to discard data. Use explicit remap/reset
controls to repair references. A malformed graph does not prevent opening its
project for repair. External file edits block conflicting saves.

Class defaults flow from native parent to Blueprint parent to child, then to
explicit scene overrides. A value equal to its parent is still an override if
the user explicitly set it. Reset removes the override and resumes inheritance.
Overriding an event replaces that implementation unless the graph calls
**Call Parent**. Parent dispatch is a qualified native call, not redispatch into
the same override. Ordinary non-overridden behavior remains inherited.

## Execution and types

Supported authoring values include bool, signed/unsigned 32-bit integers,
Fixed Q12, reflected enums, bounded Fixed vectors, entity handles, imported
Texture/AudioClip references, and class references. Pins reject incompatible
links; class/entity covariance follows the reflected ancestry. Unsafe raw
pointers, arbitrary source text, dynamic containers, and open-ended recursion
have no graph execution policy and are rejected.

Execution nodes include event/function entry, calls, Call Parent, setters,
Branch, Sequence, bounded For, Return, Delay, Timeline and Stop Timeline.
Pure expressions include literals, parameters, getters, arithmetic, comparison,
Boolean operations, vector operations and reroutes. Engine adapters cover self,
handle validity, local transforms, input, activity/destruction, scene requests,
class tests/spawning and entity audio/texture assignment. Native annotated
methods extend the callable surface without adding an interpreted language.

Make Vector combines two or three Fixed inputs. Vector Component extracts one
checked component without a dynamic index. Spawn Class accepts a typed
`ClassRef<Base>` from a variable or pin; the selected runtime class must have a
compatible registered factory. A missing class or exhausted pool returns an
invalid handle. The fixed-class Spawn node remains available.

**Call on instance** invokes a reflected public callable on a typed Target
entity, including another Blueprint. Checked casts retain handle-generation
validation. An invalid, destroyed, or wrong-class target does nothing and returns
the type's empty value. Impure returned values are captured once, even when
multiple pins consume them. Cross-instance dispatch has a 32-call depth ceiling;
destroyed dynamic receivers stay allocated until their active calls unwind.

Impure calls with return values execute once, in execution-wire order. Reading
their result before the call is rejected. Pure data dependencies cannot cycle.
Nested structured loops have a combined 4096-iteration compile bound; expression
depth and expansion are also bounded. Division by zero produces zero; signed
integer/Q12 arithmetic saturates, and division rounds toward zero.

Delay yields; even zero delay resumes on a later tick. Each graph has a bounded
continuation frame; retriggering replaces its earlier pending invocation.
Arguments and live temporaries survive suspension. Inactive ancestors and
paused simulation freeze timers. Destruction, reused handles and scene changes
cancel stale work. Timeline uses bounded, strictly increasing Q12 time/value
keys and exposes Updated/Finished outputs; looping and Stop Timeline are explicit.

## Entity templates and construction

The class's template defines a stable-ID root and component/child hierarchy.
Use the template editor to add entities and edit inherited component members,
or capture a selected scene subtree into the class. Captured internal references
are remapped; references outside the subtree must be removed or represented by
an explicit instance input. Place a class to create a linked scene instance.

Unchanged members follow future template edits. Instance edits record explicit
member overrides; reset restores inheritance. New inherited children receive
fresh scene IDs. Removed/replaced template identities are reported for explicit
repair, preserving the existing scene data. Unlink retains the current entities
as ordinary scene objects. Placement, reset and unlink support scene undo.

Construction uses a closed host backend: bounded transform, activity, color and
parent operations applied with Q12-compatible rules. It does **not** execute
arbitrary native constructors or game MIPS code on the host. The same resolved
prototype supplies editor placement and runtime spawning.

Dynamic spawning reserves the entire template, binds all scripts, applies
defaults and resolves internal handles before any Start callback. Capacity or
validation failure rolls back the unstarted allocation without gameplay destroy
callbacks. Spawned scripts use typed per-class pools (four instances per class),
with 32 dynamic slots, at most 64 cooked classes, 32 entities per template, and
a 64 KiB compile-time typed-pool storage ceiling. Returned handles must be
checked for validity. Instance-generation checks prevent stale-slot reuse.

Resources reachable only through templates or AssetRef values are cooked too.
Dynamic resources use a fixed shared resident texture layout across scene banks;
the normal VRAM/audio limits still apply and overflow is an actionable cook error.

## Debugging and iteration

Enable **Instrument Blueprint Debugger** before Play. Select a graph node and
set a breakpoint; saved all-instance breakpoints also catch Start. The debugger
supports a real node pause, next-node step, continue, and run-local
instance/generation breakpoints. Current class/node mappings, recent bounded
traces, and typed property values come from the generated source map and a
versioned target snapshot. The first 16 reflected members are inspectable in
the fixed snapshot. This is not arbitrary native memory inspection.

Instrumentation uses an execution breakpoint in the owned PCSX-Redux interpreter
so synchronous graph calls retain their actual native stack. Release builds omit
the snapshot and hook work. Debug builds use a separate cache. Changes after a
debug build invalidate source navigation until rebuilding; there is no live
native-code or object-layout patching. Pause freezes the owned emulator, not
other running emulator instances.

Graph source changes during Play queue a later build. Stop, save and Play again
to restart from authored defaults; runtime state is deliberately not preserved.
Layout-only node moves do not change the semantic C++ cache key. Export produces
standalone native sources and a build script; neither the editor nor the
reflection extractor is required to rebuild the exported game.

## Reproducible examples and acceptance

From the engine checkout after `cargo build --bins`:

```powershell
python tests/integration/create_blueprint_visual_fixture.py --destination "D:\Games\BlueprintCanvas"
python tests/integration/verify_blueprints.py --keep --emulator
python tests/integration/verify_blueprint_features.py --keep --emulator
```

The canvas generator refuses existing destinations and prints the command to
open the compiled example. The acceptance scripts retain isolated playable
projects when `--keep` is present: native Enemy / Blueprint Enemy / Blueprint Boss
inheritance, and a template/Timeline/resource/cross-instance-call example.
Run emulator checks sequentially with no other Play session on port 8077.
Reports are written under ignored `artifacts/blueprints/`.

## Command line

```powershell
uniqo-editor.exe --project "D:\Games\Example" --new-blueprint BP_Enemy --parent Enemy
uniqo-editor.exe --project "D:\Games\Example" --compile-blueprints
uniqo-editor.exe --project "D:\Games\Example" --build-psx
uniqo-editor.exe --project "D:\Games\Example" --play-psx --blueprint-debug
uniqo-editor.exe --project "D:\Games\Example" --export-psx
```

The native canvas uses compact node headers, typed pins and curved execution/data
wires. Its Unreal-inspired visual language does not imply Unreal API or asset compatibility.
Lua is a separately reserved provider. The post-Blueprint VFX/sequencing editor
is tracked separately from scalar Blueprint timelines.
