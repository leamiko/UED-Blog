<template>
  <div class="page">
    <a-form :form="form" @submit="handleSubmit">
      <a-form-item label="名称" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
        <a-input v-decorator="[
          'model.title',
          {
            rules: [{ required: true, message: '名称不能为空！' }],
            initialValue:model.title
          }
        ]" placeholder="请输入文章名称" />
      </a-form-item>
      <a-form-item label="分类" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
        <a-select v-decorator="[
          'model.blogType',
          {rules: [{ required: true, message: '分类不能为空!' }],
                initialValue:model.blogType}
        ]" placeholder="请选择文章分类">
          <!-- 需要所有文章分类 -->
          <a-select-option value="1">技术</a-select-option>
          <a-select-option value="2">交互</a-select-option>
          <a-select-option value="3">设计</a-select-option>
          <a-select-option value="4">管理</a-select-option>
          <a-select-option value="5">其他</a-select-option>
        </a-select>
      </a-form-item>
      <!-- <a-form-item label="作者" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
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
      </a-form-item>-->
      <a-form-item label="文章简介" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
        <a-textarea v-decorator="[
          'model.info',
          {rules: [{ required: true, message: '文章简介不能为空！' }],
                initialValue:model.info}
        ]" placeholder="请输入文章简介" :autosize="{ minRows: 1, maxRows: 3 }" />
      </a-form-item>
      <a-form-item label="文章内容" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
        <quill-editor v-model="model.content" ref="myTextEditor" :options="editorOption"></quill-editor>
      </a-form-item>
      <a-form-item label="图片上传" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
       <a-upload listType="picture-card" :fileList="fileList" :beforeUpload="beforeUpload" :multiple="true" :remove="remove" @preview="handlePreview">
          <div v-if="fileList.length < 2">
            <a-icon type="plus" />
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
        <!-- <viewer :images="imgList" style="margin-top: 20px;">
          <div class="flex_center_wrap">
            <div class="imgDiv" v-for="(src, index) in imgList" :key="index">
              <img class="imgStyle" :src="src" />
              <a-icon class="icon" type="close" @click="remove(index)" />
            </div>
          </div>
        </viewer> -->
        <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
          <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
      </a-form-item>
      <!-- 新建按钮 -->
      <a-form-item :wrapper-col="{ span: 12, offset: 7 }">
        <a-button type="primary" html-type="submit" @click="save()">保存</a-button>
        <a-button :style="{ marginLeft: '30px', marginTop: '40px' }" @click="goBack()">返回</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import {
  client
} from '../../assets/js/aliyun_oss'
export default {
  data () {
    return {
      editorOption: {},
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
      model: {},
      blogId: '',
      previewVisible: false,
      previewImage: '',
      fileList: [],
      imgList: []
    }
  },
  mounted () {
    this.blogId = this.$route.query.blogId ? this.$route.query.blogId : ''
    if (this.blogId) {
      this.getArticleInfo()
    }
  },
  methods: {
    // 获取文章信息（编辑用）
    getArticleInfo: async function () {
      const url = this.api.getBlog
      let params = {
        blogId: this.blogId
      }
      const res = await this.$http.get(url, params)
      if (res.status_code === 200) {
        this.model = res.data
        this.fileList = [
          {
            uid: '-1',
            name: 'big.png',
            status: 'done',
            url: this.model.bigImgUrl,
            thumbUrl: this.model.bigImgUrl
          }, {
            uid: '-2',
            name: 'small.png',
            status: 'done',
            url: this.model.midImgUrl,
            thumbUrl: this.model.midImgUrl
          }
        ]
      }
    },
    handleCancel () {
      this.previewVisible = false
    },
    handlePreview (file) {
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    beforeUpload (file) {
      this.uploadFile(file)
      return false
    },

    uploadFile: async function (file) {
      var timestamp = new Date().getTime()
      await client()
        .put('UED/' + timestamp + file.name, file)
        .then(res => {
          delete res.res
          file.url = res.url
          file.imgName = res.name
          file.thumbUrl = res.url
          this.fileList.push(file)
          console.log(this.fileList)
          this.$message.success('upload successfully.')
          this.imgList.push(res.url)
        }).catch(err => {
          this.$message.error(`${err},upload failed.`)
        })
    },
    remove (file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
    },
    // async handleChange ({ file }) {
    //   if (file.status === 'success') {
    //     this.fileList.push(file)
    //     console.log(file)
    //   }
    //   let url = Math.round(new Date().getTime() / 1000) + '.' + file.name.split('.')[1]
    //   await client().put('ued/' + url, file.originFileObj, {
    //   }).then(function (result) {
    //     console.log(result)
    //     alert('上传成功')
    //   }).catch(function (err) {
    //     console.log(err)
    //   })
    // },
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
      let bigImgUrl
      let midImgUrl
      for (let i = 0; i < this.fileList.length - 1; i++) {
        if (this.fileList[i].size > this.fileList[i + 1].size) {
          bigImgUrl = this.fileList[i].url
          midImgUrl = this.fileList[i + 1].url
        } else {
          bigImgUrl = this.fileList[i + 1].url
          midImgUrl = this.fileList[i].url
        }
      }
      this.form.validateFields(async (err, values) => {
        if (!err) {
          const url = this.api.addEditBlog
          const params = {
            _id: this.blogId,
            title: values.model.title,
            blogType: values.model.blogType,
            info: values.model.info,
            content: this.model.content,
            bigImgUrl: bigImgUrl,
            midImgUrl: midImgUrl
          }
          const res = await this.$http.post(url, params)
          if (res.status_code === 200) {
            this.$notification.success({
              placement: 'bottomRight',
              description: '保存成功！'
            })
            this.$router.push({
              name: 'article'
            })
          }
        }
      })
    },
    // 返回
    goBack () {
      this.$router.push({
        name: 'article'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .page {
    padding: 50px;
    background: #ffffff;
  }

  .flex_center_wrap {
    display: flex;

    .imgDiv {
      width: 102px;
      height: 102px;
      display: flex;
      margin-right: 10px;
      img{
        width: 100%;
      }
    }
  }

  .article_addbtn {
    margin-top: 50px;
    text-align: center;
  }
</style>
