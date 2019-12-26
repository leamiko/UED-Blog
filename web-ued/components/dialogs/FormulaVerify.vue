<template>
  <el-dialog
    title
    :visible.sync="visible"
    width="40%"
    :modal="true"
    :before-close="cancelModal" 
    destroy-on-close append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <img src="@/assets/img/bg/bg-dialog-reg.png" slot="title" class="dialog-img" />
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
      <el-form-item label="正则表达式" prop="name" class="from-label">
        <el-input v-model="form.name" autocomplete="off" :disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item label="测试内容" prop="content" class="from-label">
        <el-input v-model="form.content" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="测试结果" prop="result" class="from-label">{{testResult}}</el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <button @click="cancelModal" class="cancel-btn">取 消</button>
      <button type="primary" @click="submitForm('form')" class="test-btn">测试匹配</button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    reg: {
      type: String,
      default: false
    }
  },
  data() {
    return {
      form: {
        name: this.reg,
        content: "",
        result: ""
      },
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
    // 关闭弹窗，触发父组件修改visible值
    cancelModal() {
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
    }
  }
};
</script>
<style lang="scss" scoped>
.demo-ruleForm {
  padding: 30px 20px 0;
}
.dialog-img {
  width: 771px;
  margin: -21px;
}
.cancel-btn {
  color: #9199a1;
  border-radius: 20px;
  height: 30px;
  line-height: 28px;
  background: #f2f5f6;
  margin-right: 15px;
  width: 80px;
  border: none;
}
.cancel-btn:focus {
  outline: none;
}
.test-btn {
  color: #fff;
  border: 1px solid #3376ff;
  border-radius: 20px;
  height: 30px;
  line-height: 27px;
  background: #3376ff;
  width: 80px;
}
.test-btn:focus {
  outline: none;
}
.dialog-footer {
  margin-right: 20px;
  margin-bottom: 20px;
}
</style>
<style lang="scss">
.el-form-item__label {
  color: #000;
  font-size: 15px;
  font-weight: 600;
}
</style>
