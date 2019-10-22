<template>
  <my-scrollbar hasHead hasFoot :headStyle="{'background':'white'}" :headActive="'写字'">
    <div slot="container" class="container">
      <!-- top block -->
      <div class="top_article">
        <div class="left_title">
          <el-carousel trigger="click" :height="342 + 'px'" :autoplay="false">
            <el-carousel-item v-for="item in config.swiperList" :key="item">
              <img :src="item" style="width: 100%; height: 100%;">
            </el-carousel-item>
          </el-carousel>
        </div>
        <div class="right_detail">
          <img src="../../assets/img/image/most_popular.svg" alt="">
          <div class="title">
            <p>如何搭建一个线上的前端项目？</p>
            <p>基于前端的服务器搭建指南</p>
          </div>
          <div class="subtitle">本文主要从前端的角度来指导如何搭建一个线上的前端项目</div>
        </div>

      </div>
      <!-- other block -->
      <div class="other_article">
        <div class="left_menu">
          <ul>
            <li v-for="item in menuItems" :key="item.id">{{item.name}}</li>
          </ul>
        </div>
        <div class="right_articles">

        </div>

      </div>
    </div>
  </my-scrollbar>

</template>
<style lang="scss" scoped>
  .container {
    padding: 48px 0;
    width: 1210px;
    margin: 0 auto;

    .top_article {
      height: 342px;
      display: flex;
      background: url('../../assets/img/bg/white_bg.png') no-repeat;
      margin-bottom: 42px;
    }

    .left_title {
      width: 791px;
    }

    .right_detail {
      width: 409px;
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
      color: #34485E;
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
  }

  .left_menu ul {
    padding-left: 0;
    list-style: none;
  }

  .left_menu li {
    color: #34485E;
    font-size: 16px;
    margin: 9px 10px 9px 10px;
    text-align: center;
    padding: 9px 34px;
    cursor: pointer;

    &:hover,
    &:focus {
      background: rgba(234, 241, 255, 1);
      border-radius: 6px;
      color: #3376FF;
      font-weight: bold;

    }
  }

  .right_articles {
    width: 100%;
    height: 20px;
    background:rgba(255,255,255,1);
    box-shadow:0px 1px 5px 0px rgba(236,236,236,0.53);
  }
</style>
<script>
  import * as custom from "@/assets/js/custom.config";
  import MyScrollbar from "@/components/scroller/Scrollbar";
  import MyHeader from "@/components/header/Header";
  export default {
    components: {
      MyScrollbar
    },
    data() {
      return {
        config: custom.write,
        menuItems: [{
            id: 1,
            name: '全部'
          },
          {
            id: 2,
            name: '技术'
          },
          {
            id: 3,
            name: '交互'
          },
          {
            id: 4,
            name: '设计'
          },
          {
            id: 5,
            name: '管理'
          },
          {
            id: 6,
            name: '其他'
          }
        ]
      }
    },
    mounted() {},
    methods: {},
  }
</script>
