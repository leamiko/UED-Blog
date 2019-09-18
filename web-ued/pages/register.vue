<template>
  <div class="el-form cus-absolute cus-fix-center">
    <el-form :model="params"
             status-icon
             :rules="rules2"
             ref="params"
             label-width="100px">
      <el-form-item prop="username">
        <el-input v-model="params.username"
                  placeholder="请输入账号"
                  prefix-icon="el-icon-user"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password"
                  v-model="params.password"
                  placeholder="请输入密码"
                  auto-complete="off"
                  prefix-icon="el-icon-lock"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   @click="submitForm('params')"
                   class="cus-full-width"
                   :loading="submitLoading">注册</el-button>
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
      params: {
        username: '',
        password: ''
      },
      rules2: {
        username: [
          { validator: checkName, trigger: 'blur' },
          { min: 10, max: 20, message: '长度在 10 到 20 个字符', trigger: 'blur' },

        ],
        password: [
          { validator: validatePass, trigger: 'blur' }
        ]
      },
      submitLoading: false
    };
  },
  head () {
    return {
      title: '注册'
    }
  },
  methods: {
    submitForm (formName) {
      this.submitLoading = true;
      this.$refs[formName].validate((valid) => {
        this.submitLoading = false;
        if (valid) {
          this.$store.dispatch('login', this.params)
            .then(() => {
              this.$message({
                message: '注册成功！',
                type: 'success'
              });
              this.$router.replace('/');
            })

        }
      });
    },
  },
  mounted () { }
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
