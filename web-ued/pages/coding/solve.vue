<template>
  <div class="cus-full-width cus-full-height hidden">
    <my-scrollbar>
      <div slot="container">
        <div class="cus-fixed cus-header">
          <my-header activeLabel="打码"></my-header>
        </div>
        <div class="my-content">
          <el-card>
            <div slot="header">
              <h5>提供解决方案</h5>
            </div>
            <div>
              <div :content="content" v-quill:myQuillEditor="editorOption" @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @ready="onEditorReady($event)"></div>
            </div>
          </el-card>
        </div>
        <my-footer :hasMenu="true"></my-footer>
      </div>
    </my-scrollbar>
  </div>
</template>

<script>
import * as custom from '@/assets/js/custom.config';
import MyScrollbar from '@/components/scroller/Scrollbar';
import MyHeader from '@/components/header/Header';
import MyFooter from '@/components/footer/Footer';
import MySearch from '@/components/search/Search';
export default {
  components: {
    MyScrollbar,
    MyHeader,
    MyFooter,
    MySearch
  },
  data() {
    return {
      searchVal: '',
      className: 'custom-dialog',
      content: '',
      editorOption: custom.editorOption
    }
  },
  methods: {
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
  },
  mounted() {
    console.log('app init, my quill insrance object is:', this.myQuillEditor);
  }
}
</script>

<style lang="scss" scoped>
.center {
  margin: 0 auto;
}
.cus-header {
  top: 0;
  width: 100%;
  z-index: 11;
  background: white;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 0px 2px;
}
.my-content {
  padding-top: 100px;
  padding-bottom: 60px;
  min-height: 560px;
  min-width: 600px;
  max-width: 1200px;
  @extend .center;
}
</style>>
