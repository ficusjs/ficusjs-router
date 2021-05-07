---
layout: main.njk
title: FicusJS router documentation - URL parameters
---
# URL Parameters

**Named route parameters** are captured and added to `context.params`.

```js
const routes = [
  { path: '/hello/:username', action: (context) => `<hello-page username="${context.params.username}"></hello-page>` }
]

const router = createRouter(routes, '#router-outlet')
```

Alternatively, captured parameters can be accessed via the second argument
to an action method like so:

```js
const routes = [
  { path: '/hello/:username', action: (context, { username }) => `<hello-page username="${username}"></hello-page>` }
]

const router = createRouter(routes, '#router-outlet')
```

Query string and hash parameters will be added to `context.params` for convenience.
