---
layout: main.njk
title: FicusJS router documentation - Starting programmatically
---
# Starting programmatically

By default, the router will auto-start. This adds a listener to the History API to handle URL changes.

If you want to programmatically start the router you can call the `start()` method on the router instance.
You can optionally pass a location object or string path to the start method too for that route to be rendered.

```js
// create a router but do not auto-start
const router = createRouter(routes, '#router-outlet', { autoStart: false })

// some time later
router.start()

// you can pass a location object or string path to the start method too for that route to be rendered
router.start('/home')
```
