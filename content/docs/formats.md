# Epok document formats

Epok uses type-specific extensions and YAML for editor-owned text documents.
The PSX runtime consumes generated C++ and binary data; it does not parse YAML.

| Document | Extension / location |
| --- | --- |
| Project identity and settings | `Game.epokproject` at the project root |
| Scene / map | `assets/scenes/Main.epokmap` |
| Visual Blueprint | `assets/scripts/Enemy.epokbp` |
| Legacy C++ property metadata | `assets/scripts/Spinner.epokscript` |
| Resource package | `Stone.epokasset` (binary) |
| Additional map registry | `ProjectSettings/Maps.epoksettings` |
| Editor tool configuration | `Editor.epokconfig` |
| Machine/project tool override | `Local.epokconfig` |
| User preferences | `Editor.epokprefs`, `RecentProjects.epokprefs` |
| Local project state | `UserSettings/SceneView.epokprefs`, `ImportState.epokprefs`, `Breakpoints.epokprefs` |
| Reflection/import caches | `.epok/reflection/Reflection.epokcache`, `.epok/imported/<hash>/Import.epokcache` |
| Extractor request | `.epok/reflection/Reflection.epokrequest` |
| Exported script manifest | `Scripts.epokmanifest` |
| Generated Blueprint debug map | `blueprints/<id>.epokdebug` |

For example:

```yaml
format_version: 1
editor_version: 0.1.0
name: My Game
startup_scene: assets/scenes/Main.epokmap
auto_build: true
```

The document layer retains the existing versioned data schemas, UUIDs, numeric
types, validation, and plain mappings/sequences. Writers produce deterministic
YAML with stable field ordering and no language-specific enum tags. Unknown
Blueprint fields are retained. Comments and hand-chosen formatting are not
preserved when the editor saves a document. Duplicate keys and multiple YAML
documents in one file are rejected. JSON syntax remains accepted as a subset for
legacy fixtures, but ordinary Epok saves write YAML.

`.epokasset` packages use the eight-byte `EPOKAS01` signature, followed by the
existing metadata/source lengths and binary payload. Their embedded metadata
remains JSON; the package is not a text document.

JSON remains intentional for MCP and extractor stdout, VS Code configuration,
Clang's `compile_commands.json`, PCSX-Redux configuration, the dependency bootstrap
manifest `tools/dependencies.json`, and explicitly JSON diagnostic reports.
These do not acquire Epok extensions merely because they are in this checkout.

## Migrating a UniQo game

The original engine checkout and existing games are not automatically modified.
Copy a game to a new destination using the migration tool:

```sh
python -m pip install -r tools/requirements.txt
python tools/migrate_project.py path/to/old-game path/to/new-epok-game
```

The tool validates the source, copies authoring files, converts JSON documents to
YAML, moves the project descriptor to the root, updates references and C++ API
names (`epok::`, `epok.hpp`, `EPOK_CLASS`, `EPOK_PROPERTY`, `EPOK_FUNCTION`), and
changes resource package signatures without changing asset UUIDs or payloads.
It refuses occupied destinations and never writes into the original game.
It omits build caches, exports, Git metadata, and machine-specific tool overrides.
Macro calls produced by custom code generators must also use the new API names.

For native reflected C++ members, Clang identities include namespaces. The tool
updates serialized qualified names; compile the copied project to diagnose any
custom identities or external provider references needing manual adjustment.

The editor's `--migrate-project` command only relocates an already compatible
legacy `ProjectSettings/project.json` manifest; it is not a substitute for the
full cross-engine migration tool above.

## Working copy

This refactor started from upstream `main` commit
`811fcb4` (Replace Blueprint promo screenshot with cursor-free native capture).
Epok is presented as an engine for the original PlayStation. The source repository
is https://github.com/franadoriv/epok-engine. The website will be linked when published.
