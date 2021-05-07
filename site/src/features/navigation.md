---
layout: main.njk
title: FicusJS router documentation - Navigation
---
# Navigation

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
