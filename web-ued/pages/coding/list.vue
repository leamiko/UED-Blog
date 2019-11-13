<template>
  <div class="cus-full-screen hidden">
    <my-scrollbar>
      <div slot="container">
        <div class="cus-fixed cus-header">
          <my-header activeLabel="打码">
            <div slot="box_cus">
              <el-dropdown trigger="click" size="medium" split-button type="primary" @command="handleCommand">
                创建
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="askShow">我要提问</el-dropdown-item>
                  <el-dropdown-item command="answer">提供解决方案</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </my-header>
        </div>
        <div class="my-content">
          <div class="code_search">
            <my-search @search="getSearch" :value="searchVal"></my-search>
            <div class="design_bar">
              <div class="design_classI inline" v-for="item in config.list" :key="item.id">
                <el-link :underline="false" :key="item.id">{{item.name}}</el-link>
              </div>
              <div class="design_classII">
                <!-- <el-tag type="info" v-for="tag in item.content" :key="tag.id">{{tag.name}}</el-tag> -->
                <el-tag type="info" v-for="tag in list.content" :key="tag.id">{{tag.name}}</el-tag>
              </div>
            </div>
          </div>
          <!-- 无结果 -->
          <div class="code_noresult bg-white" v-show="true">
            <!-- <no-result @active="askShow=true"></no-result> -->
            <div class="noresult_img">
              <img src="@/assets/img/image/image-search-noresult-image.png" >
            </div>
            <div class="noresult_prompt">
              如你所料，果然没搜到！不妨试试
              <button type="button" class="ask_btn bg-white pointer" @click="askShow=true">我要提问</button>
            </div>
          </div>
          <!-- 数据列表 -->
          <div class="code_list bg-white">
            <div class="category_tabs inline">
              <span class="category_tab pointer active">全部</span>
              <span class="category_tab pointer">已解决</span>
              <span class="category_tab pointer">未解决</span>
            </div>
            <div class="code_info">
              <div class="code_content pointer" @click="showDetail()">
                <div class="content_title">Spring Cloud异步场景分布式事务怎样做？</div>
                <div class="content_question">在微服务架构中，我们常常使用异步化的手段来提升系统的 吞吐量 和 解耦 上下游，而构建异步架构最常用的手段就是使用 消息队列(MQ)，那异步架构怎样才能实现数据一致性呢？</div>
                <div class="content_mark inline">
                  <div class="presenter flt">
                    <div class="presenter_head flt inline">
                      <img src="@/assets/img/image/code_presenter.png">
                    </div>
                    <span class="presenter_info inline">UILEO · 2019-08-28</span>
                    <div class="mark_tags inline">
                      <span class="mark_tag">javascript</span>
                      <span class="mark_tag">php</span>
                      <span class="mark_tag">css</span>
                    </div>
                  </div>
                  <div class="respondents frt">已有10人回答</div>
                </div>
              </div>
              <div class="code_content pointer" @click="showDetail()">
                <div class="content_title">Spring Cloud异步场景分布式事务怎样做？</div>
                <div class="content_question">在微服务架构中，我们常常使用异步化的手段来提升系统的 吞吐量 和 解耦 上下游，而构建异步架构最常用的手段就是使用 消息队列(MQ)，那异步架构怎样才能实现数据一致性呢？</div>
                <div class="content_mark inline">
                  <div class="presenter flt">
                    <div class="presenter_head flt inline">
                      <img src="@/assets/img/image/code_presenter.png">
                    </div>
                    <span class="presenter_info inline">UILEO · 2019-08-28</span>
                    <div class="mark_tags inline">
                      <span class="mark_tag">javascript</span>
                      <span class="mark_tag">php</span>
                      <span class="mark_tag">css</span>
                    </div>
                  </div>
                  <div class="respondents frt">已有10人回答</div>
                </div>
              </div>
            </div>
            <div class="page_flipper">
              <el-pagination background layout="prev, pager, next" :total="100"></el-pagination>
            </div>
          </div>
        </div>
        <my-footer :hasMenu="true"></my-footer>
      </div>
    </my-scrollbar>
    <!-- 模态框 -->
    <quiz-dialog :isShow="askShow" :classStyle="className" placeholder="请一句话描述你的问题" @hide="askShow=false"></quiz-dialog>
  </div>
</template>

<script>
import * as custom from '@/assets/js/custom.config';
import MyScrollbar from '@/components/scroller/Scrollbar';
import MyHeader from '@/components/header/Header';
import MyFooter from '@/components/footer/Footer';
import MySearch from '@/components/search/Search';
import NoResult from '@/components/search/NoResult';
import QuizDialog from '@/components/dialogs/QuizDialog';
import MyTag from '@/components/Tag';
export default {
  components: {
    MyScrollbar,
    MyHeader,
    MyFooter,
    MySearch,
    NoResult,
    QuizDialog,
    MyTag
  },
  data() {
    return {
      searchVal: '',
      className: 'custom-dialog',
      askShow: false,
      config: custom.search,
      list:  custom.search.list[0],
    }
  },
  methods: {
    async showDetail () {
      this.$router.push({
        path: '/coding/detail'
      })
    },
    handleCommand(command) {
      if (command === 'answer') {
        this.$router.push({
          path: '/coding/solve'
        })
        return;
      }
      this[command] = !this[command];
    },
    getSearch(val) {
      console.log(val);
    }
  }
}
</script>

<style lang="scss" scoped>
.center {
  margin: 0 auto;
}
.cus-header {
  top: 0;
  width: 100%;
  z-index: 11;
  background: white;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 0px 2px;
}
.flt {
  float: left;
}
.frt {
  float: right;
}
.my-content {
  padding: 82px 0 46px;

  > div {
    max-width: 1200px;
    min-width: 960px;
    @extend .center;

    &:first-child {
      width: 100%;
      max-width: initial;
      min-width: initial;
      padding-top: 66px;
      padding-bottom: 40px;
      background: #fff;
      border-top: 1px solid #ececec;
      box-shadow: 0px 4px 5px 0px #ececec;
      > div {
        @extend .center;
        width: 62.5%;
        min-width: 960px;
        max-width: 1200px;
        min-width: 600px;
        max-width: 922px;
      }
      .design_bar {
        margin-top: 30px;
        .design_classI {
          margin-right: 45px;
          .el-link {
            font-weight: 600;
            .el-link--default{
              color: #34485E;
            }
          }
        }
        .design_classI:active {
          color: #3376FF;
        }
        .design_classII {
          .el-tag.el-tag--info {
            display: inline-block;
            margin-top: 16px;
            margin-right: 20px;
            padding: 0 16px;
            color: #A3B3BF;
            font-size: 14px;
            background:#F0F5F9;
            border-radius:16px;
            border: none;
          }
        }
      }
    }

    &.code_noresult {
      display: flex;
      height: 218px;
      margin-top: 20px;
      margin-bottom: 30px;
      padding-top: 38px;
      box-shadow:0px 1px 5px 0px rgba(236,236,236,0.5);
      .noresult_img {
        width: 234px;
        height: 185px;
        margin-left: calc((100% - 614px)/2);
        img {
          width: 100%;
        }
      }
      .noresult_prompt {
        flex: 1;
        margin-top: 60px;
        margin-left: 50px;
        color: #A0A0A0;
        .ask_btn {
          margin-left: 20px;
          padding: 6px 19px;
          color: #3376FF;
          border: 1px solid #3376FF;
          border-radius: 15px;
        }
        .ask_btn:focus {
          outline: none;
        }
      }
    }
  }
}

@media screen and(min-width: 1024px) {
  .my-content {

    > div {
      width: 960px;

      &:first-child {

        > div {
          width: 600px;
        }
      }
    }
  }
}

@media screen and(min-width: 1100px) {
  .my-content {

    > div {
      width: 1000px;

      &:first-child {

        > div {
          width: 720px;
        }
      }
    }
  }
}
@media screen and(min-width: 1280px) {
  .my-content {

    > div {
      width: 1100px;

      &:first-child {

        > div {
          width: 840px;
        }
      }
    }
  }
}

@media screen and(min-width: 1366px) {
  .my-content {

    > div {
      width: 1200px;

      &:first-child {

        > div {
          width: 922px;
        }
      }
    }
  }
}

@media screen and(min-width: 1440px) {
  .my-content {

    > div {
      width: 1200px;

      &:first-child {

        > div {
          width: 922px;
        }
      }
    }
  }
}

@media screen and(min-width: 1680px) {
  .my-content {

    > div {
      width: 1200px;

      &:first-child {

        > div {
          width: 922px;
        }
      }
    }
  }
}
@media screen and(min-width: 1920px) {
  .my-content {

    > div {
      width: 1200px;

      &:first-child {

        > div {
          width: 922px;
        }
      }
    }
  }
}

.code_list {
  box-shadow:0px 1px 5px 0px rgba(236,236,236,0.5);
  .category_tabs {
    width: 100%;
    text-align: right;
    padding: 30px 40px;
    .category_tab {
      margin-left:30px;
      font-size: 16px;
      color: #7D7D7D;
    }
    .category_tab.active {
      color: #3376FF;
    }
  }
  // 数据
  .code_info {
    padding: 0 75px;
    .code_content {
      padding: 40px 21px 30px;
      border-top: 1px solid #EFF3F7;
      .content_title {
        margin-bottom: 21px;
        font-size: 20px;
        font-weight: 600;
        color: #34485E;
      }
      .content_question {
        width: 85%;
        margin-bottom: 36px;
        font-size: 18px;
        color: #394145;
      }
      .content_mark {
        width: 100%;
        color: #394A58;
        .presenter {
          .presenter_head {
            width: 30px;
            height: 30px;
            img {
              width: 100%;
            }
          }
          .presenter_info {
            height: 100%;
            margin-left: 10px;
            padding: 5px 0;
          }
          .mark_tags {
            margin-left: 20px;
            .mark_tag {
              margin-right: 16px;
              color:#9EADBA;
            }
          }
        }
        .respondents {
          padding: 5px 0;
        }
      }
    }
    .code_content:first-child {
      padding-top: 0px;
      border-top: none;
    }
  }
  // 分页器
  .page_flipper {
    padding: 30px 50px 46px;
    text-align: right;
    .el-pagination {
      font-weight: normal;
    }
    .el-pagination.is-background .btn-prev, .el-pagination.is-background .btn-next, .el-pagination.is-background .el-pager li {
      border: 1px solid #D9D9D9!important;
      background: #ffffff;
    }
  }

}
</style>>
