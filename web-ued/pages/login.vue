<template>
  <div class="el-form cus-absolute cus-fix-center">
    <el-form :model="loginForm"
             status-icon
             :rules="rules2"
             ref="loginForm"
             label-width="100px">
      <el-form-item prop="account">
        <el-input v-model="loginForm.account"
                  placeholder="请输入账号"
                  prefix-icon="el-icon-user"></el-input>
      </el-form-item>
      <el-form-item prop="passWord">
        <el-input type="passWord"
                  v-model="loginForm.passWord"
                  placeholder="请输入密码"
                  auto-complete="off"
                  prefix-icon="el-icon-lock"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   @click="submitForm('loginForm')"
                   class="cus-full-width"
                   :loading="submitLoading">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    var checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('账号不能为空'));
      } else {
        return callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        account: '',
        passWord: ''
      },
      rules2: {
        account: [
          { validator: checkName, trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' },

        ],
        passWord: [
          { validator: validatePass, trigger: 'blur' }
        ]
      },
      submitLoading: false
    };
  },
  head () {
    return {
      title: '登录'
    }
  },
  mounted () {

    console.log(process.env.BASE_URL)
  },
  methods: {
    submitForm (formName) {
      this.submitLoading = true;
      this.$refs[formName].validate(async (valid) => {
        this.submitLoading = false;
        if (valid) {
          const { data } = await this.$axios.post(`${process.env.BASE_URL}/api_nuxt/login`, this.loginForm)
          if (data.status_code == 200) {
            this.$store.dispatch('login', data.user)
              .then(() => {
                this.$router.replace('/');
              })
          } else {
            //登录失败
            alert(data.message)
          }
        }
      });
    },
    // 清空数据
    resetForm (formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style lang='scss' scoped>
.el-form {
  max-width: 800px;
  min-width: 320px;
  width: 480px;
  top: calc(50% - 93px);
}
</style>
