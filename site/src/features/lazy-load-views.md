---
layout: main.njk
title: FicusJS router documentation - Lazy load views
---
# Lazy load views

To lazy load a view you can use the native ES6 import `import('/path/to/script.js')` within your route action:

```js
{
  path: '',
  action: () => import('./views/home.js').then(() => 'home-page')
}
```
