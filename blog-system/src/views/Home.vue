<template>
  <a-layout id="components-layout-demo-custom-trigger">
    <!-- menu -->
    <a-menu></a-menu>
    <a-layout>
      <!-- header -->
      <a-header></a-header>
      <!-- content -->
      <a-layout-content class="layout_content">
         <router-view/>
      </a-layout-content>
      <!-- footer -->
      <a-footer></a-footer>
    </a-layout>
  </a-layout>
</template>
<script>
import Menu from '../components/Index/Menu'
import Header from '../components/Index/Header'
import Footer from '../components/Index/Footer'
export default {
  data () {
    return {
      collapsed: false
    }
  },
  components: {
    'a-menu': Menu,
    'a-header': Header,
    'a-footer': Footer
  }
}
</script>
<style>
</style>
