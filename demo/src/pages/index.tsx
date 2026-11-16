import React from 'react'
import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import Heading from '@theme/Heading'
import clsx from 'clsx'
import styles from './index.module.css'

const features = [
  {
    title: 'Script Extensions',
    description:
      'Turn on hash-route tracking, outbound-link clicks, file downloads, revenue tracking, and other Plausible extensions with plugin options.',
  },
  {
    title: 'Path Exclusions',
    description:
      'Skip pageviews for paths that match your regex patterns, such as admin or staging routes.',
  },
  {
    title: 'Self-Hosted Support',
    description:
      'Set a custom script domain and, if needed, route event requests through your own endpoint.',
  },
  {
    title: 'TypeScript-First',
    description:
      'Use the exported `PluginOptions` type for configuration checks and editor autocomplete.',
  },
]

function Feature({ title, description }: { title: string; description: string }) {
  return (
    <div className={clsx('col col--3')}>
      <div className="padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  )
}

function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {features.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  )
}

function HomepageHero() {
  const { siteConfig } = useDocusaurusContext()
  return (
    <header className={clsx('hero hero--primary', styles.hero)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/docs/intro">
            Documentation
          </Link>
          <Link className="button button--outline button--secondary button--lg" to="/playground">
            Config Playground
          </Link>
        </div>
      </div>
    </header>
  )
}

export default function Home() {
  return (
    <Layout description="Privacy-first Plausible Analytics integration for your Docusaurus site">
      <HomepageHero />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  )
}
