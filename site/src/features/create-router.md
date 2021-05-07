---
layout: main.njk
title: FicusJS router documentation - createRouter function
---
# createRouter function

Create your router instance using the `createRouter` function passing an array of routes and an element selector as the router outlet:

```js
// import the function
import { createRouter } from 'https://cdn.skypack.dev/@ficusjs/router@2'

// create list of routes
const routes = [
  // routes defined here
]

const router = createRouter(routes, '#router-outlet')
```

When using the `createRouter` function, the following arguments can be passed:

| Argument | Type | Required | Description                                                                                                                                                                              |
| --- | --- | --- | --- |
| `routes` | `Array` | yes | An array of routes |
| `rootOutletSelector` | `String` | yes | A CSS selector for the main router outlet |
| `options` | `Object` | | An optional set of options. See [options](#options) |
