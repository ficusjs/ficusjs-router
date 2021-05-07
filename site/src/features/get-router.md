---
layout: main.njk
title: FicusJS router documentation - getRouter function
---
# getRouter function

The `getRouter` function is a quick way to retrieve the router instance.

```js
// import the function
import { getRouter } from 'https://cdn.skypack.dev/@ficusjs/router@2'

// use it within a component
createComponent('my-page-component', {
  navigateTo (url) {
    getRouter().push(url)
  }
})
```
