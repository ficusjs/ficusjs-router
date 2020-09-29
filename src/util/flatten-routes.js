class Stack extends Array {
  peek () {
    return this[this.length - 1]
  }
}

function flatten (stack, parentRouteStack, routes, clearParentRouteStack = true) {
  routes.forEach(route => {
    if (route.children) {
      flattenChildren(stack, parentRouteStack, route)
    } else {
      const nr = copyRouteAndAdjustPath(route, parentRouteStack)
      stack.push(nr)
    }
    if (clearParentRouteStack) {
      parentRouteStack.splice(0, parentRouteStack.length)
    }
  })
}

export function flattenRoutes (routes) {
  const stack = new Stack()
  const parentRouteStack = new Stack()
  flatten(stack, parentRouteStack, routes)
  return stack
}

function flattenChildren (stack, parentRouteStack, route) {
  let children = [...route.children]
  let newRoute
  if (route.action || route.component) {
    newRoute = { ...route }
    delete newRoute.children
  } else {
    const emptyRoute = children.find(r => r.path === '')
    if (emptyRoute) {
      newRoute = { ...emptyRoute }
      newRoute.path = route.path
      delete newRoute.children
      children = children.filter(r => r.path !== '')
    }
  }
  const nr = copyRouteAndAdjustPath(newRoute, parentRouteStack)
  stack.push(nr)
  parentRouteStack.push(nr)
  flatten(stack, parentRouteStack, children, false)
}

function copyRouteAndAdjustPath (route, parentRouteStack) {
  const nr = { ...route }
  const last = parentRouteStack.peek()
  if (last) {
    nr.path = `${last.path}${nr.path}`
  }
  return nr
}
