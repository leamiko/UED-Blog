<template>
  <div>
    <button @click="testGetListApi()">get</button>
    <button @click="testAddApi()">add</button>
    <button @click="testDetailApi()">detail</button>

  </div>
</template>
<script>
export default {
  data () {
    return {

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
      const { data } = await this.$axios.post('/api_nuxt/AddBugItems', params);
      console.log(data);
    },
    async testGetListApi () {
      let params = {
        pageIndex: 1,
        pageSize: 10
      }
      const { data } = await this.$axios.post('/api_nuxt/GetBugList', params);
      console.log(data);
    },
    async testDetailApi () {
      const res = await this.$axios.get(`/api_nuxt/GetBugDetail?bugId=5cf8b075c26c2f18a0cb4fa7`);
      console.log(res);
    }
  },
}
</script>