import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

declare global {
  interface Window {
    plausible: ((event: string, ...args: unknown[]) => void) & {
      q?: unknown[][];
    };
    plausibleExcludePaths?: RegExp[];
  }
}

interface RouteUpdateArgs {
  location: Location;
  previousLocation: Location | null;
}

export default (function () {
  if (!ExecutionEnvironment.canUseDOM) {
    return null;
  }

  return {
    onRouteUpdate({ location }: RouteUpdateArgs): void {
      const pathIsExcluded =
        location != null &&
        typeof window.plausibleExcludePaths !== 'undefined' &&
        window.plausibleExcludePaths.some((rx) => rx.test(location.pathname));

      if (pathIsExcluded) {
        return;
      }

      window.plausible('pageview');
    },
  };
})();
