---
sidebar_position: 1
---

# Introduction

**Plausible for Docusaurus** integrates [Plausible Analytics](https://plausible.io/) into your Docusaurus site. It injects the Plausible tracking script, handles route-change pageviews automatically, and supports the full range of Plausible script extensions.

This plugin was forked from [InfraCost's docusaurus-plugin-plausible](https://github.com/infracost/docusaurus-plugin-plausible), originally inspired by [gatsby-plugin-plausible](https://github.com/Aquilio/gatsby-plugin-plausible). It has been rewritten in TypeScript and updated for Docusaurus v3+.

## Installation

```bash
npm install @homotechsual/docusaurus-plugin-plausible
# or
yarn add @homotechsual/docusaurus-plugin-plausible
```

## Quick start

Add the plugin to your `docusaurus.config.ts`:

```ts
import type { Config } from '@docusaurus/types'
import plausiblePlugin, { type PluginOptions } from '@homotechsual/docusaurus-plugin-plausible'

const config: Config = {
  plugins: [
    [
      plausiblePlugin,
      {
        domain: 'your-site.com',
      } satisfies PluginOptions,
    ],
  ],
}

export default config
```

Or in `docusaurus.config.js`:

```js
export default {
  plugins: [
    [
      '@homotechsual/docusaurus-plugin-plausible',
      {
        domain: 'your-site.com',
      },
    ],
  ],
}
```

The tracking script is only injected in production builds (`NODE_ENV === 'production'`). No analytics fire during `docusaurus start`.
