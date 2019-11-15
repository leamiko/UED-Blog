<template>
  <div>
    <my-scrollbar hasHead hasFoot :headStyle="{'background':'white'}" :headActive="'写字'">
      <div slot="container">
        <div class="detail_container">
          <div class="support">
            <div class="support_icon pointer">
              <img src="@/assets/img/icon/praise_small_icon.svg" />
            </div>
            <div class="support_text">
              <span>点赞</span>
              <span class="separate inline"></span>
              <span>分享</span>
            </div>
            <div class="support_icon pointer">
              <img src="@/assets/img/icon/wechat_icon.svg" />
            </div>
            <div class="support_icon pointer">
              <img src="@/assets/img/icon/wechat_share_icon.svg" />
            </div>
            <div class="support_icon pointer">
              <img src="@/assets/img/icon/weibo_icon.svg" />
            </div>
          </div>
          <div class="detail_info inline bg-white">
            <div class="detail_title">
              {{detailList.title}}
              <div class="detail_presenter">
                <div class="presenter_head flt inline">
                  <img src="@/assets/img/image/code_presenter.png" />
                </div>
                <span class="presenter_info inline">{{detailList.author}} · {{detailList.updateAt | formatDateDay}}</span>
                <div class="mark_tags inline">
                  <span class="mark_tag">{{ detailList.blogType == 1 ? "技术" : detailList.blogType == 2 ? "交互" :detailList.blogType == 3 ? "设计" :detailList.blogType == 4 ? "管理" :"其它" }}</span>
                </div>
                <div class="browse inline">
                  <div class="browse_icon inline">
                    <img src="@/assets/img/icon/browse.png" />
                  </div>{{detailList.viewNum}}
                </div>
              </div>
              <img class="topImg" v-if="detailParams.imgUrl" :src="require('../../assets/img/image/' + detailParams.imgUrl)" alt="">
            </div>
            <div class="detail_content">
              <div class="infoBox">
                {{detailList.info}}
              </div>
              <div class="contentBox" v-html="detailList.content">
                {{detailList.content}}
              </div>
            </div>
            <div class="praise">
              <div class="praise_img pointer">
                <img src="@/assets/img/icon/praise.png" />
              </div>
              <div class="praise_num">136个赞</div>
            </div>
          </div>
          <div class="interest inline frt">
            <div class="interest_title">
              你可能感兴趣
              <router-link class="more frt" :to="'/coding/list'">
                更多
                <i class="el-icon-arrow-right"></i>
              </router-link>
            </div>
            <div class="interest_list">
              <div class="interest_info pointer">
                <div class="pic">
                  <img src="@/assets/img/banner/banner-index-banner-11.jpg" />
                </div>
                <span>浏览器的内核是支持浏览器运行的最核心的 程序，分为渲染引擎和 JS 引擎两部分…</span>
              </div>
              <div class="interest_info pointer">
                <div class="pic">
                  <img src="@/assets/img/banner/banner-index-banner-12.jpg" />
                </div>
                <span>浏览器的内核是支持浏览器运行的最核心的 程序，分为渲染引擎和 JS 引擎两部分…</span>
              </div>
              <div class="interest_info pointer">
                <div class="pic">
                  <img src="@/assets/img/banner/banner-index-banner-15.jpg" />
                </div>
                <span>浏览器的内核是支持浏览器运行的最核心的 程序，分为渲染引擎和 JS 引擎两部分…</span>
              </div>
              <div class="interest_info pointer">
                <div class="pic">
                  <img src="@/assets/img/banner/banner-index-banner-10.jpg" />
                </div>
                <span>浏览器的内核是支持浏览器运行的最核心的 程序，分为渲染引擎和 JS 引擎两部分…</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 评论     -->
        <div class="comment_container">
          <div class="comment_title">共8条评论</div>
          <div class="comment_info bg-white">
            <div class="comment_text">
              <div class="current_user inline">
                <img src="@/assets/img/image/code_presenter.png" />
              </div>
              <div class="current_edit inline">
                <my-editor @change="onEditorChange" :height="'104px'" :placeholder="'我有一个大胆的想法～'"></my-editor>
                <br />
                <div class="text-right">
                  <el-checkbox v-model="isAnonymous">匿名只是你穿的保护色～</el-checkbox>&emsp;&emsp;
                  <el-button type="primary" round size="small" @click="submit()" v-bind:class="{comment_btn_gray: !haveCommentContent}">&emsp;评&nbsp;论&emsp;</el-button>
                </div>
              </div>
              <hr class="comment_hr" />
            </div>
            <div class="comment_text">
              <div class="current_user inline">
                <img src="@/assets/img/image/code_presenter.png" />
              </div>
              <div class="current_edit inline">
                <div class="comment_unit_name">Maria</div>
                <div class="comment_unit_content">写的真的很棒，虽然还远没有做到架构师的级别，但是看到了自己的不足和应该努力的方向但是看到了自己的不足和应该努力的方向。</div>
                <div class="comment_unit_bottom">
                  <div class="comment_unit_bottom_left">
                    <div class="comment_unit_bottom_btn">
                      <img src="@/assets/img/icon/icon-support.svg" />
                      0
                    </div>
                    <div class="comment_unit_bottom_btn margin_left_15">删除</div>
                  </div>
                  <div class="comment_unit_bottom_right">2019-09-06</div>
                </div>
                <div class="comment_text margin_top_40">
                  <div class="current_user inline">
                    <img src="@/assets/img/image/code_presenter.png" />
                  </div>
                  <div class="current_edit inline">
                    <div class="comment_unit_name">
                      Nike
                      <span>回复</span>
                      Maria
                    </div>
                    <div class="comment_unit_content">写的真的很棒，虽然还远没有做到架构师的级别，但是看到了自己的不足和应该努力的方向。</div>
                    <div class="comment_unit_bottom">
                      <div class="comment_unit_bottom_left">
                        <div class="comment_unit_bottom_btn">
                          <img src="@/assets/img/icon/icon-support.svg" />
                          0
                        </div>
                        <div class="comment_unit_bottom_btn margin_left_15">回复</div>
                      </div>
                      <div class="comment_unit_bottom_right">2019-09-06</div>
                    </div>
                  </div>
                </div>
                <div class="comment_text">
                  <div class="current_user inline">
                    <img src="@/assets/img/image/code_presenter.png" />
                  </div>
                  <div class="current_edit inline">
                    <my-editor :height="'104px'" :placeholder="'我有一个大胆的想法～'"></my-editor>
                    <br />
                    <div class="text-right">
                      <el-checkbox v-model="isAnonymous">匿名只是你穿的保护色～</el-checkbox>&emsp;&emsp;
                      <el-button type="primary" round size="small" @click="submit()">&emsp;评&nbsp;论&emsp;</el-button>
                    </div>
                  </div>
                </div>
                <div class="btn_blue">查看更多回复</div>
              </div>
              <hr class="comment_hr" />
            </div>
          </div>
        </div>
      </div>
    </my-scrollbar>
    <el-dialog :visible.sync="showDialog" :show-close="false" width="390px" center>
      <template slot="title">
        <h5 class="font-size--md text-dark line-height--lg">{{resultMsg}}</h5>
      </template>
      <div class="text-center">
        <img :src="resultImage" class="my-img" />
      </div>
    </el-dialog>
  </div>
</template>
<script>
import * as custom from "@/assets/js/custom.config";
import MyScrollbar from "@/components/scroller/Scrollbar";
import MyEditor from "@/components/Editor";
import { async } from "q";
import successImg from "@/assets/img/image/image-system-submit-success.svg";
export default {
  components: {
    MyScrollbar,
    MyEditor
  },
  props: {
    lists: {
      type: Array,
      required: false
    }
  },
  data() {
    return {
      config: custom.search,
      list: custom.search.list[0],
      isAnonymous: false,
      resultMsg: "",
      resultImage: "",
      showDialog: false,
      commentContent: "",
      haveCommentContent: false,
      name: "",
      detailParams: JSON.parse(this.$route.query.detailParams),
      detailList: new Array()
    };
  },
  watch: {
    name(val, oldval) {
      console.log(val); //val 为input中的新值
      // console.log(oldval); //oldval 为input中的旧值
    }
  },
  created() {
    this.getBlog();
    console.log(this.detailParams);
  },
  methods: {
    //获取详情列表
    async getBlog() {
      const res = await this.$axios.get(
        `${process.env.BASE_URL}/web_api/getBlog?blogId=${this.detailParams.detailId}`
      );
      this.detailList = res.data.data;
      // console.log(this.detailList);
      // console.log(this.detailParams);
    },
    // 发布评论
    submit() {
      if (!this.haveCommentContent) return;
      console.log(this.commentContent);
      this.resultMsg = "发布成功!";
      this.resultImage = successImg;
      this.showDialog = true;
    },
    onEditorChange({ editor, html, text }) {
      this.commentContent = text;
      this.haveCommentContent = html ? true : false;
      console.log(this.commentContent, this.haveCommentContent);
    }
  }
};
</script>
<style lang='scss' scoped>
.flt {
  float: left;
}
.frt {
  float: right;
}
.detail_container {
  position: relative;
  width: 62.5%;
  margin: 57px auto 40px;
  .support {
    position: absolute;
    left: -91px;
    top: 78px;
    width: 55px;
    .support_icon {
      width: 55px;
      height: 54px;
      img {
        width: 100%;
      }
    }
    .support_text {
      padding: 12px 11px;
      font-size: 16px;
      color: #b2bac1;
      .separate {
        width: 26px;
        height: 1px;
        margin: 4px 2px;
        background: #dce5ed;
      }
    }
  }
  .detail_info {
    width: 874px;
    box-shadow: 0px 1px 5px 0px #ececec;
    border-radius: 2px;
    .detail_title {
      padding: 28px 20px 16px;
      font-size: 24px;
      font-weight: 600;
      color: #000000;
      border-bottom: 1px solid #eff3f7;
      position: relative;
      .detail_presenter {
        margin-top: 17px;
        font-size: 14px;
        color: #394a58;
        .presenter_head {
          width: 30px;
          height: 30px;
          img {
            width: 100%;
          }
        }
        .presenter_info {
          height: 100%;
          margin-left: 10px;
          padding: 5px 0;
        }
        .mark_tags {
          margin-left: 20px;
          .mark_tag {
            margin-right: 16px;
            color: #9eadba;
          }
        }
        .browse {
          color: #9eadba;
          .browse_icon {
            width: 13px;
            height: 9px;
            img {
              width: 100%;
            }
          }
        }
      }
      .topImg {
        position: absolute;
        top: 28px;
        right: 6px;
      }
    }
    .detail_content {
      margin: 54px auto 40px;
      width: 100%;
      text-align: center;
      .infoBox,
      .contentBox {
        color: #000000;
        font-size: 16px;
        width: 640px;
        text-align: left;
        margin: 0 auto 50px;
      }
    }
    .praise {
      margin: 0 57px;
      padding-top: 37px;
      padding-bottom: 41px;
      border-top: 1px solid #eff3f7;
      .praise_img {
        width: 102px;
        margin-left: calc((100% - 102px) / 2);
        img {
          width: 100%;
        }
      }
      .praise_num {
        margin-left: calc((100% - 102px) / 2);
        padding-left: 13px;
        font-size: 18px;
        color: #394a58;
      }
    }
  }
  .interest {
    width: calc(25% - 26px);
    .interest_title {
      font-size: 18px;
      font-weight: 600;
      color: #000000;
      .more {
        padding-top: 4px;
        font-size: 14px;
        color: #3376ff;
        text-decoration: none;
      }
    }
    .interest_list {
      padding-top: 10px;
      font-size: 16px;
      color: #000000;
      .interest_info {
        margin-bottom: 20px;
        padding: 20px 33px 0 0;
        border-top: 1px solid #eff3f7;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        .pic{
          img{
            width: 300px;
            height: 128px;
          }
        }
        span{
          color: #34485E;
          font-size: 14px;
        }
      }
      .interest_info:first-child {
        border-top: none;
      }
      .interest_info.active {
        color: #3376ff;
      }
    }
  }
}
.comment_container {
  width: 62.5%;
  margin: 0 auto 48px;
  .comment_title {
    margin-bottom: 20px;
    font-size: 22px;
    font-weight: 600;
    color: #000000;
  }
  .comment_info {
    width: 75%;
    padding: 40px 44px;
    box-shadow: 0px 1px 5px 0px #ececec;
    border-radius: 2px;
    .comment_text {
      padding-bottom: 30px;
      .current_user {
        width: 50px;
        margin-right: 10px;
        vertical-align: top;
        img {
          width: 100%;
        }
      }
      .current_edit {
        width: calc(100% - 90px);
      }
    }
  }
}
.margin_left_15 {
  margin-left: 15px;
}
.margin_top_40 {
  margin-top: 40px;
}
.btn_blue {
  cursor: pointer;
  font-size: 16px;
  font-weight: 400;
  color: rgba(0, 132, 255, 1);
}
.comment_hr {
  margin: 30px 0 10px;
  border-top-color: #eff3f7;
  opacity: 0.2;
}
.comment_unit_name {
  margin: 12px 0;
  color: #333333;
  font-size: 1rem;
  font-weight: 600;
  > span {
    font-weight: 500;
    color: rgba(145, 153, 161, 1);
  }
}
.comment_unit_content {
  font-size: 1rem;
  font-weight: 400;
  color: rgba(0, 0, 0, 1);
}
.comment_unit_bottom {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}
.comment_unit_bottom_left {
  display: flex;
  flex-direction: row;
}
.comment_unit_bottom_btn {
  cursor: pointer;
  padding: 7px 25px;
  background: rgba(242, 245, 246, 1);
  border-radius: 20px;
  font-size: 16px;
  font-weight: 400;
  color: rgba(145, 153, 161, 1);
  img {
    vertical-align: -2px;
  }
}
.comment_unit_bottom_right {
  font-size: 16px;
  font-weight: 400;
  color: rgba(145, 153, 161, 1);
  margin-top: 15px;
}
.comment_btn_gray {
  background: #f2f5f6;
  color: #9199a1;
  border: none;
}
</style>
