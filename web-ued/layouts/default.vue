<template>
  <nuxt v-show="isRouterAlive" v-loading="isloading"></nuxt>
</template>

<script>
export default {
  provide() {
    return {
      reload: this.reload,
      isloading: this.reloading
    }
  },
  data() {
    return {
      isRouterAlive: true,
      isloading: false
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    },
    reloading() {
      this.isloading = true
      this.$nextTick(() => {
        this.isloading = false
      })
    }
  }
}
</script>>
