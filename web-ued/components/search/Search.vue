<template>
  <div class="cus-flex">
    <el-input v-model="value" :placeholder="placeholder"></el-input>
    &emsp;&emsp;<el-button type="primary" round @click="emit()"> &emsp;&emsp;搜&nbsp;索&emsp;&emsp; </el-button>
  </div>
</template>
<script>
export default {
  props: {
    placeholder: {
      default: '有Bug，这里搜～',
      type: String,
      required: false
    },
    value: {
      default: '',
      type: String,
      required: false
    }
  },
  methods: {
    emit() {
      this.$emit('search', this.value);
    }
  }
}
</script>
