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
        :isChange='isAddClass'
      ></my-header>
      <el-carousel
        trigger="click"
        :height="height + 'px'"
        :interval="interval"
      >
        <el-carousel-item
          v-for="item in config.swipers"
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
            v-for="item in list"
            :key="item.id"
            class="cus-flex"
          >
            <img
              :src="img"
              class="my-img"
            >
            <div>
              <span class="list_title">{{item.title}}</span>
              <span class="desc">{{item.content}}</span>
              <div class="cus-flex cus-align-center">
                <el-avatar
                  size="small"
                  :src="avatar"
                  class="avatar"
                ></el-avatar>
                <span class="text_color_time">{{item.author}} · {{item.updateAt | datetimeFormat}}</span>&emsp;&emsp;
                <span class="text_color">{{item.blogType}}</span>&emsp;&emsp;
                <span class="text_color"><img src="@/assets/img/icon/eyes.svg">{{item.viewNum}}</span>&emsp;&emsp;
                <span class="text_color"><img src="@/assets/img/icon/like.svg">{{item.likeNum}}</span>
              </div>
            </div>
          </li>
        </ul>
        <div class="center">
          <el-button
            round
            class="btn_style"
          > 查看更多 </el-button>
        </div>
      </div>
    </div>
  </my-scrollbar>
</template>

<script>
import * as custom from "@/assets/js/custom.config";
import MyScrollbar from "@/components/scroller/Scrollbar";
import MyHeader from "@/components/header/Header";

export default {
  inject: ["reload"],
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
      isAddClass: true,
      list: [],
      interval: 6000,
      img: custom.index.newsList[0].img,
      avatar: custom.index.newsList[0].avatar,
      updateTime: custom.index.newsList[0].updateTime,
    };
  },
  head () {
    return {
      title: "首页",
      meta: [
        {
          hid: "description",
          name: "description",
          content: "My custom description"
        }
      ]
    };
  },
  filters: {
    datetimeFormat: function (value) {
      if (!value) return ''
      value = value.toString()
      let date = value.split('T')[0];
      return date;
    }
  },
  methods: {
    getScrollTop (val) {
      if (val > this.height - 100) {
        this.isAddClass = false;
      } else {
        this.isAddClass = true;
      }
    },
    // 获取文章列表
    async getHomeList () {
      let response = await this.$axios.get(`${process.env.BASE_URL}/web_api/getHomeList`);
      response.data.data.forEach(element => {
        if (element !== null) {
          this.list.push(element);
        }
      });
      console.log(this.list);
    }
  },
  mounted () {
    this.height = (document.body.clientWidth / 1920) * 645;
    this.getHomeList();
  }
};
</script>
<style lang="scss" scoped>
.el-dialog__body {
  height: 500px;
}

.bg_white {
  transition: all 0.5s ease;
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
  display: block;
  font-weight: 400;
  font-size: 18px;
  color: rgba(57, 65, 69, 1);
  line-height: 30px;
  margin-top: 12px;
  margin-bottom: 24px;
  width: 628px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: keep-all;
}
.avatar {
  margin-right: 10px;
}
.text_color {
  font-size: 14px;
  font-weight: 400;
  color: rgba(158, 173, 186, 1);
  img {
    margin: 0 5px 1px 0;
  }
}
.text_color_time {
  font-size: 14px;
  font-weight: 400;
  color: rgba(57, 74, 88, 1);
}
.center {
  text-align: center;
}
.btn_style {
  width: 700px;
  height: 54px;
  border-radius: 27px;
  background: rgba(238, 238, 239, 1);
  font-size: 14px;
  margin-bottom: 68px;
}
.list_title {
  font-weight: 600;
  width: 427px;
  height: 32px;
  font-size: 20px;
  &:hover {
    cursor: pointer;
    color: #3376ff;
  }
}
/*
* 轮播图的高度是根据屏幕的大小以及图片的比例计算出来的
* 坚持要改，可修改this实例种height参数
*/
// .el-carousel {
//   height: 645px;
// }
</style>
