import Bus from '../../Share/Bus.js'
export default {
  data () {
    return {
      collapsed: false
    }
  },
  methods: {
    toggleCollapse () {
      this.collapsed = !this.collapsed
      Bus.$emit('menuCollapse', this.collapsed)
    }
  }
}
