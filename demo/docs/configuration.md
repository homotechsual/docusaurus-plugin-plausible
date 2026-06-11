---
sidebar_position: 2
---

# Configuration

All options are passed as the second element of the plugin tuple in your `docusaurus.config.ts` (or `.js`).

## Options

| Option | Type | Required | Default | Description |
| ------ | ---- | -------- | ------- | ----------- |
| `domain` | `string` | Yes | — | The domain of your website as configured in Plausible |
| `customDomain` | `string` | No | `"plausible.io"` | Custom domain for self-hosted Plausible instances |
| `hashBasedRouting` | `boolean` | No | `false` | Enable tracking for hash-based (`#`) routes |
| `outboundLinks` | `boolean` | No | `false` | Automatically track clicks on outbound (external) links |
| `fileDownloads` | `boolean \| FileDownloadsOptions` | No | `false` | Automatically track file downloads |
| `taggedEvents` | `boolean` | No | `false` | Track custom events on elements marked with `data-analytics` |
| `revenue` | `boolean` | No | `false` | Track ecommerce revenue |
| `captureOnLocalhost` | `boolean` | No | `false` | Enable event tracking on `localhost` |
| `manualPageviews` | `boolean` | No | `false` | Disable automatic pageview tracking (pageviews sent by the plugin's client module) |
| `compat` | `boolean` | No | `false` | Use the compatibility script for browsers that block the standard tracker |
| `pageviewProps` | `boolean` | No | `false` | Attach custom properties to every automatic pageview |
| `excludePaths` | `string[]` | No | `[]` | Paths to exclude from tracking — each entry is a bare regex pattern |
| `proxyApiEndpoint` | `string` | No | — | Override the API endpoint for sending events (sets `data-api` on the script tag) |

## `fileDownloads` object options

When `fileDownloads` is an object rather than `true`, you can control which extensions are tracked:

| Option | Type | Description |
| ------ | ---- | ----------- |
| `extensions` | `string[]` | Replace the default extension list entirely (e.g. `["pdf", "zip"]`) |
| `addExtensions` | `string[]` | Add to the default extension list without replacing it |

Default tracked extensions: `pdf`, `xlsx`, `docx`, `txt`, `rtf`, `csv`, `exe`, `key`, `pps`, `ppt`, `pptx`, `7z`, `pkg`, `rar`, `gz`, `zip`, `avi`, `mov`, `mp4`, `mpeg`, `wmv`, `midi`, `mp3`, `wav`, `wma`, `dmg`.

## TypeScript example

```ts
import type { Config } from '@docusaurus/types'
import plausiblePlugin, { type PluginOptions } from '@homotechsual/docusaurus-plugin-plausible'

const config: Config = {
  plugins: [
    [
      plausiblePlugin,
      {
        domain: 'your-site.com',
        outboundLinks: true,
        fileDownloads: {
          addExtensions: ['sketch', 'fig'],
        },
        excludePaths: ['^/admin', '^/internal'],
      } satisfies PluginOptions,
    ],
  ],
}

export default config
```
