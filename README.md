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

## Update the engine guides

The Markdown and screenshots in `content/` come from published engine documentation. The sync step adapts migration wording to the current public identity and excludes historical editor captures with obsolete branding. `content-manifest.json` records the exact commit. They do not include uncommitted editor or runtime changes.

After fetching the engine repository, sync from its published branch:

```sh
python tools/sync-content.py /path/to/Epok origin/develop
npm run build
npm run check
```

When adding a guide, register its navigation entry in `tools/build.mjs`. Keep the homepage feature descriptions and current-limits section consistent with the documented revision. Internal guide links become website links; references to engine source files point to the matching GitHub revision. The complete feature catalog is the source-mapped inventory; keep its source coverage tables current when production modules or runtime headers are added.

Web-specific long-form guides live in `articles/`; their introductory notes are in
`articles/guide-notes.json`. Register their source attribution in `webArticles` in
the build tool. Evidence-backed corrections to older synced prose live in
`correctWebMarkdown`, never as unrecorded changes to the active engine checkout.

The landing Feature Explorer is generated from the full committed feature catalog
plus `feature-updates.json`. Add source paths, useful descriptions and guide links
there; counts, static rows and the new-features article section are derived from
the same data. Keep future ideas out of implemented-feature counts. The bounded
widget supports category/search/new filters and a JavaScript-free disclosure view.

The architecture graphic is semantic HTML in `tools/architecture-section.mjs`
with responsive styling in `assets/architecture.css`. Solid connectors describe
the current build path; the dashed undisclosed-target teaser is editorial, not
an implemented backend. Discord navigation is shared across every generated page.

If new runtime headers or declarations land, regenerate the API in an isolated
engine worktree and import it with `node tools/refresh-api.mjs <worktree>` after
syncing. The checked procedure, extraction fixture, source audit and design
references are in [the September audit](notes/feature-audit-2026-09-14.md).

The documentation index offers four learning paths: a first Blueprint, a first
Lua Actor class, VFX authoring, and a marker-driven spell. Keep introductory
tutorials separate from their complete references. The Lua tutorial should stay
small enough to follow end-to-end while linking to the full language/runtime
contracts for exact types, modes and target limits. The Timelines & VFX group
also includes the playable example and a shared troubleshooting guide. Search,
navigation, table-of-contents anchors and the editor captures are checked by
`npm run check`.

## Publish

Push to `main`. The GitHub Actions workflow builds, validates and publishes the static artifact to GitHub Pages. Repository Settings → Pages must use **GitHub Actions** as the source. Hosting uses the free GitHub Pages service for this public repository; no paid services or custom domain are required.

Search runs in the browser against a bundled index. No accounts, analytics, API keys or server are required. Typography uses Google Fonts with local sans-serif fallbacks.

## License and attribution

Website source is MIT licensed. Documentation, screenshots and the Epok mark come from the Epok project; see [its license](content/LICENSE), [branding provenance](content/resources/branding/README.md), [third-party notices](content/THIRD_PARTY_NOTICES.md) and [runtime notices](content/runtime/THIRD_PARTY_NOTICES.md). The forest showcase contains AI-generated game artwork, as described in the engine README. Epok is independent homebrew software and is not affiliated with Sony Interactive Entertainment.
