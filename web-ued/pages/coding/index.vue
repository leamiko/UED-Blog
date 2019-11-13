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
            <my-search @search="getSearch"></my-search>
            <div>
              <br><br>
              <h4 class="text-dark">大家都在搜</h4><br>
              <div>
                <my-tag class="my-tag" v-for="item in list" :key="item.name" :text="item.name"></my-tag>
                <!-- <el-tag :type="item.type" v-for="item in list" :key="item.name"> {{item.name}} </el-tag> -->
              </div>
            </div>
          </div>
          <div class="my-card">
            <div class="cus-flex cus-flex-between cus-align-center">
              <h4 class="text-dark">热门问题</h4>
              <el-button size="medium" round @click="pathRedirect('/coding/list')"> 查看更多<i class="el-icon-arrow-right el-icon-caret-right"></i> </el-button>
            </div>
            <ul>
              <li v-for="item in hotList" :key="item.id">
                <el-link :underline="false" href="javascript:void(0)" target="_blank">{{item.name}}</el-link>
              </li>
            </ul>
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
      list: custom.search.hotLabel,
      hotList: custom.search.hotList,
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
      const res = await this.$axios.get(`${process.env.BASE_URL}/web_api/AddTags`);
      if (!res.data && localStorage.getItem("user")) {
        localStorage.removeItem('user')
        window.location.reload()
      }
    }
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
</style>>
