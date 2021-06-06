---
layout: main.njk
title: FicusJS router documentation - Guards
---
# Guards

You can guard navigations either by redirecting it or canceling it using the

## Global guards

You can use the `resolveRoute` option to redirect a route or cancel it:

```js
{
  resolveRoute (context, params) {
    // do some logic here
    return { redirect: '/login' }
  }
}
```

## Route guards

You can redirect from a route by returning a redirect object from the action function:

```js
const routes = [
  {
    path: '/redirect',
    action () {
      return { redirect: '/target' } // <== request a redirect
    }
  },
  {
    path: '/admin',
    action(context) {
      if (!context.user) {
        return { redirect: '/login' }
      }
      return 'admin-page'
    }
  }
]
```
