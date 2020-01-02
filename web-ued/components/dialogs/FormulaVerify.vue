<template>
  <el-dialog
    title
    :visible.sync="visible"
    width="40%"
    :modal="true"
    :before-close="cancelModal"
    destroy-on-close
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="dialog"
  >
    <img src="@/assets/img/bg/bg-dialog-reg.png" slot="title" class="dialog-img" />
    <el-form
      :label-position="labelPosition"
      :model="form"
      label-width="120px"
      status-icon
      :rules="rules"
      ref="form"
      class="demo-ruleForm reg-from"
      hide-required-asterisk
    >
      <el-form-item label="正则表达式" prop="name" class="from-label">
        <el-input
          v-model="form.name"
          autocomplete="off"
          :disabled="disabled"
          placeholder="请在此输入正则表达式"
        ></el-input>
      </el-form-item>
      <el-form-item label="测试内容" prop="content" class="from-label" placeholder="请在此输入测试内容">
        <el-input v-model="form.content" autocomplete="off"></el-input>
      </el-form-item>
      <!-- <el-form-item label="测试结果" prop="result" class="from-label">
        <span :class="{'red' : !result, 'green': result}">{{testResult}}</span>
      </el-form-item>-->
      <div class="result">
        <label>测试结果</label>
        <span :class="{'red' : !result, 'green': result}">{{testResult}}</span>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <button @click="cancelModal" class="cancel-btn">取 消</button>
      <el-button type="primary" round size="small" @click="submitForm('form')">测试匹配</el-button>
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
      testResult: "",
      result: false
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
          //     console.log(this.form.name.substr(1));
          // const reg= new RegExp(this.form.name.substring(1,this.form.name.length-1));
          if (new RegExp(this.form.name).test(this.form.content)) {
            this.testResult = "验证成功";
            this.result = true;
          } else {
            this.testResult = "验证失败";
            this.result = false;
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style lang="scss">
.reg-from {
  padding: 30px 20px 0;
  .el-form-item {
    margin-bottom: 30px;
  }
}

.el-form-item__label {
  color: #000;
  font-size: 14px;
  font-weight: 600;
}
.dialog {
  .el-dialog {
    border-radius: 15px;
    .el-dialog__header {
      padding: 0;
      margin-right: -1px;
      .dialog-img {
        width: 100%;
      }
    }
    .el-dialog__body {
      padding: 0 35px;
    }
  }
}

.cancel-btn {
  color: #9199a1;
  border-radius: 20px;
  height: 32px;
  line-height: 32px;
  background: #f2f5f6;
  margin-right: 15px;
  width: 80px;
  border: none;
}
.cancel-btn:focus {
  outline: none;
}
.dialog-footer {
  margin-right: 20px;
  margin-bottom: 20px;
}

.result {
  label {
    font-weight: 600;
    color: #000;
  }
  span {
    margin-left: 58px;
  }
  .red {
    color: #f24724;
  }
  .green {
    color: #52c41a;
  }
}
</style>
