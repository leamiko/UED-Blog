<template>
  <el-dialog :visible.sync="show" width="750px" :custom-class="classStyle" :before-close="handleClose" destroy-on-close append-to-body>
    <img src="@/assets/img/bg/bg-dialog-ans.png" slot="title" class="dialog-img">
    <div>
      <el-avatar :size="40" :src="avator" class="align-top"></el-avatar>
      <div class="inline" style="width: 582px;">
        <div>占位符</div>
        <div class="cus-flex cus-flex-between">
          <a href="">#添加标签</a>
          <p>最多只能输入40个字哦～</p>
        </div>
        <div editor>https://simditor.tower.im/</div>
        <div editor>https://surmon-china.github.io/vue-quill-editor/</div>
      </div>
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
    }
  },
  data() {
    return {
      show: false,
      isAnonymous: false
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
      done();
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
