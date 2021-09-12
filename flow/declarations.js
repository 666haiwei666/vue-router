declare var document: Document;

declare class RouteRegExp extends RegExp {
  keys: Array<{ name: string, optional: boolean }>;
}

declare type PathToRegexpOptions = {
  sensitive?: boolean,
  strict?: boolean,
  end?: boolean
}

declare module 'path-to-regexp' {
  declare module.exports: {
    (path: string, keys?: Array<?{ name: string }>, options?: PathToRegexpOptions): RouteRegExp;
    compile: (path: string) => (params: Object) => string;
  }
}

declare type Dictionary<T> = { [key: string]: T }

declare type NavigationGuard = (
  to: Route,
  from: Route,
  next: (to?: RawLocation | false | Function | void) => void
) => any

declare type AfterNavigationHook = (to: Route, from: Route) => any

type Position = { x: number, y: number };
type PositionResult = Position | { selector: string, offset?: Position } | void;

declare type RouterOptions = {
  // 页面的配置路径
  routes?: Array<RouteConfig>;
  // 模式
  mode?: string;
  // 当浏览器不支持 history.pushState 控制路由是否应该回退到 hash 模式。默认值为 true
  fallback?: boolean;
  // 应用的基路径
  base?: string;
  // 全局配置 <router-link> 默认的激活的 class
  linkActiveClass?: string;
  // 全局配置 <router-link> 默认的精确激活的 class
  linkExactActiveClass?: string;
  // 提供自定义查询字符串的解析函数。覆盖默认行为
  parseQuery?: (query: string) => Object;
  // // 提供自定义查询字符串的反解析函数。覆盖默认行为
  stringifyQuery?: (query: Object) => string;
  // return 期望滚动到哪个的位置
  scrollBehavior?: (
    to: Route,
    from: Route,
    savedPosition: ?Position
  ) => PositionResult | Promise<PositionResult>;
}

declare type RedirectOption = RawLocation | ((to: Route) => RawLocation)

declare type RouteConfig = {
  path: string;
  name?: string;
  component?: any;
  components?: Dictionary<any>;
  redirect?: RedirectOption;
  alias?: string | Array<string>;
  children?: Array<RouteConfig>;
  beforeEnter?: NavigationGuard;
  meta?: any;
  props?: boolean | Object | Function;
  caseSensitive?: boolean;
  pathToRegexpOptions?: PathToRegexpOptions;
}

declare type RouteRecord = {
  path: string;
  alias: Array<string>;
  regex: RouteRegExp;
  components: Dictionary<any>;
  instances: Dictionary<any>;
  enteredCbs: Dictionary<Array<Function>>;
  name: ?string;
  parent: ?RouteRecord;
  redirect: ?RedirectOption;
  matchAs: ?string;
  beforeEnter: ?NavigationGuard;
  meta: any;
  props: boolean | Object | Function | Dictionary<boolean | Object | Function>;
}

declare type Location = {
  _normalized?: boolean;
  name?: string;
  path?: string;
  hash?: string;
  query?: Dictionary<string>;
  params?: Dictionary<string>;
  append?: boolean;
  replace?: boolean;
}

declare type RawLocation = string | Location

declare type Route = {
  path: string;
  name: ?string;
  hash: string;
  query: Dictionary<string>;
  params: Dictionary<string>;
  fullPath: string;
  matched: Array<RouteRecord>;
  redirectedFrom?: string;
  meta?: any;
}
