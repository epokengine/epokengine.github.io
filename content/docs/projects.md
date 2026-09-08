# Independent game projects

UniQo starts in **Projects**. Create a project with a name, parent folder and template, or open an existing project folder. Recent projects are shortcuts to their folders; **Remove from list** forgets a shortcut without deleting the game. **Basic PSX** contains a camera and an empty scene; **Sample game** copies the bundled demo and native behaviours. The default location is `Documents/UniQo Projects`, outside the editor installation.

Use **File > Projects... (New / Open / Close)** to return to the selector. Unsaved scenes offer Save and close, Discard changes and Cancel. Closing a project stops its owned build/emulator before releasing its lock. A failed open stays in the selector and displays the error; it never substitutes a sample scene or overwrites a damaged project.

The dark Hub opens on a searchable project list. Search matches names and paths; the sort button switches between recently opened and alphabetical order. Each row shows its folder, PlayStation target and compatible editor version. Click a row to open it, or use its **...** menu to open or remove the shortcut. Unavailable projects remain visible so their errors can be inspected. **New project** opens the template and project details view; **Open project** accepts a folder path or the native folder browser. The Hub has its own typography and palette, preserved when returning from the editor.

## Ownership and format

**Third Person** adds an editable arena with grey platforms, ramps, blue cubes and a static mannequin. It is currently a level placeholder; movement and collisions are not included. See [Third Person arena](third-person.md) for its layout and PSX rendering details. The command-line template name is `third-person`.

```text
My Game/
  ProjectSettings/project.json      # Versioned project identity and settings
  assets/scenes/Main.uniqo.json      # Original scenes
  assets/scripts/                   # Original C++ and .script.json metadata
  assets/Audio/*.uniqoasset          # Imported assets with UUIDs and source snapshots
  .gitignore
  .uniqo/                           # Regenerable build/emulator data; ignored
  UserSettings/                     # Local editor layout; ignored
  exports/                          # Standalone C++ exports; ignored
```

`project.json` contains `format_version`, `editor_version`, `name`, `startup_scene`, `auto_build` and `rendering`. Open **Edit > Project Settings** to edit them through the settings window. Rendering defaults to 640 x 480 interlaced NTSC when omitted. The startup scene is a relative path within `assets/scenes`; there is no fixed SampleScene path. Change it in Project Settings and reopen the project. Format/version mismatches are rejected. See [Settings](settings.md) for video modes and local Editor Preferences.

Track `assets/`, `ProjectSettings/` and `.gitignore` in the game's own repository. Moving or copying this content preserves the game; `.uniqo/` can be removed while the project is closed and regenerated on the next build. Creation requires a new destination directory and never merges with an existing folder. If disk creation fails partway through, the partial directory is retained for inspection and the error is shown; choose a fresh destination after correcting the cause.

The editor executable embeds its runtime source snapshot, templates, fonts and emulator adapter. Only generated C++ builds and exports receive runtime copies. Projects do not need editor Rust sources, `runtime/`, `resources/`, `third_party/` or `.tools/`.

Tool configuration belongs to the editor installation: `uniqo.config.json`, optionally replaced by `uniqo.local.json`. Installation discovery uses `UNIQO_EDITOR_HOME`, then executable ancestors with `uniqo.config.json`, then the development checkout recorded at compilation. It does not use the working directory. Relative tool paths resolve against that installation. An optional, untracked project `uniqo.local.json` replaces the machine configuration and resolves its paths against the project. The manifest owns the initial Auto compile setting.

The Hub stores recent folders in `%LOCALAPPDATA%/UniQo/projects.json`, separate from both the editor repository and shared game files. Layout belongs to `UserSettings/editor-layout-v2.ini`. An OS-backed `.uniqo/project.lock` prevents simultaneous editing/building through UniQo; a crash releases the lock automatically, so a leftover file is harmless.

## Command line

```powershell
cargo run --locked
cargo run --locked -- --create-project "D:/Games/My Game" --template basic
cargo run --locked -- --create-project "D:/Games/My Demo" --template sample --name "My Demo"
cargo run --locked -- --project "D:/Games/My Game"
cargo run --locked -- --project "D:/Games/My Game" --build-psx
cargo run --locked -- --project examples/sample-game --play-psx --stop-after 10
```

Creation is a headless operation; open the resulting folder to edit. Build, Play, lighting bake and profiling require `--project`. Running from an arbitrary working directory works with the executable's absolute path. Game paths with spaces are tested; the upstream SDK/tool installation still needs a path without spaces.

The old repository-root sample lives in `examples/sample-game/`. It is an ordinary project and also supplies the embedded Sample game template. Rebuild the editor after changing embedded runtime/template sources.

## Runtime and asset contract

UniQo ships one matched PsyQo runtime; `editor_version` pins that contract. Dependency resolution, package installation and multi-editor upgrades remain future work.

Imported AudioClips use UUID references and portable `.uniqoasset` packages with embedded source snapshots. Their index and conversions are disposable; moves are reconciled when the project opens and while it is running. See [Assets and audio](assets.md). Script metadata remains explicit and script bindings remain name-based.
