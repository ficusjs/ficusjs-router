# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.4.1] - 2023-07-31

### Updates
- Uplift devDependencies

## [3.4.0] - 2022-10-25

### Updates
- Generate sourcemaps on build

## [3.3.2] - 2022-10-25

### Updates
- Uplift devDependencies

## [3.3.1] - 2022-10-18

### Fixes
- Fix `addMatcherToRoute` issue with slashes

## [3.3.0] - 2022-10-18

### New
- Export `addMatcherToRoute` function for adding a matcher to a route

## [3.2.0] - 2022-10-02

### New
- Emit `outlet-change` event when an outlet is populated

### Updates
- Uplift devDependencies
- Convert e2e tests to Cypress v10.x

## [3.1.1] - 2021-11-16

### Fixes
- Fix types for `createRouter` function

## [3.1.0] - 2021-10-20

### Updates
- Add `sideEffects` to package.json
- Uplift devDependencies

## [3.0.0] - 2021-06-10

### Breaking
- Make package `type: module`
- Rename build file to `router.mjs`

### New
- Allow routes to be cancelled

### Updates
- Add guards to documentation
- Uplift NPM dependencies

## [2.2.0] - 2021-05-07

### New
- Allow `sticky` attribute for persistent named outlets

## [2.1.0] - 2021-04-29

### Updates
- Uplift NPM dev dependencies

## [2.0.2] - 2021-03-04

### Fixes
- Missing package.json properties

## [2.0.1] - 2021-03-04

### Fixes
- Add exports map to package.json

### Updates
- Uplift dev dependencies

## [2.0.0] - 2021-02-06

### Changed
- Rename package to @ficusjs/router

## [1.1.2] - 2020-10-06

### Fixed
- Wait for child outlets before continuing render

## [1.1.1] - 2020-10-06

### Fixed
- Ensure an outlet is clear before rendering contents

## [1.1.0] - 2020-09-30

### Fixed
- Rename private properties

### Added
- Cache outlets to avoid re-rendering the same content

## [1.0.0] - 2020-09-29

- Initial release

## [0.1.0] - 2020-09-29

- Beta release
