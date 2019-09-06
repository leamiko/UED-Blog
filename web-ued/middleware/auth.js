/**
 * 已作为全局使用，位置 nuxt.conf.js
 * 如非全局请手动删除 conf ，在单独的页面中添加
 */

export default function ({ redirect, store, error }) {
  if (!store.state.authToken) {
    redirect('/login')
    // error({
    //   message: 'You are not connected',
    //   statusCode: 403
    // })
  }
}
