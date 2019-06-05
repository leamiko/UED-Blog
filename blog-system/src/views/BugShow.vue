<template>
  <div class="show">

    <h2>{{model.title}}</h2>
    <p class="bug-info h6">
      <span class="labels">作者：</span> <span>{{model.author}}</span>
      <span class="labels">关键词：</span>
      <a-tag v-for="(item, index) in model.keyword"
             :key="index"
             :color="colorArr[index]">{{item}}</a-tag>
      <span class="labels">时间：</span> <span>{{model.updateAt | formatDateDay}}</span>
      <!-- <span class="labels">状态：</span> <span>{{model.bugStatus?'已解决':'未解决'}}</span> -->
      <!-- <span class="labels">采用数：</span> <span>{{model.useNum}}</span> -->
    </p>
    <a-row>
      <a-col class="contentWrap"
             :span="20"
             :offset="2">
        <div>
          <h3><span class="content-title">内容</span></h3>
          <div class="codeWrap"
               v-html="model.content"></div>
        </div>
        <div v-if="model.bugSolution">
          <h3><span class="content-title">解决方案</span></h3>
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
      model: {},
      colorArr: ['pink', 'orange', 'blue', 'red', 'green', 'cyan', 'purple']
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
.contentWrap h3 {
  margin-bottom: 30px;
}
.content-title {
  font-weight: 600;
  position: relative;
  margin-bottom: 30px;
}
.content-title:after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -8px;
  width: 100%;
  height: 3px;
  background-color: #1890ff;
}
</style>
