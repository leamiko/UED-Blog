<template>
  <my-scrollbar>
    <div slot="container">
      <el-button type="primary" @click="reload()">刷新测试</el-button>
      <Logo></Logo>
    </div>
  </my-scrollbar>
</template>

<script>
import Logo from '@/components/Logo';
import MyScrollbar from '@/components/Scrollbar';

export default {
  inject: ['reload'],
  // fetch ({ redirect, store }) {
  //   console.log(store.state)
  //   if (!store.state.authToken) {
  //     redirect('/login');
  //   }
  // },
  components: {
    Logo,
    MyScrollbar
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
</style>
