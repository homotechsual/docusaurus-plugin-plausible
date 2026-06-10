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

## Licence

Apache-2.0
