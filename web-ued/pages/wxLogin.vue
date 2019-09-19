<template>
  <div>
    <my-header></my-header>
    <div id="wxLoginQrcode">
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
      title: '微信登录绑定',
      meta: [
        { hid: 'description', name: 'description', content: 'My custom description' }
      ]
    }
  },
  mounted () {
    this.wxHandle()
  },
  methods: {
    wxHandle () {
      var obj = new WxLogin({
        id: "wxLoginQrcode",
        appid: process.env.WX_APP_ID,
        scope: "snsapi_login",
        redirect_uri: "http://ued.lunz.cn/api_nuxt/wxLogin",
        state: "",
        style: "",
        href: ""
      })    }
  },
  created () {
  }
}
</script>

<style>
</style>
