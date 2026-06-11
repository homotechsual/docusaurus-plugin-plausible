# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-06-11

### Added

* Swizzleable `PlausibleDashboard` theme component for embedding Plausible analytics dashboards ([796a915](../../commit/796a915))
* `EmbedOptions` and `EmbedData` types for embed dashboard configuration ([7c33b83](../../commit/7c33b83))
* `getThemePath` and `contentLoaded` lifecycle hooks to support the embed dashboard ([9ff11e4](../../commit/9ff11e4))

### Fixed

* `validateOptions` now returns `id` to satisfy Docusaurus 3.10.1 requirement ([8f3f4a2](../../commit/8f3f4a2))
* Skip initial pageview in `onRouteUpdate` to prevent double-fire on page load ([6fcc064](../../commit/6fcc064))
* Fixed `JSX.Element` return type and augmented `Layout` with `title` and `description` props ([e877c35](../../commit/e877c35))
* Updated iframe height calculation for responsive embed dashboard design ([1bb734b](../../commit/1bb734b))

### Changed

* Switched yarn to `nodeLinker: node-modules` for broader tooling compatibility
* Improved documentation code examples with consistent TypeScript import style

## [1.0.0] - 2026-06-08

### Changed

* Updated `globals` package to version 17.6.0 in `yarn.lock` ([fe6e91d](../../commit/fe6e91d))

## \[0.1.0] - 2026-06-06

* Streamlined CI workflows by removing redundant corepack installation steps ([8a644fe](../../commit/8a644fe))
* Updated Node version to `current` in CI workflows ([06efcd1](../../commit/06efcd1))
* Updated corepack installation in publish workflow ([9d6c642](../../commit/9d6c642))
* Installed corepack globally in CI workflow ([943f2ed](../../commit/943f2ed))
* Updated `actions/checkout` and `actions/setup-node` to v6 ([b623894](../../commit/b623894))
* Updated for Docusaurus v3, converted to TypeScript and reimplemented as an ESM plugin ([050ffdb](../../commit/050ffdb))

## \[0.0.1] - 2021-03-29

* Initial release, forked from [infracost/docusaurus-plugin-plausible](https://github.com/infracost/docusaurus-plugin-plausible)

[Unreleased]: ../../compare/83480db...HEAD

[1.0.0]: ../../releases/tag/v1.0.0
