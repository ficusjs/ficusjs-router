---
layout: main.njk
title: FicusJS router documentation - Context
---
# Context

In addition to a URL path string, any arbitrary data can be passed to a route action method.

```js
const routes = [
  { path: '/hello', action: (context) => `<hello-page user="${context.user}"></hello-page>` }
]
const options = {
  context: { user: 'admin' }
}

const router = createRouter(routes, '#router-outlet', options)
```

Router always adds the following parameters to the `context` object
before passing it to the `resolveRoute` function:

- `router` - Current router instance
- `route` - Matched route object
- `path` - Matched path
- `params` - Matched path and query string params, see [URL Parameters](/features/url-parameters) section above for details
