<template>
  <div class="cus-full-width cus-full-height hidden">
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
          <div class="my-search">
            <my-search @search="getSearch" :value="searchVal"></my-search>
            <div>
              <div class="top_30">
                <el-link :underline="false" v-for="item in 6" :key="item">{{item}}</el-link>
              </div>
              <div class="top_16">
                <el-tag type="info" v-for="item in 10" :key="item"> {{item}} </el-tag>
              </div>
            </div>
          </div>
        </div>
        <div class="my-content">
          <no-result @active="askShow=true"></no-result>
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
export default {
  components: {
    MyScrollbar,
    MyHeader,
    MyFooter,
    MySearch,
    NoResult,
    QuizDialog
  },
  data() {
    return {
      searchVal: '',
      className: 'custom-dialog',
      askShow: false
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

.my-search {
  padding-top: 66px;
  padding-bottom: 40px;
  border-top: 1px solid #ECECEC;

  > div {
    @extend .center;
    width: 62.5%;
    min-width: 600px;
    max-width: 922px;
  }
}
.my-content {
  padding-top: 357px;
  padding-bottom: 60px;
  min-height: 560px;
  min-width: 600px;
  max-width: 1200px;
  @extend .center;
}
.el-link {
  height: 30px;
  margin-right: 45px;
}
.el-tag {
  margin-right: 20px;
  cursor: pointer;
  &:nth-last-child(1) {
    margin-right: 0;
  }
}
.top_30 {
  padding-top: 30px;
}
.top_16 {
  padding-top: 16px;
}
</style>>
