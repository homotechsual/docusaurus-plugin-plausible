export interface FileDownloadsOptions {
  /** Replace the default list of tracked file extensions (e.g. ["pdf", "zip"]) */
  extensions?: string[];
  /** Add to the default tracked file extensions instead of replacing them */
  addExtensions?: string[];
}

export interface EmbedOptions {
  /** Auth token from Plausible → Visibility → Shared links (required) */
  authToken: string;
  /** Route path for the analytics page (default: '/analytics') */
  routeBasePath?: string;
  /** Page heading shown above the iframe (default: 'Analytics') */
  title?: string;
  /** Optional description paragraph shown below the heading */
  description?: string;
}

export interface EmbedData {
  authToken: string;
  domain: string;
  customDomain: string;
  title: string;
  description?: string;
}

export interface PluginOptions {
  /** The domain of your website as configured in Plausible (required) */
  domain: string;
  /** Custom domain for self-hosting Plausible (defaults to "plausible.io") */
  customDomain?: string;
  /** Use hash-based routing instead of History API routing */
  hashBasedRouting?: boolean;
  /** Automatically track clicks on outbound (external) links */
  outboundLinks?: boolean;
  /** Automatically track file downloads, optionally scoped to specific extensions */
  fileDownloads?: boolean | FileDownloadsOptions;
  /** Track custom events on tagged HTML elements via the data-analytics attribute */
  taggedEvents?: boolean;
  /** Track ecommerce revenue */
  revenue?: boolean;
  /** Enable tracking on localhost (useful for development) */
  captureOnLocalhost?: boolean;
  /** Disable automatic pageview tracking — pageviews must be sent manually */
  manualPageviews?: boolean;
  /** Use the compatibility script for browsers that block the standard tracker */
  compat?: boolean;
  /** Attach custom properties to every automatic pageview */
  pageviewProps?: boolean;
  /**
   * Paths to exclude from pageview tracking. Each entry is used as a RegExp
   * pattern (e.g. "^/admin" or "private").
   *
   * NOTE: Pass bare patterns — not regex-literal strings like "/admin/".
   */
  excludePaths?: string[];
  /** Override the API endpoint used to send events (sets data-api on the script tag) */
  proxyApiEndpoint?: string;
  /** Embed a Plausible shared-link dashboard as an automatic page */
  embed?: EmbedOptions;
}
