# FicusJS router

<img src="img/ficus-icon.svg" alt="FicusJS" width="150" align="right">

Lightweight standalone client-side router that supports history and hash routing.

## Features

- Declarative route set-up
- Two modes of routing - history and hash
- Routes render web components or HTML strings
- Routes can be sync or async
- Provide context to routes
- Handle redirects from routes
- Named URL parameters
- Guard navigations by redirecting or cancelling
- Outlets act as placeholders for rendering content per route
- Control navigation with methods
- Lazy load views based on route
- Start router programatically

## Documentation

See the [full documentation](https://router.ficusjs.org).

## Getting started

The easiest way to try out FicusJS router is using a simple example.

Create an `index.html` file and copy the following between the `<body>` tags.

```html
<top-nav></top-nav>
<div id="router-outlet"></div>

<script type="module">
import { createRouter } from 'https://cdn.skypack.dev/@ficusjs/router@3'
import { createComponent } from 'https://cdn.skypack.dev/ficusjs@3'
import { renderer, html } from 'https://cdn.skypack.dev/@ficusjs/renderers@4/lit-html'

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

## Installation

FicusJS router can be installed in a number of ways.

### CDN

We recommend using native ES modules in the browser.

```html
<script type="module">
  import { createRouter, getRouter } from 'https://cdn.skypack.dev/@ficusjs/router@3'
</script>
```

FicusJS router is available on [Skypack](https://www.skypack.dev/view/@ficusjs/router).

### NPM

FicusJS router works nicely with build tools such as Webpack or Rollup. If you are using a NodeJS tool, you can install the NPM package.

```bash
npm install @ficusjs/router
```

### Available builds

FicusJS router is only available as an ES module. For legacy browsers or alternative modules such as CommonJS, it is recommended to use a build tool to transpile the code.

## Development

How to set-up FicusJS router for local development.

1. Clone the repository:

```bash
git clone https://github.com/ficusjs/ficusjs-router.git
```

2. Change the working directory

```bash
cd ficusjs-router
```

3. Install dependencies

```bash
npm install # or, yarn install
```

4. Run the local development server

```bash
npm run dev # or, yarn dev
```

That's it! Now open http://localhost:8080 to see a local app.

## License

This project is licensed under the MIT License - see the [`LICENSE`](LICENSE) file for details.

## Contributing to FicusJS router

Any kind of positive contribution is welcome! Please help us to grow by contributing to the project.

If you wish to contribute, you can work on any features you think would enhance the library. After adding your code, please send us a Pull Request.

> Please read [CONTRIBUTING](CONTRIBUTING.md) for details on our [CODE OF CONDUCT](CODE_OF_CONDUCT.md), and the process for submitting pull requests to us.

## Support

We all need support and motivation. FicusJS is not an exception. Please give this project a ⭐️ to encourage and show that you liked it. Don't forget to leave a star ⭐️ before you move away.

If you found the library helpful, please consider [sponsoring us](https://github.com/sponsors/ficusjs).
