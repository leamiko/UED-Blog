<template>
  <div :style="{'height': this.height}" :content="content" v-quill:myQuillEditor="editorOption" @change="onEditorChange"  @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @ready="onEditorReady($event)"></div>
</template>
<script>
import * as custom from '@/assets/js/custom.config';
export default {
  props: {
    placeholder: {
      default: '请在这里输入',
      type: String,
      required: false
    },
    tools: {
      default: null,
      type: Object/Array,
      required: false
    },
    theme: {
      default: 'snow',
      type: String,
      required: false
    },
    height: {
      default: '150px',
      type: String,
      required: false
    }
  },
  data() {
    return {
      content: '',
      editorOption: {
        placeholder: this.placeholder,
        modules: [],
        theme: this.theme
      }
    }
  },
  created() {
    if (!this.tools || (this.tools && this.tools.length == 0)) {
      this.editorOption.modules = custom.editorOption.modules;
    }
  },
  methods: {
    onEditorBlur(editor) {
      this.$emit('blur', editor);
    },
    onEditorFocus(editor) {
      this.$emit('focus', editor);
    },
    onEditorReady(editor) {
      this.$emit('ready', editor);
    },
    onEditorChange({ editor, html, text }) {
      // console.log('editor change!', editor, html, text)
      this.content = html;
      this.$emit('change', { editor, html, text });
    },
    clear() {
      this.content = '<p></p>';
    }
  }
}
</script>
