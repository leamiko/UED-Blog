<template>
  <my-scrollbar hasHead hasFoot :headStyle="{'background':'white'}" :headActive="'打码'">
    <div slot="container">
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
