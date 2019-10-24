<template>
  <my-scrollbar hasHead hasFoot :headStyle="{'background':'white'}" :headActive="'打码'">
    <div slot="container">
      <div class="code_search bg-white">
        <div class="search_bar">
          <el-input class="input_content" placeholder="有Bug，这里搜～"></el-input>
          <el-button type="primary" class="search_btn">搜索</el-button>
        </div>
        <div class="design_bar">
          <div class="design_classI inline" v-for="item in config.list">
              <el-link :underline="false" :key="item.id">{{item.name}}</el-link>
          </div>
          <div class="design_classII">
              <el-tag type="info" v-for="tag in list.content" :key="tag.id">{{tag.name}}</el-tag>
          </div>
        </div>
      </div>
      <button @click="testGetListApi()">get</button>
      <button @click="testAddApi()">add</button>
      <button @click="testDetailApi()">detail</button>
      <button @click="testDelApi()">delate</button><br>
      <router-link :to="'/coding/search'">去搜索</router-link><br>
      <router-link :to="'/coding/list'">去打码列表</router-link><br>
      <router-link :to="'/coding/solve'">去提供解决方案</router-link><br>
      <button @click="testSearchApi()">search</button><br>
    </div>
  </my-scrollbar>
</template>
<script>
import * as custom from "@/assets/js/custom.config";
import MyScrollbar from '@/components/scroller/Scrollbar';
import { async } from 'q';
export default {
  components: {
    MyScrollbar
  },
  data () {
    return {
      config: custom.search,
      list:  custom.search.list[0],
    }
  },
  mounted () {
  },
  methods: {
    async testAddApi () {
      let params = {
        title: 'req.body.title',
        content: 'req.body.content',
        tags: [],
        bugStatus: true,
        bugSolution: 'req.body.bugSolution',
        author: 'req.body.author'
      }
      const { data } = await this.$axios.post(`${process.env.BASE_URL}/web_api/AddBugItems`, params);
      console.log(data);
    },
    async testGetListApi () {
      let params = {
        pageIndex: 1,
        pageSize: 10
      }
      const { data } = await this.$axios.post(`${process.env.BASE_URL}/web_api/GetBugList`, params);
      console.log(data);
    },
    async testDetailApi () {
      const res = await this.$axios.get(`${process.env.BASE_URL}/web_api/GetBugDetail?bugId=5cf8b075c26c2f18a0cb4fa7`);
      console.log(res);
    },
    async testDelApi () {
      let params = {
        id: '5cf8b075c26c2f18a0cb4fa7'
      }
      const { data } = await this.$axios.post('/api_nuxt/DeleteBugById', params);
      console.log(data);
    },
    async testSearchApi() {
      let params = {
        keywords: 'author',
        pageIndex: 1,
        pageSize: 10
      }
      const { data } = await this.$axios.post(`/web_api/SearchByKeywords`, params);
      console.log(data);
    }
  },
}
</script>
<style lang='scss' scoped>
.flt {
  float: left;
}
.frt {
  float: right;
}
.code_search {
  padding-top: 66px;
  padding-bottom: 40px;
  border-top: 1px solid #ececec;
  box-shadow: 0px 1px 5px 0px #ececec;
  .search_bar {
    width: 62.5%;
    height: 46px;
    margin: 0 auto;
    .input_content {
      width: 60%;
      height: 44px;
      border-radius: 8px;
      border: 2px solid #3376ff;
    }
    .search_btn {
      width: 130px;
      height: 44px;
      margin-left: 20px;
      border-radius: 23px;
    }
  }
  .design_bar {
    width: 62.5%;
    margin: 30px auto 0;
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
      // margin-top: 16px;
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
</style>
