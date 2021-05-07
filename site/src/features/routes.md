---
layout: main.njk
title: FicusJS router documentation - Routes
---
# Routes

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

## Adding routes dynamically

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

## Nested routes

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
