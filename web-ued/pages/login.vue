<template>
  <div class="el-form cus-absolute cus-fix-center">
    <el-form :model="loginForm" status-icon :rules="rules2" ref="loginForm" label-width="100px">
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" placeholder="请输入账号" prefix-icon="el-icon-user"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="loginForm.password" placeholder="请输入密码" auto-complete="off" prefix-icon="el-icon-lock"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('loginForm')" class="cus-full-width" :loading="submitLoading">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import * as VueCookie from 'vue-cookies';
export default {
  data() {
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
        username: '',
        password: ''
      },
      rules2: {
        username: [
          { validator: checkName, trigger: 'blur' }
        ],
        password: [
          { validator: validatePass, trigger: 'blur' }
        ]
      },
      submitLoading: false
    };
  },
  head() {
    return {
      title: '登录'
    }
  },
  methods: {
    submitForm(formName) {
      this.submitLoading = true;
      this.$refs[formName].validate((valid) => {
        this.submitLoading = false;
        if (valid) {
          this.$store.dispatch('login', this.loginForm)
          .then(() => {
            this.$message({
              message: '登录成功！',
              type: 'success'
            });
            this.$router.replace('/');
          })

        } else {
          this.$message.error('登录失败！');
          return false;
        }
      });
    },
    // 清空数据
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  mounted() {
    // 自动登录
    if (VueCookie.isKey('AUTHTOKEN')) {
      this.$store.dispatch('login', VueCookie.get('AUTHTOKEN'))
      .then(() => {
        this.$router.replace('/');
      })
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
