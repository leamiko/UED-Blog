<template>
  <div>杜林达test哈哈</div>
</template>
<script>
export default {
  data() {
    return {
      test: "123"
    };
  },
  mounted() {
    this.testss(); 
  },
  methods: {
    testss() {
      console.log(this.test);
    }
  }
};
</script>
<style lang="scss" scoped>
</style>