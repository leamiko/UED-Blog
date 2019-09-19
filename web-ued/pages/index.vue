<template>
  <div>
    <el-button type="primary"
               @click="reload()">刷新测试</el-button>
    <Logo></Logo>
  </div>
</template>

<script>
import Logo from '../components/Logo';
export default {
  inject: ['reload'],
  fetch ({ redirect, store }) {
    if (!store.state.authToken) {
      redirect('/login');
    }
  },
  components: {
    Logo
  },
  data () {
    return {
      title: 'Hello World'
    }
  },
  head () {
    return {
      title: '首页',
      meta: [
        { hid: 'description', name: 'description', content: 'My custom description' }
      ]
    }
  },
  methods: {},
  created () { }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
