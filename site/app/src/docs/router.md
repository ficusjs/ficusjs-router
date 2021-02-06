---
layout: doc.hbs
title: FicusJS router documentation - Router
---
# Router

For multiple page applications, this simple client-side router is responsible for traversing a list of routes, finding the first matching route by string path, rendering any HTML returned from that route's action method into an outlet within the application.

**The router is a singleton - this ensures only one router instance exists as it controls page navigation.**

## Example

Import the router creator function into your Javascript main file:

**main.js**

```js
// import the createRouter function
import { createRouter } from 'https://cdn.skypack.dev/@ficusjs/router'

// create list of routes
const routes = [
  { path: '/one', component: 'page-one' },
  { path: '/two', component: 'page-two' }
]

// Create a new router instance using the element selector as the router outlet
const router = createRouter(routes, '#router-outlet')
```

## `createRouter` function

Create your router instance using `createRouter` passing an array of routes and an element selector as the router outlet:

```js
// create list of routes
const routes = [
  // routes defined here
]

const router = createRouter(routes, '#router-outlet')
```

When using the `createRouter` function, the following arguments can be passed:

| Argument | Type | Required | Description                                                                                                                                                                              |
| --- | --- | --- | --- |
| `routes` | `Array` | yes | An array of routes |
| `rootOutletSelector` | `String` | yes | A CSS selector for the main router outlet |
| `options` | `Object` | | An optional set of options. See [options](#options) |

## `getRouter` function

The `getRouter` function is a quick way to retrieve the router instance.

```js
// import the function
import { getRouter } from 'https://cdn.skypack.dev/ficusjs'

// use it within a component
createComponent('my-page-component', {
  navigateTo (url) {
    getRouter().push(url)
  }
})
```

## Routes

Each route is a plain JavaScript object having `path` and either `component` or `action` properties.

A route `component` is a tag string for a component. For example; `my-page-component`.

```js
{ path: '/one', component: 'page-one' }
```

A route `action` must be a function that returns a string for a component or a `Promise` that resolves a string for a component.
The string can contain props that are passed to the component. For example:

```js
// render the page component with tag <page-one>
{ path: '/one', action: () => 'page-one' }
{ path: '/one', action: () => '<page-one></page-one>' } // same as above

// use the route params to render the component with props
{ path: '/one', action: (context, params) => `<page-one title="${params.title}" user="${context.user}"></page-one>` }
```

The `action` function receives `context` and `params` arguments when the route matches, and the action function invoked:

```js
const routes = [
  { path: '/one', action: (context, params) => `<page-one title=${params.title} user=${context.user}></page-one>` }
]
```

- `context` is an object with any data you want to pass to an action (see [Options](#options) below)
- `params` is a key/value object containing URL and query string parameters matched for the route

You can define an action using different ES6 flavours:

```js
{
  path: '/',
  action: () => 'home-page' // inline fat-arrow function
}
{
  path: '/one',
  action () { // shortcut function declaration
    return 'page-one'
  }
}
```

### Adding routes dynamically

Dynamically add more routes to the router using the `addRoutes` method.
The argument must be an `Array` using the same route format.

```js
// create list of routes
const routes = [
  { path: '/one', component: 'page-one' },
  { path: '/two', component: 'page-two' }
]

const router = createRouter(routes, '#router-outlet')

// some time later
router.addRoutes([
  { path: '/three', component: 'page-three' },
  { path: '/four', action: () => `<page-four show-menu="true"></page-four>` }
])
```

### Nested routes

Each route may have an optional `children: [ ... ]` property containing the list of child routes:

```js
const routes = [
  {
    path: '/admin',
    children: [
      {
        path: '',                        // www.example.com/admin
        component: 'admin-page'
      },
      {
        path: '/users',
        children: [
          {
            path: '',                    // www.example.com/admin/users
            component: 'user-list-page'
          },
          {
            path: '/:username',          // www.example.com/admin/users/john
            action: (context, { username }) => `<user-profile-page username="${username}"></user-profile-page>`
          }
        ]
      }
    ]
  }
]
```

## Options

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

### Setting options

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

### Modes

There are two modes of routing available - `history` and `hash`.

#### History routing

A router that uses the HTML5 history API (`pushState`, `replaceState` and the `popstate` event) to keep your UI in sync with the URL.

#### Hash routing

A router that uses the hash portion of the URL (i.e. `window.location.hash`) to keep your UI in sync with the URL.

### Starting programmatically

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

## URL Parameters

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

## Context

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
- `params` - Matched path and query string params, see [URL Parameters](#url-parameters) section above for details

## Async Routes

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

## Redirects

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

## Outlet

The router outlet acts as a placeholder that marks the spot where the router should display the components for that outlet.

```html
<div id="router-outlet"></div>
```

Given the routes above, when the browser URL for this application becomes `/one`, the router matches that URL to the route path `/one` and displays the `<page-one>` component as a sibling to the `<div id="router-outlet">`.

### Named outlets

Views can contain child outlets allowing components to be composed in the view dynamically based on route.

```html
<div id="outlet-sidebar"></div>
```

Routes can contain `outlets` that map named outlets to components:

```js
const routes = [
  {
    path: '/hello/:username',
    action (context) {
      // this component contains a <div id="outlet-sidebar"></div> outlet
      return `<hello-page username="${context.params.username}"></hello-page>`
    },
    outlets: {
      '#outlet-sidebar': (context) => `<sidebar-contents username="${context.params.username}"></sidebar-contents>`
    }
  }
]
```

The `outlets` object keys are CSS selectors that match an element in your view.
Each value must be a function that returns a string for a component or a `Promise` that resolves a string for a component.

Multiple outlets of the same name can exist and will be rendered with the same template. This is useful for displaying the same component in different locations - such as a mobile and desktop view.

```js
const routes = [
  {
    path: '/hello/:username',
    action (context) {
      // this component contains a <div class="outlet-sidebar"></div> outlet
      return `<hello-page username="${context.params.username}"></hello-page>`
    },
    outlets: {
      '.outlet-sidebar': (context) => `<sidebar-contents username="${context.params.username}"></sidebar-contents>`
    }
  }
]
```

#### `resolveRoute`

The `resolveRoute` option can return an object containing `template` and `outlets` properties:

```js
{
  resolveRoute (context, params) {
    return {
      template: context.route.action(context, params), // call an existing route action for a template
      outlets: {
        '#bar': () => 'bar-contents'
      }
    }
  }
}
```

## Navigation

`router` instances can be used to programmatically change the current location using the following methods:

- `router.push(path, [state])`
- `router.replace(path, [state])`
- `router.go(n)`
- `router.goBack()`
- `router.goForward()`

When using `push` or `replace` you can either specify both the URL path and state as separate arguments or include everything in a single location-like object as the first argument.

1. A URL path _or_
2. A location-like object with `{ pathname, search, hash, state }`

```js
// Go to the /home route
router.push('/home')

// Go to the /home route with a query string
// and some state. Location state does not appear in the URL.
router.push('/home?the=query', { some: 'state' })

// If you prefer, use a single location-like object to specify both
// the URL and state. This is equivalent to the example above.
router.push({
  pathname: '/home',
  search: '?the=query',
  state: { some: 'state' }
})

// Go back to the previous history entry. The following
// two lines are synonymous.
router.go(-1)
router.goBack()
```

Please note; calling `router.push(path)` with a path that matches the current URL will be ignored.

## Location

To retrieve the current location, use the `location` property:

```js
router.location // retrieve the location
router.location.state // retrieve the location state
```

## Lazy load views

To lazy load a view you can use the native ES6 import `import('/path/to/script.js')` within your route action:

```js
{
  path: '',
  action: () => import('./views/home.js').then(() => 'home-page')
}
```

## Server-side routing

If you are using the `history` routing mode, the router uses the [HTML History API](https://developer.mozilla.org/en-US/docs/Web/API/History) to handle client-side routing. This breaks when the user refreshes a URL that isn't handled server-side.
To ensure the client can handle the URL, you need server-side logic to route to the client.

For example, when using NodeJS and Express:

```js
app.get('*', function (req, res) {
  res.sendFile(__dirname + '/index.html')
})
```

### Full page reloads

If the browser reloads to a route that is not at root level, for example; `/user/matt/tasks`, the browser will need to load resources relative to the root.
To ensure this happens, add a base tag to the head of your index page:

```html
<head>
  <base href="/">
  <!-- other head tags come after this -->
</head>
```
