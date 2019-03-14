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
    // var localCode = localStorage.getItem('menuCode')
    // this.initKey = '\'' + localCode + '\''
    Bus.$on('menuCollapse', (value) => {
      this.IsOpen = value
    })
  },
  methods: {
    selectItem (code) {
      console.log(code)
      this.initKey = '\'' + code + '\''
      // localStorage.setItem('menuCode', code)
    }
  }
}
