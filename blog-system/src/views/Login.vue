<template>
  <div>
    <a-form
      :form="form"
      class="login_form"
    >
      <div class="logo">
        <img
          alt="logo"
          :src="config.logoPath"
        />
        <span>{{config.siteName}}</span>
      </div>
      <a-form-item>
        <a-input
          v-decorator="[
          'username',
          {rules: [{ required: true, message: '请输入用户名' }]}
        ]"
          placeholder="用户名"
        />
      </a-form-item>
      <a-form-item>
        <a-input
          v-decorator="[
          'password',
          {rules: [{ required: checkNick, message: '请输入密码' }]}
        ]"
          placeholder="密码"
        />
      </a-form-item>
      <a-form-item class="margin_bottom0">
        <a-checkbox
          :checked="checkNick"
          @change="handleChange"
        >
          记住密码
        </a-checkbox>
      </a-form-item>
      <a-form-item class="margin_bottom0">
        <a-button
          type="primary"
          @click="check"
          class="log_btn"
        >
          登录
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checkNick: false,
      form: this.$form.createForm(this)
    };
  },
  methods: {
    check() {
      this.form.validateFields(async (err, params) => {
        if (!err) {
          console.log(params)
          // let url = this.api.login;
          // const res = await this.$http.post(url, params);
          // console.log(res);
        }
      });
    },
    handleChange(e) {
      this.checkNick = e.target.checked;
      this.$nextTick(() => {
        this.form.validateFields(["nickname"], { force: true });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.login_form {
  width: 320px;
  padding: 36px;
  background-color: #fff;
  box-shadow: 0 0 100px rgba(0, 0, 0, 0.08);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.log_btn {
  width: 100%;
}

.logo {
  text-align: center;
  cursor: pointer;
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 40px;
    margin-right: 15px;
  }

  span {
    vertical-align: text-bottom;
    font-size: 21px;
    text-transform: uppercase;
    display: inline-block;
    font-weight: 700;
    color: #1890ff;
    background-image: -webkit-gradient(
      linear,
      37.219838% 34.532506%,
      36.425669% 93.178216%,
      from(#29cdff),
      to(#0a60ff),
      color-stop(0.37, #148eff)
    );
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
</style>
