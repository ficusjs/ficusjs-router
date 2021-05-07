---
layout: main.njk
title: FicusJS router documentation - Async routes
---
# Async Routes

The router works great with asynchronous functions out of the box:

```js
const routes = [
  {
    path: '/hello/:username',
    async action({ params }) {
      const resp = await window.fetch(`/api/users/${params.username}`)
      const user = await resp.json()
      if (user) return `<hello-page user="${user.displayName}"></hello-page>`
      return 'hello-page'
    },
  }
]

const router = createRouter(routes, '#router-outlet')
```

Alternatively, stick to Promises:

```js
const routes = [
  {
    path: '/hello/:username',
    action ({ params }) {
      return window.fetch(`/api/users/${params.username}`)
        .then(resp => resp.json())
        .then(user => user ? `<hello-page user="${user.displayName}"></hello-page>` : 'hello-page')
    }
  }
]

const router = createRouter(routes, '#router-outlet')
```
