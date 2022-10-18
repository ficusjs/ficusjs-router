---
layout: main.njk
title: FicusJS router documentation - addMatcherToRoute function
---
# addMatcherToRoute function

The `addMatcherToRoute` function adds a matcher to a route to match a URL with parameters.

```js
const route = {
  path: '/hello/:username',
  async action({ params }) {
    const resp = await window.fetch(`/api/users/${params.username}`)
    const user = await resp.json()
    if (user) return `<hello-page user="${user.displayName}"></hello-page>`
    return 'hello-page'
  }
}

const routeWithMatcher = addMatcherToRoute(route)

// check a route that contains a username
const url = '/hello/john'
const params = routeWithMatcher.matcher(url)
// params = { username: 'john' }
```
