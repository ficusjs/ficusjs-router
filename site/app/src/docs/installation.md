---
layout: doc.hbs
title: FicusJS router documentation - Installation
---
# Installation

FicusJS router can be installed in a number of ways.

## CDN

We recommend using native ES modules in the browser.

```html
<script type="module">
  import { createRouter, getRouter } from 'https://unpkg.com/ficusjs-router?module'
</script>
```

You can browse the source of the NPM package at [cdn.jsdelivr.net/npm/ficusjs-router](https://cdn.jsdelivr.net/npm/ficusjs-router/).

FicusJS router is also available on [unpkg](https://unpkg.com/browse/ficusjs-router/).

## NPM

FicusJS router works nicely with build tools such as Webpack or Rollup. If you are using a NodeJS tool, you can install the NPM package.

```sh
npm install ficusjs-router
```

## Available builds

FicusJS router is only available as an ES module. For legacy browsers or alternative modules such as CommonJS, it is recommended to use a build tool to transpile the code.

The following builds are available.

- [Route](docs/router) `dist/router.js`
