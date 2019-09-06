<template>
  <el-container>
    <el-header>
      <Header></Header>
    </el-header>
    <el-main>
      <transition name="el-zoom-in-center">
        <nuxt />
      </transition>
    </el-main>
    <el-footer>
      <Footer></Footer>
    </el-footer>
  </el-container>
</template>

<script>
import Header from '@/components/Header';
import Footer from '@/components/Footer';
export default {
  components: {
    Header,
    Footer
  }
}
</script>
