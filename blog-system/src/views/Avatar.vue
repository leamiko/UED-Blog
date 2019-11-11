<template>
  <div>
    <div class="add_row">
      <span>文章管理</span>
      <a-button type="primary"
                icon="plus"
                @click="addAvatar()">上传</a-button>
    </div>
    <div class="clearfix">
      <a-upload action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture-card"
                :fileList="fileList"
                @preview="handlePreview"
                @change="handleChange">
        <div v-if="fileList.length < 3">
          <a-icon type="plus" />
          <div class="ant-upload-text">Upload</div>
        </div>
      </a-upload>
      <a-modal :visible="previewVisible"
               :footer="null"
               @cancel="handleCancel">
        <img alt="example"
             style="width: 100%"
             :src="previewImage" />
      </a-modal>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      previewVisible: false,
      previewImage: '',
      fileList: [
        {
          uid: '-1',
          name: 'xxx.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
        }
      ]
    }
  },
  methods: {
    addAvatar () { },
    handleCancel () {
      this.previewVisible = false
    },
    handlePreview (file) {
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    handleChange ({ fileList }) {
      console.log(fileList)
      this.fileList = fileList
    }
  }
}
</script>

<style scoped>
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
