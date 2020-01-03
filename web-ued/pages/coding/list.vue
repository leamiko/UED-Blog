<template>
  <div class="cus-full-screen hidden"
       v-loading="loading">
    <div class="my-content">
      <div class="code_search">
        <my-search @search="getSearch"
                   :value="searchVal"></my-search>
        <div class="design_bar">
          <div class="design_classI inline"
               v-for="item in classList.list"
               :key="item.id">
            <el-link :underline="false"
                     :key="item.id"
                     @click="changeType(item)">{{item.name}}</el-link>
          </div>
          <div class="design_classII">
            <el-tag type="info"
                    class="type_select pointer"
                    v-for="tag in typeObject.content"
                    :key="tag.id"
                    @click="chooseTag(tag)">{{tag.name}}</el-tag>
          </div>
        </div>
      </div>
      <!-- 无结果 -->
      <div class="code_noresult bg-white"
           v-show="noData">
        <div class="noresult_img">
          <img src="@/assets/img/image/image-search-noresult-image.png">
        </div>
        <div class="noresult_prompt">
          如你所料，果然没搜到！不妨试试
          <button type="button"
                  class="ask_btn bg-white pointer"
                  @click="askShow=true">我要提问</button>
        </div>
      </div>
      <!-- 数据列表 -->
      <div class="code_list bg-white"
           v-show="listShow">
        <div class="category_tabs inline">
          <span class="category_tab pointer"
                :class="{'active':m.isActive}"
                v-for="(m,index) in stateList"
                :key="index"
                @click="changeState(m)">{{m.text}}</span>
        </div>
        <div class="code_info">
          <div class="code_content"
               v-for="x in bugList"
               :key="x._id">
            <div class="pointer"
                 @click="showDetail(x._id)">
              <div class="content_title">{{x.title}}</div>
            </div>
            <div class="content_mark inline">
              <div class="presenter flt">
                <div class="presenter_head flt inline">
                  <img v-if="!x.anonymous && x.authorInfo.avatar!=='' && x.authorInfo.avatar!==null"
                       :src="x.authorInfo.avatar">
                  <img v-else-if="x.anonymous || x.authorInfo.avatar==='' || x.authorInfo.avatar===null"
                       src="@/assets/img/image/avarot-default.png">
                </div>
                <span class="presenter_info inline">{{x.authorInfo.nickName}} · {{x.createAt | formatDateDay}}</span>
                <div class="mark_tags inline">
                  <span class="mark_tag"
                        v-for="(y,index) in x.tags"
                        :key="index">{{y}}</span>
                </div>
              </div>
              <div class="respondents frt">已有{{x.commentNum}}人回答</div>
            </div>
          </div>
        </div>
        <div class="page_flipper">
          <el-pagination background
                         layout="prev, pager, next"
                         :total="count?count:0"
                         @current-change="changePage"></el-pagination>
        </div>
      </div>
    </div>
    <!-- 模态框 -->
    <quiz-dialog :isShow="askShow"
                 :classStyle="className"
                 placeholder="请一句话描述你的问题"
                 @hide="askShow=false"></quiz-dialog>
  </div>
</template>

<script>
import * as custom from '@/assets/js/custom.config';
import MySearch from '@/components/search/Search';
import NoResult from '@/components/search/NoResult';
import QuizDialog from '@/components/dialogs/QuizDialog';
import MyTag from '@/components/Tag';
export default {
  components: {
    MySearch,
    NoResult,
    QuizDialog,
    MyTag
  },
  data () {
    return {
      loading: true,
      className: 'custom-dialog',
      askShow: false,
      searchVal: null, // 搜索内容
      classList: custom.search, // 条目
      typeObject: custom.search.list[0], // 二级条目
      searchType: [], // 条目类别
      stateList: [
        { id: '0', text: '全部', state: null, isActive: true },
        { id: '1', text: '已解决', state: true, isActive: false },
        { id: '2', text: '未解决', state: false, isActive: false },
      ],
      solveState: null, // 解决状态
      noData: true, // 无数据
      listShow: false, // 是否展示列表数据，解决状态搜索出无数据时不展示
      pageIndex: 1,
      bugList: [], // bug
      count: '', // bug总条数
    }
  },
  mounted () {
    this.$store.commit("headActive", "打码");
    this.getInfo();
  },
  watch: {
    askShow (newVal, oldVal) {
      if (oldVal === true && newVal === false) {
        this.pageIndex = 1;
        this.getInfo();
      }
    }
  },
  methods: {
    // 获取列表信息
    async getInfo () {
      let params = {
        pageIndex: this.pageIndex,
        pageSize: 10,
        filters: {
          title: this.searchVal,
          bugStatus: this.solveState,
          author: "", //作者，置空
          tags: this.searchType
        }
      }
      const { data } = await this.$axios.post(`${process.env.BASE_URL}/web_api/GetBugList`, params);
      if (data.status_code === 200) {
        if (data.data.length > 0) {
          this.noData = false;
          this.bugList = data.data;
          this.count = data.count;
          setTimeout(() => {
            this.loading = false;
            this.listShow = true;
          }, 500);
        } else {
          setTimeout(() => {
            this.loading = false;
            this.noData = true;
            if (this.solveState !== null) {
              this.listShow = false;
            };
          }, 500);
        }
      } else {
        setTimeout(() => {
          this.loading = false;
        }, 500);
        this.$notify.error({
          title: '错误',
          message: data.data.message
        });
      }
    },
    // 搜索
    getSearch (val) {
      if (val !== '') {
        this.getInfo();
      }
    },
    // 切换分类
    changeType (val) {
      this.typeObject = {};
      this.typeObject = val;
    },
    // 选择分类
    chooseTag (val) {
      this.searchType = [];
      this.searchType.push(val.name);
      this.getInfo();
    },
    // 切换状态
    changeState (val) {
      for (let i = 0; i < this.stateList.length; i++) {
        if (this.stateList[i].id === val.id) {
          this.stateList[i].isActive = true;
        } else {
          this.stateList[i].isActive = false;
        }
      }
      this.solveState = val.state;
      this.getInfo();
    },
    // 翻页
    changePage (page) {
      this.pageIndex = page;
      this.getInfo();
    },
    // 查看打码明细
    showDetail (id) {
      this.$router.push({
        path: '/coding/detail',
        query: {
          bugId: id
        }
      })
    },
    // 创建
    handleCommand (command) {
      if (command === 'answer') {
        this.$router.push({
          path: '/coding/solve'
        })
        return;
      }
      this[command] = !this[command];
    },
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
            .el-link--default {
              color: #34485e;
            }
          }
        }
        .design_classI:active {
          color: #3376ff;
        }
        .design_classII {
          .el-tag.el-tag--info {
            display: inline-block;
            margin-top: 16px;
            margin-right: 20px;
            padding: 0 16px;
            color: #a3b3bf;
            font-size: 14px;
            background: #f0f5f9;
            border-radius: 16px;
            border: none;
          }
          .type_select:active {
            background: #3376ff;
            color: #ffffff;
          }
        }
      }
    }

    &.code_noresult {
      display: flex;
      height: 218px;
      margin-top: 30px;
      padding-top: 38px;
      box-shadow: 0px 1px 5px 0px rgba(236, 236, 236, 0.5);
      .noresult_img {
        width: 234px;
        height: 185px;
        margin-left: calc((100% - 614px) / 2);
        img {
          width: 100%;
        }
      }
      .noresult_prompt {
        flex: 1;
        margin-top: 60px;
        margin-left: 50px;
        color: #a0a0a0;
        .ask_btn {
          margin-left: 20px;
          padding: 6px 19px;
          color: #3376ff;
          border: 1px solid #3376ff;
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
  margin-top: 30px !important;
  box-shadow: 0px 1px 5px 0px rgba(236, 236, 236, 0.5);
  .category_tabs {
    width: 100%;
    text-align: right;
    padding: 30px 40px;
    .category_tab {
      margin-left: 30px;
      font-size: 16px;
      color: #7d7d7d;
    }
    .category_tab.active {
      color: #3376ff;
    }
  }
  // 数据
  .code_info {
    padding: 0 75px;
    .code_content {
      padding: 40px 21px 30px;
      border-top: 1px solid #eff3f7;
      .content_title {
        margin-bottom: 21px;
        font-size: 20px;
        font-weight: 600;
        color: #34485e;
      }
      .content_question {
        width: 85%;
        max-height: 56px;
        margin-bottom: 36px;
        font-size: 18px;
        color: #394145;
        font-weight: normal;
        font-style: normal;
        font-family: PingFangSC-Regular, PingFang SC;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
      .content_mark {
        width: 100%;
        color: #394a58;
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
              color: #9eadba;
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
    .el-pagination.is-background .btn-prev,
    .el-pagination.is-background .btn-next,
    .el-pagination.is-background .el-pager li {
      border: 1px solid #d9d9d9 !important;
      background: #ffffff;
    }
  }
}
</style>
<style lang="scss">
// 非私有样式！，格式化富文本
.content_question {
  width: 85%;
  max-height: 56px;
  margin-bottom: 36px;
  font-size: 18px;
  color: #394145;
  font-weight: normal;
  font-style: normal;
  font-family: PingFangSC-Regular, PingFang SC;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  // 统一富文本样式
  p,
  ul,
  ol,
  li,
  pre,
  blockquote,
  strong,
  em {
    list-style: none;
    padding-left: 0px;
    font-size: 18px;
    color: #394145;
    font-weight: normal;
    font-style: normal;
    font-family: PingFangSC-Regular, PingFang SC;
    background: #ffffff;
  }
  // 隐藏富文本中的图片
  p img,
  blockquote img {
    display: none;
  }
}
</style>
