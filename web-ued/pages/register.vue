<template>
  <div class="el-form cus-fix-center">
    <el-form :model="params"
             status-icon
             :rules="rules2"
             ref="params"
             label-width="0"
             v-show="!successBox">
      <el-form-item prop="account">
        <el-input v-model="params.account"
                  placeholder="请输入账号"
                  prefix-icon="el-icon-user"
                  maxlength=20></el-input>
      </el-form-item>
      <el-form-item prop="passWord">
        <el-input type="passWord"
                  v-model="params.passWord"
                  placeholder="请输入6到16位密码，区分大小写"
                  auto-complete="off"
                  prefix-icon="el-icon-lock"
                  minlength=6
                  maxlength=16></el-input>
      </el-form-item>
      <el-form-item prop="checkPass">
        <el-input type="passWord"
                  v-model="params.checkPass"
                  placeholder="请再次确认密码"
                  auto-complete="off"
                  prefix-icon="el-icon-lock"
                  minlength=6
                  maxlength=16></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   @click="submitForm('params')"
                   class="cus-full-width"
                   :loading="submitLoading">注册</el-button>
        <div class="login">已有账号，<el-button type="text"
                     @click="Visible">直接登录</el-button>
        </div>
      </el-form-item>
    </el-form>

    <div class="regSuccess"
         v-show="successBox">
      <div class="successBox"
           v-show="!bindWX">
        <div class="successPic"><img src="@/assets/img/image/Bitmap.png"
               alt=""></div>
        <el-button type="primary" @click="compelteInfo()"
                   class="cus-full-width successBtn">丰富你的个人信息</el-button>
      </div>
      <div class="codeBox"
           v-show="bindWX">
        <div class="text1">扫码绑定微信，登录更方便哦~</div>
        <div class="box"
             id="wxBindQrcode">假设这里有二维码</div>
        <div class="text2">不绑定，<el-button type="text"
                     @click="bindWX=false">直接跳过</el-button>
        </div>
      </div>
    </div>
      <!-- 模态框 -->
    <person-dialog :isShow="infoShow"
                   :classStyle="className"
                   @hide="infoShow = false"></person-dialog>
  </div>
</template>

<script>
import PersonDialog from "../components/dialogs/PersonalInfo";
export default {
  components: {
    PersonDialog
  },
  data () {
    var checkName = (rule, value, callback) => {
      // console.log(value);
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
    var checkPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value !== this.params.passWord) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    var error = (rule, value, callback) => {
      if (this.isError == true) {
        callback(new Error("该账号已被注册"));
      } else {
        callback();
      }
    };
    return {
      params: {
        account: "",
        passWord: "",
        checkPass: ""
      },
      checkPass: "",
      rules2: {
        account: [
          { validator: checkName, trigger: "blur" },
          { validator: error, trigger: "blur" }
        ],
        passWord: [
          { validator: validatePass, trigger: "blur" },
          { min: 6, max: 16, message: "请输入6-16位密码", trigger: "blur" }
        ],
        checkPass: [
          { validator: checkPass, trigger: "blur" },
          { min: 6, max: 16, message: "请输入6-16位密码", trigger: "blur" }
        ]
      },
      submitLoading: false,
      successBox: false,
      bindWX: false,
      isError: false,
      infoShow: false, // 个人信息弹窗
      className: "info_dialog",
    };
  },
  // head() {
  //   return {
  //     title: "注册"
  //   };
  // },
  mounted () {
    this.wxHandle();
  },
  methods: {
    // 填写个人信息
    compelteInfo() {
       this.infoShow = true 
       this.bindWX = false;
    },
    //二维码
    wxHandle () {
      var obj = new WxLogin({
        id: "wxBindQrcode",
        appid: process.env.WX_WEB_ID,
        scope: "snsapi_login",
        // redirect_uri: window.location.href,
        redirect_uri: 'http://ued.lunz.cn',
        state: "",
        style: "",
        href: "data:text/css;base64,Ly8gLmltcG93ZXJCb3ggew0KLy8gICAucXJjb2RlIHsNCi8vICAgICB3aWR0aDogMTgwcHg7DQovLyAgICAgaGVpZ2h0OiAxODBweDsNCi8vICAgICBtYXJnaW4tdG9wOiAwcHg7DQovLyAgICAgbWFyZ2luLXJpZ2h0OiAxMThweDsNCi8vICAgICBib3JkZXI6IDFweCBzb2xpZCAjZTJlMmUyOw0KLy8gICB9DQovLyAgIC5pbmZvew0KLy8gICAgIGRpc3BsYXk6IG5vbmU7DQovLyAgIH0NCi8vICAgLnRpdGxlew0KLy8gICAgIGRpc3BsYXk6IG5vbmU7DQovLyAgIH0NCi8vIH0NCi5pbXBvd2VyQm94IC5xcmNvZGV7DQogIHdpZHRoOiAxODBweDsNCiAgaGVpZ2h0OiAxODBweDsNCiAgbWFyZ2luLXRvcDogMHB4Ow0KICBtYXJnaW4tcmlnaHQ6IDExOHB4Ow0KICBib3JkZXI6IDFweCBzb2xpZCAjZTJlMmUyOw0KfQ0KLmltcG93ZXJCb3ggLmluZm97DQogIGRpc3BsYXk6IG5vbmU7DQp9DQouaW1wb3dlckJveCAudGl0bGV7DQogIGRpc3BsYXk6IG5vbmU7DQp9"
      });
    },
    //注册框隐藏登录框显示
    Visible () {
      this.$emit("titleChanged", "登录");
      this.$store.commit("isLogin", true);
    },
    submitForm (formName) {
      this.submitLoading = true;
      this.$refs[formName].validate(async valid => {
        this.submitLoading = false;
        if (valid) {
          const { data } = await this.$axios.post(
            `${process.env.BASE_URL}/web_api/register`,
            this.params
          );
          // console.log(data);
          if (data.status_code == 200) {
            // this.$store.dispatch("login", data.user).then(() => {
            //   this.$router.replace("/login");
            // });
            localStorage.setItem("user", JSON.stringify(data.user));
            this.$store.commit("flag", new Date().toLocaleTimeString());
            this.$emit("titleChanged", "恭喜你，注册成功");
            this.successBox = true;
            this.bindWX = true;
          } else {
            //注册失败
            this.isError = true;
            this.$refs[formName].validate(async valid => { });
          }
        }
      });
    }
  }
};
</script>

<style lang='scss' scoped>
.el-form {
  width: 330px;
  // top: calc(50% - 93px);
}
.codeBox {
  .text1 {
    margin-bottom: 26px;
    font-size: 16px;
    color: black;
  }
  .text2 {
    text-align: right;
    margin: 20px 0 10px;
  }
  .box {
    width: 180px;
    height: 180px;
    margin: 0 auto;
    box-sizing: border-box;
    overflow: hidden;
  }
}
.login {
  margin: 10px 0 0px;
  text-align: center;
  font-size: 14px;
  color: #34485e;
}
</style>
