# Demo Site Design

**Date:** 2026-06-10  
**Status:** Approved  
**Scope:** Phase 1 — demo site + workflow improvements (embed dashboard feature is a separate follow-up)

---

## Overview

Add a `demo/` Docusaurus site workspace to the `docusaurus-plugin-plausible` repo, following the same pattern as `docusaurus-plugin-showcase`. The demo site serves as the canonical documentation home for the plugin and demonstrates its capabilities live. The existing README is simplified to a pointer toward the demo site.

---

## Repo & Workspace Structure

### Changes to root `package.json`

- Add `"workspaces": ["demo"]`

### New `demo/` workspace

```text
demo/
├── package.json           (name: docusaurus-plugin-plausible-demo, private: true)
├── docusaurus.config.ts
├── sidebars.ts
├── tsconfig.json
├── docs/
│   ├── intro.md
│   ├── configuration.md
│   ├── extensions.md
│   ├── path-exclusions.md
│   └── self-hosted.md
├── src/
│   ├── css/
│   │   └── custom.css
│   └── pages/
│       ├── index.tsx      (landing page)
│       ├── demo.tsx       (live demo page)
│       └── playground.tsx (config playground)
└── static/
    └── img/
        └── favicon.ico
```

`demo/package.json` dependencies:

```json
{
  "name": "docusaurus-plugin-plausible-demo",
  "version": "0.0.0",
  "private": true,
  "dependencies": {
    "@docusaurus/core": "^3.10.1",
    "@docusaurus/preset-classic": "^3.10.1",
    "@homotechsual/docusaurus-plugin-plausible": "workspace:*",
    "react": "^19.2.7",
    "react-dom": "^19.2.7"
  },
  "devDependencies": {
    "@docusaurus/module-type-aliases": "^3.10.1",
    "@docusaurus/tsconfig": "^3.10.1",
    "@docusaurus/types": "^3.10.1",
    "typescript": "^6.0.3"
  }
}
```

The demo site uses the plugin itself (`workspace:*`) with `domain: 'plausible.docusaurus.homotechsual.dev'`, so the site is genuinely tracked and the live demo page reflects real behaviour.

---

## Demo Site Content

### Landing page (`/`)

Hero section with plugin name, one-line description, and CTA buttons to Docs and Playground. Brief feature grid below (script extensions, path exclusions, self-hosted support, TypeScript-first).

### Documentation (`/docs`)

Content migrated and expanded from the current README:

| File | Content |
| ---- | ------- |
| `intro.md` | What the plugin does, install command, minimal quick-start config |
| `configuration.md` | Full options reference table (all 13 options with types, defaults, descriptions) |
| `extensions.md` | Each Plausible extension explained with the config flag and resulting script name |
| `path-exclusions.md` | Regex exclusion patterns — syntax, examples, gotchas |
| `self-hosted.md` | `customDomain` and `proxyApiEndpoint` for self-hosted Plausible instances |

### Live Demo (`/demo`)

A custom React page that:

- Checks `window.plausible` at mount and displays whether the tracking script is loaded
- Reads the injected `<script>` tag from the DOM via `document.querySelector('script[data-domain]')` and displays its `src`
- Provides a "Fire pageview" button that calls `window.plausible('pageview')` and shows confirmation
- Notes that the demo site itself is live-tracked — visitors are real data points

This page only works in production (the plugin does not inject the script in dev mode); in dev it shows a clear "Script not loaded in development" notice rather than a broken state.

### Config Playground (`/playground`)

A custom React page with two columns:

**Left — controls:**

- Text input: `domain`
- Text input: `customDomain`
- Checkboxes for each boolean extension: `hashBasedRouting`, `outboundLinks`, `fileDownloads`, `taggedEvents`, `revenue`, `captureOnLocalhost`, `manualPageviews`, `compat`, `pageviewProps`
- Text area: `excludePaths` (one pattern per line)
- Text input: `proxyApiEndpoint`

**Right — live output:**

- Resolved script filename (e.g. `script.hash.outbound-links.js`) updated on every change
- Generated `docusaurus.config.ts` snippet with a copy button
- Generated `docusaurus.config.js` snippet with a copy button

The script name resolution logic mirrors the plugin's own `index.ts` so the output is always accurate.

---

## README Simplification

The `README.md` is trimmed to match the showcase plugin's pattern:

```markdown
# Plausible for Docusaurus

[badges]

A Docusaurus plugin for Plausible analytics.

**[Full documentation →](https://plausible.docusaurus.homotechsual.dev)**

## Installation

npm install @homotechsual/docusaurus-plugin-plausible
# or
yarn add @homotechsual/docusaurus-plugin-plausible

## Quick start

[minimal TS config snippet — domain only]

For all configuration options, extensions, path exclusions, and self-hosted setup,
see the [docs](https://plausible.docusaurus.homotechsual.dev).

## Licence

Apache-2.0
```

The full options table, JS config example, `fileDownloads` sub-options table, and the fork/inspiration credits all move to the docs site. The fork/inspiration note is preserved in `docs/intro.md` rather than dropped entirely.

---

## Workflow Improvements

### `deploy-demo.yml` (new)

Adapted directly from `docusaurus-plugin-showcase`'s `deploy-demo.yml`:

- **Triggers:** push to `main`, `pull_request` (non-fork), `pull_request_target` with `request-deploy` label (forks), `workflow_dispatch`
- **Permissions:** `contents: write`, `deployments: write`, `pull-requests: write`
- **Concurrency:** cancel-in-progress per branch
- **Timeout:** 15 minutes
- **Steps:** checkout (with `fetch-depth: 0`) → corepack → node (current) → `yarn install --immutable` → `yarn build` (plugin) → `yarn workspace docusaurus-plugin-plausible-demo build` → Cloudflare Pages deploy
- **Post-deploy:**
  - On `main` push: commit comment with deployment URL
  - On PR: PR comment with preview URL
  - GitHub Step Summary with deployment table on every run
- **Fork safety:** separate `comment` job that posts a "needs `request-deploy` label" message when a fork PR is first opened

**Cloudflare Pages config:**

- Project name: `docusaurus-plausible`
- Build output: `demo/build`
- Production URL: `plausible.docusaurus.homotechsual.dev`
- Secrets required: `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN` (same account as showcase)

### `publish.yml` (updated)

Add `packages: write` to top-level permissions. Add a second job `publish-gpr` (needs: `publish-npm`) that publishes to the GitHub Package Registry (`https://npm.pkg.github.com`) using `GITHUB_TOKEN`.

### `ci.yml` (updated)

Add `yarn test` step with `continue-on-error: true`. The current `test` script exits 1 as a placeholder; `continue-on-error: true` keeps CI green while making the failure visible as a reminder. Tests will be written in a future PR at which point the `exit 1` placeholder and `continue-on-error` are both removed.

---

## Deployment Prerequisites (manual steps)

These are not code changes but must be done before the deploy workflow succeeds:

1. Create Cloudflare Pages project `docusaurus-plausible` (or confirm it already exists)
2. Configure custom domain `plausible.docusaurus.homotechsual.dev` in Cloudflare
3. Add GitHub secrets `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` to the repo
4. Register `plausible.docusaurus.homotechsual.dev` as a new site in Plausible
5. Generate a Plausible shared link for the embed dashboard (deferred to Phase 2)

---

## Out of Scope (Phase 2)

- Embed dashboard plugin feature (`embed.routeBasePath`, automatic page, swizzleable `@theme/PlausibleDashboard`)
- Tests (placeholder left in place with `continue-on-error: true`)
- Config playground live preview of script loading (requires production environment)
