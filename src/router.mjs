import { waitFor } from './util/wait-for.mjs'
import { stripTrailingSlash } from './util/slashes.mjs'
import { isPromise } from './util/is-promise.mjs'
import { hasKey } from './util/object-has-key.mjs'
import { elementEmpty } from './util/element-empty.mjs'
import { renderOutlet } from './util/render-outlet.mjs'
import { flattenRoutes } from './util/flatten-routes.mjs'
import { emit } from './util/emit.mjs'

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

class Stack {
  constructor () {
    this.items = []
  }

  push (element) {
    this.items.push(element)
  }

  pop () {
    this.items.pop()
  }

  peek () {
    return this.items[this.items.length - 1]
  }

  isEmpty () {
    return this.items.length === 0
  }

  clear () {
    this.items = []
  }

  size () {
    return this.items.length
  }
}

class Router {
  constructor (routes, rootOutletSelector, options) {
    if (typeof window !== 'undefined' && window.__ficusjs__ && window.__ficusjs__.router) {
      return window.__ficusjs__.router
    }

    this._rootOutletSelector = rootOutletSelector

    // create stack
    this.stack = new Stack()

    // process routes
    this._routes = this._processRoutes(routes)

    // process router options
    this._routerOptions = this._processOptions(options)

    // create an outlet cache
    this._outletCache = new WeakMap()

    // add the popstate event listener for history changes
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', () => {
        this._findAndRenderRoute(this.location)
          .then(() => this.stack.pop())
          .catch(e => {
            this._renderError(this.location, e)
            throw e
          })
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
   * @param {Object|undefined} options
   */
  setOptions (options = {}) {
    this._routerOptions = this._processOptions(options)
  }

  /**
   * Add more routes to the router
   * @param {Routes} routes
   */
  addRoutes (routes) {
    this._routes = [...this._routes, ...this._processRoutes(routes)]
  }

  /**
   * Check if the path name matches a route
   * @param {string} pathname
   * @returns {boolean}
   */
  hasRoute (pathname) {
    return !!this._findRoute(pathname)
  }

  /**
   * Get the query string params as an object
   * @param {RouteLocation} location
   * @returns {Object|undefined}
   * @private
   */
  _getQueryStringParams (location) {
    return Object.fromEntries(new UrlSearchOrHashParams(location.href).entries())
  }

  /**
   * Get the URL params as an object
   * @param {RouteLocation} location
   * @returns {Object|undefined}
   * @private
   */
  _getUrlParams (location, route) {
    const params = route.matcher(location.pathname)
    return typeof params === 'string' ? undefined : params
  }

  /**
   * Match a route by pathname
   * @param {String} pathname
   * @returns {Route}
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
   * Process router options
   * @param {RouterOptions} opts
   * @returns {RouterOptions}
   * @private
   */
  _processOptions (opts = {}) {
    const that = this
    const options = {
      mode: 'history', // or 'hash'
      autoStart: true,
      changeHistoryState: true,
      warnOnMissingOutlets: false,
      ...opts
    }

    // check for existence of the resolveRoute function
    if (!options.resolveRoute) {
      return {
        ...options,
        resolveRoute (context, params) {
          if (context.route && typeof context.route.action === 'function') {
            return {
              template: new Promise((resolve, reject) => {
                const template = context.route.action(context, params)
                resolve(template)
              }).catch(e => {
                that._renderError(context.location, e)
                throw e
              }),
              outlets: context.route.outlets
            }
          }
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
   * Render an template for a route
   * @param {RouteLocation} location
   * @param {object} context
   * @param {ActionResult} result
   * @param {Outlets} outlets
   * @returns {Promise}
   * @private
   */
  _render (location, context, result, outlets = {}) {
    return isPromise(result)
      ? result.then(template => this._performRender(location, context, template, outlets))
      : this._performRender(location, context, result, outlets)
  }

  /**
   * Perform a render
   * @param {RouteLocation} location
   * @param {object} context
   * @param {ActionResult} template
   * @param {Outlets} outlets
   * @returns {Promise}
   * @private
   */
  _performRender (location, context, template, outlets) {
    // is the template a redirect?
    if (typeof template === 'object' && template.redirect) {
      return Promise.resolve(template)
    }

    // is the action result an Error?
    if (template instanceof Error) {
      this._renderError(location, template)
      return Promise.resolve(true)
    }

    // is the action result a false value?
    if (template === false) return Promise.resolve(false)

    return waitFor(() => document.querySelector(this._rootOutletSelector))
      .then(() => {
        const routerOutlet = document.querySelector(this._rootOutletSelector)
        const ok = Object.keys(outlets)

        // find any outlets and clear them if they're not a defined outlet for the route
        const namedOutlets = document.querySelectorAll('[data-router-outlet]:not([sticky])')
        if (namedOutlets.length) {
          [...namedOutlets].filter(o => o !== routerOutlet).forEach(o => elementEmpty(o))
        }

        // render the template into the outlet component
        this._renderIntoOutlet(template, routerOutlet)

        // do we have named outlets to render?
        if (ok.length) {
          return Promise.all(
            ok.map(k => waitFor(() => {
              const namedOutlets = document.querySelectorAll(k)
              return namedOutlets.length > 0 ? namedOutlets : false
            })
              .then(allOutlets => {
                const result = outlets[k](context, context && context.params)
                isPromise(result)
                  ? result.then(template => this._renderIntoAllOutlets(template, allOutlets))
                  : this._renderIntoAllOutlets(result, allOutlets)
              })
              .catch(e => this._routerOptions.warnOnMissingOutlets && console.warn(e)))
          ).then(() => true)
        } else {
          return Promise.resolve(true)
        }
      })
  }

  /**
   * Render a template into a router outlet
   * @param {ActionResult} result
   * @param {HTMLElement} routerOutlet
   * @private
   */
  _renderIntoOutlet (result, routerOutlet) {
    if (!result) return
    if (this._isSameOutletContent(result, routerOutlet)) {
      return
    }
    renderOutlet(result, routerOutlet)
    this._outletCache.set(routerOutlet, result)
    this._emitRouterOutletChangeEvent(routerOutlet)
  }

  /**
   * Render a template into multiple outlets
   * @param {ActionResult} result
   * @param {Array<HTMLElement>} routerOutlets
   * @private
   */
  _renderIntoAllOutlets (result, routerOutlets) {
    for (let i = 0; i < routerOutlets.length; i++) {
      const ro = routerOutlets[i]
      this._renderIntoOutlet(result, ro)
    }
  }

  /**
   * Emit a router outlet change event
   * @private
   * @param {HTMLElement} routerOutlet the router outlet to emit the change event for
   */
  _emitRouterOutletChangeEvent (routerOutlet) {
    emit(routerOutlet, 'outlet-change', {
      detail: {
        outlet: routerOutlet
      }
    })
  }

  /**
   * Check if what has already been rendered is the same content
   * @param {ActionResult} result
   * @param {HTMLElement} routerOutlet
   * @returns {boolean}
   * @private
   */
  _isSameOutletContent (result, routerOutlet) {
    if (typeof result === 'string' && this._outletCache.has(routerOutlet) && this._outletCache.get(routerOutlet) === result) {
      return true
    }
    return false
  }

  /**
   * Navigate to a location
   * @param {string|RouteLocation} location
   * @param {object|undefined} state
   * @returns {Promise}
   */
  push (location, state) {
    return this._navigate(location, state)
  }

  /**
   * Replace the current location
   * @param {string|RouteLocation} location
   * @param {object|undefined} state
   * @returns {Promise}
   */
  replace (location, state) {
    return this._navigate(location, state, true)
  }

  /**
   * Navigate to a route
   * This involves finding and rendering a route and then setting the history state.
   *
   * If an errorHandler is supplied with the router options then it is invoked with
   * the error and context arguments and the resulting template is rendered. If no errorHandler
   * is specified then a generic error message is rendered
   * @param {string|RouteLocation} location
   * @param {object|undefined} state
   * @param {boolean} replaceHistory
   * @returns {Promise}
   * @private
   */
  _navigate (location, state, replaceHistory = false) {
    const thisLocation = this._normalizeLocation(location)

    // ignore the current URL if we are not replacing history
    if (!replaceHistory && thisLocation.pathname === this.location.pathname) {
      return Promise.resolve()
    }

    // find route
    const { actionResult, context } = this._resolveRoute(thisLocation)

    if (actionResult == null) {
      this._routerOptions.changeHistoryState && this._setState(thisLocation.href, state, replaceHistory)
      const err = new Error('not_found')
      this._renderError(thisLocation, err)
      return Promise.reject(err)
    }

    // is the action result a redirect?
    if (typeof actionResult === 'object' && actionResult.redirect) {
      const state = { from: location }
      return actionResult.redirect !== this.location.pathname ? this.push(actionResult.redirect, state) : Promise.resolve()
    }

    // is the action result an Error?
    if (actionResult instanceof Error) {
      this._routerOptions.changeHistoryState && this._setState(thisLocation.href, state, replaceHistory)
      this._renderError(thisLocation, actionResult)
      return Promise.reject(actionResult)
    }

    // is the action result a false value?
    if (actionResult === false) return Promise.resolve()

    // render route
    return this._renderActionResult(thisLocation, context, actionResult, state, replaceHistory)
      .then(result => {
        if (typeof result === 'object' && result.redirect) {
          const state = { from: thisLocation.href }
          return this.push(result.redirect, state)
        }
        result && this._routerOptions.changeHistoryState && this._setState(thisLocation.href, state, replaceHistory)
        return Promise.resolve(result)
      })
      .catch(e => {
        this._renderError(thisLocation, e)
        throw e
      })
  }

  /**
   * Normalise a location - can be string or location object
   * @param location
   * @returns {RouteLocation}
   * @private
   */
  _normalizeLocation (location) {
    const loc = {
      host: undefined,
      protocol: undefined,
      href: undefined,
      pathname: undefined,
      search: undefined,
      hash: undefined
    }

    if (typeof location === 'object') {
      if (this._routerOptions.mode === 'history' && !location.pathname) throw new Error(`Unable to navigate to: ${location}`)
      let href = location.href || this.location.href
      loc.pathname = location.pathname || this.location.pathname
      if (location.search && location.search !== '' && !href.includes(location.search)) {
        href = `${href}${location.search}`
        loc.search = location.search
      }
      if (location.hash && location.hash !== '' && !href.includes(location.hash)) {
        href = `${href}${location.hash}`
        loc.hash = location.hash
      }
      loc.hash = location.hash || this.location.hash
      loc.search = location.search || this.location.search
      loc.host = location.host || this.location.host
      loc.protocol = location.protocol || this.location.protocol
      loc.href = href
    } else if (typeof location === 'string') {
      const url = new URL(/^https?:\/\//.test(location) ? location : `${window.location.protocol}//${window.location.host}${location}`)
      loc.host = url.host
      loc.protocol = url.protocol
      loc.href = url.href
      loc.pathname = url.pathname
      loc.search = url.search
      loc.hash = url.hash
      if (location.includes('?')) {
        loc.pathname = location.substring(0, location.indexOf('?'))
        loc.search = location.substring(location.indexOf('?'))
      } else if (location.includes('#')) {
        loc.pathname = location.substring(0, location.indexOf('#'))
      }
    }

    if (this._routerOptions.mode === 'hash') {
      loc.href = `${window.location.pathname}${loc.search || ''}#${loc.pathname}`
    }

    return loc
  }

  /**
   * Render an action result
   * @param {RouteLocation} location
   * @param {object} context
   * @param {ActionResult} actionResult
   * @param {object|undefined} state
   * @param {boolean} replaceHistory
   * @returns {Promise}
   * @private
   */
  _renderActionResult (location, context, actionResult) {
    if (hasKey(actionResult, 'template') && hasKey(actionResult, 'outlets')) {
      const { template, outlets } = actionResult
      return this._render(location, context, template, outlets)
    } else {
      return this._render(location, context, actionResult, {})
    }
  }

  /**
   * Get a route context
   * @param {Route} route
   * @param {RouteLocation} location
   * @returns {RouteContext}
   * @private
   */
  _getRouteContext (route, location) {
    let params = {
      ...this._getQueryStringParams(location)
    }
    const routeContext = {
      context: this._routerOptions.context,
      router: this,
      route,
      location,
      params
    }
    if (route) {
      params = {
        ...params,
        ...this._getUrlParams(location, route)
      }
      routeContext.params = params
    }
    return routeContext
  }

  /**
   * Resolve a route
   * If the resolveRoute function is specified, it is invoked to get the route action result.
   * If no resolveRoute is defined then the route action result is matched against any defined routes
   * @param {RouteLocation} pathname
   * @returns {{actionResult: ActionResult|undefined, context: RouteContext}}
   * @private
   */
  _resolveRoute (location) {
    const route = this._findRoute(location.pathname)
    const context = this._getRouteContext(route, location)
    try {
      const actionResult = this._routerOptions.resolveRoute(context, context.params)
      if (actionResult != null) {
        return { actionResult, context }
      }
      if (!route) {
        return { actionResult: undefined, context }
      }
      return { actionResult: route.action(context, context.params), context }
    } catch (e) {
      this._renderError(location, e)
      throw e
    }
  }

  /**
   * Find and render a route
   * This involves matching a route and then rendering it.
   * It is wrapped in a Promise so routes can be async and resolved before rendering.
   * @param {RouteLocation} location
   * @returns {Promise}
   * @private
   */
  _findAndRenderRoute (location) {
    // find route
    const { actionResult, context } = this._resolveRoute(location)

    if (!actionResult) {
      throw new Error('not_found')
    }

    return this._renderActionResult(location, context, actionResult)
  }

  /**
   * Set the history state
   * This pushes or replaces the current state
   * @param {String} path
   * @param {any} state
   * @param {Boolean} replace
   * @private
   */
  _setState (path, state, replace = false) {
    if (replace) {
      window.history.replaceState(state, null, path)
    } else {
      this.stack.push(path)
      window.history.pushState(state, null, path)
    }
  }

  /**
   * Handle a generic error
   * @param {RouteLocation} location
   * @param {Error} error
   * @private
   */
  _renderError (location, error) {
    console.error(`A router error occurred for location '${location.href}'`, error)
    if (this._routerOptions.errorHandler) {
      const err = {
        message: error.message,
        status: error.message === 'not_found' ? 404 : 500
      }
      const context = this._getRouteContext(this._findRoute(location.pathname), location)
      const errorTemplate = this._routerOptions.errorHandler(err, context)
      if (isPromise(errorTemplate)) {
        errorTemplate
          .then(template => this._render(location, context, template))
          .catch(e => this._render(location, context, `<div><strong>Router error from <code>errorHandler</code></strong>: ${e.message}, original error: ${error.message}</div>`))
      } else {
        this._render(location, context, errorTemplate)
      }
    } else {
      // use generic error template as a fallback
      this._render(location, null, `<div><strong>Router error</strong>: ${error.message}</div>`)
    }
  }

  /**
   * Go forwards or backwards n pages in history
   * @param {Number} n
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
   * @param {string|RouteLocation} location
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
}

/**
 * Function to create a Router class instance
 * @param {Routes} routes
 * @param {string} rootOutletSelector
 * @param {RouterOptions|undefined} options
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
