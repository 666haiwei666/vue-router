/* @flow */
import { inBrowser } from './dom'

// use User Timing api (if present) for more accurate key precision
// 是W3C性能小组引入的新的API，目前IE9以上的浏览器都支持。一个performance对象的完整结构如下图所示：
// 
const Time =
  inBrowser && window.performance && window.performance.now
    ? window.performance
    : Date

export function genStateKey (): string {
  // 当前时间戳
  return Time.now().toFixed(3)
}

let _key: string = genStateKey()

export function getStateKey () {
  return _key
}

export function setStateKey (key: string) {
  return (_key = key)
}
