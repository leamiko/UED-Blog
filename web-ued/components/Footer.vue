<template>
  <div class="my-footer" :class="{'bor-top': hasMenu}">
    <div class="cus-flex cus-flex-center foot" ref="foot" v-if="hasMenu">
      <div v-for="(item, index) in custom.menu" :key="index">
        <h5> {{ item.label }} </h5>
        <ul>
          <li v-for="(list, i) in item.children" :key="i">
            <router-link :to="item.redirectUrl"> {{ list.label }} </router-link>
          </li>
        </ul>
      </div>
    </div>
    <el-divider></el-divider>
    <div class="text-center"> {{ custom.desc }} </div>
  </div>
</template>

<script>
import logo from '@/assets/img/logo/logo-system-large.svg';
import * as custom from '@/assets/js/custom.config';
export default {
  props: {
    hasMenu: {
      default: true,
      required: false
    }
  },
  data() {
    return {
      custom: custom.foot
    }
  },
  mounted() {
    if (this.hasMenu) {
      this.$refs.foot.style.backgroundImage = `url(${logo})`;
    }
  }
}
</script>

<style lang="scss" scoped>
a {
  color: inherit;
  text-decoration: none;
}
h5 {
  color: #000000;
  font-size: 16px;
}
.bor-top {
  border-top: 2px solid rgba(51, 118, 255, .5);
}
.my-footer {
  color: #34485E;
  background: white;

  > div.foot {
    width: 62.5%;
    height: 100%;
    min-width: 600px;
    max-width: 1200px;
    margin: 0 auto;
    padding: 102px 0 68px;
    background-repeat: no-repeat;
    background-size: 90px 90px;
    background-position: 10px 102px;
    > div {
      margin-right: 90px;
      &:nth-last-child(1) {
        margin-right: 0;
      }
    }
  }

  > div:nth-last-child(1) {
    color: #777777;
    line-height: 20px;
    padding: 0 0 24px;
    font-weight: 300;
  }

  img {
    width: 42px;
    height: 42px;
  }

  ul {
    list-style: none;
    padding-left: 0;
    margin-top: 2em;
    li {
      margin-bottom: 1em;
      color: #777777;
      &:nth-last-child(1) {
        margin-bottom: 0;
      }
    }
  }
}
</style>
