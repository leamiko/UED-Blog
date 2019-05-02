<template>
    <div class="article">
        <p class="h3">{{model.title}} &nbsp;<a-icon type="heart" theme="twoTone" class="icon_size" twoToneColor='#eb2f96'/></p>
        <p class="article-info h6"> In：<span class="category">{{model.blogType}}</span> on：{{model.updateAt | formatDateDay}} by：<span class="author">{{model.author}}</span>    &nbsp;&nbsp;<a-icon type="like" theme="twoTone" twoToneColor='#52c41a' class="icon_size"/>12</p>
        <p class="article-content" v-html="model.info">
        </p>
        <div v-html="model.content">
        </div>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        model:[],
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
            this.model = res.data;
        }
    }
  }
</script>

<style>
.icon_size {
    font-size: 20px;
}

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

img {
    max-width: 100%;
}
</style>
