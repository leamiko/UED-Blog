<template>
  <div>
    <my-scrollbar hasHead hasFoot :headStyle="{'background':'white'}" :headActive="'打码'">
      <div slot="container" v-loading="loading">
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
              {{detailInfo.title}}
              <div class="detail_presenter">
                <div class="presenter_head flt inline">
                  <img src="@/assets/img/image/code_presenter.png" />
                </div>
                <span class="presenter_info inline">{{detailInfo.author}} · {{detailInfo.createAt | formatDateDay}}</span>
                <div class="mark_tags inline">
                  <span class="mark_tag" v-for="item in detailInfo.tags">{{item}}</span>
                </div>
                <div class="browse inline" v-show="detailInfo.viewNum>0">
                  <div class="browse_icon inline">
                    <img src="@/assets/img/icon/browse.png" />
                  </div>{{detailInfo.viewNum}}
                </div>
              </div>
            </div>
            <div class="detail_content">
              <div class="detail_sign">
                <span class="span_sign inline flt"></span>问题描述
              </div>
              <div class="describe">
                <!-- <div class="word" v-html="detailInfo.content"></div> -->
                <div class="word">{{detailInfo.content}}</div>
              </div>
            </div>
            <div class="detail_content" v-show="detailInfo.bugSolution!==''">
              <div class="detail_sign">
                <span class="span_sign inline flt"></span>解决方案
              </div>
              <div class="describe">
                <!-- <div class="word" v-html="detailInfo.bugSolution"></div> -->
                <div class="word">{{detailInfo.bugSolution}}</div>
              </div>
            </div>
            <div class="praise">
              <div class="praise_img pointer">
                <img src="@/assets/img/icon/praise.png" v-show="detailInfo.likeNum === 0"/>
                <img src="@/assets/img/icon/praise_null.svg" v-show="detailInfo.likeNum !== 0 && 0 < detailInfo.likeNum < 50"/>
                <img src="@/assets/img/icon/praise_50.svg" v-show="detailInfo.likeNum === 50"/>
              </div>
              <div class="praise_num">&nbsp;&nbsp;{{detailInfo.likeNum?detailInfo.likeNum:0}}个赞</div>
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
              <div class="interest_info pointer" v-for="i in interestList" @click="showDetail(i._id)">{{i.title}}</div>
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
                  <el-button
                    type="primary"
                    round
                    size="small"
                    @click="submit()"
                    v-bind:class="{comment_btn_gray: !haveCommentContent}"
                  >&emsp;评&nbsp;论&emsp;</el-button>
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
                <div
                  class="comment_unit_content"
                >写的真的很棒，虽然还远没有做到架构师的级别，但是看到了自己的不足和应该努力的方向但是看到了自己的不足和应该努力的方向。</div>
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
                      <el-button
                        type="primary"
                        round
                        size="small"
                        @click="submit()"
                      >&emsp;评&nbsp;论&emsp;</el-button>
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
  data() {
    return {
      loading: false,
      Id: '', // 当前问题Id
      detailInfo: {}, // 详情信息
      interestList: [], // 感兴趣List
      interestOriginal: [], // 原始bugList
      interestUnfiltered: [], // 未过滤兴趣List
      isAnonymous: false,
      resultMsg: "",
      resultImage: "",
      showDialog: false,
      commentContent: "",
      haveCommentContent: false,
      name: ""
    };
  },
  watch: {
    name(val, oldval) {
      console.log(val); //val 为input中的新值
      // console.log(oldval); //oldval 为input中的旧值
    }
  },
  mounted() {
    this.Id = this.$route.query.bugId ? this.$route.query.bugId : '';
    if (this.Id) {
      this.getInfo();
    }
  },
  methods: {
    // 获取详情信息
    async getInfo() {
      let params = {
        bugId: this.Id
      }
      const url = `${process.env.BASE_URL}/web_api/GetBugDetail?bugId=`+ this.Id;
      const res = await this.$axios.get(url);
      if (res.status === 200) {
        if (res.data.data && res.data.data !== null) {
          this.detailInfo = res.data.data;
          // setTimeout(() => {
          //   this.loading = false;
          // }, 500);
        } else {
          // setTimeout(() => {
          //   this.loading = false;
          // }, 500);
          this.$notify.error({
            title: '错误',
            message: '未查询到相关数据，请联系管理员。'
          });
        }
      } else {
        // setTimeout(() => {
        //   this.loading = false;
        // }, 500);
        this.$notify.error({
          title: '错误',
          message: data.data.message
        });
      }
      const tagList = this.detailInfo.tags;
      this.getInterestInfo(tagList); 
    },
    // 获取感兴趣信息
    async getInterestInfo (tagList) {
      let listParams = {
        pageIndex: 1,
        pageSize: 10,
        filters: { 
          title: "",
        	bugStatus: "",
	        author: "", //作者，置空
        	tags: tagList
        }
      }
      const { data } = await this.$axios.post(`${process.env.BASE_URL}/web_api/GetBugList`, listParams);
      if (data.status_code === 200) {      
        if (tagList === null) {
          // tags为空时查询出的List
          if (data.data.length > 0) {
            this.interestOriginal = data.data;
          }
        } else {
          // tags为当前详情tag时查询出的List
          if (data.data.length > 0) {
            this.interestUnfiltered = data.data;
          }
        }
        // 当前详情tag的List.length < 4 时获取原始List
        if (this.interestUnfiltered.length < 4 && this.interestOriginal.length === 0) {
          this.getInterestInfo(null);
        }
        if (this.interestUnfiltered.length >= 4) {
          // 去除合并的list中含有当前详情的对象
          for (let i = 0; i < this.interestUnfiltered.length; i++) {
            if (this.interestUnfiltered[i]._id !== this.Id) {
              this.interestList.push(this.interestUnfiltered[i]);
            }
          }
          this.interestList = this.interestList.slice(0, 4);
        } else if (this.interestUnfiltered.length < 4 && this.interestOriginal.length > 0) {
          // 合并两个List，当前详情tag的List在前
          for (let o = 0; o < this.interestOriginal.length; o++) {
            this.interestUnfiltered.push(this.interestOriginal[o]);
          }
          // 去除合并的list中含有当前详情的对象
          for (let i = 0; i < this.interestUnfiltered.length; i++) {
            if (this.interestUnfiltered[i]._id !== this.Id) {
              this.interestList.push(this.interestUnfiltered[i]);
            }
          }
          this.interestList = this.interestList.slice(0, 4);
        }
      } else {
        this.$notify.error({
          title: '错误',
          message: data.data.message
        });
      }
    },
    // 查看感兴趣内容
    showDetail (id) {
      this.$router.push({
        path: '/coding/detail',
        query: {
          bugId: id
        }
      })
      this.Id = id;
      this.getInfo();
    },
    // 详情点赞
    praise() {

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
// 详情
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
    width: 75%;
    box-shadow: 0px 1px 5px 0px #ececec;
    border-radius: 2px;
    .detail_title {
      padding: 28px 20px 16px;
      font-size: 24px;
      font-weight: 600;
      color: #000000;
      border-bottom: 1px solid #eff3f7;
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
    }
    .detail_content {
      margin-top: 54px;
      margin-bottom: 40px;
      .detail_sign {
        font-size: 22px;
        font-weight: 600;
        color: #000000;
        .span_sign {
          width: 10px;
          height: 30px;
          margin: 4px 14px 14px 0;
          background: #3376ff;
        }
      }
      .describe {
        padding: 30px 52px;
        .word {
          line-height: 35px;
          font-size: 16px;
          color: #000000;
        }
        .image {
          img {
            width: 100%;
          }
        }
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
      .praise_img:active {
        // transition-duration: 5s;
        transform: rotate(30deg);
        transition-timing-function: ease-in;
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
      }
      .interest_info:first-child {
        border-top: none;
      }
      .interest_info:hover {
        color: #3376ff;
      }
    }
  }
}
// 评论
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
