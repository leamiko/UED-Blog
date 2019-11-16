<template>
  <div>
    <div class="add_row">
      <span>头像管理</span>
      <a-button type="primary" icon="plus" @click="addAvatar()">上传</a-button>
    </div>
    <viewer :images="imageList" style="margin-top: 20px;">
      <div class="flex_center_wrap">
        <div class="imgDiv" v-for="(src, index) in imageList" :key="index">
          <img class="imgStyle" :src="src" />
          <a-icon class="icon" type="close" @click="deleteImage(index)" />
        </div>
      </div>
    </viewer>
    <a-modal
      title="上传头像"
      :visible="visible"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="modelCancel"
    >
      <div class="clearfix">
        <a-upload
          :beforeUpload="beforeUpload"
          :remove="remove"
          :showUploadList="false"
          multiple
        >
          <a-button> <a-icon type="upload" /> 上传图片 </a-button>
        </a-upload>
        <viewer :images="images" style="margin-top: 20px;">
          <div class="flex_center_wrap">
            <div class="imgDiv" v-for="(src, index) in images" :key="index">
              <img class="imgStyle" :src="src" />
              <a-icon class="icon" type="close" @click="remove(index)" />
            </div>
          </div>
        </viewer>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { client } from '../assets/js/aliyun_oss'

export default {
  data () {
    return {
      visible: false,
      confirmLoading: false,
      fileList: [],
      images: [],
      imageList: [],
      fileLists: []
    }
  },
  mounted () {
    this.getAvatarList()
  },
  methods: {
    getAvatarList: async function () {
      this.imageList = []
      let url = this.api.getAvatarList
      const res = await this.$http.get(url)
      if (res.status_code === 200) {
        this.fileLists = res.data
        res.data.forEach(element => {
          this.imageList.push(element.url)
        })
      }
    },
    deleteImage: async function (index) {
      let url = `${this.api.deleteAvatar}?avatarId=${this.fileLists[index]._id}`
      const res = await this.$http.get(url)
      if (res.status_code === 200) {
        this.fileLists.splice(index, 1)
        this.imageList.splice(index, 1)
      }
    },
    addAvatar () {
      this.visible = true
    },
    handleOk: async function (e) {
      console.log(this.fileList)
      this.confirmLoading = true
      let url = this.api.addAvatar
      const res = await this.$http.post(url, this.fileList)
      if (res.status_code === 200) {
        this.visible = false
        this.confirmLoading = false
        this.getAvatarList()
      } else {
        this.confirmLoading = false
      }
    },
    modelCancel (e) {
      this.visible = false
    },
    beforeUpload: async function (file) {
      var timestamp = new Date().getTime()
      await client()
        .put('UED/' + timestamp + file.name, file)
        .then(res => {
          delete res.res
          this.fileList.push(res)
          this.images.push(res.url)
        })
    },
    remove (index) {
      this.fileList.splice(index, 1)
      this.images.splice(index, 1)
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

.flex_center_wrap {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.imgDiv {
  position: relative;
  width: 50px;
  height: 50px;
  border-radius: 5px;
  margin-right: 10px;
}
.imgStyle {
  width: 50px;
  height: 50px;
  border-radius: 5px;
  margin-right: 10px;
}
.icon {
  position: absolute;
  right: -5px;
  top: -5px;
}
</style>
