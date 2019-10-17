<template>
  <my-scrollbar
    hasFoot
    @scrollTop="getScrollTop"
  >
    <div slot="container">
      <my-header
        class="cus-fixed my-header"
        :class="{'bg_white': !isAddClass, 'text_white': isAddClass}"
        activeLabel="首页"
      ></my-header>
      <el-carousel
        trigger="click"
        :height="645 + 'px'"
      >
        <el-carousel-item
          v-for="item in config.bannerList"
          :key="item"
        >
          <img
            :src="item"
            style="width: 100%; height: 100%;"
          >
        </el-carousel-item>
      </el-carousel>
      <div class="my-content">
        <ul>
          <li
            v-for="item in config.newsList"
            :key="item.id"
            class="cus-flex"
          >
            <img
              :src="item.img"
              class="my-img"
            >
            <div>
              <h2>{{item.title}}</h2>
              <p class="desc">{{item.desc}}</p>
              <div class="cus-flex cus-align-center">
                <el-avatar
                  size="small"
                  :src="item.avatar"
                  class="avatar"
                ></el-avatar>
                <span class="text_color_time">{{item.author}} · {{item.updateTime}}</span>&emsp;&emsp;
                <span class="text_color">{{item.type}}</span>&emsp;&emsp;
                <span class="text_color"><img src="@/assets/img/icon/eyes.svg">浏览{{item.skim}}</span>&emsp;&emsp;
                <span class="text_color">点赞{{item.likes}}</span>
              </div>
            </div>
          </li>
        </ul>
        <el-button
          round
          class="btn_style"
        > 查看更多 </el-button>
      </div>
    </div>
  </my-scrollbar>
</template>

<script>
import * as custom from '@/assets/js/custom.config';
import MyScrollbar from '@/components/scroller/Scrollbar';
import MyHeader from '@/components/header/Header';

export default {
  inject: ['reload'],
  // fetch ({ redirect, store }) {
  //   console.log(store.state)
  //   if (!store.state.authToken) {
  //     redirect('/login');
  //   }
  // },
  components: {
    MyScrollbar,
    MyHeader
  },
  data () {
    return {
      config: custom.index,
      height: '',
      isAddClass: true
    }
  },
  head () {
    return {
      title: '首页',
      meta: [
        { hid: 'description', name: 'description', content: 'My custom description' }
      ]
    }
  },
  methods: {
    getScrollTop (val) {
      if (val > (this.height - 100)) {
        this.isAddClass = false;
      } else {
        this.isAddClass = true;
      }
    }
  },
  mounted () {
    this.height = document.body.clientWidth / 1800 * 766;
  }
}
</script>
<style lang="scss" scoped>
.bg_white {
  background: white;
  border-bottom: 1px solid rgb(220, 223, 230);
  box-shadow: rgba(0, 0, 0, 0.12) 0px 0px 2px;
}
.my-header {
  top: 0;
  width: 100%;
  z-index: 11;
}
.text_white {
  color: white !important;
}
.my-content {
  max-width: 1008px;
  margin: 0 auto;
  ul {
    padding: 0;
    list-style: none;
    li {
      padding: 50px 0;
      border-bottom: 1px solid #eff3f7;
      &:nth-last-child(1) {
        border-bottom: 0;
      }
      > img {
        width: 300px;
        height: 128px;
        margin-right: 30px;
      }
    }
  }
}
.desc {
  font-weight: 400;
  font-size: 18px;
  color: rgba(57, 65, 69, 1);
  line-height: 30px;
  margin-top: 12px;
  margin-bottom: 24px;
}
.avatar {
  margin-right: 10px;
}
.text_color {
  font-size: 14px;
  font-weight: 400;
  color: rgba(158, 173, 186, 1);
}
.text_color_time {
  font-size: 14px;
  font-weight: 400;
  color: rgba(57, 74, 88, 1);
}
.btn_style {
  width: -webkit-fill-available;
  height: 54px;
  border-radius: 27px;
  background: rgba(238, 238, 239, 1);
  font-size: 14px;
}

</style>
