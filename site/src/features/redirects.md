---
layout: main.njk
title: FicusJS router documentation - Redirects
---
# Redirects

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

You can also use the `resolveRoute` option to redirect a route:

```js
{
  resolveRoute (context, params) {
    // do some logic here
    return { redirect: '/login' }
  }
}
```
