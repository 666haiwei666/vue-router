/* @flow */

import type VueRouter from '../index'
import { parsePath, resolvePath } from './path'
import { resolveQuery } from './query'
import { fillParams } from './params'
import { warn } from './warn'
import { extend } from './misc'

export function normalizeLocation (
  raw: RawLocation,
  current: ?Route,
  append: ?boolean, // 设置 append 属性后，则在当前 (相对) 路径前添加基路径
  router: ?VueRouter
): Location {
  let next: Location = typeof raw === 'string' ? { path: raw } : raw
  // named target
  if (next._normalized) {
    return next

    // 对 raw 进行了一次深拷贝赋值给了next
  } else if (next.name) {
    next = extend({}, raw)
    const params = next.params
    if (params && typeof params === 'object') {
      next.params = extend({}, params)
    }
    return next
  }
  console.log(!next.path && next.params && current)
  // relative params
  // 如果raw的path不存在，并且有参数，有当前浏览器的路径
  if (!next.path && next.params && current) {
    // debugger
    next = extend({}, next)
    next._normalized = true
    // 先拷贝了一份当前浏览的参数，在此基础上有合并了raw的参数
    const params: any = extend(extend({}, current.params), next.params)
    // 如果当前有name，则参数覆盖，名称也覆盖
    if (current.name) {
      next.name = current.name
      next.params = params
      // matched 一个数组，包含当前路由的所有嵌套路径片段的路由记录
    } else if (current.matched.length) {
      const rawPath = current.matched[current.matched.length - 1].path
      next.path = fillParams(rawPath, params, `path ${current.path}`)
    } else if (process.env.NODE_ENV !== 'production') {
      warn(false, `relative params navigation requires a current route.`)
    }
    return next
  }

  const parsedPath = parsePath(next.path || '')
  const basePath = (current && current.path) || '/'
  const path = parsedPath.path
    ? resolvePath(parsedPath.path, basePath, append || next.append)
    : basePath
  const query = resolveQuery(
    parsedPath.query,
    next.query,
    router && router.options.parseQuery
  )

  let hash = next.hash || parsedPath.hash
  if (hash && hash.charAt(0) !== '#') {
    hash = `#${hash}`
  }

  return {
    _normalized: true,
    path,
    query,
    hash
  }
}
