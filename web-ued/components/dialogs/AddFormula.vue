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
      :model="form1"
      label-width="120px"
      status-icon
      :rules="rules"
      ref="form1"
      class="demo-ruleForm"
      hide-required-asterisk
    >
      <el-form-item label="名称" prop="name">
        <el-input v-model="form1.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="desc">
        <el-input v-model="form1.desc" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="正则表达式" prop="reg">
        <el-input v-model="form1.reg" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelModal">取 消</el-button>
      <el-button type="primary" @click="submitForm('form1')">测试匹配</el-button>
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
      form1: {
        name: "",
        desc: "",
        reg: ""
      },
      labelPosition: "left",
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        reg: [{ required: true, message: "请输入正则表达式", trigger: "blur" }]
      },
      testResult: ""
    };
  },
  mounted() {},
  methods: {
    // 关闭弹窗，触发父组件修改visible值
    cancelModal() {
      this.$emit("update:visible", false);
    },

    // 提交验证
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.demo-ruleForm {
  padding: 30px 20px 0;
}
</style>
