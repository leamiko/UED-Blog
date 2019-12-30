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
      :model="form1"
      label-width="120px"
      status-icon
      :rules="rules"
      ref="form1"
      class="demo-ruleForm reg-from"
      hide-required-asterisk
    >
      <el-form-item label="名称" prop="name">
        <el-input v-model="form1.name" autocomplete="off" placeholder="请在此输入名称"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="desc">
        <el-input v-model="form1.desc" autocomplete="off"  placeholder="请在此输入描述"></el-input>
      </el-form-item>
      <el-form-item label="正则表达式" prop="reg">
        <el-input v-model="form1.reg" autocomplete="off"  placeholder="请在此输入正则表达式"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <button @click="cancelModal" class="cancel-btn">取 消</button>
      <el-button type="primary" round size="small" @click="submitForm('form1')">测试匹配</el-button>
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
</style>