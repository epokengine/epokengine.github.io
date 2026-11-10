# Epok website

Public website and documentation for [Epok](https://github.com/epokengine/epok-engine), a desktop game engine for the original PlayStation.

Live site: **https://epokengine.github.io/**

## Develop

Requires Node.js 22 and Python 3.10 or newer for the optional local preview and content sync.

```sh
npm ci
npm run build
npm run check
npm run preview
```

Open http://127.0.0.1:4173. The generated static site lives in `dist/`.

The homepage demo is at http://127.0.0.1:4173/#playable-preview. It uses the
packaged PSX disc in `play/reactor-station.zip` and downloads EmulatorJS 4.2.3
when the visitor starts the game. See [play/README.md](play/README.md) for the
disc's provenance and update steps.

The gallery is at http://127.0.0.1:4173/gallery/, linked from the shared navigation
and homepage. Edit `gallery-content.json` to add screenshots or MP4/WebM videos;
`tools/media-gallery.mjs` generates the static cards and
`assets/media-gallery.js` adds media tabs, topic/search filters and a keyboard
accessible viewer. Without JavaScript, the cards link to their original files.
The three bundled videos are explicitly labeled silent demo montages of existing
captures. See `assets/reels/README.md` for provenance and regeneration. Replace
them with actual recordings when available. No external video service is needed.

## Update the engine guides

The Markdown and screenshots in `content/` come from committed engine
documentation. The sync step adapts historical branding and excludes old
editor captures. `content-manifest.json` records the exact engine commit and
SDK revision. The generated API can also be imported from a detached worktree.

After fetching the engine release tag, sync from that tag:

```sh
python tools/sync-content.py /path/to/Epok v0.10.0 /path/to/Epok-v0.10.0-api
npm run build
npm run check
```

When adding a guide, register its navigation entry in `tools/build.mjs`. Keep the homepage feature descriptions and current-limits section consistent with the documented revision. Internal guide links become website links; references to engine source files point to the matching GitHub revision. The complete feature catalog is the source-mapped inventory; keep its source coverage tables current when production modules or runtime headers are added.

Web-specific long-form guides live in `articles/`; their introductory notes are in
`articles/guide-notes.json`. Register their source attribution in `webArticles` in
the build tool. Evidence-backed corrections to older synced prose live in
`correctWebMarkdown`, never as unrecorded changes to the active engine checkout.

The landing Feature Explorer combines the committed feature catalog with
`latest-feature-highlights.json`. Refresh the highlights against a committed
engine release; verify each description and source path. Counts and static
rows are derived from the data. The widget supports category/search/latest
filters and a JavaScript-free disclosure view.

The architecture graphic is semantic HTML in `tools/architecture-section.mjs`
with responsive styling in `assets/architecture.css`. Solid connectors describe
the current build path; the dashed undisclosed-target teaser is editorial, not
an implemented backend. Discord navigation is shared across every generated page.

The v0.10.0 tag carries an older generated API catalog. In a detached worktree
at v0.10.0, run the engine's `tools/generate-api-reference.py` with the pinned
Nugget checkout, Clang bindings and MIPS compiler. Pass that worktree as the
third argument above to import its regenerated API while syncing the guides
from the tag. Omit the worktree argument for a release with a current catalog.
After syncing, run
`node tools/verify-api-sources.mjs /path/to/Epok` to compare every recorded
header hash against the committed engine and pinned Nugget blobs and reject
extraction diagnostics. The pinned Nugget commit must exist in the checkout's
submodule Git repository. If the committed generated reference is stale or has
diagnostics, regenerate it in an isolated worktree before importing; never use
uncommitted engine changes as a published snapshot. The [API audit](notes/documentation-api-audit-2026-11-06.md) records the current review and its limits.

The documentation index offers learning paths for Blueprints, Lua, VFX,
terrain and navigation, dungeon generation, and 2D platforming. Keep tutorials
separate from the full references. Run `npm run check` to verify search,
navigation, anchors and editor captures.

## Publish

Push to `main`. The GitHub Actions workflow builds, validates and publishes the static artifact to GitHub Pages. Repository Settings → Pages must use **GitHub Actions** as the source. Hosting uses the free GitHub Pages service for this public repository; no paid services or custom domain are required.

Search runs in the browser against a bundled index. No accounts, analytics, API keys or server are required. Typography uses Google Fonts with local sans-serif fallbacks.

## License and attribution

Website source is MIT licensed. Documentation, screenshots and the Epok mark come from the Epok project; see [its license](content/LICENSE), [branding provenance](content/resources/branding/README.md), [third-party notices](content/THIRD_PARTY_NOTICES.md) and [runtime notices](content/runtime/THIRD_PARTY_NOTICES.md). The forest showcase contains AI-generated game artwork, as described in the engine README. Epok is independent homebrew software and is not affiliated with Sony Interactive Entertainment.
