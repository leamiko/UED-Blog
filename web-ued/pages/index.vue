<template>
  <div class="container">
    {{title}}
  </div>
</template>

<script>

export default {
  components: {
  },
  data() {
    return {
      title: 'OHMA ZI-O'
    }
  },
  methods() {

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
