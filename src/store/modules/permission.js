import { constantRouterMap } from '@/router'
import Layout from '@/views/layout/Layout'

const _import = path => () => import(`@/views/${path}`)

function mapAsyncRoutes(asyncRouterMap) {
  return asyncRouterMap.map(route => {
    route = generateRouter(route)
    if (route.children) {
      route.children = mapAsyncRoutes(route.children)
    }
    return route
  })
}

function generateRouter(item) {
  const meta = { icon: item.icon, title: item.name }
  var router = {
    path: item.url,
    name: item.alias,
    meta: meta,
    component: item.component === 'Layout' ? Layout : _import(item.component),
    redirect: item.redirect ? item.redirect : item.component === 'Layout' ? 'noredirect' : '',
    alwaysShow: item.children.length === 1,
    children: item.children
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
        const accessedRouters = mapAsyncRoutes(data.menuTree)
        commit('SET_ROUTES', accessedRouters)
        resolve(accessedRouters)
      })
    }
  }
}

export default permission
