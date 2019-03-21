import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      children: [
        {
          path: '/article',
          name: 'article',
          // route level code-splitting
          // this generates a separate chunk (article.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "article" */ './views/Article.vue')
        },
        {
          path: '/bug',
          name: 'bug',
          component: () => import('./views/Bug.vue')
        },
        {
          path: '/userInfo',
          name: 'userInfo',
          component: () => import('./views/UserInfo.vue')
        }, {
          path: '/dictionary',
          name: 'dictionary',
          component: () => import('./views/Dictionary.vue')
        }
      ]
    }
  ]
})
