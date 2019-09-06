<template>
  <div class="">
    {{title}}<br>
    <el-button type="primary" @click="haha">主要按钮</el-button>

    {{time | formatDateYear}}

    <Logo></Logo>
  </div>
</template>

<script>
import Logo from '../components/Logo';
export default {
  components: {
    Logo
  },
  data() {
    return {
      title: 'Hello World',
      time: '2019-09-05 17:08:22'
    }
  },
  head() {
    return {
      title: '首页',
      meta: [
        { hid: 'description', name: 'description', content: 'My custom description' }
      ]
    }
  },
  methods: {
    haha() {
      console.log(this.title);
      console.log(this.$op.moment().format('YYYY-MM-DD HH:mm:ss'));
    }
  },
  created() {
    this.$message({
      message: '恭喜你，这是一条成功消息',
      type: 'success'
    });
  }
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
