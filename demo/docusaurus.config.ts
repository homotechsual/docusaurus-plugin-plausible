import { themes as prismThemes } from 'prism-react-renderer'
import type { Config } from '@docusaurus/types'
import type * as Preset from '@docusaurus/preset-classic'
import { DOCUSAURUS_VERSION } from '@docusaurus/utils'

const config: Config = {
  title: 'Plausible for Docusaurus',
  tagline: 'Privacy-first analytics for your Docusaurus site',
  favicon: 'img/favicon.ico',
  url: 'https://plausible.docusaurus.homotechsual.dev',
  baseUrl: '/',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  plugins: [
    [
      '@homotechsual/docusaurus-plugin-plausible',
      {
        domain: 'plausible.docusaurus.homotechsual.dev',
      },
    ],
  ],
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    navbar: {
      title: 'Plausible Plugin',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docs',
          position: 'left',
          label: 'Docs',
        },
        { to: '/demo', label: 'Live Demo', position: 'left' },
        { to: '/playground', label: 'Playground', position: 'left' },
        {
          href: 'https://github.com/homotechsual/docusaurus-plugin-plausible',
          label: 'GitHub',
          position: 'right',
          className: 'github-link',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            { label: 'Introduction', to: '/docs/intro' },
            { label: 'Configuration', to: '/docs/configuration' },
            { label: 'Extensions', to: '/docs/extensions' },
            { label: 'Path Exclusions', to: '/docs/path-exclusions' },
            { label: 'Self-Hosted', to: '/docs/self-hosted' },
          ],
        },
        {
          title: 'Tools',
          items: [
            { label: 'Live Demo', to: '/demo' },
            { label: 'Config Playground', to: '/playground' },
          ],
        },
        {
          title: 'Links',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/homotechsual/docusaurus-plugin-plausible',
            },
            {
              label: 'npm',
              href: 'https://www.npmjs.com/package/@homotechsual/docusaurus-plugin-plausible',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Mikey O'Toole.<br />Built with <a href="https://docusaurus.io">Docusaurus v${DOCUSAURUS_VERSION}</a>.`,
    },
    prism: {
      theme: prismThemes.oneLight,
      darkTheme: prismThemes.oneDark,
    },
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
  } satisfies Preset.ThemeConfig,
}

export default config
