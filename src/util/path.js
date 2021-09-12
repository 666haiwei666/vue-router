/* @flow */

export function resolvePath (
  relative: string,
  base: string,
  append?: boolean
): string {
  // charAt() 方法可返回指定位置的字符。
  // 如果第一个字符以/开头，说明是相对路径,并返回
  const firstChar = relative.charAt(0)
  if (firstChar === '/') {
    return relative
  }
  // 如果以？或#开头，返回base + relative
  if (firstChar === '?' || firstChar === '#') {
    return base + relative
  }

  const stack = base.split('/')
  // debugger
  // remove trailing segment if:
  // - not appending
  // - appending to trailing slash (last segment is empty)
  if (!append || !stack[stack.length - 1]) {
    stack.pop() // 方法用于删除并返回数组的最后一个元素
  }

  // resolve relative path
  // 匹配relative路径，并且以/分割
  const segments = relative.replace(/^\//, '').split('/')  
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
   // 如果是.. ，返回stack删除最后一个元素
    if (segment === '..') {
      stack.pop()
      // 如果是.，则push
    } else if (segment !== '.') {
      stack.push(segment)
    }
  }

  // ensure leading slash 确保 /是第一个
  if (stack[0] !== '') {
    stack.unshift('')
  }

  return stack.join('/')
}
// 匹配路径，参数，hash值
export function parsePath (path: string): {
  path: string;
  query: string;
  hash: string;
} {
  let hash = ''
  let query = ''

  const hashIndex = path.indexOf('#')
  if (hashIndex >= 0) {
    hash = path.slice(hashIndex)
    path = path.slice(0, hashIndex)
  }

  const queryIndex = path.indexOf('?')
  if (queryIndex >= 0) {
    query = path.slice(queryIndex + 1)
    path = path.slice(0, queryIndex)
  }

  return {
    path,
    query,
    hash
  }
}
// 把// 替换为  /
export function cleanPath (path: string): string {
  return path.replace(/\/\//g, '/')
}
