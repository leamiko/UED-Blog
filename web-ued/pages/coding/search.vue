<template>
  <div class="cus-full-width cus-full-height hidden">
    <my-scrollbar hasHead hasFoot :headActive="'打码'" :isFootMenu="false" :mainStyle="{'background':'white'}" :headStyle="styleConf">
      <div slot="head_custom">
        <el-dropdown size="medium" split-button type="primary" @command="handleCommand">
          创建
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="askShow">我要提问</el-dropdown-item>
            <el-dropdown-item command="answerShow">提供解决方案</el-dropdown-item>
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
              <h4>大家都在搜</h4><br>
              <div>
                <el-tag :type="item.type" v-for="item in list" :key="item.name"> {{item.name}} </el-tag>
              </div>
            </div>
          </div>
          <div class="my-card">
            <div class="cus-flex cus-flex-between cus-align-center">
              <h4>热门问题</h4>
              <el-button size="medium"> 查看更多<i class="el-icon-arrow-right el-icon-caret-right"></i> </el-button>
            </div>
            <ul>
              <li v-for="item in hotList" :key="item.id">
                <el-link href="javascript:void(0)" target="_blank">{{item.name}}</el-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </my-scrollbar>

    <!-- 模态框 -->
    <answer-dialog :isShow="answerShow" :classStyle="className" @hide="answerShow=false"></answer-dialog>
    <quiz-dialog :isShow="askShow" :classStyle="className" placeholder="请一句话描述你的问题" @hide="askShow=false"></quiz-dialog>
  </div>
</template>

<script>
import * as custom from '@/assets/js/custom.config';
import MyScrollbar from '@/components/scroller/Scrollbar';
import QuizDialog from '@/components/dialogs/QuizDialog';
import AnswerDialog from '@/components/dialogs/AnswerDialog';
import MySearch from '@/components/search/Search';
export default {
  components: {
    MyScrollbar,
    QuizDialog,
    AnswerDialog,
    MySearch
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
      answerShow: false,
      className: 'custom-dialog'
    }
  },
  methods: {
    handleCommand(command) {
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
.my-body {
  min-height: calc(100% - 151px);
  > div {
    width: 1000px;
    @extend .center;
  }
  .my-search {
    width: 760px;
    @extend .center;
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

.el-tag {
  margin-right: 10px;
  cursor: pointer;
  &:nth-last-child(1) {
    margin-right: 0;
  }
}
</style>>
