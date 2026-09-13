# Preview procedural UI without starting the console

Choose **UI** in the Scene window to see authored Canvas content. Epok can also compile a small desktop preview of portable native C++ controllers and run their `editor_preview` construction hook. Menus created in code can appear while you edit, without a MIPS build, emulator or connected PlayStation.

This is particularly useful for a title screen: you can see the finished layout immediately instead of waiting through its opening fade every time you move a label. Earlier technical notes call this “Scene > 2D”; **UI** is its location since the three-way mode split.

## Share construction, not gameplay side effects

Put layout creation in a helper used both by gameplay and the preview hook. In an existing Behaviour, the pattern is:

```cpp
// Members of your own Behaviour class:
void build_menu(epok::Transform& transform); // Implement your layout here.

void start(epok::Transform& transform) override {
    build_menu(transform);
    // Start your runtime intro here, if needed.
}

#ifdef EPOK_EDITOR_PREVIEW
void editor_preview(epok::Transform& transform) {
    build_menu(transform);
    // Show the editable final layout; do not start the intro.
}
#endif
```

`build_menu` is project code, not a built-in function. The public `editor_preview(Transform&)` hook is detected by C++20 dispatch; it does not add a console vtable entry. In normal edit preview, Epok binds properties and invokes this hook, **not** `start`, `update`, `frame_update` or gameplay lifecycle notifications.

A class with no hook still shows serialized Canvas content; its gameplay does not run just to fill the preview. Procedurally created nodes are derived output. Edit their construction code rather than expecting them to be saved back as authored entities.

## Automatic refresh

The first preview needs a native C++20 compiler; on Windows, use Visual Studio C++ Build Tools. Changed source, imported resources and scene properties rebuild the isolated child process after a brief debounce. Unchanged inputs reuse compiled output under `.epok/native-preview/`.

Compilation is asynchronous/cancellable. Errors are shown in the view, without an endless retry loop. A stalled or invalid child is terminated rather than executing scripts inside the editor process.

This automatic *desktop UI preview* is separate from manual *PSX game compilation*. Seeing a refreshed menu does not mean a new disc or console executable was built.

## Test interactions when you need them

Choose **Interact**, then click the preview to give it input:

| Key | Action |
| --- | --- |
| Arrows | Navigate |
| K | Confirm |
| L | Back |
| Enter | Start |

Pause, Resume, Step and Restart control the session. Step advances one 60 Hz frame. Restart recompiles changed inputs and resets the child process, including script globals. **Back to editing** restores automatic construction-only preview.

Interactive mode runs supported native lifecycle/update callbacks. Edits made during simulation change the authored document; Restart applies them to a fresh simulation. Generated nodes remain temporary.

## What matches the target, and what does not?

The desktop and PSX paths share `hud_core.hpp`: Q12 layout, pixel rounding, traversal, clipping, atlas bounds, nine-slice subdivision, text placement and budgets. This makes it useful for catching layout mistakes early.

It is not cycle-accurate emulation or a guarantee of identical GPU-edge pixels. The desktop compositor uses nearest sampling and does not measure real console performance. Audio state is silent, Memory Cards are temporary process-local storage, and a scene transition stops at the destination boundary instead of loading the next map.

Blueprint logic and full 3D simulation are not part of this preview. A Blueprint-driven scene is refused explicitly; use Play for it. Timeline and Particle Effect assets retain their own previews. Unsupported hardware services produce compiler/linker diagnostics, not fake success.

## A useful iteration loop

Adjust a menu → inspect the automatic UI preview → optionally test navigation → build and Play the target. The [HUD guide](/docs/hud/) explains widgets and anchors; [Build, measure and iterate](/docs/iteration/) explains which reports measure the actual PSX build. Fast previews are great. Accidentally debugging a desktop simulation as though it were a console is less great.
