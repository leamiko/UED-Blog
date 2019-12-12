<template>
  <el-dialog
    title
    :visible.sync="visible"
    width="40%"
    :show-close="false"
    :modal="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :label-position="labelPosition"
      :model="form"
      label-width="120px"
      status-icon
      :rules="rules"
      ref="form"
      class="demo-ruleForm"
      hide-required-asterisk
    >
      <el-form-item label="正则表达式" prop="name">
        <el-input v-model="form.name" autocomplete="off" :disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item label="测试内容" prop="content">
        <el-input v-model="form.content" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="测试结果" prop="result">{{testResult}}</el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelModal">取 消</el-button>
      <el-button type="primary" @click="submitForm('form')">测试匹配</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      disabled: Boolean,
      form: {},
      // form: {
      //   name: "",
      //   content: "",
      //   result: ""
      // },
      labelPosition: "left",
      rules: {
        name: [
          { required: true, message: "请输入正则表达式", trigger: "blur" }
        ],
        content: [
          { required: true, message: "请输入测试内容", trigger: "blur" }
        ]
      },
      testResult: ""
    };
  },
  mounted() {},
  methods: {
    initForm() {
      this.form = {
        name: "",
        content: "",
        result: ""
      };
      if (this.$refs.form) {
        this.$refs.form.resetFields();
      }
    },
    cancelModal() {
      // 关闭弹窗，触发父组件修改visible值
      this.$emit("update:visible", false);
    },
    // 提交验证
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (new RegExp(this.form.name).test(this.form.content)) {
            this.testResult = "验证成功";
          } else {
            this.testResult = "验证失败";
          }
        } else {
          return false;
        }
      });
    },
  }
};
</script>
<style lang="scss" scoped>
.demo-ruleForm {
  padding: 30px 20px 0;
}
</style>
