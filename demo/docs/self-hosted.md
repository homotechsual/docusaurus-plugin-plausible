---
sidebar_position: 5
---

# Self-Hosted Plausible

If you run your own Plausible instance, two options let you point the plugin at it.

## `customDomain`

Sets the hostname used for both the preconnect hint and the script URL. Defaults to `plausible.io`.

```ts
{
  domain: 'your-site.com',
  customDomain: 'analytics.your-company.com',
}
```

This loads the script from:

```text
https://analytics.your-company.com/js/plausible.js
```

## `proxyApiEndpoint`

Sets the `data-api` attribute on the script tag, routing event submissions through a custom endpoint. Useful when you want to proxy events through your own domain to avoid ad-blockers.

```ts
{
  domain: 'your-site.com',
  proxyApiEndpoint: 'https://your-site.com/api/event',
}
```

Plausible's script will POST pageview events to `https://your-site.com/api/event` instead of the default `https://plausible.io/api/event`.

## Combined example

```ts
import type { Config } from '@docusaurus/types'
import plausiblePlugin, { type PluginOptions } from '@homotechsual/docusaurus-plugin-plausible'

const config: Config = {
  plugins: [
    [
      plausiblePlugin,
      {
        domain: 'your-site.com',
        customDomain: 'analytics.your-company.com',
        proxyApiEndpoint: 'https://your-site.com/api/event',
      } satisfies PluginOptions,
    ],
  ],
}

export default config
```
