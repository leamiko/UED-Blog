import Bus from '../../Share/Bus.js'
import StaticData from '../../Share/StaticData.js'
export default {
  data () {
    return {
      IsOpen: false,
      menuList: StaticData.menuList,
      initKey: '1'
    }
  },
  mounted () {
    Bus.$on('menuCollapse', value => {
      this.IsOpen = value
    })

    // 获取当前加载页面url的key  高亮
    this.menuList.forEach(item => {
      if (item.linkUrl === this.$route.path) {
        this.initKey = item.code
        return true
      }
    })
    const authorization = this.localEvent.StorageGetter('user').authorization
    if (authorization.length > 0) {
      this.menuList = this.menuList.filter(item => {
        return authorization.indexOf(item.code) > -1
      })
    }
  },
  methods: {
    selectItem (code) {
      this.initKey = code
    }
  }
}
