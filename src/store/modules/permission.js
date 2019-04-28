import { constantRouterMap } from '@/router'
import Layout from '@/views/layout/Layout'

const _import = path => () => import(`@/views/${path}`)
/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

function convertRouter(asyncRouterMap) {
  const accessedRouters = []
  console.log('convertRouter...', asyncRouterMap)
  if (asyncRouterMap) {
    asyncRouterMap.forEach(item => {
      var parent = generateRouter(item, true)
      var children = []
      if (item.children && item.children.length > 0) {
        item.children.forEach(child => {
          children.push(generateRouter(child, false))
          if (child.children && child.children.length >= 1) {
            console.log('child' + child.children)
            convertRouter(child)
          }
        })
      }
      parent.children = children
      accessedRouters.push(parent)
    })
  }
  accessedRouters.push({ path: '*', redirect: '/404', hidden: true })
  return accessedRouters
}

function generateRouter(item, isParent) {
  // 表单 输入 path： /sys/menu
  // name string-random 生成唯一字符串 xxxoo_sys_menu 形式 6个随机字符 + path 转换
  // redirect： 判断如果是一级菜单 noredirect
  // component: 判断如果是一级菜单component: Layout
  const meta = { icon: item.icon, title: item.name }
  var router = {
    path: item.url,
    name: item.alias,
    meta: meta,
    // component: item.component === 'Layout' ? Layout : getViews(item.component),
    component: item.component === 'Layout' ? Layout : _import(item.component),
    // redirect: item.component === 'Layout' ? 'noredirect' :  '',
    // 面包屑上 点击 redirect 的 url  首页/系统管理/菜单管理  , 可点击系统管理
    // redirect: item.redirect ? item.redirect : item.component === 'Layout' ? 'noredirect' : '',
    // component: isParent ? Layout : componentsMap[item.name],
    alwaysShow: item.children.length === 1
  }
  console.log('router....', router)
  return router
}

const permission = {
  state: {
    routers: [],
    addRouters: []
  },
  mutations: {
    SET_ROUTES: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        // const { roles } = data
        // let accessedRoutes
        // if (roles.includes('admin')) {
        //   accessedRoutes = asyncRoutes
        // } else {
        //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
        // }
        console.log('asyncRouterMap.........', data.menuTree)
        const accessedRouters = convertRouter(data.menuTree)
        console.log('accessedRouters.........', accessedRouters)
        commit('SET_ROUTES', accessedRouters)
        resolve(accessedRouters)
      })
    }
  }
}

export default permission
