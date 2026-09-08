# UniQo website

Public website and documentation for [UniQo](https://github.com/franadoriv/UniQo), a desktop game engine for the original PlayStation.

Live site: **https://uniqoengine.github.io/**

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

The Markdown and screenshots in `content/` are a snapshot of published engine documentation. `content-manifest.json` records the exact commit. They do not include uncommitted editor or runtime changes.

After fetching the engine repository, sync from its published branch:

```sh
python tools/sync-content.py /path/to/UniQo origin/main
npm run build
npm run check
```

When adding a guide, register its navigation entry in `tools/build.mjs`. Keep the homepage feature descriptions and current-limits section consistent with the documented revision. Internal guide links become website links; references to engine source files point to the matching GitHub revision.

## Publish

Push to `main`. The GitHub Actions workflow builds, validates and publishes the static artifact to GitHub Pages. Repository Settings → Pages must use **GitHub Actions** as the source. Hosting uses the free GitHub Pages service for this public repository; no paid services or custom domain are required.

Search runs in the browser against a bundled index. No accounts, analytics, API keys or server are required. Typography uses Google Fonts with local sans-serif fallbacks.

## License and attribution

Website source is MIT licensed. Documentation, screenshots and the UQ mark come from the UniQo project; see [its license](content/LICENSE), [branding provenance](content/resources/branding/README.md), [third-party notices](content/THIRD_PARTY_NOTICES.md) and [runtime notices](content/runtime/THIRD_PARTY_NOTICES.md). The forest showcase contains AI-generated game artwork, as described in the engine README. UniQo is independent homebrew software and is not affiliated with Sony Interactive Entertainment.
