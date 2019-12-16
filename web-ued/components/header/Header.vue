<template>
  <div class="my-header"
       ref="header">
    <div class="cus-flex cus-flex-between cus-align-center">
      <div>
        <el-avatar :size="42"
                   :src="logoURL"
                   class="middle"></el-avatar>
        <router-link :to="custom.menu[0].redirectUrl">
          <h2 class="inline middle">{{ custom.title }}</h2>
        </router-link>
        <ul>
          <li v-for="(item, index) in custom.menu"
              :key="index"
              :class="{'active': activeLabel === item.label}">
            <router-link :to="item.redirectUrl"
                         class="font-size-18">{{ item.label }}</router-link>
          </li>
        </ul>
      </div>
      <div class="cus-flex cus-align-center">
        <slot name="box_cus"></slot>&emsp;&emsp;
        <el-badge is-dot
                  class="item">
          <div class="inline pointer"
               @mouseenter="showBadge = 1"
               @mouseleave="showBadge = 2">
            <img :src="
                showBadge === 2
                  ? isChange === true
                    ? msgURL
                    : msgUrl02
                  : msgURLHover
              "
                 class="message" />
          </div>
        </el-badge>
        <div class="logModal">
          <el-button type="text"
                     @click="modalLogin()"
                     v-if="$store.state.flag===null"><span :class="{ login_text: isChange, login_text_02: !isChange }">登录</span></el-button>
          <div class="avatar"
               @mouseenter="showMsg = true"
               @mouseleave="showMsg = false"
               v-if="$store.state.flag!==null">
               <span v-if="userName">{{userName}}</span><span v-else>{{account}}</span>
               <img v-if="avatar" :src="avatar" />
               <img v-else src="../../assets/img/image/avarot-default.png" alt="">
               </div>
          <!-- <el-button
            type="text"
            @click="infoShow = true"
          >个人信息</el-button> -->
          <el-dialog :title="title"
                     :visible.sync="$store.state.modalVisible"
                     :append-to-body="true"
                     custom-class="logDialog"
                     :center="true"
                     :close-on-click-modal="false"
                     :before-close="handleClose">
            <my-login v-show="$store.state.isLogin"
                      :title="title"
                      @titleChanged="registerTitle($event)"
                      @modalChanged="modalChanged($event)"></my-login>
            <my-register v-show="!$store.state.isLogin"
                         @titleChanged="loginTitle($event)" @modalChanged="modalChanged($event)"></my-register>
          </el-dialog>
          <!-- <router-link
          :to="'login'"
          class="text_size_18"
        >登录</router-link> -->
          <div class="badge_hover margin_right"
               v-show="showBadge === 1"
               @mouseenter="showBadge = 1"
               @mouseleave="showBadge = 2">
            <img :src="msgNull" />
            <span>还没有消息哦</span>
          </div>
          <div class="badge_hover msg_hover"
               @mouseenter="showMsg = true"
               @mouseleave="showMsg = false"
               v-show="showMsg">
            <span @click="infoShow = true">个人信息</span>
            <span @click="logOut">退出账号</span>
          </div>
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
import * as custom from "@/assets/js/custom.config";
import MyLogin from "@/pages/login";
import MyRegister from "@/pages/register";
import PersonDialog from "../dialogs/PersonalInfo";

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
      type: Boolean
    }
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
      title: "登录",
      showBadge: 2,
      showMsg: "",
      infoShow: false, // 个人信息弹窗
      className: "info_dialog",
      userName: "",
      avatar: null,
      account: ""
    };
  },
  watch: {
    "$store.state.flag": function () {
      if (this.$store.state.flag !== null) {
        this.avatar = JSON.parse(localStorage.getItem("user")).avatar;
        this.userName = JSON.parse(localStorage.getItem("user")).nickName;
      }
    }
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
    this.wxLogin();
  },
  methods: {
    handleClose () {
      this.$store.commit("modalVisible", false);
    },
    modalLogin () {
      this.$store.commit("modalVisible", true);
    },
    registerTitle (e) {
      this.title = e;
    },
    loginTitle (e) {
      this.title = e;
    },
    modalChanged (e) {
      // this.$store.state.modalVisible = e;
      this.$store.commit("modalVisible", e);
    },
    // 退出登录
    async logOut () {
      const res = await this.$axios.get(
        `${process.env.BASE_URL}/web_api/logOut`
      );
      localStorage.removeItem("user");
      this.$store.commit("flag", null);
    },
    //判断是否登录
    async isLogin () {
      this.account = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).account : '';
      const res = await this.$axios.get(
        `${process.env.BASE_URL}/web_api/isLogin`
      );
      if (!res.data && localStorage.getItem("user")) {
        localStorage.removeItem("user");
        window.location.reload();
      }
      if (localStorage.getItem("user") !== null) {
        this.$store.commit("flag", new Date().toLocaleTimeString());
        this.avatar = JSON.parse(localStorage.getItem("user")).avatar;
        this.userName = JSON.parse(localStorage.getItem("user")).nickName;
      }
    },
    // 调用微信扫码API
    async wxLogin () {
      // console.log(this.getQueryVariable("code"));
      const res = await this.$axios.get(
        `${process.env.BASE_URL}/web_api/wxLogin?code=${this.getQueryVariable(
          "code"
        )}`
      );
      // console.log(res);
      if (res.data.status_code == 200) {
        localStorage.setItem("user", JSON.stringify(data.user));
        this.loginForm = {};
      } else if (res.data.status_code == 401) {
        //登录失败
        this.$store.state.wxUnionId = res.data.data.wxUnionId;
        // this.title = "登录失败";
        // this.$store.state.qrcodeBindBox = true;
        this.$store.state.modalVisible = true;
        console.log("还没绑");
      }
    },
    getQueryVariable (variable) {
      var query = window.location.search.substring(1);
      var vars = query.split("&");
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
          return pair[1];
        }
      }
      return false;
    }
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
      min-width: 960px;
      max-width: 1200px;
      height: 82px;
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
@media screen and(min-width: 1024px) {
  .my-header {
    > div {
      &:nth-child(1) {
        width: 960px;
      }
    }
  }
} /*>=1024的设备*/

@media screen and(min-width: 1100px) {
  .my-header {
    > div {
      &:nth-child(1) {
        width: 1000px;
      }
    }
  }
}
@media screen and(min-width: 1280px) {
  .my-header {
    > div {
      &:nth-child(1) {
        width: 1100px;
      }
    }
  }
}

@media screen and(min-width: 1366px) {
  .my-header {
    > div {
      &:nth-child(1) {
        width: 1200px;
      }
    }
  }
}

@media screen and(min-width: 1440px) {
  .my-header {
    > div {
      &:nth-child(1) {
        width: 1200px;
      }
    }
  }
}

@media screen and(min-width: 1680px) {
  .my-header {
    > div {
      &:nth-child(1) {
        width: 1200px;
      }
    }
  }
}
@media screen and(min-width: 1920px) {
  .my-header {
    > div {
      &:nth-child(1) {
        width: 1200px;
      }
    }
  }
}

.badge_hover {
  z-index: 99;
  position: absolute;
  top: 63px;
  padding: 171px 131px;
  width: 440px;
  height: 530px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 1px 5px 0px rgba(230, 230, 230, 1);
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
.font-size-18 {
  font-size: 18px;
}
.login_text {
  font-size: 18px;
  color: #ececec !important;
  &:hover {
    color: $primary_blue !important;
  }
}
.login_text_02 {
  font-size: 18px;
  color: rgba(52, 72, 94, 1) !important;
  &:hover {
    color: $primary_blue !important;
  }
}
.msg_hover {
  padding: 10px 0 !important;
  width: 113px !important;
  height: 106px !important;
  span {
    display: inline-block;
    font-size: 16px;
    padding: 10px 20px !important;
    color: rgba(52, 72, 94, 1);
    &:hover {
      background: rgba(249, 249, 249, 1);
      color: rgba(51, 118, 255, 1);
      cursor: pointer;
    }
  }
}
.margin_right {
  margin-left: -450px !important;
}
.avatar {
  margin-bottom: 5px;
  span {
    width: 80px;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: keep-all;
  }
  img {
    top: 3px;
    position: relative;
  }
  &:hover {
    cursor: pointer;
  }
}
</style>
