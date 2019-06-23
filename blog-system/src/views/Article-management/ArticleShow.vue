<template>
  <div class="show">
    <h2>{{model.title}}</h2>
    <p class="bug-info h6">
      <span class="labels">作者：</span> <span>{{model.author}}</span>
      <span class="labels">分类：</span><span>{{model.blogType}}</span>
      <span class="labels">时间：</span> <span>{{model.updateAt | formatDateDay}}</span>
      <span class="labels">精选：</span> <span>{{model.isGood?'是':'否'}}</span>
      <span class="labels">采用数：</span> <span>{{model.likeNum}}</span>
    </p>
    <a-row>
      <a-col class="contentWrap"
             :span="20"
             :offset="2">
        <div>
          <h3><span class="content-title">文章简介</span></h3>
          <div class="codeWrap"
               v-html="model.info"></div>
        </div>
        <div>
          <h3><span class="content-title">文章内容</span></h3>
          <div class="codeWrap"
               v-html="model.content"></div>
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
    const blogId = this.$route.query.blogId
    this.getBlog(blogId)
  },
  methods: {
    getBlog: async function (blogId) {
      let url = this.api.getBlog
      const res = await this.$http.get(url, {
        blogId: blogId
      })
      this.model = res.data
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
  margin-top: 30px;
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
