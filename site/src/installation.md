---
layout: main.njk
title: FicusJS router documentation - Installation
---
# Installation

FicusJS router can be installed in a number of ways.

## CDN

We recommend using native ES modules in the browser.

```html
<script type="module">
  import { createRouter, getRouter } from 'https://cdn.skypack.dev/@ficusjs/router@2'
</script>
```

FicusJS router is available on [Skypack](https://www.skypack.dev/view/@ficusjs/router).

## NPM

FicusJS router works nicely with build tools such as Webpack or Rollup. If you are using a NodeJS tool, you can install the NPM package.

```bash
npm install @ficusjs/router
```

## Available builds

FicusJS router is only available as an ES module. For legacy browsers or alternative modules such as CommonJS, it is recommended to use a build tool to transpile the code.

The following builds are available.

- `dist/router.mjs`
