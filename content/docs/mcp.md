# AI assistants / MCP

Epok exposes the open game project through the Model Context Protocol. An MCP client can inspect and edit scenes, components, assets and C++ scripts, control the editor and emulator, and receive PNG screenshots from the actual renderer.

`editor_control` also accepts `serial_connection` to open adapter setup and
`serial_prepare` to install or repair Epok's managed serial components. Neither
uploads a program. `editor_state.serial` reports the setup window, component
directory, adapter and setup result; `play` uses the project's saved destination.

The server is **off by default**. No AI account or provider SDK is needed.

## Connect

1. Open a game project.
2. Open **Edit > Editor Preferences > AI / MCP**.
3. Check **Enable MCP Server**, then **Apply**. Status should show `Listening`.
4. Copy either client configuration and add it to your AI application's MCP settings.



**HTTP:** the default endpoint is `http://127.0.0.1:8765/mcp`, with a bearer access key. **Copy HTTP Client Config** produces this shape with your actual key:

```json
{
  "mcpServers": {
    "epok": {
      "url": "http://127.0.0.1:8765/mcp",
      "headers": { "Authorization": "Bearer YOUR_ACCESS_KEY" }
    }
  }
}
```

**Stdio:** **Copy Stdio Client Config** uses the current editor executable as a lightweight bridge to the running server. It does not open another editor or enable MCP automatically. The bridge reads the same user's saved preferences, so no key is embedded in this configuration:

```json
{
  "mcpServers": {
    "epok": {
      "command": "D:/Applications/Epok/epok-editor.exe",
      "args": ["--mcp-stdio"]
    }
  }
}
```

Replace the example executable path with your installation, or use the copy button. Client configuration syntax can differ between applications; use their Streamable HTTP or stdio connection form as appropriate. Image-capable MCP clients can inspect the screenshot results directly.

Keep the editor open with the intended project selected. Closing that project stops its server; opening another project starts a server for the new project if the preference remains enabled. Clients should read `editor_state` after reconnecting. Only one editor can use a given port at a time; a conflict is shown in Status. Choose another port, or disable and re-enable after freeing it.

## Tools

Tools publish their argument schemas and descriptions through `tools/list`.

| Tools | What an assistant can do |
| --- | --- |
| `editor_state`, `logs_read` | Inspect project identity, current scene revision, selection, job status, import errors, camera, emulator frame metadata and recent logs. |
| `scene_read`, `scene_schema` | Read the whole scene and component examples. |
| `scene_apply` | Atomically create, update, duplicate, delete, reparent or replace entities; edit transforms, scripts, HUD, audio, lighting, mesh and skeletal components; change the environment. |
| `scene_history` | Undo/redo up to 32 MCP scene batches. |
| `scene_save`, `scene_open` | Save or switch scenes. New scenes can be written under `assets/` before opening them. |
| `entity_select`, `editor_view` | Change selection, frame an entity, orbit or reposition the Scene camera, toggle grid/wireframe or switch 2D/3D. |
| `viewer_screenshot` | Return PNG image content for `scene`, `hud`, `game` or the entire `editor`. |
| `editor_control` | Build, Play, Stop, Pause, Resume, Step, bake lighting, export a standalone project, reset layout or open settings/imports. |
| `game_input` | Send a PSX controller bitmask for a bounded duration, with automatic release. |
| `project_settings` | Read or edit project name, startup scene, output resolution and build preferences. |
| `project_files` | List directories and read/write text or base64 files under `assets/`, including gameplay scripts and source media. Delete individual source files. |
| `asset_list`, `asset_import` | Inspect asset UUIDs, metadata and pending imports; import/reimport FBX or audio sources through the normal pipeline. |
| `mesh_create`, `asset_document` | Create Blockout primitives or custom geometry; read/edit mesh, skeleton, animation and material documents while preserving asset UUIDs. |
| `asset_manage` | Move, duplicate or move imported assets to the existing recoverable trash. Referenced assets cannot be trashed. |

Read-only resources are also available at `epok://guide`, `epok://editor/state`, `epok://scene/current`, `epok://scene/schema` and `epok://project/settings`.

## Editing workflow

Ask an assistant to inspect the project, create a blue cube next to the player, frame it, and show a Scene screenshot. A typical tool sequence is:

1. `editor_state` and `scene_read` establish the project and current revision.
2. `scene_apply` receives that revision and an operation such as:

   ```json
   {
     "op": "create",
     "entity": {
       "name": "Blue Cube",
       "kind": "Mesh",
       "position": [0, 0.5, 0],
       "material": { "color": [0.2, 0.6, 1.0] }
     }
   }
   ```

3. `entity_select` uses the returned index and revision, with `frame: true`.
4. `viewer_screenshot` with `target: "scene"` returns the rendered image.
5. `scene_save` saves the accepted scene, or `scene_history` with `action: "undo"` restores the previous scene.

Entity indices refer to the scene array, not permanent IDs. Deleting a branch changes subsequent indices. Within a batch, each operation sees the result of the previous one. Patches merge objects recursively, replace arrays and use `null` to remove optional components. Invalid batches leave the scene untouched. Unknown component fields are rejected instead of silently ignored.

Scene changes remain unsaved until `scene_save`. Revisions prevent stale edits; Undo/Redo also rejects intervening changes from the user. MCP history covers scene batches only, not file changes, asset documents, lighting bakes or arbitrary GUI actions.

For source files, `project_files` returns a SHA256 revision. Supply it for replacement/deletion, or `"absent"` to create a new file. Prior contents are retained under `.epok/mcp-backups/`; the response identifies the backup path for manual recovery. Imported asset trash lives in `UserSettings/AssetTrash/`. The active scene and `.epokasset` packages use their dedicated tools.

Build, Play, import and lighting bake run asynchronously. Poll `editor_state` and read `logs_read` to distinguish completion from failure. Stop Play before authoring changes. The same scene, geometry and PSX budget validators used by the editor apply to MCP edits.

## Scope and limits

- The HTTP server binds only to IPv4 loopback and checks the bearer key, Host and browser Origin. There is no LAN listener, shell execution or arbitrary computer filesystem access. Script edits can affect what runs during a game build; connect trusted clients.
- Preferences and the key are local to the OS user. They are not included in game exports. **Regenerate > Apply** rotates the key and restarts connections. **Uncheck Enable MCP Server > Apply** stops the listener, including while Play is running. A restart does not undo edits already applied.
- `scene` captures the full 960 x 600 render texture in 3D mode and the native HUD in 2D mode. The visible dock can crop this texture. `hud` always captures the native HUD; `game` requires a frame received from the emulator and returns its actual output resolution. `editor` captures the application surface, including open dialogs.
- File read/write payloads are limited to 2 MiB. Directory listing returns one level, up to 1,000 entries. Larger source files can be copied into the project normally and then imported by MCP.
- Requests use a bounded queue, with at most eight serviced per editor frame and a 20-second queue/response deadline. Cancelled or expired requests still waiting in the queue never edit the scene. If a client disconnects during an operation already underway, read the current state before retrying.
- This exposes current engine features; it does not add collision physics, texture import, animation blending or other unsupported runtime systems. MCP clients and transports are portable; the editor and emulator workflow are verified on Windows x64 and macOS Apple Silicon.

The transport uses the [official Rust MCP SDK](https://github.com/modelcontextprotocol/rust-sdk). Local tests cover protocol negotiation, resources, real HTTP and stdio clients, revisions, atomic scene edits, file conflicts, authentication and listener lifecycle. See [Testing](../knowledge/maintainers/testing.md) for the desktop/emulator integration command.
