<template>
  <div
    class="my-header"
    ref="header"
  >
    <div class="cus-flex cus-flex-between cus-align-center">
      <div>
        <el-avatar
          :size="42"
          :src="logoURL"
          class="middle"
        ></el-avatar>
        <h2 class="inline middle">{{ custom.title }}</h2>
        <ul>
          <li
            v-for="(item, index) in custom.menu"
            :key="index"
            :class="{'active': activeLabel === item.label}"
          >
            <router-link
              :to="item.redirectUrl"
            >{{ item.label }}</router-link>
          </li>
        </ul>
      </div>
      <div class="cus-flex cus-align-center">
        <slot name="box_cus"></slot>&emsp;&emsp;
        <el-badge
          is-dot
          class="item"
        >
          <div class="inline pointer"><img
              :src="msgURL"
              class="message"
            ></div>
        </el-badge>
        <router-link
          :to="'login'"
          class="text_size_18"
        >登录</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import * as custom from '@/assets/js/custom.config';
export default {
  props: {
    activeLabel: {
      default: null,
      type: String,
      required: false
    },
    innerStyle: {
      default: null,
      type: Object,
      required: false
    }
  },
  data () {
    return {
      custom: custom.head,
      logoURL: custom.head.logoUrl,
      msgURL: custom.head.msgUrl
    }
  },
  mounted () {
    if (this.innerStyle) {
      Object.keys(this.innerStyle).forEach(key => {
        this.$refs.header.style[key] = this.innerStyle[key];
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/style/cus.scss";
.item {
  margin-top: 10px;
  margin-right: 22px;
}
.middle {
  vertical-align: middle;
  margin-bottom: 8px;
}
a {
  color: inherit;
  text-decoration: none;
  &:hover {
    color: $primary_blue;
  }
}
.my-header {
  min-height: 82px;
  color: #34485e;
  font-size: 16px;

  > div {
    &:nth-child(1) {
      width: 62.5%;
      height: 82px;
      min-width: 600px;
      max-width: 1200px;
      margin: 0 auto;
    }
    &:nth-child(2) {
      padding-top: 66px;
      padding-bottom: 40px;
      border-top: 1px solid #ececec;
    }
  }

  img {
    width: 42px;
    height: 42px;
    &.message {
      width: 21px;
      height: 21px;
    }
  }

  h2 {
    font-size: 26px;
  }

  ul {
    display: inline-flex;
    list-style: none;
    padding-top: 3px;
    li {
      margin-right: 60px;
      &.active {
        color: $primary_blue;
      }
    }
  }
}
</style>
