---
layout: main.njk
title: FicusJS router documentation - Guards
---
# Guards

You can guard navigations either by redirecting it or cancelling it.

## Global guards

You can use the `resolveRoute` option to redirect a route or cancel it:

```js
{
  resolveRoute (context, params) {
    // request a redirect
    return { redirect: '/login' }

    // cancel a route
    return false
  }
}
```

## Route guards

You can redirect or cancel a route from the action function:

```js
const routes = [
  {
    path: '/redirect',
    action () {
      return { redirect: '/target' } // <== request a redirect
    }
  },
  {
    path: '/cancelled',
    action () {
      return false
    }
  }
]
```
