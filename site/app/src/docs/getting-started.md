---
layout: doc.hbs
title: FicusJS router documentation - Getting started
---
# Getting started

The easiest way to try out FicusJS router is using a simple example.

Create an `index.html` file and copy the following between the `<body>` tags.

```html
<top-nav></top-nav>
<div id="router-outlet"></div>

<script type="module">
import { createRouter } from 'https://cdn.skypack.dev/@ficusjs/router'
import { createComponent } from 'https://cdn.skypack.dev/ficusjs'
import { renderer, html } from 'https://cdn.skypack.dev/@ficusjs/renderers/dist/lit-html.js'

createComponent('home-page', {
  renderer,
  render () {
    return html`<div>Welcome to the home page!</div>`
  }
})

createComponent('page-one', {
  renderer,
  render () {
    return html`<div>Welcome to the page one!</div>`
  }
})

createComponent('page-two', {
  renderer,
  render () {
    return html`<div>Welcome to the page two!</div>`
  }
})

const router = createRouter([
  { path: '', component: 'home-page' },
  { path: '/one', component: 'page-one' },
  { path: '/two', component: 'page-two' }
], '#router-outlet', { mode: 'hash' })

createComponent('top-nav', {
  renderer,
  navigateTo (path) {
    router.push(path)
  },
  render () {
    return html`
      <nav>
        <ul>
          <li><button type="button" @click="${() => this.navigateTo('/')}">Home</button></li>
          <li><button type="button" @click="${() => this.navigateTo('/one')}">Page one</button></li>
          <li><button type="button" @click="${() => this.navigateTo('/two')}">Page two</button></li>
        </ul>
      </nav>
    `
  }
})
</script>
```

> Alternatively, fork this Codepen to see it in action - [https://codepen.io/ducksoupdev/pen/PoNvGwK](https://codepen.io/ducksoupdev/pen/PoNvGwK)

The example creates a set of page components, a page navigation component and a new router using hash mode.
