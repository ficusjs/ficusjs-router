export type RouteOrOutletHTMLResult = string | HTMLElement

export interface Outlets {
  [outletName: string]: () => RouteOrOutletHTMLResult | Promise<RouteOrOutletHTMLResult>
}

export interface QueryParams {
  [paramName: string]: string | string[]
}

export interface RouteLocation {
  host: string
  protocol: string
  href: string
  pathname: string
  search: string
  hash: string
}

export interface RouteContext {
  context?: RouterOptionsContext
  router: Router
  route: Route
  path: string
  params: QueryParams
}

type RedirectObject = { redirect: string }

export type ActionResult = boolean | Error | RedirectObject | RouteOrOutletHTMLResult | Promise<RouteOrOutletHTMLResult> | { template: RouteOrOutletHTMLResult | Promise<RouteOrOutletHTMLResult>, outlets?: Outlets }

export type ResolveRoute = (context: RouteContext, params: QueryParams) => ActionResult

export type ErrorHandler = (error: Error & { status?: number }, context: RouteContext) => RouteOrOutletHTMLResult

export type RouterOptionsContext = object

export interface RouterOptions {
  mode: 'history' | 'hash'
  autoStart?: boolean
  changeHistoryState?: boolean
  warnOnMissingOutlets?: boolean
  context?: RouterOptionsContext
  resolveRoute?: ResolveRoute
  errorHandler?: ErrorHandler
}

export type Route = {
  path: string
  component: string
  outlets?: Outlets
  children?: Array<Route>
} | {
  path: string
  action: (context: RouteContext, params: QueryParams) => ActionResult
  outlets?: Outlets
  children?: Array<Route>
}

export interface RouterLocation {
  host: string | undefined
  protocol: string | undefined
  pathname: string | undefined
  hash: string | undefined
  href: string | undefined
  search: string | undefined
  state: any
}

type Routes = Array<Route>

declare class Router {
  constructor(routes: Routes, rootOutletSelector: string, options?: RouterOptions)
  push (location: string): Promise<boolean>
  replace (location: string): Promise<boolean>
  go (n: number): void
  goBack (): void
  goForward (): void
  start (location?: string | object): void
  setOptions(options: RouterOptions): void
  addRoutes(routes: Routes): void
  hasRoute(pathname: string): boolean
  get options(): RouterOptions
  get location(): RouterLocation
}

type GetRouterFunction = () => Router

export declare function createRouter (routes: Routes, rootOutletSelector: string, options?: RouterOptions): Router

export declare function getRouter (): Router
