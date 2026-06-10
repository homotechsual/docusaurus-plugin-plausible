import React, { useState } from 'react'
import Layout from '@theme/Layout'
import Heading from '@theme/Heading'
import { PlaygroundOutputAccordion } from '../components/PlaygroundOutputAccordion'
import {
  defaults,
  resolveScriptName,
  resolveScriptUrl,
  generateTsConfig,
  generateJsConfig,
} from '../lib/playground-generators'
import type { PlaygroundState } from '../lib/playground-generators'

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
                    <td><code>{scriptName}</code></td>
                  </tr>
                  <tr>
                    <th style={{ paddingRight: '1rem', whiteSpace: 'nowrap' }}>Full URL</th>
                    <td><code style={{ wordBreak: 'break-all' }}>{scriptUrl}</code></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <PlaygroundOutputAccordion title="docusaurus.config.ts" defaultOpen copyText={tsConfig}>
              <pre style={{ margin: 0 }}><code>{tsConfig}</code></pre>
            </PlaygroundOutputAccordion>

            <PlaygroundOutputAccordion title="docusaurus.config.js" defaultOpen copyText={jsConfig}>
              <pre style={{ margin: 0 }}><code>{jsConfig}</code></pre>
            </PlaygroundOutputAccordion>
          </div>
        </div>
      </main>
    </Layout>
  )
}
