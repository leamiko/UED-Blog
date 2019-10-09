<template>
<el-card class="cus-flex cus-align-center cus-flex-center cus-height">
  <span>如你所料，果然没搜到！不妨试试</span>&emsp;&emsp;
  <el-button type="primary" plain round size="small" @click="emit()">我要提问</el-button>
</el-card>
</template>
<script>
export default {
  methods: {
    emit() {
      this.$emit('active', true);
    }
  }
}
</script>
<style lang="scss" scoped>
.cus-height {
  height: 218px;
}
</style>
