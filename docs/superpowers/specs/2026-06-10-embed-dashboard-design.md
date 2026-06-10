# Embed Dashboard Design

**Date:** 2026-06-10
**Status:** Approved
**Scope:** Phase 2 — embed Plausible shared-link dashboard as an automatic Docusaurus page

---

## Overview

Add an `embed` option group to `docusaurus-plugin-plausible` that automatically creates a page embedding the user's Plausible shared-link dashboard in an iframe. The page is registered via the plugin's `contentLoaded` lifecycle and rendered by a swizzleable `@theme/PlausibleDashboard` component. The user only needs to provide their Plausible auth token — the plugin constructs the full iframe URL from options already present in the plugin config (`domain`, `customDomain`).

---

## New Plugin Options

### `EmbedOptions` (new interface in `src/types.ts`)

```ts
export interface EmbedOptions {
  /** Auth token from Plausible → Visibility → Shared links (required) */
  authToken: string;
  /** Route path for the analytics page (default: '/analytics') */
  routeBasePath?: string;
  /** Page heading (default: 'Analytics') */
  title?: string;
  /** Optional description shown below the heading */
  description?: string;
}
```

### `EmbedData` (new interface in `src/types.ts`)

Represents the JSON written by `createData` and received as a prop by the page component. Kept separate from `EmbedOptions` so the component does not import plugin-side types.

```ts
export interface EmbedData {
  authToken: string;
  domain: string;
  customDomain: string;
  title: string;
  description?: string;
}
```

### Addition to `PluginOptions`

```ts
/** Embed a Plausible shared-link dashboard as an automatic page */
embed?: EmbedOptions;
```

### Iframe URL construction

```
https://{customDomain}/share/{domain}?auth={authToken}&embed=true&theme=system&background=transparent
```

`customDomain` defaults to `plausible.io`. `domain` comes from the existing required option. The user only needs to supply `authToken`.

---

## Plugin Lifecycle Changes (`src/index.ts`)

### `getThemePath()`

Registers `lib/theme/` as a theme directory so `@theme/PlausibleDashboard` is resolvable and swizzleable by consumers.

```ts
getThemePath() {
  return fileURLToPath(new URL('./theme', import.meta.url));
},
```

### `async contentLoaded({ actions })`

Only executes when `embed` is configured. Writes embed options to a JSON data file, then registers the route.

```ts
async contentLoaded({ actions }) {
  if (!embed) return;
  const { addRoute, createData } = actions;
  const dataPath = await createData(
    'embed-options.json',
    JSON.stringify({
      authToken: embed.authToken,
      domain,
      customDomain,
      title: embed.title ?? 'Analytics',
      description: embed.description,
    } satisfies EmbedData),
  );
  addRoute({
    path: embed.routeBasePath ?? '/analytics',
    component: '@theme/PlausibleDashboard',
    exact: true,
    modules: { embedData: dataPath },
  });
},
```

No changes to `injectHtmlTags` or `getClientModules`.

---

## Theme Component (`src/theme/PlausibleDashboard/index.tsx`)

Swizzleable via `docusaurus swizzle @homotechsual/docusaurus-plugin-plausible PlausibleDashboard`.

```tsx
import Layout from '@theme/Layout';
import type { EmbedData } from '../../types.js';

interface Props {
  embedData: EmbedData;
}

export default function PlausibleDashboard({ embedData }: Props): JSX.Element {
  const { authToken, domain, customDomain, title, description } = embedData;
  const src = `https://${customDomain}/share/${domain}?auth=${authToken}&embed=true&theme=system&background=transparent`;

  return (
    <Layout title={title}>
      <main style={{ padding: '2rem' }}>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
        <iframe
          src={src}
          loading="lazy"
          style={{ width: '100%', height: '1500px', border: 'none' }}
          title={title}
        />
      </main>
    </Layout>
  );
}
```

Default iframe height is `1500px`. Users who need a different height swizzle the component.

---

## Files Created / Modified

| File | Change |
| ---- | ------ |
| `src/types.ts` | Add `EmbedOptions`, `EmbedData` interfaces; add `embed?: EmbedOptions` to `PluginOptions` |
| `src/index.ts` | Add `getThemePath()`, `contentLoaded()` lifecycle methods; import `EmbedData` |
| `src/theme/PlausibleDashboard/index.tsx` | New — swizzleable dashboard page component |
| `demo/docusaurus.config.ts` | Add `embed` config block; add Analytics navbar link |
| `.github/workflows/deploy-demo.yml` | Inject `PLAUSIBLE_SHARED_LINK_TOKEN` env var on demo build step |

---

## Demo Site Updates

### `demo/docusaurus.config.ts` — plugin config

```ts
embed: {
  authToken: process.env.PLAUSIBLE_SHARED_LINK_TOKEN ?? '',
  routeBasePath: '/analytics',
  title: 'Live Analytics',
  description: 'Real visitor data for this demo site, powered by Plausible.',
},
```

The auth token is read from an environment variable so it is never committed. An empty string causes the iframe to fail silently (no crash).

### `demo/docusaurus.config.ts` — navbar

```ts
{ label: 'Analytics', to: '/analytics' },
```

Added between the Playground and GitHub links.

### `deploy-demo.yml` — demo build step

```yaml
env:
  PLAUSIBLE_SHARED_LINK_TOKEN: ${{ secrets.PLAUSIBLE_SHARED_LINK_TOKEN }}
```

### Manual prerequisite

Generate a Plausible shared link at `plausible.io → your site → Visibility → Shared links` and add the token as a GitHub secret named `PLAUSIBLE_SHARED_LINK_TOKEN`.

---

## Out of Scope

- Custom iframe height as a plugin option (swizzle covers this)
- Loading state / skeleton while the iframe loads
- Dark/light theme switching for the iframe (Plausible's `theme=system` handles this automatically)
- Tests (deferred — `continue-on-error: true` remains on the test step)
