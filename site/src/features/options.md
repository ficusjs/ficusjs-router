---
layout: main.njk
title: FicusJS router documentation - Options
---
# Options

You can pass an `options` object to the `createRouter` function to provide additional router configuration and context.

You can provide the following options:

| Property | Required | Default | Type | Description                                                                                                                                                                              |
| --- | --- | --- | --- | --- |
| `mode` | | `history` | `string` | The type of URL routing to use - `history` or `hash`. The default is `history` which requires a back-end to serve the application. A `hash` router uses hashes in the URL to route and doesn't require a server back-end |
| `autoStart` | | `true` | `boolean` | Indicate if the router should auto-start. The default is `true`. If `false` is set, the `start()` method must be called to start the router |
| `changeHistoryState` | | `true` | `boolean` | Indicate if the router should change the browser session history stack using `window.history.replaceState` and `window.history.pushState`. The default is `true` |
| `warnOnMissingOutlets` | | `false` | `boolean` | Indicate if the router should log a `console.warn` if a named outlet cannot be found. The default is `false` |
| `context` | | | `object` | `context` is an object with any data which you want to pass to `resolveRoute` function or an `action` function for a matched route |
| `resolveRoute` | | | `function` | `resolveRoute` is a function for any custom route handling logic. For example you can define this option to work with routes in declarative manner. To render a route, this function must return either an HTML template or a `Promise` that resolves an HTML template. If `undefined` is returned, the router will attempt to match a route and call the `action` function if one is found |
| `errorHandler` | | | `function` | `errorHandler` is a function for global error handling. Called with `error` and `context` arguments every time the route is not found or throws an error. This must return either an HTML template or a `Promise` that resolves an HTML template to be rendered when an error occurs |

Pass the `options` object to the `createRouter` function:

```js
const routes = [
  { path: '', action: (context) => `<home-page user=${context.user}></home-page>` },
  { path: '/one', action: (context) => `<page-one title=${context.params.title}></page-one>` },
  { path: '/two', action: (context, params) => `<page-two title=${params.title}></page-two>` }
]

function logErrorAndRender (error) {
  return new Promise((resolve, reject) => {
    window.fetch('/error-logger', {
      method: 'POST',
      data: JSON.stringify(error),
      headers: {
        'Content-type': 'application/json'
      }
    })
    .then(() => resolve('page-error'))
    .catch(e => resolve(`<page-error logger-error=${e.message}></page-error>`))
  })
}

const options = {
  context: { user: null },
  resolveRoute (context, params) {
    if (typeof context.route.action === 'function') {
      return context.route.action(context, params)
    }
    return undefined
  },
  errorHandler (error, context) {
    console.error(error)
    console.info(context)
    return error.status === 404
      ? 'page-not-found'
      : logErrorAndRender(error)
  }
}

const router = createRouter(routes, '#router-outlet', options)
```

## Setting options

You can set options at any time using the `setOptions` method on the router instance.

For example, this allows you to use a store as part of the router options after the store and router instances have been created.

```js
const router = createRouter(routes, '#router-outlet')
const store = getStore('an-example-store')

// some time later
router.setOptions({
  ...router.options, // get the existing options from the router
  resolveRoute (context, params) {
    if (context.path === '/logout') {
      store.dispatch('setUserLoggedIn', false)
      return { redirect: '/' }
    }
  },
  errorHandler (error, context) {
    console.error(error)
    console.info(context)
    return error.status === 404
      ? 'page-not-found'
      : logErrorAndRender(error)
  }
})
```
