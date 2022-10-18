import { stripTrailingSlash } from './slashes.mjs'

export function addMatcherToRoute (route) {
  const newRoute = {
    ...route,
    matcher: (path) => {
      return stripTrailingSlash(route.path) === stripTrailingSlash(path) ? path : undefined
    }
  }
  if (route.component && !route.action) newRoute.action = () => route.component
  if (/:[^/]+/.test(route.path)) {
    const keys = route.path.match(/(:[^/]+)/gm)
    if (keys && keys.length > 0) {
      newRoute.urlParamKeys = keys.map(k => k.substring(1))
    }
    const pathRegexStr = stripTrailingSlash(route.path.replace(/:[^/]+/g, '([^/]+)'))
    newRoute.pathRegex = new RegExp(`^${pathRegexStr}$`)
    newRoute.pathRegexCapture = new RegExp(pathRegexStr, 'gm')
    newRoute.matcher = (path) => {
      if (newRoute.pathRegex.test(path)) {
        const params = {}
        let v
        while ((v = newRoute.pathRegexCapture.exec(path)) !== null) {
          if (v && v.length === newRoute.urlParamKeys.length + 1) {
            const nv = v.slice(1)
            for (let i = 0; i < nv.length; i++) {
              params[newRoute.urlParamKeys[i]] = nv[i]
            }
          }
        }
        return params
      }
      return undefined
    }
  }
  return newRoute
}
