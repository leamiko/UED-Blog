<template>
  <div class="el-form cus-fix-center">
    <el-form :model="loginForm"
             status-icon
             :rules="rules2"
             ref="loginForm"
             label-width="0"
             v-show="!iscodeBox">
      <el-form-item prop="account">
        <el-input v-model="loginForm.account"
                  placeholder="请输入账号"
                  prefix-icon="el-icon-user"
                  maxlength="20"></el-input>
      </el-form-item>
      <el-form-item prop="passWord">
        <el-input type="passWord"
                  v-model="loginForm.passWord"
                  placeholder="请输入密码"
                  auto-complete="off"
                  prefix-icon="el-icon-lock"
                  minlength="6"
                  maxlength="16"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   @click="submitForm('loginForm')"
                   class="cus-full-width"
                   :loading="submitLoading">登录</el-button>
        <div class="login">
          没有账号，<el-button type="text"
                     @click="Visible">立即注册</el-button>
        </div>
      </el-form-item>
    </el-form>
    <div class="codePic"
         @click="Qrcode">
      <img v-show="!iscodeBox"
           src="@/assets/img/image/code1.png"
           alt="" />
      <img v-show="iscodeBox"
           src="@/assets/img/image/code2.png"
           alt="" />
    </div>
    <div class="codeBox"
         v-show="iscodeBox">
      <div class="text">请使用微信扫码二维码登录</div>
      <div class="box"
           id="wxLoginQrcode"></div>
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
  data () {
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
    var error = (rule, value, callback) => {
      if (this.isError == true) {
        callback(new Error("该账号尚未注册/密码有误，请重新输入"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        account: "",
        passWord: "",
        wxUnionId: ""
      },
      rules2: {
        account: [
          { validator: checkName, trigger: "blur" },
          { validator: error, trigger: "blur" }
        ],
        passWord: [
          { validator: validatePass, trigger: "blur" },
          { validator: error, trigger: "blur" }
        ]
      },
      submitLoading: false,
      iscodeBox: false,
      isError: false
    };
  },
  mounted () {
    this.wxHandle();
  },
  methods: {
    Qrcode () {
      this.iscodeBox = !this.iscodeBox;
      this.$emit("titleChanged", "登录");
    },
    //登录二维码
    wxHandle () {
      var obj = new WxLogin({
        id: "wxLoginQrcode",
        appid: process.env.WX_WEB_ID,
        scope: "snsapi_login",
        // redirect_uri: window.location.href,
        redirect_uri: "http://ued.lunz.cn",
        state: "",
        style: "",
        href:
          "data:text/css;base64,LmltcG93ZXJCb3ggLnFyY29kZXsNCiAgd2lkdGg6IDE4MHB4Ow0KICBoZWlnaHQ6IDE4MHB4Ow0KICBtYXJnaW4tdG9wOiAwcHg7DQogIG1hcmdpbi1yaWdodDogMTE4cHg7DQp9DQouaW1wb3dlckJveCAuaW5mb3sNCiAgZGlzcGxheTogbm9uZTsNCn0NCi5pbXBvd2VyQm94IC50aXRsZXsNCiAgZGlzcGxheTogbm9uZTsNCn0="
      });
    },
    //注册框隐藏登录框显示
    Visible () {
      this.$emit("titleChanged", "注册");
      this.$store.commit("isLogin", false);
    },
    submitForm (formName) {
      this.submitLoading = true;
      this.$refs[formName].validate(async valid => {
        this.submitLoading = false;
        if (valid) {
          if (this.$store.state.wxUnionId) {
            this.loginForm.wxUnionId = this.$store.state.wxUnionId;
          }
          const { data } = await this.$axios.post(
            `${process.env.BASE_URL}/web_api/login`,
            this.loginForm
          );
          if (data.status_code == 200) {
            localStorage.setItem("user", JSON.stringify(data.user));
            this.$emit("modalChanged", false);
            this.$store.dispatch("login", data.user).then(() => {
              this.$router.replace("/");
            });
            this.loginForm = {};
            this.$store.commit("flag", new Date().toLocaleTimeString());
            // 监测是否包含回调
            if (this.$store.state.redirect) {
              this.$router.push({
                path: this.$store.state.redirect
              })
              this.$store.commit("ChangeRedirect", null);
            }
          } else {
            //登录失败
            this.isError = true;
            this.$refs[formName].validate(async valid => { });
          }
        }
      });
    },
    // 清空数据
    resetForm (formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang="scss" scoped>
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
    box-sizing: border-box;
  }
}
</style>
