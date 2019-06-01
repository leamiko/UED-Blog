<template>
  <div class="page">
    <a-form :form="form" @submit="handleSubmit">
      <a-form-item label="名称" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
        <a-input v-decorator="[
          'model.title',
          {rules: [{ required: true, message: '名称不能为空！' }]}
        ]" placeholder="请输入文章名称" />
      </a-form-item>
      <a-form-item label="分类" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
        <a-select v-decorator="[
          'model.blogType',
          {rules: [{ required: true, message: '分类不能为空!' }]}
        ]" placeholder="请选择文章分类">
        <!-- 需要所有文章分类 -->
          <a-select-option value="CSS">
            CSS
          </a-select-option>
          <a-select-option value="VUE">
            VUE
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="作者" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
        <a-input v-decorator="[
          'model.author',
          {rules: [{ required: true, message: '作者不能为空！' }]}
        ]" placeholder="请输入文章作者" />
      </a-form-item>
      <a-form-item label="点赞数" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
        <a-input-number v-decorator="[
          'model.likeNum',
          {rules: [{ required: true, message: '点赞数不能为空！' }]}
        ]" placeholder="请输入文章点赞数" :min="0" :max="10000" :style="{ width: '100%' }" />
      </a-form-item>
      <a-form-item label="是否精选" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
        <a-select v-decorator="[
          'model.isGood',
          {rules: [{ required: true, message: '是否精选不能为空!' }]}
        ]" placeholder="请选择是否精选">
          <a-select-option value="是">
            是
          </a-select-option>
          <a-select-option value="否">
            否
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="审核状态" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
        <a-select v-decorator="[
          'model.isAudit',
          {rules: [{ required: true, message: '审核状态不能为空!' }]}
        ]" placeholder="请选择审核状态">
          <a-select-option value="是">
            是
          </a-select-option>
          <a-select-option value="否">
            否
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="文章简介" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
        <a-textarea v-decorator="[
          'model.info',
          {rules: [{ required: true, message: '文章简介不能为空！' }]}
        ]" placeholder="请输入文章简介" :autosize="{ minRows: 1, maxRows: 3 }" />
      </a-form-item>
      <a-form-item label="文章内容" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
        <a-textarea v-decorator="[
          'model.content',
          {rules: [{ required: true, message: '文章内容不能为空！' }]}
        ]" placeholder="请输入文章内容" :autosize="{ minRows: 3, maxRows: 10 }" />
      </a-form-item>
      <!-- 新建按钮 -->
      <a-form-item :wrapper-col="{ span: 12, offset: 7 }">
        <a-button type="primary" html-type="submit" @click="save()">
          保存
        </a-button>
        <a-button :style="{ marginLeft: '30px', marginTop: '40px' }" @click="cancel()">
          取消
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
      model: {}
    }
  },
  mounted () {
    const blogId = this.$route.query.articleInfo.key
    this.getArticleInfo(blogId)
  },
  methods: {
    // 获取文章信息（编辑用）
    getArticleInfo: async function (blogId) {
      let url = 'http://ued.lunz.cn/api/blogs/getBlog?blogId=' + blogId
      const res = await this.$http.get(url, {
        blogId: blogId
      })
      if (res.data && res.data != null) {
        this.model = res.data
      } else {
        this.$error({
          title: '错误信息',
          content: res.msg || res.message
        })
      }
    },
    // 组件校验
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('校验的值: ', values)
        }
      })
    },
    // 保存
    save () {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$confirm({
            title: '提示信息',
            content: '文章信息编辑完成，是否保存？',
            okText: '确定',
            cancelText: '取消',
            onOk () {
              let url = 'http://ued.lunz.cn/api/blogs/addEditBlog'
              const params = {
                title: this.model.title,
                blogType: this.model.blogType,
                info: this.model.info,
                content: this.model.content
              }
              const res = this.$http.post(url, params)
              if (res.status_code === 200) {
                this.$success({
                  title: '成功信息',
                  content: '保存成功!'
                })
                this.$router.push({
                  name: 'article'
                })
              } else {
                this.$error({
                  title: '错误信息',
                  content: res.message
                })
              }
            },
            onCancel () {
            }
          })
        }
      })
    },
    // 取消
    cancel () {
      this.$router.push({
        name: 'article'
      })
    }
  }
}
</script>

<style>
.page {
  padding: 50px;
  background: #ffffff;
}

.article_addbtn {
  margin-top: 50px;
  text-align: center;
}
</style>
