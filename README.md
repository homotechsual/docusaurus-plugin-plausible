# Plausible for Docusaurus

[![NPM Version](https://img.shields.io/npm/v/%40homotechsual%2Fdocusaurus-plugin-plausible?style=for-the-badge)](https://www.npmjs.com/package/@homotechsual/docusaurus-plugin-plausible)
[![NPM Last Update](https://img.shields.io/npm/last-update/%40homotechsual%2Fdocusaurus-plugin-plausible?style=for-the-badge)](https://www.npmjs.com/package/@homotechsual/docusaurus-plugin-plausible)
[![NPM Downloads](https://img.shields.io/npm/dy/%40homotechsual%2Fdocusaurus-plugin-plausible?style=for-the-badge)](https://www.npmjs.com/package/@homotechsual/docusaurus-plugin-plausible)

A Docusaurus plugin for [Plausible](https://plausible.io/) analytics.

**[Full documentation →](https://plausible.docusaurus.homotechsual.dev)**

## Installation

```bash
npm install @homotechsual/docusaurus-plugin-plausible
# or
yarn add @homotechsual/docusaurus-plugin-plausible
```

## Quick start

```ts
import plausiblePlugin from '@homotechsual/docusaurus-plugin-plausible'
import type { PluginOptions } from '@homotechsual/docusaurus-plugin-plausible'

export default {
  plugins: [
    [
      plausiblePlugin,
      {
        domain: 'your-site.com',
      } satisfies PluginOptions,
    ],
  ],
}
```

For all configuration options, extensions, path exclusions, and self-hosted setup, see the [docs](https://plausible.docusaurus.homotechsual.dev).

## Demo site integrations

The demo homepage displays the package version and links to the current release.
Its production build generates OpenGraph images for documentation and pages using
`@homotechsual/docusaurus-og` and locally installed Inter fonts. Plausible tracking
remains configured for `plausible.docusaurus.homotechsual.dev`; the OG integration
is demo-only and is not enabled automatically for plugin consumers.

## Licence

Apache-2.0
