---
layout: main.njk
title: FicusJS router documentation - Example
---
# Example

Import the router creator function into your Javascript main file:

**main.js**

```js
// import the createRouter function
import { createRouter } from 'https://cdn.skypack.dev/@ficusjs/router@3'

// create list of routes
const routes = [
  { path: '/one', component: 'page-one' },
  { path: '/two', component: 'page-two' }
]

// Create a new router instance using the element selector as the router outlet
const router = createRouter(routes, '#router-outlet')
```
