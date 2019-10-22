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
              <h5 class="font-size--lg">提供解决方案</h5>
            </template>
            <div class="card-content">
              <el-avatar :size="48" :src="avator" class="align-top"></el-avatar>
              <div class="inline inline_auto">
                <el-input v-model="input" :placeholder="'请一句话描述问题'"></el-input>
                <div class="cus-flex cus-flex-between my-padding">
                  <el-dropdown trigger="click" :placement="'bottom-start'">
                    <span class="el-dropdown-link pointer">#添加标签</span>
                    <el-dropdown-menu slot="dropdown">
                      <div class="my-menu-content">
                        <ul>
                          <li class="pointer" v-for="item in list" :key="item.id" @click="descList = item.content">{{item.name}}</li>
                        </ul>
                        <div>
                          <my-tag class="my-tag pointer" :class="{'active': checkList.indexOf(item) >= 0}" v-for="item in descList" :key="'desc' + item.id" :text="item.name" @active="checkLabel(item)"></my-tag>
                        </div>
                      </div>
                    </el-dropdown-menu>
                  </el-dropdown>
                  <span class="my-text font-size--md">最多只能输入40个字哦～</span>
                </div>
                <my-editor :height="'374px'" :placeholder="'可以详细描述问题，也可以插入图片和代码块（选填）'"></my-editor><br>
                <my-editor :height="'374px'" :placeholder="'请将您的解决方案写在此处，感谢你为其他码农作出的贡献！'"></my-editor><br>
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

    <el-dialog :visible.sync="showDialog" :show-close="false" width="390px" center>
        <template slot="title">
          <h5 class="font-size--md text-dark line-height--lg">{{resultMsg}}</h5>
        </template>
      <div class="text-center">
        <img :src="resultImage" class="my-img">
      </div>
    </el-dialog>
  </div>
</template>

<script>
import avatorUrl from '@/assets/img/icon/icon-system-avator.svg';
import successImg from '@/assets/img/image/image-system-submit-success.svg';
import failImg from '@/assets/img/image/image-system-submit-fail.png';
import * as custom from '@/assets/js/custom.config';
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
      className: 'custom-dialog',
      isAnonymous: false,
      list: custom.search.list,
      descList: custom.search.list[0].content,
      showDialog: false,
      checkList: [],
      resultMsg: '',
      resultImage: ''
    }
  },
  methods: {
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
    submit() {
      this.resultMsg = '发布成功!';
      this.resultImage = successImg;
      this.showDialog = true;
    }
  },
  mounted() {
    console.log('app init, my quill insrance object is:', this.myQuillEditor);
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/cus.scss';
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
