<template>
  <my-scrollbar hasFoot :active="'首页'">
    <div slot="container" style="min-height:800px">
      <my-header activeLabel="首页"></my-header>
      <el-button type="primary" @click="reload()">刷新测试</el-button>
      <Logo></Logo>
    </div>
  </my-scrollbar>
</template>

<script>
import Logo from '@/components/Logo';
import MyScrollbar from '@/components/Scrollbar';
import MyHeader from '@/components/Header';

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
    MyScrollbar,
    MyHeader
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
