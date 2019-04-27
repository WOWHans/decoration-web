import router from './router'
import store from './store'
// import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth'
// import getters from './store/getters' // get token from cookie

NProgress.configure({ showSpinner: false }) // NProgress Configuration

// permission judge function
// function hasPermission(roles, permissionRoles) {
//   if (roles.includes('admin')) return true // admin permission passed directly
//   if (!permissionRoles) return true
//   return roles.some(role => permissionRoles.indexOf(role) >= 0)
// }

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist
router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  if (getToken()) {
    // determine if there has token

    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      // 判断当前用户是否已拉取完user_info信息
      // const roles = store.getters.roles // note: roles must be a object array! such as: [{id: '1', name: 'editor'}, {id: '2', name: 'developer'}]
      if (store.getters.addRouters.length <= 0) {
        store.dispatch('GetUserInfo').then(res => {
          store.dispatch('GetMenuTree').then(menuTree => {
            store.dispatch('GenerateRoutes', { menuTree }).then(accessedRouters => {
              // 根据roles权限生成可访问的路由表
              router.addRoutes(accessedRouters) // 动态添加可访问路由表
              next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
            })
          })
        })
      } else {
        next()
      }
      // store
      //   .dispatch('GetUserInfo')
      //   .then(res => {
      //     // 拉取user_info
      //   })
      //   .catch(err => {
      //     store.dispatch('FedLogOut').then(() => {
      //       Message.error(err)
      //       next({ path: '/' })
      //     })
      //   })
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
