import React, { useEffect, useState } from 'react'
import Layout from '@theme/Layout'
import Heading from '@theme/Heading'

declare global {
  interface Window {
    plausible?: ((event: string, ...args: unknown[]) => void) & {
      q?: unknown[][]
    }
  }
}

export default function DemoPage() {
  const [scriptLoaded, setScriptLoaded] = useState<boolean | null>(null)
  const [scriptSrc, setScriptSrc] = useState<string | null>(null)
  const [pageviewFired, setPageviewFired] = useState(false)
  const isDev = process.env.NODE_ENV === 'development'

  useEffect(() => {
    const script = document.querySelector<HTMLScriptElement>('script[data-domain]')
    setScriptLoaded(typeof window.plausible === 'function')
    setScriptSrc(script?.src ?? null)
  }, [])

  function firePageview() {
    if (window.plausible) {
      window.plausible('pageview')
      setPageviewFired(true)
    }
  }

  return (
    <Layout title="Live Demo" description="See the Plausible plugin running on this site">
      <main className="container margin-vert--lg">
        <Heading as="h1">Live Demo</Heading>
        <p>
          This site is tracked with <code>@homotechsual/docusaurus-plugin-plausible</code> using the
          domain <code>plausible.docusaurus.homotechsual.dev</code>. The sections below reflect the
          plugin's runtime state on this page.
        </p>

        {isDev ? (
          <div className="admonition admonition-note alert alert--secondary">
            <div className="admonition-heading">
              <h5>Development mode</h5>
            </div>
            <div className="admonition-content">
              <p>
                The Plausible script is not injected in development mode (<code>NODE_ENV !== 'production'</code>).
                Build and serve the demo to see this page fully working:
              </p>
              <pre>
                <code>
                  yarn build{'\n'}
                  yarn workspace docusaurus-plugin-plausible-demo build{'\n'}
                  yarn workspace docusaurus-plugin-plausible-demo serve
                </code>
              </pre>
            </div>
          </div>
        ) : (
          <>
            <section style={{ marginBottom: '2rem' }}>
              <Heading as="h2">Script status</Heading>
              <table>
                <tbody>
                  <tr>
                    <th style={{ paddingRight: '1rem' }}>window.plausible</th>
                    <td>
                      {scriptLoaded === null
                        ? '⏳ checking…'
                        : scriptLoaded
                        ? '✅ loaded'
                        : '❌ not found'}
                    </td>
                  </tr>
                  <tr>
                    <th style={{ paddingRight: '1rem' }}>Script src</th>
                    <td>{scriptSrc ? <code>{scriptSrc}</code> : '—'}</td>
                  </tr>
                </tbody>
              </table>
            </section>

            <section>
              <Heading as="h2">Manual pageview</Heading>
              <p>
                Click the button to fire a manual <code>pageview</code> event. Verify it appears in
                your Plausible dashboard under <strong>plausible.docusaurus.homotechsual.dev</strong>.
              </p>
              <button
                className="button button--primary"
                onClick={firePageview}
                disabled={pageviewFired || scriptLoaded === false}
              >
                {pageviewFired ? '✅ Pageview fired' : 'Fire pageview'}
              </button>
            </section>
          </>
        )}
      </main>
    </Layout>
  )
}
