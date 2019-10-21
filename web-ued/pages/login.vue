<template>
  <div class="el-form cus-absolute cus-fix-center">
    <el-form :model="loginForm" status-icon :rules="rules2" ref="loginForm" label-width="0" v-show="!iscodeBox">
      <el-form-item prop="account">
        <el-input v-model="loginForm.account" placeholder="请输入账号" prefix-icon="el-icon-user"></el-input>
      </el-form-item>
      <el-form-item prop="passWord">
        <el-input type="passWord" v-model="loginForm.passWord" placeholder="请输入密码" auto-complete="off" prefix-icon="el-icon-lock"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('loginForm')" class="cus-full-width" :loading="submitLoading">登录</el-button>
        <div class="login">没有账号，<el-button type="text" @click="Visible">立即注册</el-button>
        </div>
      </el-form-item>
    </el-form>
    <div class="codePic" @click="Qrcode">
      <img v-if="!iscodeBox" src="@/assets/img/image/code1.png" alt="">
      <img v-if="iscodeBox" src="@/assets/img/image/code2.png" alt="">
    </div>
    <div class="codeBox" v-show="iscodeBox">
      <div class="text">请使用微信扫码二维码登录</div>
      <div class="box" id="wxLoginQrcode">假设这里有二维码</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: false
    }
  },
  data() {
    var checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("账号不能为空"));
      } else {
        return callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        account: "",
        passWord: ""
      },
      rules2: {
        account: [
          { validator: checkName, trigger: "blur" },
          { min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur" }
        ],
        passWord: [{ validator: validatePass, trigger: "blur" }]
      },
      submitLoading: false,
      iscodeBox: false
    };
  },
  mounted() {
    this.wxHandle();
  },
  methods: {
    Qrcode() {
      this.iscodeBox = !this.iscodeBox;
      console.log(this.iscodeBox);
    },
    //二维码
    wxHandle() {
      var obj = new WxLogin({
        id: "wxLoginQrcode",
        appid: process.env.WX_APP_ID,
        scope: "snsapi_login",
        redirect_uri: "http://ued.lunz.cn/web_api/wxLogin",
        state: "",
        style: "",
        href: ""
      });
    },
    //注册框隐藏登录框显示
    Visible() {
      this.$emit("titleChanged", "注册");
      this.$store.commit("isLogin", false);
    },
    submitForm(formName) {
      this.submitLoading = true;
      this.$refs[formName].validate(async valid => {
        this.submitLoading = false;
        if (valid) {
          const { data } = await this.$axios.post(
            `${process.env.BASE_URL}/web_api/login`,
            this.loginForm
          );
          if (data.status_code == 200) {
            this.$emit("modalChanged", false);
            this.$store.dispatch("login", data.user).then(() => {
              this.$router.replace("/");
            });
            this.loginForm = {};
          } else {
            //登录失败
            alert(data.message);
          }
        }
      });
    },
    // 清空数据
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang='scss' scoped>
.el-form {
  width: 330px;
  // top: calc(50% - 93px);
}
.login {
  margin: 10px 0 0px;
  text-align: center;
  font-size: 14px;
  color: #34485e;
}
.codePic {
  position: absolute;
  top: 12px;
  left: 12px;
  width: 50px;
  height: 50px;
}
.codeBox {
  .text {
    margin-bottom: 26px;
    font-size: 16px;
    color: black;
  }
  .box {
    width: 180px;
    height: 180px;
    margin: 0 auto;
    border: 1px solid black;
    box-sizing: border-box;
  }
}
</style>
