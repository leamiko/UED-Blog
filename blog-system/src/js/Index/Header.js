import Bus from '../../Share/Bus.js'
export default {
  data () {
    return {
      nickName: '',
      collapsed: false
    }
  },
  mounted () {
    this.nickName = this.localEvent.StorageGetter('user').account
  },
  methods: {
    toggleCollapse () {
      this.collapsed = !this.collapsed
      Bus.$emit('menuCollapse', this.collapsed)
    },
    async logOut () {
      let url = this.api.logOut
      const res = await this.$http.get(url)
      if (res.status_code === 200) {
        this.$router.push('/login')
      }
    }
  }
}
