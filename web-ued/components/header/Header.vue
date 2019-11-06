<template>
  <div class="my-header"
       ref="header">
    <div class="cus-flex cus-flex-between cus-align-center">
      <div>
        <el-avatar :size="42"
                   :src="logoURL"
                   class="middle"></el-avatar>
        <h2 class="inline middle">{{ custom.title }}</h2>
        <ul>
          <li v-for="(item, index) in custom.menu"
              :key="index"
              :class="{'active': activeLabel === item.label}">
            <router-link :to="item.redirectUrl">{{ item.label }}</router-link>
          </li>
        </ul>
      </div>
      <div class="cus-flex cus-align-center">
        <slot name="box_cus"></slot>&emsp;&emsp;
        <el-badge is-dot
                  class="item">
          <div class="inline pointer"
               @mouseenter="showBadge=1"
               @mouseleave="showBadge=2">
            <img :src="showBadge===2?(isChange===true? msgURL :msgUrl02 ):msgURLHover"
                 class="message"></div>
        </el-badge>
        <div class="logModal">
          <el-button type="text"
                     @click="modalVisible = true"><span :class="{'login_text':isChange,'login_text_02':!isChange}">登录</span></el-button>
          <el-button type="text"
                     @click="infoShow = true">个人信息</el-button>
          <el-dialog :title="title"
                     :visible.sync="modalVisible"
                     :append-to-body="true"
                     custom-class="logDialog"
                     :center="true"
                     :close-on-click-modal="false">
            <my-login v-if="$store.state.isLogin"
                      :title="title"
                      @titleChanged="registerTitle($event)"
                      @modalChanged="modalChanged($event)"></my-login>
            <my-register v-if="!$store.state.isLogin"
                         @titleChanged="loginTitle($event)"></my-register>
          </el-dialog>
          <!-- <router-link
          :to="'login'"
          class="text_size_18"
        >登录</router-link> -->
          <div class="badge_hover"
               v-if="showBadge===1"
               @mouseenter="showBadge=1"
               @mouseleave="showBadge=2">
            <img :src="msgNull">
            <span>还没有消息哦</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 模态框 -->
    <person-dialog :isShow="infoShow"
                   :classStyle="className"
                   @hide="infoShow=false"></person-dialog>
  </div>

</template>

<script>
import * as custom from "@/assets/js/custom.config";
import MyLogin from "@/pages/login";
import MyRegister from "@/pages/register";
import PersonDialog from '../dialogs/PersonalInfo';

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
    },
    isChange: {
      default: null,
      type: Boolean,
    },
  },
  components: {
    MyLogin,
    MyRegister,
    PersonDialog
  },

  data () {
    return {
      custom: custom.head,
      logoURL: custom.head.logoUrl,
      msgURL: custom.head.msgUrl,
      msgURLHover: custom.head.hoverMsgUrl,
      msgUrl02: custom.head.msgUrl02,
      msgNull: custom.head.msgNull,
      modalVisible: false,
      title: "登录",
      showBadge: 2,
      infoShow: false, // 个人信息弹窗
      className: 'info_dialog'
    };
  },

  mounted () {
    if (this.innerStyle) {
      Object.keys(this.innerStyle).forEach(key => {
        this.$refs.header.style[key] = this.innerStyle[key];
      });
    }
  },
  created () {
    this.isLogin();
  },
  methods: {
    registerTitle (e) {
      this.title = e;
    },
    loginTitle (e) {
      this.title = e;
    },
    modalChanged (e) {
      this.modalVisible = e;
    },
    //判断是否登录
    async isLogin () {
      const res = await this.$axios.get(`${process.env.BASE_URL}/web_api/isLogin`);
      if (!res.data && localStorage.getItem("user")) {
        localStorage.removeItem('user')
        window.location.reload()
      }
    },
  }
};
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
.badge_hover {
  position: absolute;
  right: 363px;
  top: 58px;
  padding: 171px 131px;
  width: 440px;
  height: 530px;
  background: white;
  border-radius: 4px;
  text-align: center;
  img {
    width: 178px;
    height: 144px;
  }
  span {
    padding-top: 20px;
    font-weight: 400;
    color: rgba(160, 160, 160, 1);
    line-height: 22px;
    font-size: 14px;
  }
}
.el-dialog__header {
  width: 600px;
  height: 600px;
  .margin_left {
    margin-left: -47px;
  }
  .mag_top_64 {
    margin-top: 64px;
  }
  .badge_hover_block {
    font-weight: 400;
    font-size: 16px;
    color: rgba(52, 72, 94, 1);
    &:hover {
      cursor: pointer;
    }
  }
}
.login_text {
  color: #ececec !important;
  &:hover {
    color: $primary_blue !important;
  }
}
.login_text_02 {
  color: rgba(52, 72, 94, 1) !important;
  &:hover {
    color: $primary_blue !important;
  }
}
</style>
