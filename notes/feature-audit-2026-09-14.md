# September 2026 website feature audit

## Source boundary

- Website baseline: `67eedbc` (Memory Analyzer showcase).
- Prior engine documentation baseline: `dc1729b`.
- Reviewed engine source: `2b75fb3aeb56694605a37c4fa4f5a943cc6ea56b` on develop. This merge has the same source tree as its `32087ed` predecessor, inspected in an isolated detached worktree.
- Review covered the 32 non-merge commits since the former snapshot, plus the merge record. The user's active engine checkout contained unrelated/uncommitted work and was not edited.
- `content/` is synced from committed Git content. Web articles, beginner notes and evidence-backed corrections are separate, so another sync cannot silently erase them.

## Evidence and article routing

| Capability | Implementation / evidence | Web explanation |
| --- | --- | --- |
| Reflected Actor families, roots and lifetime | `runtime/object_model.hpp`, `runtime/actor_tables.hpp`, `src/actor_document.rs` | `articles/actors.md` |
| Actor/component editing | `src/gui.rs` Actor menus, hierarchy commands, Inspector; `src/editor.rs` mutations | Actors guide and editor corrections |
| Actor/Component Blueprint events and typed references | `runtime/actor_blueprint.hpp`, compiler/reflection changes | Actors and Scene Blueprints guides |
| Map-owned Scene Blueprint | `src/editor.rs`, `src/gui.rs` Map Settings, `src/blueprint_refs.rs` | `articles/scene-blueprints.md` |
| World2D placement and native helpers | `src/gui.rs::world2d_view`, `src/scene_view_mode.rs`, `runtime/world2d.hpp` | `articles/worlds-2d.md` |
| Playable arena and camera | `src/third_person.rs`, `templates/ThirdPersonController.{hpp,cpp}` | `articles/third-person.md` |
| Walkable ramp height surfaces | `runtime/collision.hpp`, corresponding source/collider/template changes | Third Person and input/collision supplement |
| Native construction-only and interactive HUD preview | `native/hud_preview.cpp`, `runtime/hud_core.hpp`, `docs/native-hud-preview.md` | `articles/native-hud-preview.md` |
| MIDI, SoundFont, quality recipes, optimizer | `src/midi*`, `src/sf2.rs`, `src/music_conversion_ui.rs`, `src/psx_music*`, `runtime/sequence_instrument_service.hpp` | `articles/music-sequences.md` |
| Audio hardware fixes and measured acceptance | `docs/architecture/psx-midi-delivery.md`, `f3a5745`, `372166b` | Scoped hardware section in music guide |
| Manual builds, receipts, selected scenes, serial control | `src/play*`, `src/editor.rs`, `src/serial*`, `docs/play.md` | `articles/iteration.md` |
| Debug HUD and projected scratchpad work | `runtime/debug_hud.hpp`, `runtime/main.cpp`, `docs/performance.md` | Iteration and Third Person guides |
| Tool repair/macOS helpers | `src/dependencies.rs`, `tools/desktop-shortcuts-macos.sh`, setup/profile fixes | Getting started and iteration |
| MCP/CLI additions | `src/mcp_tools.rs`, `src/main.rs`, `docs/mcp.md` | Synced MCP guide and feature inventory |

All newly curated feature entries also carry a repository-relative implementation path in `feature-updates.json`. The build turns these into immutable source links at the manifest revision.

## Corrections to stale prose

The committed source includes older statements next to newer implementation. Web overlays in `tools/feature-explorer.mjs` correct manual compilation, Actor/component Inspector editing, opening map graphs, input API availability, UI mode naming, ramp collision and the scope of hardware music measurements. The old Third Person guide describes a static template even though the controller is now generated and bound; the web guide is rewritten from code.

Important limits retained:

- World2D's editor displays labeled placement footprints, not a textured sprite compositor/tilemap editor. Native helper availability is not a blanket editor-to-console feature guarantee.
- Root/inherited components are protected. There is no automatic Actor domain conversion or legacy scene rewrite.
- Actor-specific console acceptance remains incomplete in its committed evidence. General emulator support does not complete that acceptance.
- SoundFont Target Preview is not cycle-accurate SPU emulation. VAB source recognition is not instrument playback.
- The short optimized music hardware run is not a full-song/full-game performance guarantee. RAM integration, independent drift and worst-case latency remain open.
- Memory Analyzer measures static build-time allocations, not dynamic heap/stack or transition peaks.
- Position interpolation is not an FPS improvement. Debug HUD GTE/GPU/SPU labels are not hardware utilization claims.

## Catalog coverage

The homepage combines all 121 bold capability bullets in the committed inventory, seven CLI families, five validation/tooling entries, two host/license entries and 53 reviewed additions: **188 entries in 12 categories**. These are discoverable capability groups, not a count of individual functions or promises of production readiness. Some overview entries summarize a subsystem whose new details also have dedicated entries.

The same additions are inserted into the full feature article from one data file. The count is computed, not maintained as a separate marketing number. A build check detects dropped source bullets, missing updates and duplicate IDs. Entries are rendered in static HTML; JavaScript enhances filtering only. Results and category lists have bounded scrolling; mobile categories become horizontal filters. The larger full-text article remains available outside the widget.

## API refresh

The published API was regenerated against the reviewed runtime source and pinned Nugget `6186b131aacc5853a9161fb076ed34ffe504552d` using the engine's existing libclang generator. It now covers 73 Epok headers and 53 PsyQo headers: 442 extracted types, 1,883 callable declarations and 2,065 property declarations. Grouped overload/member routes produce 4,291 API pages.

The extraction fixture `tools/api-fixtures/debug-hud.hh` enables every Debug HUD conditional declaration and provides Clang's constant-expression `offsetof` spelling on Windows. It is only copied into the isolated documentation worktree, never the active engine or a game build. Without this fixture, the generated project header is missing and the module is incomplete. The final extraction reports no diagnostics. `tools/refresh-api.mjs` validates source-tree equality and rejects diagnostics before importing generated docs; the manifest records generator/fixture hashes.

To repeat after syncing a newer committed revision:

1. Create an isolated engine worktree at the manifest commit, with access to the pinned PsyQo checkout and host libclang Python bindings.
2. Copy the documentation-only `debug-hud.hh` fixture into that worktree's `runtime/` directory.
3. Run that worktree's `tools/generate-api-reference.py --psyqo-root <pinned-psyqo> --clang-python <clang-bindings>`.
4. Run `node tools/refresh-api.mjs <isolated-engine-worktree>` from the website.
5. Build and check the website. Do not claim generated snippets are complete game programs or hardware tests.

## Design research and architecture

Primary references inspected in text and browser:

- [Godot features](https://godotengine.org/features/): themed groups, explanatory feature cards and a separate complete inventory.

Applied to Epok: compact overview/detail hierarchy; persistent search/filter context; source and guide links; restrained dark panels; actual Epok screenshots. No competitor assets or copy were reused.

The architecture diagram uses native semantic HTML and lightweight SVG connectors, not a screenshot of text or an external FigJam embed. Labels come from the source ownership/build boundaries: Rust editor → host reflection/cook/build → native C++/PsyQo PSX runtime. Following the diagram guidance, solid and dashed connections separate current flow from the user-requested future-retro-console hint. The teaser names no other console, date, implemented backend or available export option. This is an editorial hint, not a new entry in the implemented feature count.

## Media and community

- User-supplied Third Person capture, 1452 × 1068, is gallery slide three. The previous two slides and all separate showcases remain.
- Byte-identical SHA-256: `2cf1efe24a05448d4979f0aa8e0d49d15cf2e9305b3a8f257da6d45a8e3e4377`.
- Discord icon/link added to shared header and footer: `https://discord.gg/2wEGxsVhKT`. No invitation acceptance, account login or membership action is performed.

## Verification

- Static build and checks cover every local link/anchor/asset, all guide primers/search entries, complete generated API navigation and per-symbol examples/warnings, feature inventory coverage, gallery retention, Discord presence and architecture current/future labeling.
- Browser checks cover category/query/new combinations, empty results, reset, expanded details, independent scrolling, the new full-resolution gallery slide and mobile layout without document-level horizontal overflow.
- Architecture was visually checked in desktop and 390-pixel mobile viewports: horizontal stages become a vertical flow, with the future signal separate from the current target. The Actors article also fits the mobile viewport. API search finds Actor2D and its four indexed members; a method page exposes its declaration, example, warnings and source link. No browser warning/error was recorded during these checks.
- Production deployment must be checked after the main-branch push; local success alone is not a published update.
