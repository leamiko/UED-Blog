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
  >
    <img src="@/assets/img/bg/bg-dialog-reg.png" slot="title" class="dialog-img" />

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
      <!-- <el-button @click="cancelModal">取 消</el-button>
      <el-button type="primary" @click="submitForm('form1')">保存</el-button>-->
      <button @click="cancelModal" class="cancel-btn">取 消</button>
      <button type="primary" @click="submitForm('form1')" class="test-btn">测试匹配</button>
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
      testResult: "",
      userInfo: null
    };
  },
  mounted() {
    if (window.localStorage.getItem("user")) {
      this.userInfo = JSON.parse(window.localStorage.getItem("user"));
    }
  },
  methods: {
    // 关闭弹窗，触发父组件修改visible值
    cancelModal() {
      this.$emit("update:visible", false);
    },
    async addRegular() {
      if (!this.userInfo) {
        this.$notify.error({
          title: "失败",
          message: "未登录！"
        });
        return;
      }
      let params = {
        regularName: this.form1.name,
        regularDescribe: this.form1.desc,
        regular: this.form1.reg,
        userId: this.userInfo._id
      };
      const { data } = await this.$axios.post(
        `${process.env.BASE_URL}/web_api/addRegular`,
        params
      );
      if (data.status_code === 200) {
        this.$notify.success({
          title: "成功",
          message: "正则添加成功"
        });
        this.$emit("update:visible", false);
      } else {
        this.$notify.error({
          title: "失败",
          message: data.message
        });
      }
    },

    // 提交验证
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addRegular();
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
  padding: 30p x 20px 0;
}
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
