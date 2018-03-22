import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/'

const _import = require('./_import_' + process.env.NODE_ENV)

Vue.use(Router)

import Layout from '../views/layout/Layout'

export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/401', component: _import('errorPage/401'), hidden: true }
]
export const asyncRouterMap = [
  {
    path: '',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index'),
      name: 'dashboard',
      meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
    }]
  },
  {
    path: '/server',
    component: Layout,
    redirect: '/server/server',
    children: [{
      path: 'server',
      component: _import('server/index'),
      name: 'server',
      meta: { title: 'server', icon: 'images', noCache: true }
    }]
  },
  {
    path: '/images',
    component: Layout,
    redirect: '/images/images',
    children: [{
      path: 'images',
      component: _import('images/index'),
      name: 'images',
      meta: { title: 'images', icon: 'images', noCache: true }
    }]
  },
  {
    path: '/terminal',
    redirect: '/terminal/terminal',
    component: Layout,
    children: [{
      path: 'terminal',
      component: _import('terminal/index'),
      name: 'terminal',
      meta: { title: 'terminal', icon: 'terminal', noCache: true }
    }]
  },
  { path: '*', redirect: '/404', hidden: true }
]
export default new Router({
  // mode: 'history', // 需要服务器端支持
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap.concat(generateRoutesFromPermission(asyncRouterMap))
})

function generateRoutesFromPermission(menus = []) {
  store.dispatch('GenerateRoutes', menus)
  return menus
}
