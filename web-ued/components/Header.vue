<template>
  <div class="my-header">
    <div class="cus-flex cus-flex-between cus-align-center">
      <div>
        <img :src="custom.logo" :title="custom.title" alt="加载失败">
        <h2 class="inline">{{ custom.title }}</h2>
        <ul>
          <li v-for="(item, index) in custom.menu" :key="index">
            <router-link :to="item.redirectUrl">{{ item.label }}</router-link>
          </li>
        </ul>
      </div>
      <div>
        <img src="" alt="">
        <router-link :to="'login'">登录</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import * as custom from '@/assets/js/custom.config';
export default {
  data() {
    return {
      custom: custom.head
    }
  },
  created() { }
}
</script>

<style lang="scss" scoped>
a {
  color: inherit;
  text-decoration: none;
  &:hover {
    color: #3376FF;
  }
}
.my-header {
  height: 82px;
  color: #34485E;
  background: white;

  > div {
    width: 62.5%;
    height: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }

  img {
    width: 42px;
    height: 42px;
  }

  h2 {
    font-size: 26px;
  }

  ul {
    display: inline-flex;
    list-style: none;
    li {
      margin-right: 60px;
    }
  }
}
</style>
