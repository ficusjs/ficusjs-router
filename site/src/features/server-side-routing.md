---
layout: main.njk
title: FicusJS router documentation - Server-side routing
---
# Server-side routing

If you are using the `history` routing mode, the router uses the [HTML History API](https://developer.mozilla.org/en-US/docs/Web/API/History) to handle client-side routing. This breaks when the user refreshes a URL that isn't handled server-side.
To ensure the client can handle the URL, you need server-side logic to route to the client.

For example, when using NodeJS and Express:

```js
app.get('*', function (req, res) {
  res.sendFile(__dirname + '/index.html')
})
```

## Full page reloads

If the browser reloads to a route that is not at root level, for example; `/user/matt/tasks`, the browser will need to load resources relative to the root.
To ensure this happens, add a base tag to the head of your index page:

```html
<head>
  <base href="/">
  <!-- other head tags come after this -->
</head>
```
