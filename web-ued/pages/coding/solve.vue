<template>
  <div class="cus-full-screen cus-full-height hidden">
    <my-scrollbar>
      <div slot="container">
        <div class="cus-fixed cus-header">
          <my-header activeLabel="打码"></my-header>
        </div>
        <div class="my-content cus-box-center">
          <el-card>
            <template slot="header">
              <div class="flex space-between">
                <h5 class="font-size--lg">提供解决方案</h5>
                <el-button size="small" @click="$router.back()">返回</el-button>
              </div>
            </template>
            <div class="card-content">
              <el-avatar :size="48" :src="avator" class="align-top"></el-avatar>
              <div class="inline inline_auto">
                <el-input v-model="input" :placeholder="'请一句话描述问题'" maxlength="40"></el-input>
                <div class="cus-flex cus-flex-between my-padding">
                  <!-- 添加标签的功能 -->
                  <el-dropdown trigger="click" :placement="'bottom-start'">
                    <span class="el-dropdown-link pointer">#添加标签</span>
                    <el-dropdown-menu slot="dropdown">
                      <div class="my-menu-content">
                        <ul>
                          <li class="pointer" v-for="item in list" :key="item.id" @click="descList = item.children">{{item.name}}</li>
                        </ul>
                        <div>
                          <my-tag class="my-tag pointer" :class="{'active': checkList.indexOf(item) >= 0}" v-for="item in descList" :key="'desc' + item._id" :text="item.name" @active="checkLabel(item)"></my-tag>
                        </div>
                      </div>
                    </el-dropdown-menu>
                  </el-dropdown>
                  <span class="my-text font-size--md">最多只能输入40个字哦～</span>
                </div>
                <my-editor :height="'374px'" :placeholder="'可以详细描述问题，也可以插入图片和代码块（选填）'" @change="onEditor1Change" ref="myEditor1"></my-editor><br>
                <my-editor :height="'374px'" :placeholder="'请将您的解决方案写在此处，感谢你为其他码农作出的贡献！'" @change="onEditor2Change" ref="myEditor2"></my-editor><br>
                <div class="text-right">
                  <el-checkbox v-model="isAnonymous">匿名只是你穿的保护色～</el-checkbox>&emsp;&emsp;
                  <el-button type="primary" round size="small" @click="submit()">&emsp;发&nbsp;布&emsp;</el-button>
                </div>
              </div>
            </div>
          </el-card>
        </div>
        <my-footer :hasMenu="true"></my-footer>
      </div>
    </my-scrollbar>

    <el-dialog :visible.sync="showDialog" :show-close="false" width="390px" center append-to-body :close-on-click-modal="resultError" :close-on-press-escape="resultError">
        <template slot="title">
          <h5 class="font-size--md text-dark line-height--lg">{{resultMsg}}</h5>
        </template>
      <div class="text-center">
        <p v-show="resultError">{{resultError}}</p>
        <img :src="resultImage" class="my-img">
        <p v-show="!resultError">距离关闭还有（{{timer}}）秒</p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import avatorUrl from '@/assets/img/icon/icon-system-avator.svg';
import successImg from '@/assets/img/image/image-system-submit-success.svg';
import failImg from '@/assets/img/image/image-system-submit-fail.png';
import MyScrollbar from '@/components/scroller/Scrollbar';
import MyHeader from '@/components/header/Header';
import MyFooter from '@/components/footer/Footer';
import MySearch from '@/components/search/Search';
import MyEditor from '@/components/Editor';
import MyTag from '@/components/Tag';
export default {
  components: {
    MyScrollbar,
    MyHeader,
    MyFooter,
    MySearch,
    MyEditor,
    MyTag
  },
  data() {
    return {
      avator: avatorUrl,
      input: '',
      content1: '',
      content2: '',
      className: 'custom-dialog',
      isAnonymous: false,
      list: [],
      descList: [],
      showDialog: false,
      checkList: [],
      resultMsg: '',
      resultImage: '',
      resultError: null,
      timer: 3,
      userInfo: null
    }
  },
  methods: {
    handleClose() {
      this.showDialog = false;
    },
    checkLabel(val) {
      if (this.checkList.indexOf(val) === -1) {
        this.checkList.push(val);
      } else {
        this.checkList = this.checkList.filter((item) => {
          if (item != val) {
            return item;
          }
        })
      }
    },
    onEditor1Change({ editor, html, text }) {
      this.content1 = html;
    },
    onEditor2Change({ editor, html, text }) {
      this.content2 = html;
    },
    async getTags() {
      const res = await this.$axios.get(`${process.env.BASE_URL}/web_api/GetBugTags`);
      if (res.status === 200 && res.data.message === 'success') {
        if (res.data.data && res.data.data.length > 0) {
          this.list = res.data.data;
          this.descList = this.list[0].children;
          // 长度限制
          if (this.list.length > 9) {
            this.list.length = 9;
          }
        }
      } else {
        this.$notify.error({
          title: '错误',
          message: res.data.message
        });
      }
    },
    async submit() {
      // 优先验证用户身份信息
      if (!this.userInfo) {
        this.$notify.error({
          title: '错误',
          message: '您还没有登录，请登录！'
        });
        return;
      }
      if (!this.input) {
        this.$notify.error({
          title: '错误',
          message: '请填写提问标题！'
        });
        return;
      }
      if (!this.content1) {
        this.$notify.error({
          title: '错误',
          message: '请填写提问描述！'
        });
        return;
      }
      if (!this.content2) {
        this.$notify.error({
          title: '错误',
          message: '请填写解决方案！'
        });
        return;
      }
      const params = {
        title: this.input,
        content: this.content1,
        tags: [],
        bugStatus: true,
        bugSolution: this.content2,
        userId: this.userInfo._id,
        anonymous: this.isAnonymous
      };
      params.tags = this.checkList.map(item => item.name);
      const res = await this.$axios.post(`${process.env.BASE_URL}/web_api/AddBugItems`, params);
      if (res.status === 200 && res.data.message === 'success') {
        this.resultMsg = '发布成功!';
        this.resultImage = successImg;
        this.showDialog = true;

        this.timer = 3;
        let jishiqi = setInterval(() => {
          this.timer --;
          if (this.timer == 0) {
            clearInterval(jishiqi);
            this.showDialog = false;
            // 如果发布成功直接跳到列表
            if (!this.resultError) {
              this.$router.replace({
                path: '/coding/list'
              });
            }
          }
        }, 1000);
      } else {
        this.resultError = res.data.message;
        this.resultMsg = '发布失败!';
        this.resultImage = failImg;
        this.showDialog = true;
      }
    }
  },
  mounted() {
    // 获取用户信息
    if (window.localStorage.getItem('user')) {
      this.userInfo = JSON.parse(window.localStorage.getItem('user'));
      this.avator = this.userInfo.avatar ? this.userInfo.avatar : avatorUrl;
    }
    this.getTags();
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/cus.scss';
.flex {
  display: flex;
}

.space-between {
  justify-content: space-between;
}
.cus-header {
  top: 0;
  width: 100%;
  z-index: 11;
  background: white;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 0px 2px;
}
.my-content {
  padding-top: 100px;
  padding-bottom: 60px;
  min-height: 560px;
  min-width: 600px;
  max-width: 1200px;
}
.card-content {
  padding: 20px;
}
.inline_auto {
  width: 902px;
  padding: 0 26px;
}
.el-dropdown-link {
  color: #409EFF;
}
.my-padding {
  padding: 20px 0;
}
.my-menu-content {
  padding: 25px;
  width: 602px;
  ul {
    list-style: none;
    padding-left: 0;
    display: flex;
    flex-wrap: wrap;
    li {
      color: #34485E;
      margin-right: 20px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
  .my-tag {
    margin-right: 20px;
    margin-top: 14px;
    &:last-child {
      margin-right: 0;
    }
    &.active {
      color: white;
      background: #3376FF;
    }
  }
}
.my-text {
  color: #A3B3BF;
}
.my-img {
  width: 200px;
  height: 200px;
}
</style>>
