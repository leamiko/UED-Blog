<template>
  <div>
    <my-header></my-header>
    <div>
      <el-button type="primary" @click="reload()">刷新测试</el-button>
      <Logo></Logo>
    </div>
    <my-footer></my-footer>
  </div>
</template>

<script>
import Logo from '@/components/Logo';
import MyHeader from '@/components/Header';
import MyFooter from '@/components/Footer';

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
    MyHeader,
    MyFooter
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
