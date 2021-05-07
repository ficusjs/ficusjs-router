---
layout: main.njk
title: FicusJS router documentation - Outlets
---
# Outlets

The router outlet acts as a placeholder that marks the spot where the router should display the components for that outlet.

```html
<div id="router-outlet"></div>
```

Given the routes above, when the browser URL for this application becomes `/one`, the router matches that URL to the route path `/one` and displays the `<page-one>` component as a sibling to the `<div id="router-outlet">`.

## Root outlet

A root outlet is mandatory when creating a router instance using the [`createRouter` function](/features/create-router).

## Child outlets

Views can contain child outlets allowing components to be composed in the view dynamically based on route.

```html
<div id="outlet-sidebar"></div>
```

Routes can contain `outlets` that map outlets to components:

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

### Sticky child outlets

By default, URL changes clear outlets ready for new routes to render content. Setting a child outlet to sticky prevents this behaviour which means the contents only get replaced if a route defines an outlet that replaces the content.

To make an outlet sticky, simply add the `sticky` attribute to the outlet element.

```html
<div id="outlet-sidebar" sticky></div>
```

### `resolveRoute`

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
