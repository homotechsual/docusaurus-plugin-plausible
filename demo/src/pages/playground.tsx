import React, { useState } from 'react'
import Layout from '@theme/Layout'
import Heading from '@theme/Heading'

interface PlaygroundState {
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

const defaults: PlaygroundState = {
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

function resolveScriptName(s: PlaygroundState): string {
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

function resolveScriptUrl(s: PlaygroundState): string {
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
    const patterns = s.excludePaths
      .split('\n')
      .map((p) => p.trim())
      .filter(Boolean)
    lines.push(`        excludePaths: [${patterns.map((p) => `'${p}'`).join(', ')}],`)
  }
  if (s.proxyApiEndpoint) lines.push(`        proxyApiEndpoint: '${s.proxyApiEndpoint}',`)
  return lines
}

function generateTsConfig(s: PlaygroundState): string {
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

function generateJsConfig(s: PlaygroundState): string {
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

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <button
      className="button button--sm button--secondary"
      onClick={copy}
      style={{ float: 'right', marginBottom: '0.5rem' }}
    >
      {copied ? '✅ Copied' : 'Copy'}
    </button>
  )
}

const booleanOptions: {
  key: keyof PlaygroundState
  label: string
  description: string
}[] = [
  { key: 'hashBasedRouting', label: 'Hash-based routing', description: 'Track hash (#) route changes' },
  { key: 'outboundLinks', label: 'Outbound links', description: 'Track clicks on external links' },
  { key: 'fileDownloads', label: 'File downloads', description: 'Track file download clicks' },
  { key: 'taggedEvents', label: 'Tagged events', description: 'Track data-analytics tagged elements' },
  { key: 'revenue', label: 'Revenue', description: 'Track ecommerce revenue' },
  { key: 'captureOnLocalhost', label: 'Capture on localhost', description: 'Enable tracking in development' },
  { key: 'manualPageviews', label: 'Manual pageviews', description: 'Disable automatic pageview tracking' },
  { key: 'compat', label: 'Compat mode', description: 'Compatibility script for browsers that block the standard tracker' },
  { key: 'pageviewProps', label: 'Pageview props', description: 'Attach custom properties to every pageview' },
]

const inputStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  marginTop: '0.25rem',
  padding: '0.4rem 0.6rem',
  border: '1px solid var(--ifm-color-emphasis-300)',
  borderRadius: '4px',
  background: 'var(--ifm-background-color)',
  color: 'var(--ifm-font-color-base)',
  fontFamily: 'var(--ifm-font-family-base)',
}

export default function PlaygroundPage() {
  const [state, setState] = useState<PlaygroundState>(defaults)

  function update<K extends keyof PlaygroundState>(key: K, value: PlaygroundState[K]) {
    setState((prev) => ({ ...prev, [key]: value }))
  }

  const scriptName = resolveScriptName(state)
  const scriptUrl = resolveScriptUrl(state)
  const tsConfig = generateTsConfig(state)
  const jsConfig = generateJsConfig(state)

  return (
    <Layout
      title="Config Playground"
      description="Interactively build your Plausible plugin configuration"
    >
      <main className="container margin-vert--lg">
        <Heading as="h1">Config Playground</Heading>
        <p>
          Configure the plugin options and see the generated Docusaurus config and resolved script URL
          in real time.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2rem',
            alignItems: 'start',
          }}
        >
          {/* ── Controls ── */}
          <div>
            <Heading as="h2">Options</Heading>

            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="domain">
                <strong>domain</strong> <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                id="domain"
                type="text"
                value={state.domain}
                onChange={(e) => update('domain', e.target.value)}
                placeholder="your-site.com"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="customDomain">
                <strong>customDomain</strong>
              </label>
              <input
                id="customDomain"
                type="text"
                value={state.customDomain}
                onChange={(e) => update('customDomain', e.target.value)}
                placeholder="plausible.io"
                style={inputStyle}
              />
            </div>

            <Heading as="h3">Extensions</Heading>

            {booleanOptions.map(({ key, label, description }) => (
              <label
                key={key}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                  marginBottom: '0.5rem',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={state[key] as boolean}
                  onChange={(e) => update(key, e.target.checked as PlaygroundState[typeof key])}
                  style={{ marginTop: '0.3rem', flexShrink: 0 }}
                />
                <span>
                  <strong>{label}</strong>
                  <br />
                  <small style={{ color: 'var(--ifm-color-emphasis-700)' }}>{description}</small>
                </span>
              </label>
            ))}

            <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
              <label htmlFor="excludePaths">
                <strong>excludePaths</strong>
              </label>
              <small style={{ display: 'block', color: 'var(--ifm-color-emphasis-700)' }}>
                One regex pattern per line (e.g. <code>^/admin</code>)
              </small>
              <textarea
                id="excludePaths"
                value={state.excludePaths}
                onChange={(e) => update('excludePaths', e.target.value)}
                rows={3}
                style={{ ...inputStyle, fontFamily: 'var(--ifm-font-family-monospace)' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="proxyApiEndpoint">
                <strong>proxyApiEndpoint</strong>
              </label>
              <input
                id="proxyApiEndpoint"
                type="text"
                value={state.proxyApiEndpoint}
                onChange={(e) => update('proxyApiEndpoint', e.target.value)}
                placeholder="https://your-site.com/api/event"
                style={inputStyle}
              />
            </div>
          </div>

          {/* ── Output ── */}
          <div>
            <Heading as="h2">Output</Heading>

            <div style={{ marginBottom: '1.5rem' }}>
              <Heading as="h3">Resolved script</Heading>
              <table>
                <tbody>
                  <tr>
                    <th style={{ paddingRight: '1rem', whiteSpace: 'nowrap' }}>Filename</th>
                    <td>
                      <code>{scriptName}</code>
                    </td>
                  </tr>
                  <tr>
                    <th style={{ paddingRight: '1rem', whiteSpace: 'nowrap' }}>Full URL</th>
                    <td>
                      <code style={{ wordBreak: 'break-all' }}>{scriptUrl}</code>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <Heading as="h3">docusaurus.config.ts</Heading>
              <CopyButton text={tsConfig} />
              <pre style={{ clear: 'both', overflowX: 'auto' }}>
                <code>{tsConfig}</code>
              </pre>
            </div>

            <div>
              <Heading as="h3">docusaurus.config.js</Heading>
              <CopyButton text={jsConfig} />
              <pre style={{ clear: 'both', overflowX: 'auto' }}>
                <code>{jsConfig}</code>
              </pre>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  )
}
