import { fileURLToPath } from 'url';
import type { LoadContext, OptionValidationContext, Plugin } from '@docusaurus/types';
import type { PluginOptions, EmbedData } from './types.js';

function pluginPlausible(
  _context: LoadContext,
  options: PluginOptions,
): Plugin<void> {
  const {
    domain,
    customDomain = 'plausible.io',
    hashBasedRouting,
    outboundLinks,
    fileDownloads,
    taggedEvents,
    revenue,
    captureOnLocalhost,
    manualPageviews,
    compat,
    pageviewProps,
    excludePaths = [],
    proxyApiEndpoint,
    embed,
  } = options;

  if (!domain) {
    throw new Error(
      'You did not specify the `domain` field in the plugin options.',
    );
  }

  const isProd = process.env.NODE_ENV === 'production';

  const extensions: string[] = [];
  if (hashBasedRouting) extensions.push('hash');
  if (outboundLinks) extensions.push('outbound-links');
  if (fileDownloads) extensions.push('file-downloads');
  if (taggedEvents) extensions.push('tagged-events');
  if (revenue) extensions.push('revenue');
  if (captureOnLocalhost) extensions.push('local');
  if (manualPageviews) extensions.push('manual');
  if (compat) extensions.push('compat');
  if (pageviewProps) extensions.push('pageview-props');

  const scriptName =
    extensions.length > 0
      ? `plausible.${extensions.join('.')}.js`
      : 'plausible.js';

  return {
    name: 'docusaurus-plugin-plausible',

    getThemePath() {
      return fileURLToPath(new URL('./theme', import.meta.url));
    },

    getClientModules() {
      return isProd
        ? [fileURLToPath(new URL('./analytics.js', import.meta.url))]
        : [];
    },

    async contentLoaded({ actions }) {
      if (!embed) return;
      const { addRoute, createData } = actions;
      const dataPath = await createData(
        'embed-options.json',
        JSON.stringify({
          authToken: embed.authToken,
          domain,
          customDomain,
          title: embed.title ?? 'Analytics',
          description: embed.description,
        } satisfies EmbedData),
      );
      addRoute({
        path: embed.routeBasePath ?? '/analytics',
        component: '@theme/PlausibleDashboard',
        exact: true,
        modules: { embedData: dataPath },
      });
    },

    injectHtmlTags() {
      if (!isProd) {
        return {};
      }

      const excludePathsScript =
        excludePaths.length > 0
          ? `window.plausibleExcludePaths=${JSON.stringify(excludePaths)}.map(function(p){return new RegExp(p);});`
          : '';

      const scriptAttributes: Record<string, string | boolean> = {
        async: true,
        defer: true,
        'data-domain': domain,
        src: `https://${customDomain}/js/${scriptName}`,
      };

      if (proxyApiEndpoint) {
        scriptAttributes['data-api'] = proxyApiEndpoint;
      }

      if (fileDownloads && typeof fileDownloads === 'object') {
        if (fileDownloads.extensions) {
          scriptAttributes['file-types'] = fileDownloads.extensions.join(',');
        }
        if (fileDownloads.addExtensions) {
          scriptAttributes['add-file-types'] =
            fileDownloads.addExtensions.join(',');
        }
      }

      return {
        headTags: [
          {
            tagName: 'link',
            attributes: {
              rel: 'preconnect',
              href: `https://${customDomain}`,
            },
          },
          {
            tagName: 'script',
            attributes: scriptAttributes,
          },
          {
            tagName: 'script',
            innerHTML: `window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) };${excludePathsScript}`,
          },
        ],
      };
    },
  };
}

export function validateOptions({
  options,
}: OptionValidationContext<unknown, PluginOptions>): PluginOptions {
  const opts = options as Record<string, unknown>;
  if (!opts || typeof opts !== 'object') {
    throw new Error('[docusaurus-plugin-plausible] Plugin options must be an object.');
  }
  if (typeof opts['domain'] !== 'string' || !opts['domain']) {
    throw new Error('[docusaurus-plugin-plausible] You must specify the `domain` option.');
  }
  return opts as unknown as PluginOptions;
}

// Cast to satisfy Docusaurus's PluginModule<unknown> — options are validated
// before this function is called so the cast is safe at runtime.
export default pluginPlausible as unknown as (
  context: LoadContext,
  options: unknown,
) => Plugin<void>;

export type { PluginOptions };
