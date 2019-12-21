<template>
  <my-scrollbar hasHead hasFoot :headStyle="{'background':'white'}" :headActive="'写字'">
    <div slot="container" class="container">
      <!-- top block -->
      <div class="top_article">
        <el-carousel trigger="click" :height="332 + 'px'" :autoplay="false" class="set_width"
          v-show="topList.length > 0">
          <el-carousel-item v-for="(item,index) in topList" :key="index" class="flex">
            <div class="left_title" @click="goDetail(item.blog)">
              <img :src="item.blog.bigImgUrl" :style="{'visibility': item.blog.bigImgUrl ? 'visible': 'hidden'}">
            </div>
            <div class="right_detail" @click="goDetail(item.blog)">
              <img :src="require('../../assets/img/image/' + item.blog.imgUrl)" alt="">
              <div class="title">
                <p>{{item.blog.title}}</p>
              </div>
              <div class="subtitle">{{item.blog.info}}</div>
            </div>
          </el-carousel-item>
        </el-carousel>

      </div>
      <!-- other block -->
      <div class="other_article">
        <div class="left_menu">
          <ul>
            <li v-for="item in menuItems" :key="item.id" @click="chooseType(item)"
              :class="{'active': item.id == blogType}">{{item.name}}</li>
          </ul>
        </div>
        <div class="right_articles" v-infinite-scroll="getWriteList" infinite-scroll-disabled="disabled">
          <div class="article_block" v-for="(item,index) in lists" @click="goDetail(item)" :key="index">
            <img class="title_img" :src="item.midImgUrl" alt=""
              :style="{'visibility': item.bigImgUrl ? 'visible': 'hidden'}">
            <div>
              <p>{{item.title}}</p>
              <p v-html="$options.filters.textLength(item.info, 38)"></p>
              <p>
                <img v-if="!item.userInfo[0].avatar" class="author_icon" src="../../assets/img/image/avarot-default.png"
                  alt="">
                <img v-else class="author_icon" :src="item.userInfo[0].avatar" alt="">
                <span class="author">{{item.userInfo[0].nickName}}·{{item.updateAt | formatDateDay}}</span>
                <span class="type">{{renderType(item.blogType)}}</span>
                <span class="view_amount">
                  <img src="../../assets/img/icon/eyes.svg" alt="">
                  {{item.viewNum}}
                </span>
                <span class="thumb_amount">
                  <img src="../../assets/img/icon/icon-thumb-up.svg" alt="">
                  {{item.likeNum}}
                </span>
              </p>
            </div>
          </div>
          <div class="article_page" v-if="showPagination">
            <el-pagination background layout="prev, pager, next" :hide-on-single-page="false" :total="listTotal"
              @current-change="changePage" :page-size="10">
            </el-pagination>
          </div>

          <!-- no result -->
          <div class="no_result" v-if="lists.length == 0">
            <img src="../../assets/img/image/img-write-blank.png" alt="">
            <span>暂时没有文章，赶快联系我们投稿吧！投稿邮箱：wangbing@zhongruigroup.com</span>
          </div>
        </div>
      </div>
    </div>
  </my-scrollbar>

</template>
<style lang="scss" scoped>
  .set_width {
    width: 100%;
  }

  .flex {
    display: flex;
  }

  .no_result {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;

    span {
      font-size: 14px;
      color: #A0A0A0;
      margin-left: 30px;
    }
  }

  .container {
    padding: 48px 0;
    width: 1200px;
    margin: 0 auto;

    .top_article {
      height: 332px;
      display: flex;
      margin-bottom: 42px;
      background: white;
      border-radius: 20px;
    }

    .left_title {
      width: 781px;

      img {
        width: 100%;
        height: 100%;
        border-radius: 20px 0 0 20px;
      }
    }

    .right_detail {
      width: 419px;
      cursor: pointer;
    }
  }

  .right_detail {
    padding: 16px 17px 0 31px;
    position: relative;

    img {
      position: absolute;
      right: 15px;
    }

    .title {
      color: #34485e;
      font-size: 22px;
      font-weight: bold;
      margin: 60px 0 84px 0;
    }

    .subtitle {
      color: #394145;
      font-size: 16px;
    }
  }

  .other_article {
    display: flex;
    word-break: keep-all;
  }

  .left_menu {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 1px 5px 0px rgba(236, 236, 236, 0.5);
    border-radius: 2px;
    margin-right: 12px;
    height: 315px;
  }

  .left_menu ul {
    padding-left: 0;
    list-style: none;
  }

  .left_menu li {
    color: #34485e;
    font-size: 16px;
    margin: 9px 10px 9px 10px;
    text-align: center;
    padding: 9px 34px;
    cursor: pointer;

    &:hover,
    &:focus {
      color: #3376ff;
    }
  }

  .right_articles {
    width: 100%;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 1px 5px 0px rgba(236, 236, 236, 0.53);
    padding: 0 30px;
    overflow: hidden;

    a {
      color: #394145;
      text-decoration: none;
    }
  }

  .article_block {
    display: flex;
    padding: 50px 0;
    border-bottom: 1px solid #eff3f7;
    cursor: pointer;

    &:last-child {
      border-bottom: none;
    }

    img.title_img {
      width: 300px;
      height: 128px;
      margin-right: 30px;
    }

    p:nth-child(1) {
      color: #34485e;
      font-size: 20px;
      font-weight: 600;
    }

    p:nth-child(2) {
      color: #394145;
      font-size: 18px;
      font-weight: 400;
      margin: 12px 0 24px 0;
    }

    p:nth-child(3) {
      display: flex;
      align-items: center;
      font-size: 14px;

      img.author_icon {
        width: 30px;
        height: 30px;
      }

      span.author {
        color: #394a58;
        margin: 0 20px 0 10px;
      }

      span.type,
      span.view_amount,
      span.thumb_amount {
        color: #9eadba;
        margin-right: 20px;
      }
    }
  }

  .active {
    background: rgba(234, 241, 255, 1);
    border-radius: 6px;
    color: #3376ff !important;
    font-weight: bold;
  }

  @media screen and (max-width: 1366px) {
    .container {
      width: 1100px;
    }
  }
</style>
<script>
  import * as custom from "@/assets/js/custom.config";
  import MyScrollbar from "@/components/scroller/Scrollbar";
  import MyHeader from "@/components/header/Header";
  import Detail from "@/pages/writing/detail";
  import {
    log
  } from "util";
  export default {
    components: {
      MyScrollbar
    },
    data() {
      return {
        config: custom.write,
        menuItems: [{
            id: 0,
            name: "全部"
          },
          {
            id: 1,
            name: "技术"
          },
          {
            id: 2,
            name: "交互"
          },
          {
            id: 3,
            name: "设计"
          },
          {
            id: 4,
            name: "管理"
          },
          {
            id: 5,
            name: "其他"
          }
        ],
        lists: [], // 写字列表
        blogType: 0, // 文章类型
        topList: [], // top3文章
        topImg: ["best_article.svg", "most_popular.svg", "best_comment.svg"],
        disabled: false,
        paging: {
          page: 0,
          limit: 10
        },
        listTotal: null, // 列表总条数
        showPagination: false, // 是否显示分页器
        listPage: {
          page: 0,
          limit: 10
        }
      };
    },
    mounted() {
      this.getBest();
      this.getWriteList();
    },
    methods: {
      //跳转明细页
      goDetail(e) {
        console.log(e);
        var detailParams = {
          detailId: e._id,
          imgUrl: e.imgUrl
        };
        window.open(window.location.href + '/detail?detailParams=' + JSON.stringify(detailParams))
        // this.$router.push({
        //   path: "writing/detail?detailParams=" + JSON.stringify(detailParams)
        // });
      },
      // 选择文章类型
      chooseType(item) {
        this.lists = []
        this.blogType = item.id;
        this.paging.page = 0
        this.getWriteList();
      },
      // 渲染文章类型
      renderType(type) {
        let result = "";
        switch (type) {
          case 1:
            result = "技术";
            break;
          case 2:
            result = "交互";
            break;
          case 3:
            result = "设计";
            break;
          case 4:
            result = "管理";
            break;
          case 5:
            result = "其他";
            break;
        }
        return result;
      },
      // 获得文章列表
      async getWriteList() {
        this.disabled = true;
        const loading = this.$loading({
          lock: true,
          text: '加载中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.paging = {
          page: ++this.paging.page,
          limit: 10
        }
        let filters = {
          blogType: this.blogType == 0 ? null : this.blogType
        };
        let params = {
          paging: this.paging,
          filters: filters
        };
        const data = await await this.$axios.post(
          `${process.env.BASE_URL}/web_api/getWriteList`,
          params
        );
        if (data.status === 200) {
          const res = data.data.data.data;
          this.listTotal = data.data.data.total
          loading.close()
          if (res.length > 0) {
            this.disabled = (res.length < 10) ? true : false
            res.map(e => {
              if (e.userInfo.length == 0) {
                e.userInfo.push({
                  avator: null,
                  nickName: null
                })
              }
              this.lists.push(e);
              this.showPagination = (this.lists.length == 20) ? true : false
              if (this.showPagination) {
                this.disabled = true;
              //  this.listPage.page = this.paging.page + 1
              //  this.listTotal = this.listTotal - this.lists.length + 1
              }
            });
          } else {
            this.disabled = true;
          }
        }
      },
      // 获得top3文章
      async getBest() {
        const data = await await this.$axios.post(
          `${process.env.BASE_URL}/web_api/getWriteBest`
        );
        if (data.status === 200) {
          if (data.data.data.length > 0) {
            this.topList = data.data.data;
            for (let i = 0; i < this.topList.length; i++) {
              this.topList[i].blog.imgUrl = this.topImg[i];
            }
            // console.log(this.topList)
          }
        }
      },

      // 分页列表
      async getPageList() {
        let filters = {
          blogType: this.blogType == 0 ? null : this.blogType
        };
        let params = {
          paging: this.listPage,
          filters: filters
        };
        const data = await this.$axios.post(
          `${process.env.BASE_URL}/web_api/getWriteList`, params);
        if (data.status === 200) {
          const res = data.data.data.data
          this.listTotal = data.data.data.total
          res.map(e => {
            if (e.userInfo.length == 0) {
              e.userInfo.push({
                avator: null,
                nickName: null
              })
            }
          })
          this.lists = res
        }
      },

      // 翻页
      changePage(page) {
        this.listPage.page = page;
        this.getPageList();
      }
    }
  };
</script>
