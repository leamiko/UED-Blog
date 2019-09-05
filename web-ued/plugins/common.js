import Vue from 'vue'
import moment from 'moment'

let common = {
  install (Vue) {
    Vue.prototype.$op = {
      'moment': (date) => {
        let newDate = new moment(date)
        newDate.locale('zh-cn')
        return newDate
      }
    }
  }
}

Vue.use(common)

/* 过滤器 */
Vue.filter('formatDateYear', (time) => {
  return moment(time).format('YYYY')
})
Vue.filter('formatDateMon', (time) => {
  return moment(time).format('YYYY-MM')
})

Vue.filter('formatDateDay', (time) => {
  return moment(time).format('YYYY-MM-DD')
})

Vue.filter('formatDateMin', (time) => {
  return moment(time).format('YYYY-MM-DD HH:mm')
})

Vue.filter('formatDateSec', (time) => {
  return moment(time).format('YYYY-MM-DD HH:mm:ss')
})
