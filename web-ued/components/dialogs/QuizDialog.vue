<template>
  <el-dialog :visible.sync="show" width="750px" :custom-class="classStyle" :before-close="handleClose" destroy-on-close append-to-body>
    <!-- 内层 -->
    <el-dialog :visible.sync="innerVisible" :show-close="false" width="390px" center append-to-body :before-close="innerClose">
        <template slot="title">
          <h5 class="font-size--md text-dark line-height--lg">{{resultMsg}}</h5>
        </template>
      <div class="text-center">
        <p v-show="resultError">{{resultError}}</p>
        <img :src="resultImage" class="my-img">
      </div>
    </el-dialog>
    <img src="@/assets/img/bg/bg-dialog-ask.png" slot="title" class="dialog-img">
    <div class="dialog-content">
      <el-avatar :size="48" :src="avator" class="align-top"></el-avatar>
      <div class="inline inline_auto">
        <el-input v-model="input" :placeholder="placeholder" @focus="showContent = true" maxlength="40"></el-input>
        <h5 class="text-dark font-size--md line-height--lg" v-if="showContent">问题描述</h5>
        <my-editor v-if="showContent" :height="'99px'" @change="onEditorChange" ref="myEditor"></my-editor>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-checkbox v-model="isAnonymous">匿名只是你穿的保护色～</el-checkbox>&emsp;&emsp;
      <el-button type="primary" round size="small" @click="submit()">&emsp;提&nbsp;问&emsp;</el-button>
    </div>
  </el-dialog>
</template>
<script>
import avatorUrl from '@/assets/img/icon/icon-system-avator.svg';
import successImg from '@/assets/img/image/image-system-submit-success.svg';
import failImg from '@/assets/img/image/image-system-submit-fail.png';
import * as custom from '@/assets/js/custom.config';
import MyEditor from '@/components/Editor';
export default {
  components: {
    MyEditor
  },
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
    // avator: {
    //   default: avatorUrl,
    //   type: String,
    //   required: false
    // },
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
      showContent: false,
      avator: avatorUrl,
      userInfo: null,
      editorOption: custom.editorOption,
      resultMsg: '',
      resultImage: '',
      innerVisible: false,
      resultError: null
    }
  },
  watch: {
    isShow(newVal, oldVal) {
      this.show = newVal;
    }
  },
  mounted() {
    // 获取用户信息
    if (window.localStorage.getItem('user')) {
      this.userInfo = JSON.parse(window.localStorage.getItem('user'));
      this.avator = this.userInfo.avatar ? this.userInfo.avatar : avatorUrl;
    }
  },
  methods: {
    handleClose(done) {
      this.$emit('hide', true);
      this.showContent = false;
      this.show = false;
      this.$router.replace({
        path: '/coding/list'
      })
      // done();
    },
    innerClose(done) {
      this.innerVisible = false;
      // 如果发布成功，直接关闭一级模态框
      if (!this.resultError) {
        this.handleClose();
      }
    },
    // onEditorBlur(editor) {
    //   console.log('editor blur!', editor)
    // },
    // onEditorFocus(editor) {
    //   console.log('editor focus!', editor)
    // },
    // onEditorReady(editor) {
    //   console.log('editor ready!', editor)
    // },
    onEditorChange({ editor, html, text }) {
      this.content = html;
    },
    async submit() {
      if (!this.input) {
        this.$notify.error({
          title: '错误',
          message: '请填写提问标题！'
        });
        return;
      }
      if (!this.content) {
        this.$notify.error({
          title: '错误',
          message: '请填写提问描述！'
        });
        return;
      }
      const params = {
        title: this.input,
        content: this.content,
        tags: [],
        bugStatus: true,
        bugSolution: null
      };
      const res = await this.$axios.post(`${process.env.BASE_URL}/web_api/AddBugItems`, params);
      if (res.status === 200 && res.data.message === 'success') {
        this.resultError = null;
        this.resultMsg = '发布成功!';
        this.resultImage = successImg;
        this.innerVisible = true;
      } else {
        this.resultError = res.data.message;
        this.resultMsg = '发布失败!';
        this.resultImage = failImg;
        this.innerVisible = true;
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/style/cus.scss';
.dialog-img {
  width: 750px;
  margin: -20px;
}
.dialog-content {
  padding: 12px 16px 0;
  margin-bottom: -15px;
}
.inline_auto {
  width: 622px;
  padding: 0 20px;
  .height_48 {
    height: 48px;
  }
}
.dialog-footer {
  padding-right: 38px;
}
</style>
