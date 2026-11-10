# C++ gameplay and exports

Epok gameplay is organized around Actors and ActorComponents. A C++ class can
expose properties and functions to the editor and Blueprints through reflection.
Use the [Actors guide](/docs/actors/) for ownership, spatial roots and component
rules, and the [API reference](/docs/api/epok/) for exact declarations.

## Create and attach a class

Create a C++ Actor or ActorComponent from the Project browser, or create and
attach a compatible component from the Inspector. Choose a reflected parent and
the owning domain; abstract classes cannot be instantiated. The editor validates
the generated class against the project model. **Edit C++ Class** opens the
original source in the [integrated code editor](/docs/code-editor/).

The Sample template's `Spinner` is a small project-owned ActorComponent. Its
actual source uses `EPOK_CLASS` for reflection, an editable `speed` property,
and a `tick` override to rotate the owner's 3D root. See the [pinned template
source](../templates/Spinner.hpp)
for the complete implementation and required class identity code.

```cpp
// Excerpt from the Sample template, inside Spinner : epok::ActorComponent.
EPOK_PROPERTY(Editable) epok::Fixed speed = 45.0;
void tick(epok::Fixed dt) override;
```

This excerpt illustrates the reflected property and lifecycle signature; use
the template or the class creation workflow for a complete class.

## Reflection and values

The host reflection tool uses Clang and the configured MIPS toolchain to inspect
annotated C++ classes. The editor presents supported properties and callable
functions in the Inspector and Blueprint editor. Classes and reflected members
have identities; changing or removing them can require repairing saved overrides.
Property defaults must be inspectable, and unsupported C++ constructs are
reported as diagnostics. See [Blueprints](/docs/blueprints/) for inheritance,
callable pins and supported value types.

Object references, scene ownership and component lifetimes follow the runtime's
bounded contracts. Check failed lookups and handles, and do not assume that an
Actor or component is still alive after it has been destroyed or a scene changes.
PlayStation simulation uses fixed-point values and a fixed-step update; measure
the actual target workload rather than assuming desktop preview timing matches.

## Existing projects

The current Actor architecture rejects previous Entity/Behaviour maps, older
Blueprint formats and `.epokscript` sidecars. It does not silently convert them.
Keep the old project, create a current project and recreate its maps and gameplay
using supported classes; see [Recreating older projects](/docs/migration-actors/).

## Export a standalone project

The editor can export a standalone C++ project containing generated scene data,
scripts, runtime sources, build files and notices. Rebuild it with the pinned
Nugget SDK and a MIPS toolchain; the editor and reflection extractor are not
required for the standalone build. Some games also need the generated disc image
or external data files. See [Standalone runtime](/docs/runtime/) and [Play
targets](/docs/play/) for the exact data-source and build requirements.

User game code and assets keep their own licenses. The exported runtime and
third-party dependencies retain the notices supplied with the export.
