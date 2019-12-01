<template>
  <div class="cus-full-screen hidden bg-white">
    <my-scrollbar hasHead hasFoot :headActive="'打码'" :isFootMenu="false" :mainStyle="{'background':'white'}" :headStyle="styleConf">
      <div slot="head_custom">
        <el-dropdown trigger="click" size="medium" split-button type="primary" @command="handleCommand">
          创建
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="askShow"><p>我要提问</p></el-dropdown-item>
            <el-dropdown-item command="answer"><p>提供解决方案</p></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div slot="container" class="my-body">
        <div>
          <div class="my-search">
            <h1 class="text-center">Bug避坑专用搜索引擎</h1>
            <my-search @select="getSearch" :isAsync="true"></my-search>
            <div v-if="list && list.length > 0">
              <br><br>
              <h4 class="text-dark">大家都在搜</h4><br>
              <div>
                <my-tag class="my-tag" v-for="item in list" :key="item.name" :text="item.name" @active="getSearch(item.name)"></my-tag>
              </div>
              <!-- <div class="design_bar">
                <div class="design_classI inline" v-for="item in list" :key="item._id">
                  <el-link :underline="false" :key="item._id" @click="changeType(item)">{{item.name}}</el-link>
                </div>
                <div class="design_classII">
                  <el-tag type="info" class="type_select pointer" v-for="tag in tagChild" :key="tag.id" @click="getSearch(tag.name)">{{tag.name}}</el-tag>
                </div>
              </div> -->
            </div>
          </div>
          <div class="my-card">
            <div class="cus-flex cus-flex-between cus-align-center">
              <h4 class="text-dark">热门问题</h4>
              <el-button size="medium" round @click="pathRedirect('/coding/list')"> 查看更多<i class="el-icon-arrow-right el-icon-caret-right"></i> </el-button>
            </div>
            <ul v-if="hotList && hotList.length > 0">
              <li v-for="item in hotList" :key="item.id">
                <el-link :underline="false" :href="'/coding/detail?bugId=' + item._id">{{item.title}}</el-link>
              </li>
            </ul>
            <!-- 无结果 -->
            <div class="code_noresult" v-else>
              <div class="noresult_img">
                <img src="@/assets/img/image/image-search-noresult-image.png" >
              </div>
              <div class="noresult_prompt">
                暂无数据~~~
                <button type="button" class="ask_btn bg-white pointer" @click="askShow=true">我要提问</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </my-scrollbar>

    <!-- 模态框 -->
    <quiz-dialog :isShow="askShow" :classStyle="className" placeholder="请一句话描述你的问题" @hide="askShow=false"></quiz-dialog>
  </div>
</template>

<script>
import * as custom from '@/assets/js/custom.config';
import MyScrollbar from '@/components/scroller/Scrollbar';
import QuizDialog from '@/components/dialogs/QuizDialog';
import MySearch from '@/components/search/Search';
import MyTag from '@/components/Tag';
export default {
  components: {
    MyScrollbar,
    QuizDialog,
    MySearch,
    MyTag
  },
  data() {
    return {
      styleConf: {
        'background':'white',
        'borderBottom':'1px solid #DCDFE6',
        'boxShadow': '0 0 2px rgba(0, 0, 0, 0.12)',
        'marginBottom': '4px'
      },
      // list: custom.search.hotLabel,
      // hotList: custom.search.hotList,
      list: [],
      tagChild: [],
      hotList: [],
      askShow: false,
      className: 'custom-dialog'
    }
  },
  methods: {
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
      if (!val) {
        return;
      }
      this.$router.push({
        path: '/coding/list',
        query: val ? {search: val} : null
      });
    },
    pathRedirect(url) {
      this.$router.push({
        path: url
      });
    },
    // 获取热门问题以及在搜标签
    async getHotData() {
      const parmas = {
        pageIndex: 1,
        pageSize: 5,
        filters:{}
      };
      const res = await this.$axios.post(`${process.env.BASE_URL}/web_api/GetBugList`, parmas);
      if (res.status === 200 && res.data.message === 'success') {
        if (res.data.data && res.data.data.length > 0) {
          this.hotList = res.data.data;
        }
      } else {
        this.$notify.error({
          title: '错误',
          message: res.data.message
        });
      }
    },
    async getTags() {
      const res = await this.$axios.get(`${process.env.BASE_URL}/web_api/GetBugTags`);
      if (res.status === 200 && res.data.message === 'success') {
        if (res.data.data && res.data.data.length > 0) {
          const tagList = [];
          this.myRecursion(res.data.data, tagList);
          this.list = tagList;
          // 长度限制
          if (this.list.length > 9) {
            this.list.length = 9;
          }
          // this.list = res.data.data;
          // this.tagChild = res.data.data[0].children;
        }
      } else {
        this.$notify.error({
          title: '错误',
          message: res.data.message
        });
      }
    },
    // 切换分类
    // changeType(val) {
    //   this.tagChild = val.children;
    // },
    myRecursion(tagList, result) {
      tagList.forEach((item) => {
        if (item.children && item.children.length > 0) {
          item.children.forEach(tag => {
            result.push(tag);
          })
        }
      });
    }
  },
  mounted() {
    const loading = this.$loading({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
    setTimeout(() => {
      loading.close();
    }, 2000);
    this.getHotData();
    this.getTags();
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/cus.scss';
@import '@/assets/style/base.scss';
.my-body {
  min-height: calc(100% - 151px);
  > div {
    width: 1000px;
    @extend .cus-box-center;
  }
  .my-search {
    width: 760px;
    @extend .cus-box-center;
    padding-top: 133px;

    h1 {
      margin-bottom: 50px;
    }
  }
  .my-card  {
    background: #F7FAFC;
    border-radius: 4px;
    padding: 30px;
    margin: 140px 0 95px;
    ul {
      list-style: none;
      padding: 30px 0 0;
      > li {
        padding: 20px 0;
        border-bottom: 1px solid #EFF3F7;

        &:last-child {
          border-bottom: 0;
        }
      }
    }
  }
}

.my-tag {
  margin-right: 10px;
  &:nth-last-child(1) {
    margin-right: 0;
  }
}

// .design_bar {

//   .design_classI {
//     margin-right: 45px;
//     .el-link {
//       font-weight: 600;
//       .el-link--default{
//         color: #34485E;
//       }
//     }
//   }
//   .design_classI:active {
//     color: #3376FF;
//   }
//   .design_classII {
//     .el-tag.el-tag--info {
//       display: inline-block;
//       margin-top: 16px;
//       margin-right: 20px;
//       padding: 0 16px;
//       color: #A3B3BF;
//       font-size: 14px;
//       background:#F0F5F9;
//       border-radius:16px;
//       border: none;
//     }
//     .type_select:active {
//       background: #3376FF;
//       color: #ffffff;
//     }
//   }
// }

.code_noresult {
  display: flex;
  height: 218px;
  margin-top: 30px;
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
</style>>
