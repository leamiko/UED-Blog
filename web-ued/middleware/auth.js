import * as VueCookie from 'vue-cookies'

export default function({ store, redirect, route, error }) {
  //刷新跳转登录页
  // if (route.fullPath !== '/login' && route.fullPath !== '/register') {
  //   if (!store.state.authToken) {
  //     return redirect('/login')
  //     // error({
  //     //   message: 'You are not connected',
  //     //   statusCode: 403
  //     // })
  //   }
  // }
}
