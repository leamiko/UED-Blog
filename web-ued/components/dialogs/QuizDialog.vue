<template>
  <el-dialog :visible.sync="show" width="750px" :custom-class="classStyle" :before-close="handleClose" destroy-on-close append-to-body>
    <img src="@/assets/img/bg/bg-dialog-ask.png" slot="title" class="dialog-img">
    <div class="cus-flex cus-align-center">
      <el-avatar :size="48" :src="avator" class="align-top"></el-avatar>&emsp;
      <el-input class="inline" v-model="input" :placeholder="placeholder"></el-input>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-checkbox v-model="isAnonymous">匿名只是你穿的保护色～</el-checkbox>&emsp;&emsp;
      <el-button type="primary" round size="small">&emsp;发&nbsp;布&emsp;</el-button>
    </div>
  </el-dialog>
</template>
<script>
import avatorUrl from '@/assets/img/icon/icon-system-avator.svg';
export default {
  props: {
    isShow: {
      default: false,
      type: Boolean,
      required: true
    },
    classStyle: {
      default: null,
      type: String,
      required: false
    },
    avator: {
      default: avatorUrl,
      type: String,
      required: false
    },
    placeholder: {
      default: null,
      type: String,
      required: false
    }
  },
  data() {
    return {
      show: false,
      isAnonymous: false,
      input: ''
    }
  },
  watch: {
    isShow(newVal, oldVal) {
      this.show = newVal;
    }
  },
  methods: {
    handleClose(done) {
      this.$emit('hide', true);
      this.show = false;
      // done();
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-img {
  width: 750px;
  margin: -20px;
}
</style>
