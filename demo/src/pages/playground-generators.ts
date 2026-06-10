// j:/Projects/docusaurus-plugin-plausible/demo/src/pages/playground-generators.ts

export interface PlaygroundState {
  domain: string
  customDomain: string
  hashBasedRouting: boolean
  outboundLinks: boolean
  fileDownloads: boolean
  taggedEvents: boolean
  revenue: boolean
  captureOnLocalhost: boolean
  manualPageviews: boolean
  compat: boolean
  pageviewProps: boolean
  excludePaths: string
  proxyApiEndpoint: string
}

export const defaults: PlaygroundState = {
  domain: 'your-site.com',
  customDomain: '',
  hashBasedRouting: false,
  outboundLinks: false,
  fileDownloads: false,
  taggedEvents: false,
  revenue: false,
  captureOnLocalhost: false,
  manualPageviews: false,
  compat: false,
  pageviewProps: false,
  excludePaths: '',
  proxyApiEndpoint: '',
}

export function resolveScriptName(s: PlaygroundState): string {
  const ext: string[] = []
  if (s.hashBasedRouting) ext.push('hash')
  if (s.outboundLinks) ext.push('outbound-links')
  if (s.fileDownloads) ext.push('file-downloads')
  if (s.taggedEvents) ext.push('tagged-events')
  if (s.revenue) ext.push('revenue')
  if (s.captureOnLocalhost) ext.push('local')
  if (s.manualPageviews) ext.push('manual')
  if (s.compat) ext.push('compat')
  if (s.pageviewProps) ext.push('pageview-props')
  return ext.length > 0 ? `plausible.${ext.join('.')}.js` : 'plausible.js'
}

export function resolveScriptUrl(s: PlaygroundState): string {
  return `https://${s.customDomain || 'plausible.io'}/js/${resolveScriptName(s)}`
}

function buildOptions(s: PlaygroundState): string[] {
  const lines: string[] = [`        domain: '${s.domain}',`]
  if (s.customDomain) lines.push(`        customDomain: '${s.customDomain}',`)
  if (s.hashBasedRouting) lines.push(`        hashBasedRouting: true,`)
  if (s.outboundLinks) lines.push(`        outboundLinks: true,`)
  if (s.fileDownloads) lines.push(`        fileDownloads: true,`)
  if (s.taggedEvents) lines.push(`        taggedEvents: true,`)
  if (s.revenue) lines.push(`        revenue: true,`)
  if (s.captureOnLocalhost) lines.push(`        captureOnLocalhost: true,`)
  if (s.manualPageviews) lines.push(`        manualPageviews: true,`)
  if (s.compat) lines.push(`        compat: true,`)
  if (s.pageviewProps) lines.push(`        pageviewProps: true,`)
  if (s.excludePaths) {
    const patterns = s.excludePaths.split('\n').map((p) => p.trim()).filter(Boolean)
    lines.push(`        excludePaths: [${patterns.map((p) => `'${p}'`).join(', ')}],`)
  }
  if (s.proxyApiEndpoint) lines.push(`        proxyApiEndpoint: '${s.proxyApiEndpoint}',`)
  return lines
}

export function generateTsConfig(s: PlaygroundState): string {
  return [
    `import plausiblePlugin from '@homotechsual/docusaurus-plugin-plausible'`,
    `import type { PluginOptions } from '@homotechsual/docusaurus-plugin-plausible'`,
    ``,
    `export default {`,
    `  plugins: [`,
    `    [`,
    `      plausiblePlugin,`,
    `      {`,
    ...buildOptions(s),
    `      } satisfies PluginOptions,`,
    `    ],`,
    `  ],`,
    `}`,
  ].join('\n')
}

export function generateJsConfig(s: PlaygroundState): string {
  return [
    `export default {`,
    `  plugins: [`,
    `    [`,
    `      '@homotechsual/docusaurus-plugin-plausible',`,
    `      {`,
    ...buildOptions(s),
    `      },`,
    `    ],`,
    `  ],`,
    `}`,
  ].join('\n')
}
