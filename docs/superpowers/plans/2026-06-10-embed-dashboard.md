# Embed Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an `embed` option group to `docusaurus-plugin-plausible` that automatically creates a `/analytics` page embedding the user's Plausible shared-link dashboard in an iframe, rendered by a swizzleable `@theme/PlausibleDashboard` component.

**Architecture:** The plugin gains `getThemePath()` (registers `lib/theme/` so `@theme/PlausibleDashboard` is resolvable and swizzleable) and `contentLoaded()` (writes embed config to a JSON data file via `createData`, then registers the route via `addRoute`). The component receives the JSON as a prop and constructs the Plausible embed iframe URL from the plugin's existing `domain`/`customDomain` options plus the new `authToken`.

**Tech Stack:** TypeScript 6, Docusaurus 3 plugin API (`addRoute`, `createData`, `getThemePath`), React 19 JSX (`react-jsx` transform), Yarn 4 workspaces.

---

## File Map

| File | Change |
| ---- | ------ |
| `src/types.ts` | Add `EmbedOptions`, `EmbedData` interfaces; add `embed?: EmbedOptions` to `PluginOptions` |
| `tsconfig.json` | Add `"jsx": "react-jsx"` to compiler options |
| `package.json` | Add `@types/react` and `@docusaurus/module-type-aliases` to `devDependencies` |
| `src/declarations.d.ts` | Add `/// <reference types="@docusaurus/module-type-aliases" />` |
| `src/theme/PlausibleDashboard/index.tsx` | **New** — swizzleable dashboard page component |
| `src/index.ts` | Add `embed` to destructure; add `getThemePath()` and `contentLoaded()` |
| `demo/docusaurus.config.ts` | Add `embed` plugin config block; add Analytics navbar link |
| `.github/workflows/deploy-demo.yml` | Add `env: PLAUSIBLE_SHARED_LINK_TOKEN` to demo build step |

---

## Task 1: Add `EmbedOptions` and `EmbedData` types

**Files:**
- Modify: `src/types.ts`

The existing file defines `FileDownloadsOptions` and `PluginOptions`. Add two new interfaces and one new field.

- [ ] **Step 1: Edit `src/types.ts`**

Replace the entire file with:

```ts
export interface FileDownloadsOptions {
  /** Replace the default list of tracked file extensions (e.g. ["pdf", "zip"]) */
  extensions?: string[];
  /** Add to the default tracked file extensions instead of replacing them */
  addExtensions?: string[];
}

export interface EmbedOptions {
  /** Auth token from Plausible → Visibility → Shared links (required) */
  authToken: string;
  /** Route path for the analytics page (default: '/analytics') */
  routeBasePath?: string;
  /** Page heading shown above the iframe (default: 'Analytics') */
  title?: string;
  /** Optional description paragraph shown below the heading */
  description?: string;
}

export interface EmbedData {
  authToken: string;
  domain: string;
  customDomain: string;
  title: string;
  description?: string;
}

export interface PluginOptions {
  /** The domain of your website as configured in Plausible (required) */
  domain: string;
  /** Custom domain for self-hosting Plausible (defaults to "plausible.io") */
  customDomain?: string;
  /** Use hash-based routing instead of History API routing */
  hashBasedRouting?: boolean;
  /** Automatically track clicks on outbound (external) links */
  outboundLinks?: boolean;
  /** Automatically track file downloads, optionally scoped to specific extensions */
  fileDownloads?: boolean | FileDownloadsOptions;
  /** Track custom events on tagged HTML elements via the data-analytics attribute */
  taggedEvents?: boolean;
  /** Track ecommerce revenue */
  revenue?: boolean;
  /** Enable tracking on localhost (useful for development) */
  captureOnLocalhost?: boolean;
  /** Disable automatic pageview tracking — pageviews must be sent manually */
  manualPageviews?: boolean;
  /** Use the compatibility script for browsers that block the standard tracker */
  compat?: boolean;
  /** Attach custom properties to every automatic pageview */
  pageviewProps?: boolean;
  /**
   * Paths to exclude from pageview tracking. Each entry is used as a RegExp
   * pattern (e.g. "^/admin" or "private").
   *
   * NOTE: Pass bare patterns — not regex-literal strings like "/admin/".
   */
  excludePaths?: string[];
  /** Override the API endpoint used to send events (sets data-api on the script tag) */
  proxyApiEndpoint?: string;
  /** Embed a Plausible shared-link dashboard as an automatic page */
  embed?: EmbedOptions;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/types.ts
git commit -m "feat: add EmbedOptions and EmbedData types"
```

---

## Task 2: Prepare TypeScript for JSX

**Files:**
- Modify: `tsconfig.json`
- Modify: `package.json`
- Modify: `src/declarations.d.ts`

The plugin's `tsconfig.json` has no JSX config and the root package has no React types. Both are required to compile `src/theme/PlausibleDashboard/index.tsx`.

- [ ] **Step 1: Add `"jsx": "react-jsx"` to `tsconfig.json`**

Replace the entire file with:

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "NodeNext",
    "lib": ["ESNext", "DOM"],
    "outDir": "./lib",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "NodeNext",
    "types": ["node"],
    "jsx": "react-jsx"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "lib"]
}
```

- [ ] **Step 2: Add devDependencies to root `package.json`**

Add `@types/react` and `@docusaurus/module-type-aliases` to the `devDependencies` block. The updated `devDependencies` section:

```json
"devDependencies": {
  "@docusaurus/core": "^3.10.1",
  "@docusaurus/module-type-aliases": "^3.10.1",
  "@docusaurus/types": "^3.10.1",
  "@types/node": "^22.0.0",
  "@types/react": "^19.0.0",
  "eslint": "^10.4.1",
  "eslint-config-prettier": "^10.1.8",
  "globals": "^17.6.0",
  "prettier": "^3.8.3",
  "typescript": "^6.0.3",
  "typescript-eslint": "^8.60.1"
}
```

- [ ] **Step 3: Add triple-slash reference to `src/declarations.d.ts`**

Replace the entire file with:

```ts
/// <reference types="@docusaurus/module-type-aliases" />

declare module '@docusaurus/ExecutionEnvironment' {
  const ExecutionEnvironment: {
    readonly canUseDOM: boolean;
  };
  export default ExecutionEnvironment;
}
```

The `/// <reference types="@docusaurus/module-type-aliases" />` line makes all `@theme/*` module declarations (including `@theme/Layout`) available to the TypeScript compiler.

- [ ] **Step 4: Install new packages**

```bash
yarn install
```

Expected: lockfile updated, no errors.

- [ ] **Step 5: Verify TypeScript compiles**

```bash
yarn build
```

Expected: exits 0, `lib/` updated. No errors about JSX or missing types.

- [ ] **Step 6: Commit**

```bash
git add tsconfig.json package.json src/declarations.d.ts yarn.lock
git commit -m "feat: configure TypeScript for JSX and add React/Docusaurus type deps"
```

---

## Task 3: Create `@theme/PlausibleDashboard` component

**Files:**
- Create: `src/theme/PlausibleDashboard/index.tsx`

This is the swizzleable page component. It receives `embedData` as a prop (populated by the plugin's `addRoute` call via `modules`), constructs the Plausible embed iframe URL, and renders a Docusaurus `Layout`-wrapped page with a heading, optional description, and the iframe.

- [ ] **Step 1: Create the directory and file**

Create `src/theme/PlausibleDashboard/index.tsx` with:

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

- [ ] **Step 2: Build the plugin**

```bash
yarn build
```

Expected: exits 0. `lib/theme/PlausibleDashboard/index.js` and `lib/theme/PlausibleDashboard/index.d.ts` are created.

Verify:

```bash
ls lib/theme/PlausibleDashboard/
```

Expected output includes `index.js`, `index.js.map`, `index.d.ts`, `index.d.ts.map`.

- [ ] **Step 3: Commit**

```bash
git add src/theme/PlausibleDashboard/index.tsx
git commit -m "feat: add swizzleable PlausibleDashboard theme component"
```

---

## Task 4: Add `getThemePath` and `contentLoaded` to the plugin

**Files:**
- Modify: `src/index.ts`

The plugin currently returns an object with `name`, `getClientModules`, and `injectHtmlTags`. Add `getThemePath` (registers the theme directory) and `contentLoaded` (creates the analytics page route when `embed` is configured). Also update the type import and destructuring.

- [ ] **Step 1: Replace `src/index.ts`**

```ts
import { fileURLToPath } from 'url';
import type { LoadContext, OptionValidationContext, Plugin } from '@docusaurus/types';
import type { PluginOptions, EmbedData } from './types.js';

function pluginPlausible(
  _context: LoadContext,
  options: PluginOptions,
): Plugin<void> {
  const {
    domain,
    customDomain = 'plausible.io',
    hashBasedRouting,
    outboundLinks,
    fileDownloads,
    taggedEvents,
    revenue,
    captureOnLocalhost,
    manualPageviews,
    compat,
    pageviewProps,
    excludePaths = [],
    proxyApiEndpoint,
    embed,
  } = options;

  if (!domain) {
    throw new Error(
      'You did not specify the `domain` field in the plugin options.',
    );
  }

  const isProd = process.env.NODE_ENV === 'production';

  const extensions: string[] = [];
  if (hashBasedRouting) extensions.push('hash');
  if (outboundLinks) extensions.push('outbound-links');
  if (fileDownloads) extensions.push('file-downloads');
  if (taggedEvents) extensions.push('tagged-events');
  if (revenue) extensions.push('revenue');
  if (captureOnLocalhost) extensions.push('local');
  if (manualPageviews) extensions.push('manual');
  if (compat) extensions.push('compat');
  if (pageviewProps) extensions.push('pageview-props');

  const scriptName =
    extensions.length > 0
      ? `plausible.${extensions.join('.')}.js`
      : 'plausible.js';

  return {
    name: 'docusaurus-plugin-plausible',

    getThemePath() {
      return fileURLToPath(new URL('./theme', import.meta.url));
    },

    getClientModules() {
      return isProd
        ? [fileURLToPath(new URL('./analytics.js', import.meta.url))]
        : [];
    },

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

    injectHtmlTags() {
      if (!isProd) {
        return {};
      }

      const excludePathsScript =
        excludePaths.length > 0
          ? `window.plausibleExcludePaths=${JSON.stringify(excludePaths)}.map(function(p){return new RegExp(p);});`
          : '';

      const scriptAttributes: Record<string, string | boolean> = {
        async: true,
        defer: true,
        'data-domain': domain,
        src: `https://${customDomain}/js/${scriptName}`,
      };

      if (proxyApiEndpoint) {
        scriptAttributes['data-api'] = proxyApiEndpoint;
      }

      if (fileDownloads && typeof fileDownloads === 'object') {
        if (fileDownloads.extensions) {
          scriptAttributes['file-types'] = fileDownloads.extensions.join(',');
        }
        if (fileDownloads.addExtensions) {
          scriptAttributes['add-file-types'] =
            fileDownloads.addExtensions.join(',');
        }
      }

      return {
        headTags: [
          {
            tagName: 'link',
            attributes: {
              rel: 'preconnect',
              href: `https://${customDomain}`,
            },
          },
          {
            tagName: 'script',
            attributes: scriptAttributes,
          },
          {
            tagName: 'script',
            innerHTML: `window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) };${excludePathsScript}`,
          },
        ],
      };
    },
  };
}

export function validateOptions({
  options,
}: OptionValidationContext<unknown, PluginOptions>): PluginOptions {
  const opts = options as Record<string, unknown>;
  if (!opts || typeof opts !== 'object') {
    throw new Error('[docusaurus-plugin-plausible] Plugin options must be an object.');
  }
  if (typeof opts['domain'] !== 'string' || !opts['domain']) {
    throw new Error('[docusaurus-plugin-plausible] You must specify the `domain` option.');
  }
  return opts as unknown as PluginOptions;
}

// Cast to satisfy Docusaurus's PluginModule<unknown> — options are validated
// before this function is called so the cast is safe at runtime.
export default pluginPlausible as unknown as (
  context: LoadContext,
  options: unknown,
) => Plugin<void>;

export type { PluginOptions };
```

- [ ] **Step 2: Build to verify**

```bash
yarn build
```

Expected: exits 0. No TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add src/index.ts
git commit -m "feat: add getThemePath and contentLoaded to plugin for embed dashboard"
```

---

## Task 5: Update demo site config

**Files:**
- Modify: `demo/docusaurus.config.ts`

Add the `embed` block to the plugin options and an Analytics link to the navbar. The auth token is read from `process.env.PLAUSIBLE_SHARED_LINK_TOKEN` so it is never committed. An empty string causes the iframe to fail silently — no crash, no build error.

- [ ] **Step 1: Add `embed` to plugin config and Analytics to navbar**

Replace the entire file with:

```ts
import { themes as prismThemes } from 'prism-react-renderer'
import type { Config } from '@docusaurus/types'
import type * as Preset from '@docusaurus/preset-classic'
import { DOCUSAURUS_VERSION } from '@docusaurus/utils'

const config: Config = {
  title: 'Plausible for Docusaurus',
  tagline: 'Privacy-first analytics for your Docusaurus site',
  favicon: 'img/favicon.ico',
  url: 'https://plausible.docusaurus.homotechsual.dev',
  baseUrl: '/',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  plugins: [
    [
      '@homotechsual/docusaurus-plugin-plausible',
      {
        domain: 'plausible.docusaurus.homotechsual.dev',
        embed: {
          authToken: process.env.PLAUSIBLE_SHARED_LINK_TOKEN ?? '',
          routeBasePath: '/analytics',
          title: 'Live Analytics',
          description: 'Real visitor data for this demo site, powered by Plausible.',
        },
      },
    ],
  ],
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    navbar: {
      title: 'Plausible Plugin',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docs',
          position: 'left',
          label: 'Docs',
        },
        { to: '/demo', label: 'Live Demo', position: 'left' },
        { to: '/playground', label: 'Playground', position: 'left' },
        { to: '/analytics', label: 'Analytics', position: 'left' },
        {
          href: 'https://github.com/homotechsual/docusaurus-plugin-plausible',
          label: 'GitHub',
          position: 'right',
          className: 'github-link',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            { label: 'Introduction', to: '/docs/intro' },
            { label: 'Configuration', to: '/docs/configuration' },
            { label: 'Extensions', to: '/docs/extensions' },
            { label: 'Path Exclusions', to: '/docs/path-exclusions' },
            { label: 'Self-Hosted', to: '/docs/self-hosted' },
          ],
        },
        {
          title: 'Tools',
          items: [
            { label: 'Live Demo', to: '/demo' },
            { label: 'Config Playground', to: '/playground' },
            { label: 'Analytics', to: '/analytics' },
          ],
        },
        {
          title: 'Links',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/homotechsual/docusaurus-plugin-plausible',
            },
            {
              label: 'npm',
              href: 'https://www.npmjs.com/package/@homotechsual/docusaurus-plugin-plausible',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Mikey O'Toole.<br />Built with <a href="https://docusaurus.io">Docusaurus v${DOCUSAURUS_VERSION}</a>.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
}

export default config
```

- [ ] **Step 2: Commit**

```bash
git add demo/docusaurus.config.ts
git commit -m "feat(demo): add embed dashboard config and Analytics navbar link"
```

---

## Task 6: Update deploy workflow

**Files:**
- Modify: `.github/workflows/deploy-demo.yml`

The demo build step needs `PLAUSIBLE_SHARED_LINK_TOKEN` injected as an environment variable. Add an `env` block to the existing "Build demo" step.

- [ ] **Step 1: Add `env` to the demo build step**

Find the "Build demo" step (currently lines 65–66):

```yaml
      - name: Build demo
        run: yarn workspace docusaurus-plugin-plausible-demo build
```

Replace it with:

```yaml
      - name: Build demo
        run: yarn workspace docusaurus-plugin-plausible-demo build
        env:
          PLAUSIBLE_SHARED_LINK_TOKEN: ${{ secrets.PLAUSIBLE_SHARED_LINK_TOKEN }}
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/deploy-demo.yml
git commit -m "ci: inject PLAUSIBLE_SHARED_LINK_TOKEN into demo build step"
```

---

## Manual prerequisite (not a code task)

Before the analytics page shows real data on the deployed demo, the user must:

1. Go to `plausible.io` → select the `plausible.docusaurus.homotechsual.dev` site → **Visibility** → **Shared links** → create a new shared link
2. Copy the auth token (the `?auth=XXXXX` part of the generated URL)
3. Add it as a GitHub secret named `PLAUSIBLE_SHARED_LINK_TOKEN` in the repo settings

---

## Self-Review

**Spec coverage:**
- ✅ `EmbedOptions` / `EmbedData` types — Task 1
- ✅ `embed?: EmbedOptions` in `PluginOptions` — Task 1
- ✅ Iframe URL constructed from `customDomain`/`domain`/`authToken` — Task 3 (component)
- ✅ `getThemePath()` registers theme directory — Task 4
- ✅ `contentLoaded()` uses `createData` + `addRoute` — Task 4
- ✅ `routeBasePath` defaults to `/analytics` — Task 4
- ✅ `title` defaults to `'Analytics'` — Task 4
- ✅ Works in dev mode (no `isProd` guard on `contentLoaded`) — Task 4
- ✅ Demo config with env var auth token — Task 5
- ✅ Analytics navbar link — Task 5
- ✅ Analytics footer link — Task 5
- ✅ `PLAUSIBLE_SHARED_LINK_TOKEN` in deploy workflow — Task 6

**Type consistency:**
- `EmbedData` defined in Task 1, used in Task 3 (component prop) and Task 4 (`satisfies EmbedData`) — consistent
- `embed.routeBasePath ?? '/analytics'` — `routeBasePath` is `string | undefined` in `EmbedOptions` — consistent
- `embed.title ?? 'Analytics'` written to `EmbedData.title: string` (not optional) — consistent; the `??` coerces `undefined` to the string default before serialisation
