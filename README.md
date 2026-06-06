# Plausible for Docusaurus

[![NPM Version](https://img.shields.io/npm/v/%40homotechsual%2Fdocusaurus-plugin-plausible?style=for-the-badge)
](https://www.npmjs.com/package/@homotechsual/docusaurus-plugin-plausible)
[![NPM Last Update](https://img.shields.io/npm/last-update/%40homotechsual%2Fdocusaurus-plugin-plausible?style=for-the-badge)](https://www.npmjs.com/package/@homotechsual/docusaurus-plugin-plausible)
[![NPM Downloads](https://img.shields.io/npm/dy/%40homotechsual%2Fdocusaurus-plugin-plausible?style=for-the-badge)
](https://www.npmjs.com/package/@homotechsual/docusaurus-plugin-plausible)

A Docusaurus plugin for [Plausible](https://plausible.io/) analytics. Forked from [InfraCost's plugin](https://github.com/infracost/docusaurus-plugin-plausible) originally inspired by [gatsby-plugin-plausible](https://github.com/Aquilio/gatsby-plugin-plausible).

Updated for Docusaurus v3. Rewritten in TypeScript and published as a native ESM module.

***

* [Install](#install)
* [Options](#options)
* [License](#license)

## Install

1. Install `@homotechsual/docusaurus-plugin-plausible`

```bash
npm install --save @homotechsual/docusaurus-plugin-plausible
# or
yarn add @homotechsual/docusaurus-plugin-plausible
```

1. Add the plugin to your Docusaurus config

**TypeScript** (`docusaurus.config.ts`) — import directly for full type-checking:

```typescript
import plausiblePlugin from '@homotechsual/docusaurus-plugin-plausible';
import type { PluginOptions } from '@homotechsual/docusaurus-plugin-plausible';

export default {
  // ...
  plugins: [
    [
      plausiblePlugin,
      {
        domain: 'your-website.com',
      } satisfies PluginOptions,
    ],
  ],
};
```

**JavaScript** (`docusaurus.config.js`):

```javascript
export default {
  // ...
  plugins: [
    [
      '@homotechsual/docusaurus-plugin-plausible',
      {
        domain: 'your-website.com',
      },
    ],
  ],
};
```

## Options

| Option | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `domain` | `string` | Yes | — | The domain of your website as configured in Plausible |
| `customDomain` | `string` | No | `"plausible.io"` | Custom domain for self-hosted Plausible instances |
| `hashBasedRouting` | `boolean` | No | `false` | Enable tracking for hash-based (`#`) routes |
| `outboundLinks` | `boolean` | No | `false` | Automatically track clicks on outbound (external) links |
| `fileDownloads` | `boolean \| FileDownloadsOptions` | No | `false` | Automatically track file downloads — `true` uses the default extension list, or pass an object to customise (see below) |
| `taggedEvents` | `boolean` | No | `false` | Track custom events on elements marked with the `data-analytics` attribute |
| `revenue` | `boolean` | No | `false` | Track ecommerce revenue |
| `captureOnLocalhost` | `boolean` | No | `false` | Enable event tracking on `localhost` |
| `manualPageviews` | `boolean` | No | `false` | Disable Plausible's automatic pageview tracking — pageviews are sent by the plugin's Docusaurus client module |
| `compat` | `boolean` | No | `false` | Use the compatibility script for browsers that block the standard tracker |
| `pageviewProps` | `boolean` | No | `false` | Attach custom properties to every automatic pageview |
| `excludePaths` | `string[]` | No | `[]` | Paths to exclude from pageview tracking — each entry is a bare `RegExp` pattern (e.g. `"^/admin"`) |
| `proxyApiEndpoint` | `string` | No | — | Override the API endpoint used to send events (sets `data-api` on the script tag) |

### `fileDownloads` object options

When `fileDownloads` is an object rather than `true`, you can control which file extensions are tracked:

| Option | Type | Description |
| --- | --- | --- |
| `extensions` | `string[]` | Replace the default extension list entirely (e.g. `["pdf", "zip"]`) |
| `addExtensions` | `string[]` | Add to the default extension list without replacing it |

The default tracked extensions are: `pdf`, `xlsx`, `docx`, `txt`, `rtf`, `csv`, `exe`, `key`, `pps`, `ppt`, `pptx`, `7z`, `pkg`, `rar`, `gz`, `zip`, `avi`, `mov`, `mp4`, `mpeg`, `wmv`, `midi`, `mp3`, `wav`, `wma`, `dmg`.

> **Note:** `excludePaths` entries are treated as bare regex patterns. If you were previously passing regex-literal strings such as `"/admin/"` you should now pass the bare pattern: `"admin"` or `"^/admin"`.

## License

[Apache License 2.0](https://choosealicense.com/licenses/apache-2.0/)
