import { waitFor } from './util/wait-for.js'
import { stripTrailingSlash } from './util/slashes.js'
import { isPromise } from './util/is-promise.js'
import { hasKey } from './util/object-has-key.js'
import { elementEmpty } from './util/element-empty.js'
import { renderOutlet as render } from './util/render-outlet.js'
import { flattenRoutes } from './util/flatten-routes.js'

class UrlSearchOrHashParams {
  constructor (url) {
    this.urlParamMap = {}
    let paramUrl
    let urlHash
    let paramPairs = []

    if (url.includes('?')) {
      paramUrl = url.substring(url.indexOf('?') + 1)
      if (paramUrl.includes('#')) {
        paramUrl = paramUrl.substring(0, paramUrl.indexOf('#'))
        urlHash = paramUrl.substring(paramUrl.indexOf('#') + 1)
      }
    } else if (url.includes('#')) {
      paramUrl = ''
      urlHash = url.substring(url.indexOf('#') + 1, url.length)
    }

    paramPairs = paramUrl ? paramUrl.split('&') : []

    if (urlHash && urlHash.includes('&') && urlHash.includes('=')) {
      paramPairs = [...paramPairs, ...urlHash.split('&')]
    }

    for (let i = 0; i < paramPairs.length; i++) {
      const paramComponents = paramPairs[i].split('=')
      if (paramComponents.length === 2) {
        this.urlParamMap[paramComponents[0]] = this._esc(decodeURIComponent(paramComponents[1]))
      }
    }
  }

  entries () {
    let entries = []
    for (const key in this.urlParamMap) {
      if (this.has(key)) {
        entries.push([key, this.urlParamMap[key]])
      }
    }

    entries = entries.sort(function (entryA, entryB) {
      if (entryA[0].toLowerCase() > entryB[0].toLowerCase()) {
        return 1
      }
      if (entryA[0].toLowerCase() < entryB[0].toLowerCase()) {
        return -1
      }
      return 0
    })

    return entries
  }

  remove (key) {
    delete this.urlParamMap[key]
  }

  get (key) {
    return this.urlParamMap[key]
  }

  has (key) {
    // eslint-disable-next-line no-prototype-builtins
    return this.urlParamMap.hasOwnProperty(key)
  }

  keys () {
    const keys = []
    for (const key in this.urlParamMap) {
      if (this.has(key)) {
        keys.push(key)
      }
    }
    return keys
  }

  set (key, val) {
    this.urlParamMap[key] = val
  }

  toString () {
    let paramsString = ''
    const entries = this.entries()
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i]
      if (this.has(entry[0])) {
        paramsString += '&' + entry[0] + '=' + encodeURIComponent(this._unesc(entry[1]))
      }
    }
    return paramsString.substring(1)
  }

  values () {
    const values = []
    for (const key in this.urlParamMap) {
      if (this.has(key)) {
        values.push(this.urlParamMap[key])
      }
    }
    return values
  }

  _esc (s) {
    return String(s)
      .replace(/</g, '&lt;')
      .replace(/'/g, '&#39;')
      .replace(/"/g, '&quot;')
      .replace(/>/g, '&gt;')
      .replace(/&/g, '&amp;')
  }

  _unesc (s) {
    return String(s)
      .replace(/&lt;/g, '<')
      .replace(/&#39;/g, '\'')
      .replace(/&quot;/g, '"')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
  }
}

class Router {
  constructor (routes, rootOutletSelector, options = {}) {
    if (typeof window !== 'undefined' && window.__ficusjs__ && window.__ficusjs__.router) {
      return window.__ficusjs__.router
    }

    this._rootOutletSelector = rootOutletSelector

    // process routes
    this._routes = this._processRoutes(routes)

    // process router options
    this._routerOptions = this._processOptions(options)

    // create an outlet cache
    this._outletCache = new WeakMap()

    // add the popstate event listener for history changes
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', () => {
        this._resolveRoute(this.location.pathname)
          .catch(e => this._renderError(this.location.pathname, e))
      })
      window.__ficusjs__ = window.__ficusjs__ || {}
      window.__ficusjs__.router = window.__ficusjs__.router || this
    }
  }

  // getter for the location property
  get location () {
    let loc
    if (typeof window !== 'undefined') {
      loc = {
        host: window.location.host,
        protocol: window.location.protocol,
        pathname: window.location.pathname,
        hash: window.location.hash,
        href: window.location.href,
        search: window.location.search,
        state: window.history.state
      }
      if (this._routerOptions.mode === 'hash') {
        loc.pathname = this._getHashPathname()
        loc.hash = ''
      }
    }
    return loc
  }

  // getter for the options
  get options () {
    return this._routerOptions
  }

  /**
   * Set the router options
   * @param options
   */
  setOptions (options = {}) {
    this._routerOptions = this._processOptions(options)
  }

  /**
   * Add more routes to the router
   * @param routes
   */
  addRoutes (routes) {
    this._routes = [...this._routes, ...this._processRoutes(routes)]
  }

  /**
   * Check if the path name matches a route
   * @param pathname
   * @returns {boolean}
   */
  hasRoute (pathname) {
    return !!this._findRoute(pathname)
  }

  /**
   * Get the query string params as an object
   * @returns {Object|undefined}
   * @private
   */
  _getQueryStringParams () {
    return Object.fromEntries(new UrlSearchOrHashParams(this.location.href).entries())
  }

  /**
   * Get the URL params as an object
   * @param path
   * @returns {Object|undefined}
   * @private
   */
  _getUrlParams (path, route) {
    const params = route.matcher(path)
    return typeof params === 'string' ? undefined : params
  }

  /**
   * Match a route by pathname
   * @param {String} pathname
   * @returns {Object}
   * @private
   */
  _findRoute (pathname) {
    return this._routes.find(r => r.matcher(pathname) !== undefined)
  }

  /**
   * Return the hash pathname
   * @returns {string}
   * @private
   */
  _getHashPathname () {
    let pathname = window.location.hash.substring(1)
    if (pathname === '') pathname = '/'
    return pathname
  }

  /**
   * Process the routes
   * @param {Array} routes
   * @returns {Array}
   * @private
   */
  _processRoutes (routes) {
    return flattenRoutes(routes).map(r => {
      const nr = {
        ...r,
        matcher: (path) => {
          return stripTrailingSlash(r.path) === stripTrailingSlash(path) ? path : undefined
        }
      }
      if (r.component && !r.action) nr.action = () => r.component
      if (/:[^/]+/.test(r.path)) {
        const keys = r.path.match(/(:[^/]+)/gm)
        if (keys && keys.length > 0) {
          nr.urlParamKeys = keys.map(k => k.substring(1))
        }
        const pathRegexStr = stripTrailingSlash(r.path.replace(/:[^/]+/g, '([^/]+)'))
        nr.pathRegex = new RegExp(`^${pathRegexStr}$`)
        nr.pathRegexCapture = new RegExp(pathRegexStr, 'gm')
        nr.matcher = (path) => {
          if (nr.pathRegex.test(path)) {
            const params = {}
            let v
            while ((v = nr.pathRegexCapture.exec(path)) !== null) {
              if (v && v.length === nr.urlParamKeys.length + 1) {
                const nv = v.slice(1)
                for (let i = 0; i < nv.length; i++) {
                  params[nr.urlParamKeys[i]] = nv[i]
                }
              }
            }
            return params
          }
          return undefined
        }
      }
      return nr
    })
  }

  /**
   * Method to process router options
   * @param routes
   * @param options
   * @returns {Object}
   * @private
   */
  _processOptions (opts) {
    const options = {
      mode: 'history', // or 'hash'
      autoStart: true,
      changeHistoryState: true,
      warnOnMissingOutlets: false,
      render,
      ...opts
    }

    // check for existence of the resolveRoute function
    if (!options.resolveRoute) {
      return {
        ...options,
        resolveRoute (context, params) {
          if (typeof context.route.action === 'function') {
            return {
              template: context.route.action(context, params),
              outlets: context.route.outlets
            }
          }
          return undefined
        }
      }
    } else if (options.resolveRoute) {
      const routeResolver = options.resolveRoute
      return {
        ...options,
        resolveRoute (context, params) {
          return routeResolver(context, params)
        }
      }
    }

    return options
  }

  /**
   * Render a template for a path
   * @param path
   * @param template
   * @private
   */
  _render (path, context, template, outlets = {}) {
    // is the template a redirect?
    if (template.redirect) {
      const state = { from: path }
      this.push(template.redirect, state)
      return
    }

    waitFor(() => document.querySelector(this._rootOutletSelector))
      .then(routerOutlet => {
        const ok = Object.keys(outlets)

        // find any outlets and clear them if they're not a defined outlet for the route
        const namedOutlets = document.querySelectorAll('[data-router-outlet]')
        if (namedOutlets.length) {
          [...namedOutlets].filter(o => o !== routerOutlet).forEach(o => elementEmpty(o))
        }

        // render the template into the outlet component
        this._renderIntoOutlet(template, routerOutlet)

        // do we have named outlets to render?
        if (ok.length) {
          ok.forEach(k => {
            waitFor(() => document.querySelectorAll(k))
              .then(allOutlets => {
                const result = outlets[k](context, context && context.params)
                isPromise(result)
                  ? result.then(template => this._renderIntoAllOutlets(template, allOutlets))
                  : this._renderIntoAllOutlets(result, allOutlets)
              })
              .catch(e => this._routerOptions.warnOnMissingOutlets && console.warn(e))
          })
        }
      })
      .catch(e => console.warn(e))
  }

  /**
   * Render a template into a router outlet
   * @param template
   * @param routerOutlet
   * @private
   */
  _renderIntoOutlet (template, routerOutlet) {
    if (this._isSameOutletContent(template, routerOutlet)) {
      return
    }
    this._routerOptions.render(template, routerOutlet)
    this._outletCache.set(routerOutlet, template)
  }

  /**
   * Render a template into multiple outlets
   * @param template
   * @param routerOutlets
   * @private
   */
  _renderIntoAllOutlets (template, routerOutlets) {
    for (let i = 0; i < routerOutlets.length; i++) {
      const ro = routerOutlets[i]
      this._renderIntoOutlet(template, ro)
    }
  }

  /**
   * Check if what has already been rendered is the same content
   * @param template
   * @param routerOutlet
   * @returns {boolean}
   * @private
   */
  _isSameOutletContent (template, routerOutlet) {
    if (typeof template === 'string' && this._outletCache.has(routerOutlet) && this._outletCache.get(routerOutlet) === template) {
      return true
    }
    return false
  }

  /**
   * Navigate to a path
   * @param {String|Object} path
   * @param {Object} [state]
   */
  push (path, state) {
    this._navigate(path, state)
  }

  /**
   * Replace the current path
   * @param {String|Object} path
   * @param {Object} [state]
   */
  replace (path, state) {
    this._navigate(path, state, true)
  }

  /**
   * Navigate to a route
   * This involves finding and rendering a route and then setting the history state.
   *
   * If an errorHandler is supplied with the router options then it is invoked with
   * the error and context arguments and the resulting template is rendered. If no errorHandler
   * is specified then a generic error message is rendered
   * @param {String|Object} path
   * @param state
   * @param replaceHistory
   * @private
   */
  _navigate (path, state, replaceHistory = false) {
    let np = path
    let pathname = path
    let search = ''
    let ns = state

    if (typeof path === 'string' && path.includes('?')) {
      pathname = path.substring(0, path.indexOf('?'))
      search = path.substring(path.indexOf('?'))
    } else if (typeof path === 'string' && path.includes('#')) {
      pathname = path.substring(0, path.indexOf('#'))
    }

    if (typeof path === 'object') {
      if (this._routerOptions.mode === 'history' && !path.pathname) throw new Error(`Unable to navigate to: ${path}`)
      np = path.pathname || this.location.pathname
      pathname = np
      if (path.search) {
        np = `${np}${path.search}`
        search = path.search
      }
      if (path.hash) np = `${np}${path.hash}`
      ns = state
      if (path.state) {
        ns = state
      }
    }

    // ignore the current URL if we are not replacing history
    if (!replaceHistory && pathname === this.location.pathname) {
      return
    }

    if (this._routerOptions.mode === 'hash') {
      np = `${window.location.pathname}${search}#${pathname}`
    }

    // set the state
    if (this._routerOptions.changeHistoryState) {
      this._setState(np, ns, replaceHistory)
    }

    this._resolveRoute(pathname)
      .catch(e => this._renderError(pathname, e))
  }

  /**
   * Resolve a route
   * If the resolveRoute function is specified, it is invoked to get the route action result.
   * If no resolveRoute is defined then execution is passed to the _findAndRenderRoute method
   * @param path
   * @returns {Promise}
   * @private
   */
  _resolveRoute (path) {
    if (this._routerOptions.resolveRoute) {
      const route = this._findRoute(path)
      let params = {
        ...this._getQueryStringParams()
      }
      const context = {
        ...this._routerOptions.context,
        router: this,
        route: route || {},
        path,
        params
      }
      if (route) {
        params = {
          ...params,
          ...this._getUrlParams(path, route)
        }
        context.route = route
        context.params = params
        const routeActionResult = this._routerOptions.resolveRoute(context, params)
        if (routeActionResult) {
          return hasKey(routeActionResult, 'template') && hasKey(routeActionResult, 'outlets')
            ? this._renderRouteActionResult(path, context, routeActionResult.template, routeActionResult.outlets)
            : this._renderRouteActionResult(path, context, routeActionResult)
        } else {
          return this._findAndRenderRoute(path)
        }
      } else {
        const routeActionResult = this._routerOptions.resolveRoute(context, params)
        if (routeActionResult) {
          return hasKey(routeActionResult, 'template') && hasKey(routeActionResult, 'outlets')
            ? this._renderRouteActionResult(path, context, routeActionResult.template, routeActionResult.outlets)
            : this._renderRouteActionResult(path, context, routeActionResult)
        } else {
          return Promise.reject(new Error('not_found'))
        }
      }
    }
    return this._findAndRenderRoute(path)
  }

  /**
   * Find and render a route
   * This involves matching a route and then rendering it.
   * It is wrapped in a Promise so routes can be async and resolved before rendering.
   * @param path
   * @returns {Promise}
   * @private
   */
  _findAndRenderRoute (path) {
    return new Promise((resolve, reject) => {
      const route = this._findRoute(path)
      if (route) {
        const params = {
          ...this._getQueryStringParams(),
          ...this._getUrlParams(path, route)
        }
        const context = {
          ...this._routerOptions.context,
          router: this,
          route,
          path,
          params
        }
        const actionResult = route.action(context, params)
        if (isPromise(actionResult)) {
          actionResult
            .then(template => {
              this._render(path, context, template, route.outlets)
              resolve()
            })
            .catch(e => {
              reject(e)
            })
        } else {
          this._render(path, context, actionResult, route.outlets)
          resolve()
        }
      } else {
        reject(new Error('not_found'))
      }
    })
  }

  /**
   * Render an action result
   * @param actionResult
   * @private
   */
  _renderRouteActionResult (path, context, actionResult, outlets = {}) {
    return new Promise((resolve, reject) => {
      if (isPromise(actionResult)) {
        actionResult
          .then(result => {
            if (hasKey(result, 'template') && hasKey(result, 'outlets')) {
              return isPromise(result.template)
                ? result.template.then(template => {
                  return { template, outlets: result.outlets }
                })
                : Promise.resolve({ template: result.template, outlets: result.outlets })
            } else {
              return Promise.resolve({ template: result, outlets })
            }
          })
          .then(result => {
            this._render(path, context, result.template, result.outlets)
            resolve()
          })
          .catch(e => {
            reject(e)
          })
      } else {
        this._render(path, context, actionResult, outlets)
        resolve()
      }
    })
  }

  /**
   * Set the history state
   * This pushes or replaces the current state
   * @param path
   * @param state
   * @param replace
   * @private
   */
  _setState (path, state, replace = false) {
    if (replace) {
      window.history.replaceState(state, null, path)
    } else {
      window.history.pushState(state, null, path)
    }
  }

  /**
   * Handle a generic error
   * @param path
   * @private
   */
  _renderError (path, error) {
    console.error(`A router error occurred for path '${path}'`, error)
    if (this._routerOptions.errorHandler) {
      const err = {
        message: error.message,
        status: error.message === 'not_found' ? 404 : 500
      }
      const context = {
        ...this._routerOptions.context,
        router: this,
        path,
        location: {
          ...this.location,
          pathname: path
        }
      }
      const errorTemplate = this._routerOptions.errorHandler(err, context)
      if (isPromise(errorTemplate)) {
        errorTemplate
          .then(template => {
            this._render(path, context, template)
          })
          .catch(e => {
            // fallback to generic error template if the errorHandler promise fails - report on both errors
            this._render(path, context, `<div><strong>Router error from <code>errorHandler</code></strong>: ${e.message}, original error: ${error.message}</div>`)
          })
      } else {
        this._render(path, context, errorTemplate)
      }
    } else {
      // use generic error template as a fallback
      this._render(path, null, `<div><strong>Router error</strong>: ${error.message}</div>`)
    }
  }

  /**
   * Go forwards or backwards n pages in history
   * @param n
   */
  go (n) {
    window.history.go(n)
  }

  /**
   * Equivalent to clicking back button
   */
  goBack () {
    this.go(-1)
  }

  /**
   * Equivalent to clicking forward button
   */
  goForward () {
    this.go(1)
  }

  /**
   * Start the router by rendering the route for the current location
   * @param {String|Object} location
   */
  start (location = this.location) {
    if (/complete|interactive|loaded/.test(document.readyState)) {
      // In case DOMContentLoaded was already fired, the document readyState will be one of "complete" or "interactive" or (nonstandard) "loaded"
      this.replace(location)
    } else {
      // In case DOMContentLoaded was not yet fired, use it to run the "replace" function when document is read for it
      document.addEventListener('DOMContentLoaded', () => this.replace(location))
    }
  }

  _getUrl (path) {
    return new URL(`${/https?/.test(path) ? '' : `${this.location.protocol}//${this.location.host}`}${path}`)
  }
}

/**
 * Function to create a Router class instance
 * @param {Array} routes
 * @param {string} rootOutletSelector
 * @param {Object|undefined} options
 * @returns {Router}
 */
export function createRouter (routes, rootOutletSelector, options = {}) {
  const router = new Router(routes, rootOutletSelector, options)

  // render the initial route
  if (router.options.autoStart) router.start()

  return router
}

/**
 * Function to get the running Router instance
 * @returns {Router}
 */
export function getRouter () {
  if (typeof window !== 'undefined' && window.__ficusjs__ && window.__ficusjs__.router) {
    return window.__ficusjs__.router
  }
}
