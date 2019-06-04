<template>
  <div class="show">

    <h2>{{model.title}}</h2>
    <p class="bug-info h6">
      <span class="labels">作者：</span> <span>{{model.author}}</span>
      <span class="labels">关键词：</span> <span>{{model.keyword}}</span>
      <span class="labels">时间：</span> <span>{{model.updateAt | formatDateDay}}</span>
      <span class="labels">状态：</span> <span>{{model.bugStatus}}</span>
      <span class="labels">采用数：</span> <span>{{model.useNum}}</span>
    </p>
    <a-row>
      <a-col class="contentWrap"
             :span="20"
             :offset="2">
        <div>
          <h3>bug描述</h3>
          <div class="codeWrap"
               v-html="model.content"></div>
        </div>
        <div v-if="model.bugSolution">
          <h3>bug解决方案</h3>
          <div class="codeWrap"
               v-html="model.bugSolution"></div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      model: {}
    }
  },
  mounted () {
    this.GetBugDetail(this.$route.params.id);
  },
  methods: {
    GetBugDetail: async function (id) {
      const res = await this.$http.get(this.api.getBugDetail, { bugId: id });
      if (res.message === 'success') {
        console.log('object');
        this.model = res.data;
      }
    }
  }
}
</script>

<style scoped>
.show {
  background-color: #fff;
  padding: 50px 30px;
  min-height: 800px;
}
h2,
p {
  text-align: center;
}
.bug-info span {
  margin-right: 18px;
}
span.labels {
  font-weight: 600;
  margin-right: 0;
}
.codeWrap {
  padding-left: 30px;
}
</style>
