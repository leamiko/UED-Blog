import * as VueCookie from 'vue-cookies'

export default function ({ store, redirect, error }) {
  if (!store.state.authToken) {
    return redirect('/login')
    // error({
    //   message: 'You are not connected',
    //   statusCode: 403
    // })
  }
}
