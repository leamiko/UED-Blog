<template>
  <my-scrollbar hasHead hasFoot :headStyle="{'background':'white'}" :headActive="'写字'">
    <div slot="container">
      <div class="detail_container">
        <div class="support" :class="{'support_back':praiseOnly}">
          <div class="support_icon pointer" @click="praise()">
            <img src="@/assets/img/icon/praise_small_icon.svg" v-show="praiseNum === 0" />
            <img src="@/assets/img/icon/praise_null.svg" v-show="praiseNum > 0" />
          </div>
          <div class="praise_badge_small" v-show="praiseNum > 0">+{{praiseNum}}</div>
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
            {{detailInfo.blog.title}}
            <div class="detail_presenter">
              <div class="presenter_head flt inline">
                <img :src="detailInfo.userInfo.avatar" />
              </div>
              <span class="presenter_info inline">{{detailInfo.userInfo.nickName}} · {{detailInfo.blog.updateAt | formatDateDay}}</span>
              <div class="mark_tags inline">
                <span class="mark_tag">{{ detailInfo.blog.blogType == 1 ? "技术" : detailInfo.blog.blogType == 2 ? "交互" :detailInfo.blog.blogType == 3 ? "设计" :detailInfo.blog.blogType == 4 ? "管理" :"其它" }}</span>
              </div>
              <div class="browse inline">
                <div class="browse_icon inline">
                  <img src="@/assets/img/icon/browse.png" />
                </div>{{detailInfo.blog.viewNum}}
              </div>
            </div>
            <img class="topImg" v-if="detailParams.imgUrl" :src="require('../../assets/img/image/' + detailParams.imgUrl)" alt="">
          </div>
          <div class="detail_content">
            <div class="infoBox">
              {{detailInfo.blog.info}}
            </div>
            <div class="contentBox" v-html="detailInfo.blog.content">
              {{detailInfo.blog.content}}
            </div>
          </div>
          <div class="praise" :class="{'praise_num50':praiseNum === 50}">
            <div class="praise_img pointer" id="praise" @click="praise()">
              <img src="@/assets/img/icon/praise.png" v-show="praiseNum === 0" />
              <img src="@/assets/img/icon/praise_null.svg" v-show="praiseNum > 0 && praiseNum !== 50" />
              <img class="transition" src="@/assets/img/icon/praise_50.svg" v-show="praiseNum === 50" />
            </div>
            <div class="praise_badge" v-show="praiseNum > 0 && praiseNum !== 50">+{{praiseNum}}</div>
            <div class="praise_num">&nbsp;&nbsp;{{praiseNum?praiseNum:0}}个赞</div>
          </div>
        </div>
        <div class="interest inline">
          <div class="interest_title">
            你可能感兴趣
            <router-link class="more frt" :to="'/writing'">
              更多
              <i class="el-icon-arrow-right"></i>
            </router-link>
          </div>
          <div class="interest_list">
            <div class="interest_info pointer" v-for="(item, index) in intrestingList" :key="index">
              <div class="pic" @click="goIntDetail(item._id)">
                <img :src="item.bigImgUrl" />
              </div>
              <span>{{item.info}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="comment_container">
        <div class="comment_title">共{{detailInfo.blog.commentNum}}条评论</div>
        <div class="comment_info bg-white" v-if="isComment">
          <div class="comment_text">
            <div class="current_user inline">
              <img :src="user.avatar" />
            </div>
            <div class="current_edit inline">
              <el-input type="textarea" @input="onEditorChange1" v-model="firstComContent" maxlength="800" :placeholder="'我有一个大胆的想法～'">
              </el-input>
              <div class="text-right margin_top_15">
                <el-checkbox v-model="isAnonymous">匿名只是你穿的保护色～</el-checkbox>&emsp;&emsp;
                <el-button type="primary" round size="small" @click="submitFistCom()" v-bind:class="{comment_btn_gray: !haveFirstComContent}">&emsp;评&nbsp;论&emsp;</el-button>
              </div>
            </div>
            <hr class="comment_hr" />
          </div>
          <div class="comment_text margin_top_40" v-for="(firstItem,firstIndex) in commentList" :key="firstIndex">
            <div class="current_user inline">
              <img :src="firstItem.userInfo[0].avatar" />
            </div>
            <div class="current_edit inline">
              <div @mouseenter="mouseHoverDelComBtn(firstIndex, firstItem.commentUserId, true)" @mouseleave="mouseHoverDelComBtn(firstIndex, firstItem.commentUserId, false)">
                <div class="comment_unit_name" v-if="firstItem.anonymous==false">{{user.nickName}}</div>
                <div class="comment_unit_content">{{firstItem.content}}</div>
                <div class="comment_unit_bottom">
                  <div class="comment_unit_bottom_left">
                    <div class="comment_unit_bottom_btn" @mouseenter="mouseHoverSupComBtn(firstIndex,true)" @mouseleave="mouseHoverSupComBtn(firstIndex,false)" @click="commentLike(firstItem._id)" v-bind:class="{comment_unit_bottom_btn_selected: firstItem.firstComIsLike}">
                      <img v-if="firstItem.firstComIsLike || (firstComIndex === firstIndex && supportComBtnIsHover)" src="@/assets/img/icon/icon-support-hover.svg" alt />
                      <img v-if="!(firstItem.firstComIsLike || (firstComIndex === firstIndex && supportComBtnIsHover))" src="@/assets/img/icon/icon-support.svg" alt />
                      {{firstItem.likeNum}}
                    </div>
                    <div class="comment_unit_bottom_btn margin_left_15" @click="replyFirstComBtn(firstItem)" v-bind:class="{comment_unit_bottom_btn_selected: firstItem.isShowReplyFirstCom}">回复</div>
                    <div class="comment_unit_bottom_btn margin_left_15" v-if="user._id ==firstItem.userInfo[0]._id && (firstComIndex == firstIndex && deleteComBtnIsHover)" @click="deleteFirstCom(firstItem._id)">删除</div>
                  </div>
                  <div class="comment_unit_bottom_right">{{firstItem.createAt | formatDateDay}}</div>
                </div>
              </div>
              <div class="margin_top_40" v-if="firstItem.isShowReplyFirstCom">
                <div class="current_user inline">
                  <img :src="user.avatar" />
                </div>
                <div class="current_edit inline">
                  <el-input type="textarea" @input="onEditorChange2" v-model="secondComContent" maxlength="800" :placeholder="'我有一个大胆的想法～'"></el-input>
                  <div class="text-right margin_top_15">
                    <el-checkbox v-model="isAnonymous">匿名只是你穿的保护色～</el-checkbox>&emsp;&emsp;
                    <el-button type="primary" round size="small" @click="submitSecondCom(firstItem)">&emsp;评&nbsp;论&emsp;</el-button>
                  </div>
                </div>
              </div>
              <!-- 二级评论 -->
              <div v-for="(secondItem, secondIndex) in firstItem.replies" :key="secondIndex">
                <div class="two_commment_div margin_top_40">
                  <div class="current_user inline">
                    <img :src="user.avatar" />
                  </div>
                  <div class="comment_text inline">
                    <div class="comment_unit_name">
                      {{user.nickName}}
                      <span>回复</span>
                      {{firstItem.userInfo[0].nickName}}
                    </div>
                    <div class="comment_unit_content">{{secondItem.content}}</div>
                    <div class="comment_unit_bottom">
                      <div class="comment_unit_bottom_left">
                        <div class="comment_unit_bottom_btn" @click="replyLike(secondItem)" v-bind:class="{comment_unit_bottom_btn_selected: secondItem.secondComIsLike}">
                          <img v-if="secondItem.secondComIsLike " src="@/assets/img/icon/icon-support-hover.svg" alt />
                          <img v-if="!secondItem.secondComIsLike " src="@/assets/img/icon/icon-support.svg" alt />
                          {{secondItem.likeNum}}
                        </div>
                        <div class="comment_unit_bottom_btn margin_left_15" @click="replySecondComBtn(secondItem)" v-bind:class="{comment_unit_bottom_btn_selected: secondItem.isShowReplyRecondCom}">回复</div>
                        <div class="comment_unit_bottom_btn margin_left_15" v-if="user._id == firstItem.userInfo[0]._id" @click="deleteReply(secondItem._id)">删除</div>
                      </div>
                      <div class="comment_unit_bottom_right">{{secondItem.createAt | formatDateDay}}</div>
                    </div>
                  </div>
                </div>
                <!-- 回复二级评论 -->
                <div class="margin_top_40" v-if="secondItem.isShowReplyRecondCom">
                  <div class="current_user inline">
                    <img :src="user.avatar" />
                  </div>
                  <div class="current_edit inline">
                    <el-input type="textarea" @input="onEditorChange2" v-model="secondComContent" maxlength="800" :placeholder="'我有一个大胆的想法～'"></el-input>
                    <div class="text-right margin_top_15">
                      <el-checkbox v-model="isAnonymous">匿名只是你穿的保护色～</el-checkbox>&emsp;&emsp;
                      <el-button type="primary" round size="small" @click="submitReSecondCom(secondItem,firstItem)">&emsp;评&nbsp;论&emsp;</el-button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
            <hr class="comment_hr" />
          </div>
          <div class="noComment2" v-if="commentList.length==0">
            <div class="pic">
              <img src="@/assets/img/image/noComment2.png" />
            </div>
            <div class="text">
              成为第一个评论的人
            </div>
          </div>
        </div>
        <div class="noComment1" v-if="!isComment">
          <div class="pic">
            <img src="@/assets/img/image/noComment.png" />
          </div>
          <div class="text">
            评论区这么热闹，不想来看看嘛？<span @click="modalLogin()">看看就看看</span>
          </div>
        </div>
      </div>
    </div>
  </my-scrollbar>
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
      list: custom.search.list[0],
      isAnonymous: false,
      commentContent: "",
      haveCommentContent: false,
      name: "",
      praiseNum: 0, // 点赞数
      detailParams: JSON.parse(this.$route.query.detailParams),
      detailInfo: {
        blog: {},
        isLike: Boolean,
        userInfo: {}
      }, //明细列表
      isShowReply: false, // 是否展示回复框
      praiseOnly: false, // 左侧点赞icon回归上方
      visualScroll: null, // 点赞滚动可视区
      commentList: [], // 评论列表
      isClick: false, //评论点赞
      supportComBtnIsHover: false, // 评论点赞按钮是否悬浮
      deleteComBtnIsHover: false, // 评论删除按钮是否悬浮
      firstComContent: "", // 一级评论内容
      haveFirstComContent: false, // 监听一级评论内容
      secondComContent: "", // 二级级评论内容
      haveSecondComContent: false, // 监听二级评论内容
      firstCommenterId: "", // 评论列表中一级评论人id
      firstComIndex: "", // 评论列表中一级评论数组下标
      user: "",
      isComment: false,
      intrestingList: [] // 感兴趣列表
    };
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user")); // 获取当前用户信息
    // console.log(this.user, "user");
    if (this.user) {
      this.isComment = true;
      this.getBlogComment();
    }
    this.getBlog();
    // 可视区内保留一个点赞icon
    (this.visualScroll = new IntersectionObserver(([entry]) => {
      if (entry && entry.isIntersecting) {
        // bigPraise已在可视范围内
        this.praiseOnly = true;
      } else {
        this.praiseOnly = false;
      }
    })),
      this.visualScroll.observe(document.querySelector("#praise"));
  },
  destroyed() {
    this.visualScroll.disconnect();
  },
  methods: {
    //跳转感兴趣详情页
    goIntDetail(id) {
      console.log(id);
      this.$router.push({
        path: "/writing" 
      });
    },
    //打开登录框
    modalLogin() {
      this.$store.commit("modalVisible", true);
    },
    //获取感兴趣列表
    async getWriteIntresting() {
      const res = await this.$axios.get(
        `${process.env.BASE_URL}/web_api/getWriteIntresting?blogType=${this.detailInfo.blog.blogType}`
      );
      this.intrestingList = res.data.data;
      console.log(this.intrestingList);
    },
    //获取详情列表
    async getBlog() {
      const res = await this.$axios.get(
        `${process.env.BASE_URL}/web_api/getBlog?blogId=${this.detailParams.detailId}`
      );
      this.detailInfo = res.data.data;
      this.praiseNum = this.detailInfo.blog.likeNum;
      this.getWriteIntresting();
      // console.log(this.detailInfo);
    },
    // 详情点赞
    async praise() {
      if (this.praiseNum < 50) {
        this.praiseNum++;
        this.setPraise();
      }
    },
    async setPraise() {
      let praiseParams = {
        authorId: this.detailInfo.userInfo._id,
        blogId: this.detailParams.detailId,
        userId: this.user._id,
        count: this.praiseNum
      };
      const { data } = await this.$axios.post(
        `${process.env.BASE_URL}/web_api/likeBlog`,
        praiseParams
      );
    },
    //获取评论列表
    async getBlogComment() {
      const res = await this.$axios.get(
        `${process.env.BASE_URL}/web_api/getBlogComment?blogId=${this.detailParams.detailId}`
      );
      this.commentList = res.data.data;
      // console.log(this.commentList, "评论列表");
      this.commentList.forEach(item => {
        item[`firstComIsLike`] = false;
        item[`isShowReplyFirstCom`] = false;
        item.replies.forEach(x => {
          x[`secondComIsLike`] = false;
          x[`isShowReplyRecondCom`] = false;
        });
      });
    },
    // 发表一级评论
    async submitFistCom() {
      if (!this.haveFirstComContent) return;
      const params = {
        commentName: this.user.nickName,
        commentUserId: this.user._id,
        blogId: this.detailParams.detailId,
        content: this.firstComContent,
        anonymous: this.isAnonymous
      };
      const res = await this.$axios.post(
        `${process.env.BASE_URL}/web_api/commentBlog`,
        params
      );
      if (res.data.status_code === 200) {
        this.getBlogComment();
        this.firstComContent = "";
      }
    },
    // 监听一级评论框
    onEditorChange1() {
      if (this.firstComContent) {
        this.haveFirstComContent = true;
      } else {
        this.haveFirstComContent = false;
      }
    },
    // 监听二级评论框
    onEditorChange2() {
      if (this.secondComContent) {
        this.haveSecondComContent = true;
      } else {
        this.haveSecondComContent = false;
      }
    },
    // 评论删除按钮悬浮
    mouseHoverDelComBtn(index, id, isHover) {
      this.deleteComBtnIsHover = isHover;
      this.firstCommenterId = id;
      this.firstComIndex = index;
    },
    // 评论点赞按钮悬浮
    mouseHoverSupComBtn(index, isHover) {
      this.supportComBtnIsHover = isHover;
      this.firstComIndex = index;
    },
    // 评论点赞
    commentLike(comId) {
      const params = {
        blogId: this.detailParams.detailId,
        commentId: comId
      };
      this.commentList.forEach(item => {
        if (item._id === comId && !item.firstComIsLike) {
          const res = this.$axios.post(
            `${process.env.BASE_URL}/web_api/commentLike`,
            params
          );
          item.firstComIsLike = !item.firstComIsLike;
          item.likeNum = item.likeNum + 1;
        }
      });
    },
    // 回复一级评论按钮
    replyFirstComBtn(e) {
      e.isShowReplyFirstCom = !e.isShowReplyFirstCom;
    },
    // 删除一级评论
    async deleteFirstCom(comId) {
      const params = {
        commentId: comId,
        userId: this.user._id,
        blogId: this.detailParams.detailId
      };
      const res = await this.$axios.post(
        `${process.env.BASE_URL}/web_api/deleteComment`,
        params
      );
      if (res.data.status_code === 200) {
        this.getBlogComment();
      }
    },

    //回复一级评论
    async submitSecondCom(firstItem) {
      const params = {
        replyName: this.user.nickName,
        replyId: this.user._id,
        reReplyname: firstItem.userInfo[0].nickName,
        reReplyId: firstItem.userInfo[0]._id,
        blogId: this.detailParams.detailId,
        commentId: firstItem._id,
        content: this.secondComContent,
        anonymous: this.isAnonymous
      };
      const res = await this.$axios.post(
        `${process.env.BASE_URL}/web_api/replyBlog`,
        params
      );
      if (res.data.status_code == 200) {
        this.getBlogComment();
      }
    },
    // 回复二级评论按钮
    replySecondComBtn(e) {
      e.isShowReplyRecondCom = !e.isShowReplyRecondCom;
    },
    //回复二级评论
    async submitReSecondCom(secondItem, firstItem) {
      const params = {
        replyName: this.user.nickName,
        replyId: this.user._id,
        reReplyname: secondItem.userInfo[0].nickName,
        reReplyId: secondItem.userInfo[0]._id,
        blogId: this.detailParams.detailId,
        commentId: firstItem._id,
        content: this.secondComContent,
        anonymous: this.isAnonymous
      };
      const res = await this.$axios.post(
        `${process.env.BASE_URL}/web_api/replyBlog`,
        params
      );
      if (res.data.status_code == 200) {
        this.getBlogComment();
      }
    },
    // 删除二级评论
    async deleteReply(comId) {
      const res = await this.$axios.get(
        `${process.env.BASE_URL}/web_api/deleteReply?replyId=${comId}`
      );
      if (res.data.status_code === 200) {
        this.getBlogComment();
      }
    },
    // 回复点赞
    replyLike(secondItem) {
      const params = {
        replyId: secondItem._id,
        userId: this.user._id
      };
      const res = this.$axios.post(
        `${process.env.BASE_URL}/web_api/replyLike`,
        params
      );
      secondItem.secondComIsLike = !secondItem.secondComIsLike;
      secondItem.likeNum = secondItem.likeNum + 1;
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
.margin_top_15 {
  margin-top: 15px;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
@-webkit-keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
@-moz-keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
@-o-keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
.transition {
  animation-name: fadeIn;
  -webkit-animation-name: fadeIn;
  -moz-animation-name: fadeIn;
  -o-animation-name: fadeIn;
  animation-timing-function: ease-in;
  -webkit-animation-timing-function: ease-in;
  -moz-animation-timing-function: ease-in;
  -o-animation-timing-function: ease-in;
  animation-duration: 0.5s;
  -webkit-animation-duration: 0.5s;
  -moz-animation-duration: 0.5s;
  -o-animation-duration: 0.5s;
}

.detail_container {
  display: flex;
  justify-content: space-between;
  position: relative;
  width: 1291px;
  margin: 57px auto 40px;
  .support {
    z-index: 1000;
    width: 55px;
    position: fixed;
    top: 217px;
    .support_icon {
      width: 55px;
      height: 54px;
      img {
        width: 100%;
      }
    }
    .praise_badge_small {
      position: absolute;
      top: 0px;
      left: 40px;
      display: inline-block;
      color: #fe4043;
      font-size: 16px;
      font-weight: 600;
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
  .support_back {
    // position: absolute;
    // left: -91px;
    // top: 78px;
  }
  .detail_info {
    margin-left: 91px;

    position: relative;
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
      // margin: 54px auto 40px;
      margin: 54px auto 240px;

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
      // position: relative;
      // margin: 0 57px;
      // padding-top: 37px;
      // padding-bottom: 41px;
      // border-top: 1px solid #eff3f7;

      width: 730px;
      position: absolute;
      left: 50%;
      bottom: 40px;
      transform: translate(-50%);
      padding-top: 37px;
      border-top: 1px solid #eff3f7;
      .praise_img {
        width: 102px;
        margin-left: calc((100% - 102px) / 2);
        img {
          width: 100%;
        }
      }
      .praise_badge {
        position: absolute;
        top: 37px;
        left: calc((100% - 102px) / 2 + 76px);
        display: inline-block;
        color: #fe4043;
        font-size: 20px;
        font-weight: 600;
      }
      .praise_num {
        margin-left: calc((100% - 102px) / 2);
        padding-left: 13px;
        font-size: 18px;
        color: #394a58;
      }
    }
    .praise_num50 {
      .praise_img {
        width: 226px;
        margin-left: calc((100% - 226px) / 2);
      }
      .praise_num {
        margin-left: calc((100% - 102px) / 2);
        padding-left: 0px;
      }
    }
  }
  .interest {
    width: calc(25% - 26px);
    margin-left: 26px;
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
        width: 300px;
        margin-bottom: 20px;
        padding: 20px 33px 0 0;
        border-top: 1px solid #eff3f7;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        .pic {
          width: 300px;
          img {
            width: 300px;
            height: 128px;
          }
        }
        span {
          color: #34485e;
          font-size: 14px;
          display: block;
          width: 226px;
          margin: 0 auto;
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
  width: 1291px;
  margin: 0 auto 48px;
  // margin: 0 auto 48px 91px;

  .comment_title {
    margin-left: 91px;

    margin-bottom: 20px;
    font-size: 22px;
    font-weight: 600;
    color: #000000;
  }
  .noComment1 {
    padding: 40px 0 50px;
    background: white;
    width: 874px;
    margin-left: 91px;
    text-align: center;
    box-shadow: 0px 1px 5px 0px #ececec;
    border-radius: 2px;
    box-sizing: border-box;
    .pic {
      img {
        width: 152px;
        height: 158px;
      }
      margin-bottom: 15px;
    }
    .text {
      color: #000000;
      font-size: 14px;
      span {
        cursor: pointer;
        display: inline-block;
        width: 104px;
        text-align: center;
        border: 1px solid #3376ff;
        border-radius: 16px;
        color: #3376ff;
        margin-left: 10px;
        padding: 4px 0;
      }
    }
  }
  .noComment2 {
    background: white;
    width: 100%;
    text-align: center;
    border-radius: 2px;
    box-sizing: border-box;
    .pic {
      img {
        width: 152px;
        height: 158px;
      }
      margin-bottom: 15px;
    }
    .text {
      color: #000000;
      font-size: 14px;
    }
  }
  .comment_info {
    margin-left: 91px;
    width: 874px;
    padding: 40px 44px;
    box-shadow: 0px 1px 5px 0px #ececec;
    border-radius: 2px;
    box-sizing: border-box;
    .comment_text {
      textarea {
        background: #f2f5f6 !important;
      }
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
.margin_top_30 {
  margin-top: 30px;
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
  border: none;

  img {
    vertical-align: -2px;
  }
}
.comment_unit_bottom_btn_selected {
  background: #3376ff;
  color: #ffffff;
}
.comment_unit_bottom_left > :hover {
  background: #3376ff;
  color: #ffffff;
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
// 二级评论样式
.two_commment_div {
  display: flex;
  .comment_text {
    flex: 1;
  }
}
</style>
