import { warn } from '../util/warn'
import { extend } from '../util/misc'
import { handleRouteEntered } from '../util/route'
// 函数式组件
// 每次路由切换都会触发 router-view 重新 render 从而渲染出新的视图
export default {
  name: 'RouterView',
  // 使组件无状态 (没有 data) 和无实例 (没有 this 上下文)。他们用一个简单的 render 函数返回虚拟节点使它们渲染的代价更小。
  functional: true,
  // 如果 <router-view> 设置了 name，则会渲染对应的路由配置中 components 下的相应组件
  props: {
    name: {
      type: String,
      default: 'default'
    }
  },
  render (_, { props, children, parent, data }) {
    // console.log(children)
    // console.log(parent)--- vue实例
    // console.log(data)
    // used by devtools to display a router-view badge
    // 由devtools用于显示路由器视图标记
    data.routerView = true

    // directly use parent context's createElement() function
    // so that components rendered by router-view can resolve named slots
    // 直接使用父上下文的createElement（）函数,这样，路由器视图渲染的组件可以解析命名插槽
    const h = parent.$createElement
    const name = props.name
    // 默认default
    const route = parent.$route
    // route ==> fullPath: "/items/1/logs",hash: "",matched: [{…}],meta: {},name: undefined,params: {id: "1"},path: "/items/1/logs",query: {} 
    const cache = parent._routerViewCache || (parent._routerViewCache = {}) //  //获取父组件的_routerViewCache属性，如果没有则初始化为空对象
    // determine current view depth, also check to see if the tree
    // has been toggled inactive but kept-alive.
    // 确定当前视图深度，同时检查树是否已切换为非活动状态但保持活动状态。
    let depth = 0        //组件嵌套的层次
    let inactive = false // 是否在keep-alive组件内
    // debugger
    while (parent && parent._routerRoot !== parent) {
      const vnodeData = parent.$vnode ? parent.$vnode.data : {}
      if (vnodeData.routerView) {
        depth++
      }
      if (vnodeData.keepAlive && parent._directInactive && parent._inactive) {
        inactive = true
      }
      parent = parent.$parent
    }
    data.routerViewDepth = depth

    // render previous view if the tree is inactive and kept-alive
    // 如果树处于非活动状态并保持活动状态，则渲染上一个视图
    if (inactive) {
      const cachedData = cache[name]
      const cachedComponent = cachedData && cachedData.component
      if (cachedComponent) {
        // #2301
        // pass props
        if (cachedData.configProps) {
          fillPropsinData(cachedComponent, data, cachedData.route, cachedData.configProps)
        }
        return h(cachedComponent, data, children)
      } else {
        // render previous empty view
        return h()
      }
    }
    debugger
    // 一个数组，包含当前路由的所有嵌套路径片段的路由记录 。路由记录就是 routes 配置数组中的对象副本 (还有在 children 数组)。
    const matched = route.matched[depth]
    const component = matched && matched.components[name]

    // render empty node if no matched route or no config component
    // 如果没有匹配的路由或配置组件，则渲染空节点
    if (!matched || !component) {
      cache[name] = null
      return h()
    }
    // debugger
    // cache component
    // 缓存组件
    cache[name] = { component }

    // attach instance registration hook
    // this will be called in the instance's injected lifecycle hooks
    // 附加实例注册挂钩
    // 这将在实例的注入生命周期挂钩中调用
    data.registerRouteInstance = (vm, val) => {
      // val could be undefined for unregistration
      const current = matched.instances[name]
      if (
        (val && current !== vm) ||
        (!val && current === vm)
      ) {
        matched.instances[name] = val
      }
    }

    // also register instance in prepatch hook
    // in case the same component instance is reused across different routes
    ;(data.hook || (data.hook = {})).prepatch = (_, vnode) => {
      matched.instances[name] = vnode.componentInstance
    }

    // register instance in init hook
    // in case kept-alive component be actived when routes changed
    // 在init hook中注册实例，以防路由更改时保持活动的组件被激活
    data.hook.init = (vnode) => {
      if (vnode.data.keepAlive &&
        vnode.componentInstance &&
        vnode.componentInstance !== matched.instances[name]
      ) {
        matched.instances[name] = vnode.componentInstance
      }
      console.log('执行了')
      // if the route transition has already been confirmed then we weren't
      // able to call the cbs during confirmation as the component was not
      // registered yet, so we call it here.
      handleRouteEntered(route)
    }

    const configProps = matched.props && matched.props[name]
    // save route and configProps in cache
    if (configProps) {
      extend(cache[name], {
        route,
        configProps
      })
      fillPropsinData(component, data, route, configProps)
    }

    return h(component, data, children)
  }
}

function fillPropsinData (component, data, route, configProps) {
  // resolve props
  let propsToPass = data.props = resolveProps(route, configProps)
  if (propsToPass) {
    // clone to prevent mutation
    propsToPass = data.props = extend({}, propsToPass)
    // pass non-declared props as attrs
    const attrs = data.attrs = data.attrs || {}
    for (const key in propsToPass) {
      if (!component.props || !(key in component.props)) {
        attrs[key] = propsToPass[key]
        delete propsToPass[key]
      }
    }
  }
}
// props?: boolean | Object | Function,
function resolveProps (route, config) {
  switch (typeof config) {
    case 'undefined':
      return
    case 'object':
      return config
    case 'function':
      return config(route)
    case 'boolean':
      return config ? route.params : undefined
    default:
      if (process.env.NODE_ENV !== 'production') {
        warn(
          false,
          `props in "${route.path}" is a ${typeof config}, ` +
          `expecting an object, function or boolean.`
        )
      }
  }
}
