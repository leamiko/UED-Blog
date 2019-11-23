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
       <a-form-item v-if="!blogId" label="作者" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
        <a-select v-decorator="[
          'model.author',
          {rules: [{ required: true, message: '分类不能为空!' }],
                initialValue:model.author}
        ]" placeholder="请选择作者">
          <!-- 需要所有文章分类 -->
          <a-select-option v-for="item in authorList" :key="item._id">{{item.nickName}}</a-select-option>
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
      <a-form-item label="图片上传(大图)" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
       <a-upload listType="picture-card" :fileList="bigList" :beforeUpload="beforeUpload"  :remove="remove" @preview="handlePreview">
          <div v-if="bigList.length < 1">
            <a-icon type="plus" />
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
        <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
          <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
      </a-form-item>
      <a-form-item label="图片上传(小图)" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
       <a-upload listType="picture-card" :fileList="smallList" :beforeUpload="beforeUploadSmall" :remove="removeSmall" @preview="handlePreview">
          <div v-if="smallList.length < 1">
            <a-icon type="plus" />
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
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
      model: {
      },
      blogId: '',
      previewVisible: false,
      previewImage: '',
      bigList: [], // 上传图片大图
      smallList: [], // 上传图片小图
      authorList: []
    }
  },
  mounted () {
    this.blogId = this.$route.query.blogId ? this.$route.query.blogId : ''
    if (this.blogId) {
      this.getArticleInfo()
    } else {
      this.getAuthorList()
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
        this.model.blogType = this.model.blogType.toString()
        this.bigList = [{ uid: '-1',
          name: 'big.png',
          status: 'done',
          url: this.model.bigImgUrl,
          thumbUrl: this.model.bigImgUrl
        }]
        this.smallList = [{
          uid: '-2',
          name: 'small.png',
          status: 'done',
          url: this.model.midImgUrl,
          thumbUrl: this.model.midImgUrl
        }]
      }
    },
    // 获取作者列表
    getAuthorList: async function () {
      const url = await this.api.getUserList
      const res = await this.$http.get(url)
      console.log(res)
      if (res.status_code === 200) {
        this.authorList = res.data
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
      this.uploadFile(0, file)
      return false
    },
    beforeUploadSmall (file) {
      this.uploadFile(1, file)
      return false
    },
    // 上传文件
    uploadFile: async function (type, file) {
      var timestamp = new Date().getTime()
      await client()
        .put('UED/' + timestamp + file.name, file)
        .then(res => {
          delete res.res
          file.url = res.url
          file.imgName = res.name
          file.thumbUrl = res.url
          if (type === 0) {
            this.bigList.push(file)
          } else {
            this.smallList.push(file)
          }
          this.$message.success('upload successfully.')
        }).catch(err => {
          this.$message.error(`${err},upload failed.`)
        })
    },
    remove (file) {
      const newFileList = this.bigList.slice()
      newFileList.splice(0, 1)
      this.bigList = newFileList
      // const index = this.fileList.indexOf(file)
      // const newFileList = this.fileList.slice()
      // newFileList.splice(index, 1)
      // this.fileList = newFileList
    },
    removeSmall (file) {
      const newFileList = this.smallList.slice()
      newFileList.splice(0, 1)
      this.smallList = newFileList
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
      // let bigImgUrl
      // let midImgUrl
      // for (let i = 0; i < this.fileList.length - 1; i++) {
      //   if (this.fileList[i].size > this.fileList[i + 1].size) {
      //     bigImgUrl = this.fileList[i].url
      //     midImgUrl = this.fileList[i + 1].url
      //   } else {
      //     bigImgUrl = this.fileList[i + 1].url
      //     midImgUrl = this.fileList[i].url
      //   }
      // }
      this.form.validateFields(async (err, values) => {
        console.log(values.model.author)
        if (!err) {
          const url = this.api.addEditBlog
          const params = {
            _id: this.blogId ? this.blogId : null,
            title: values.model.title,
            blogType: values.model.blogType,
            info: values.model.info,
            content: this.model.content,
            bigImgUrl: this.bigList[0].url,
            midImgUrl: this.smallList[0].url,
            //   author: !this.blogId ? values.model.author.author : null,
            userId: !this.blogId ? values.model.author : null
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
