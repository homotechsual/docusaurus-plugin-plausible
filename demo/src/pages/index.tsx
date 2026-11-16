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
      'Enable hash routing, outbound link tracking, file downloads, revenue tracking, and more — one config option each.',
  },
  {
    title: 'Path Exclusions',
    description:
      'Exclude pages from analytics using regex patterns. Keep admin routes, staging paths, and internal pages out of your data.',
  },
  {
    title: 'Self-Hosted Support',
    description:
      'Point the plugin at your own Plausible instance with customDomain. Proxy API requests through your own endpoint for extra privacy.',
  },
  {
    title: 'TypeScript-First',
    description:
      'Full type safety with the exported PluginOptions interface. Use satisfies in your config for complete IDE assistance.',
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
