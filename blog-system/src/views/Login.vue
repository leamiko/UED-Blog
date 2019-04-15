<template>
  <div>LOGIN</div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    login: async function(data) {
      let url = this.api.login;
      const res = await this.$http.get(url);
      console.log(res)
    }
  }
};
</script>
