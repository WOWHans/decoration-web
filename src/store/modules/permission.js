import { constantRouterMap } from '@/router'
import Layout from '@/views/layout/Layout'

const _import = path => () => import(`@/views/${path}`)

function convertRouter(asyncRouterMap) {
  const accessedRouters = []
  if (asyncRouterMap) {
    asyncRouterMap.forEach(item => {
      var parent = generateRouter(item, true)
      var children = []
      if (item.children && item.children.length > 0) {
        item.children.forEach(child => {
          children.push(generateRouter(child, false))
          if (child.children && child.children.length >= 1) {
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
    redirect: item.redirect ? item.redirect : item.component === 'Layout' ? 'noredirect' : '',
    // component: isParent ? Layout : componentsMap[item.name],
    alwaysShow: item.children.length === 1
  }
  console.log('router....', router)
  return router
}

const permission = {
  state: {
    routes: [],
    addRouters: []
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes
      state.routes = constantRouterMap.concat(routes)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const accessedRouters = convertRouter(data.menuTree)
        commit('SET_ROUTES', accessedRouters)
        resolve(accessedRouters)
      })
    }
  }
}

export default permission
