import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
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
          component: () => import(/* webpackChunkName: "article" */ './views/Article-management/Article.vue')
        },
        {
          path: '/article/articleShow',
          name: 'articleShow',
          component: () => import('./views/Article-management/ArticleShow.vue')
        },
        {
          path: '/bug',
          name: 'bug',
          component: () => import('./views/Bug.vue')
          // children: [{
          //   path: '/edit',
          //   name: 'edit',
          //   component: () => import('./views/BugEdit.vue')
          // }]
        },
        {
          path: '/bug/edit',
          name: 'edit',
          component: () => import('./views/BugEdit.vue')
        },
        {
          path: '/bug/add',
          name: 'add',
          component: () => import('./views/BugAdd.vue'),
          meta: {
            title: '新增Bug'
          }
        },
        {
          path: '/userInfo',
          name: 'userInfo',
          component: () => import('./views/UserInfo.vue')
        },
        {
          path: '/dictionary',
          name: 'Dictionary',
          component: () => import('./views/Dictionary.vue'),
          meta: {
            title: '字典管理'
          }
        },
        {
          path: '/bug/bugShow',
          name: 'bugShow',
          component: () => import('./views/BugShow.vue'),
          meta: {
            title: '查看Bug详情'
          }
        }
      ]
    }
  ]
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  } else {
    document.title = 'UED-Blog'
  }
  next()
})

export default router
