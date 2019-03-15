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
    Bus.$on('menuCollapse', (value) => {
      this.IsOpen = value
    })

    // 获取当前加载页面url的key
    this.menuList.forEach(item => {
      if (item.linkUrl === this.$route.path) {
        this.initKey = item.code
        return true
      }
    })
  },
  methods: {
    selectItem (code) {
      this.initKey = code
    }
  }
}
