<template>
  <el-dialog :visible.sync="show" width="750px" :custom-class="classStyle" :before-close="handleClose" destroy-on-close append-to-body>
    <img src="@/assets/img/bg/bg-dialog-ask.png" slot="title" class="dialog-img">
    <div class="cus-flex cus-align-center">
      <el-avatar :size="48" :src="avator" class="align-top"></el-avatar>&emsp;
      <el-input class="inline" v-model="input" :placeholder="placeholder"></el-input>
    </div>
    <div>
      <h5>问题描述</h5>
      <div :content="content" v-quill:myQuillEditor="editorOption" @change="onEditorChange"  @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @ready="onEditorReady($event)"></div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-checkbox v-model="isAnonymous">匿名只是你穿的保护色～</el-checkbox>&emsp;&emsp;
      <el-button type="primary" round size="small">&emsp;发&nbsp;布&emsp;</el-button>
    </div>
  </el-dialog>
</template>
<script>
import avatorUrl from '@/assets/img/icon/icon-system-avator.svg';
import * as custom from '@/assets/js/custom.config';
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
      input: '',
      content: '',
      editorOption: custom.editorOption
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
    },
    onEditorBlur(editor) {
      console.log('editor blur!', editor)
    },
    onEditorFocus(editor) {
      console.log('editor focus!', editor)
    },
    onEditorReady(editor) {
      console.log('editor ready!', editor)
    },
    onEditorChange({ editor, html, text }) {
      // console.log('editor change!', editor, html, text)
      this.content = html
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
