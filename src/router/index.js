import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
/** note: sub-menu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    will control the page roles (you can set multiple roles)
    title: 'title'               the name show in sub-menu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if true, the page will no be cached(default is false)
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
    affix: true                  if true, the tag will affix in the tags-view
  }
 **/
export const constantRouterMap = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  }
]
export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
export const asyncRouterMap = [
  // 表单 输入 path： /sys/menu
  //  name 由最后一个 menu 取首字母大写
  // redirect： 判断如果是一级菜单 noredirect
  // component: 判断如果是一级菜单component: Layout
  // {
  //   path: '/sys',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   name: 'Sys',
  //   meta: {
  //     title: '系统管理',
  //     icon: 'nested'
  //   },
  //   children: [
  //     {
  //       path: '/sys/menu',
  //       name: 'Menu',
  //       component: () => import('@/views/sys/menu/index'),
  //       meta: {
  //         title: '菜单管理',
  //         icon: 'nested'
  //       },
  //       children: [
  //       ]
  //     },
  //     {
  //       path: '/sys/user',
  //       component: () => import('@/views/sys/user/index'), // Parent router-view
  //       name: 'User',
  //       meta: { title: '用户管理' },
  //       redirect: '',
  //       alwaysShow: true,
  //       children: [
  //         {
  //           path: 'menu1-1',
  //           component: () => import('@/views/sys/user/menu1-1'),
  //           name: 'Menu1-1',
  //           meta: { title: 'menu1-1' }
  //         }
  //       ]
  //     },
  //     {
  //       path: '/sys/role',
  //       name: 'Role',
  //       component: () => import('@/views/sys/role/index'),
  //       meta: { title: '角色管理' },
  //       children: [
  //       ]
  //     },
  //     {
  //       path: '/sys/dept',
  //       name: 'Dept',
  //       component: () => import('@/views/sys/role/index'),
  //       meta: { title: '机构管理' },
  //       children: [
  //       ]
  //     }
  //   ]
  // },
  // { path: '*', redirect: '/404', hidden: true }
]
