<template>
    <div class="article">
        <p class="h3">rthrwt</p>
        <p class="article-info h6"> In：<span class="category">theh</span> on：2017-08-22 by：<span class="author">rbrn</span></p>
        <p class="article-content">
            ewgeb
        </p>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        
      }
    },
    mounted() {
      const  blogId = this.$route.query.blogId;
      this.getBlog(blogId);
    },
    methods: {
        getBlog: async function (blogId) {
            let url = this.api.showBlog;
            console.log(blogId);
            const res = await this.$http.get(url, {
                blogId: blogId
            });
            console.log(res);
        }
    }
  }
</script>

<style>
.article {
    padding-right: 200px;
    padding-left: 200px;
    margin-right: auto;
    margin-left: auto;
}

.article .h3 {
    color: #333;
    text-align: center;
    font-size: 24px;
}

.article .article-info {
    text-align: center;
    padding-bottom: 20px;
    color: #999;
}

.article .article-info .category,
.article .article-info .author {
    color: #5747d9;
}

.article .article-content {
    color: #333;
    line-height: 1.8;
}
</style>
