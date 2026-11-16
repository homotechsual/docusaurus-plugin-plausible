import { themes as prismThemes } from 'prism-react-renderer'
import type { Config } from '@docusaurus/types'
import type * as Preset from '@docusaurus/preset-classic'
import { DOCUSAURUS_VERSION } from '@docusaurus/utils'
import plausiblePlugin, { type PluginOptions as PlausiblePluginOptions } from '@homotechsual/docusaurus-plugin-plausible'
import npm2yarn from '@docusaurus/remark-plugin-npm2yarn'

const config: Config = {
  title: 'Plausible for Docusaurus',
  tagline: 'Add Plausible Analytics to your Docusaurus site',
  favicon: 'img/favicon.svg',
  url: 'https://plausible.docusaurus.homotechsual.dev',
  baseUrl: '/',
  onBrokenLinks: 'warn',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  plugins: [
    [
      plausiblePlugin,
      {
        domain: 'plausible.docusaurus.homotechsual.dev',
        embed: {
          authToken: process.env.PLAUSIBLE_SHARED_LINK_TOKEN ?? '',
          routeBasePath: '/analytics',
          title: 'Live Analytics',
          description: 'Visitor statistics for this demo site, provided by Plausible.',
        },
      } satisfies PlausiblePluginOptions,
    ],
  ],
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          remarkPlugins: [
            [
              npm2yarn,
              {
                converters: ['yarn', 'pnpm', 'bun'],
                sync: true,
              },
            ],
          ],
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
      logo: { alt: 'Plausible', src: 'img/favicon.svg' },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docs',
          position: 'left',
          label: 'Docs',
        },
        { to: '/demo', label: 'Live Demo', position: 'left' },
        { to: '/playground', label: 'Playground', position: 'left' },
        { to: '/analytics', label: 'Analytics', position: 'left' },
        {
          label: 'More Projects',
          position: 'right',
          items: [
            { label: 'OpenGraph', href: 'https://og.docusaurus.homotechsual.dev/' },
            { label: 'FAQs', href: 'https://faqs.docusaurus.homotechsual.dev/' },
            { label: 'Showcase', href: 'https://showcase.docusaurus.homotechsual.dev/' },
            { label: 'Waypoint', href: 'https://waypoint.docusaurus.homotechsual.dev/' },
            { label: 'All Projects', href: 'https://docs.homotechsual.dev/' },
          ],
        },
        {
          href: 'https://github.com/sponsors/homotechsual',
          html: '<span class="navbar__action-label">Sponsor</span>',
          'aria-label': 'Sponsor',
          title: 'Sponsor',
          position: 'right',
          className: 'sponsorship-link',
        },
        {
          href: 'https://github.com/homotechsual/docusaurus-plugin-plausible',
          html: '<span class="navbar__action-label">GitHub</span>',
          'aria-label': 'GitHub',
          title: 'GitHub',
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
            { label: 'Analytics', to: '/analytics' },
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
            { label: 'Other Projects', href: 'https://docs.homotechsual.dev/' },
          ],
        },
        {
          title: 'Docusaurus projects',
          items: [
            { label: 'OpenGraph', href: 'https://og.docusaurus.homotechsual.dev/' },
            { label: 'FAQs', href: 'https://faqs.docusaurus.homotechsual.dev/' },
            { label: 'Showcase', href: 'https://showcase.docusaurus.homotechsual.dev/' },
            { label: 'Plausible', href: 'https://plausible.docusaurus.homotechsual.dev/' },
            { label: 'Waypoint', href: 'https://waypoint.docusaurus.homotechsual.dev/' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Mikey O'Toole.<br />Built with <a href="https://docusaurus.io">Docusaurus v${DOCUSAURUS_VERSION}</a>.<br /><span class="designedBy">Designed with <svg xmlns="http://www.w3.org/2000/svg" class="heart" role="img" aria-label="love" width="24" height="24" viewBox="0 0 24 24"><path d="M14 20.408c-.492.308-.903.546-1.192.709-.153.086-.308.17-.463.252h-.002a.75.75 0 01-.686 0 16.709 16.709 0 01-.465-.252 31.147 31.147 0 01-4.803-3.34C3.8 15.572 1 12.331 1 8.513 1 5.052 3.829 2.5 6.736 2.5 9.03 2.5 10.881 3.726 12 5.605 13.12 3.726 14.97 2.5 17.264 2.5 20.17 2.5 23 5.052 23 8.514c0 3.818-2.801 7.06-5.389 9.262A31.146 31.146 0 0114 20.408z"/></svg> by <a href="https://homotechsual.dev">homotechsual</a></span>`,
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
