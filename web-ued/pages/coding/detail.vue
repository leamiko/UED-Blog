<template>
  <div>
    <my-scrollbar hasHead hasFoot :headStyle="{'background':'white'}" :headActive="'打码'">
      <div slot="container" v-loading="loading">
        <div class="detail_container">
          <div class="support" :class="{'support_back':praiseOnly}">
            <div class="support_icon pointer" @click="praise()">
              <!-- <img src="@/assets/img/icon/praise_small_icon.svg" /> -->
              <img src="@/assets/img/icon/praise_small_icon.svg" v-show="praiseNum === 0"/>
              <img src="@/assets/img/icon/praise_null.svg" v-show="praiseNum > 0"/>
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
              {{detailInfo.title}}
              <div class="detail_presenter">
                <div class="presenter_head flt inline">
                  <img src="@/assets/img/image/code_presenter.png" />
                </div>
                <span
                  class="presenter_info inline"
                >{{detailInfo.author}} · {{detailInfo.createAt | formatDateDay}}</span>
                <div class="mark_tags inline">
                  <span
                    class="mark_tag"
                    v-for="(item,index) in detailInfo.tags"
                    :key="index"
                  >{{item}}</span>
                </div>
                <div class="browse inline" v-show="detailInfo.viewNum>0">
                  <div class="browse_icon inline">
                    <img src="@/assets/img/icon/browse.png" />
                  </div>
                  {{detailInfo.viewNum}}
                </div>
              </div>
            </div>
            <div class="detail_content" v-show="detailInfo.content!==null&&detailInfo.content!==''">
              <div class="detail_sign">
                <span class="span_sign inline flt"></span>问题描述
              </div>
              <div class="describe">
                <div class="word" v-html="detailInfo.content"></div>
              </div>
            </div>
            <div class="detail_content" v-show="detailInfo.bugSolution!==null&&detailInfo.bugSolution!==''">
              <div class="detail_sign">
                <span class="span_sign inline flt"></span>解决方案
              </div>
              <div class="describe">
                <div class="word" v-html="detailInfo.bugSolution"></div>
              </div>
            </div>
            <div class="praise" :class="{'praise_num50':praiseNum === 50}">
              <div class="praise_img pointer" id="praise" @click="praise()">
                <img src="@/assets/img/icon/praise.png" v-show="praiseNum === 0"/>
                <img src="@/assets/img/icon/praise_null.svg" v-show="praiseNum > 0 && praiseNum !== 50"/>
                <img src="@/assets/img/icon/praise_50.svg" v-show="praiseNum === 50"/>
              </div>
              <div class="praise_badge" v-show="praiseNum > 0 && praiseNum !== 50">+{{praiseNum}}</div>
              <div class="praise_num">&nbsp;&nbsp;{{praiseNum?praiseNum:0}}个赞</div>
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
              <div
                class="interest_info pointer"
                v-for="i in interestList"
                @click="showDetail(i._id)"
              >{{i.title}}</div>
            </div>
          </div>
        </div>
        <!-- 评论 -->
        <div class="comment_container">
          <div class="comment_title">共{{commentList.length}}条评论</div>
          <div class="comment_info bg-white">
            <!-- 发表一级评论 -->
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
                    @click="submitFistCom()"
                    v-bind:class="{comment_btn_gray: !haveFirstComContent}"
                  >&emsp;评&nbsp;论&emsp;</el-button>
                </div>
              </div>
              <hr class="comment_hr" />
            </div>
            <!-- 整条评论，包括一级二级 -->
            <div
              class="comment_text margin_top_40"
              v-for="(firstItem,firstIndex) in commentList"
              :key="firstIndex"
            >
              <div class="current_user inline">
                <img src="@/assets/img/image/code_presenter.png" />
              </div>
              <div class="current_edit inline">
                <!-- 一级评论 -->
                <div
                  @mouseenter="mouseHoverDelComBtn(firstIndex, firstItem.commenterId, true)"
                  @mouseleave="mouseHoverDelComBtn(firstIndex, firstItem.commenterId, false)"
                >
                  <div class="comment_unit_name">{{firstItem.commenterName}}</div>
                  <div class="comment_unit_content">{{firstItem.content}}</div>
                  <div class="comment_unit_bottom">
                    <div class="comment_unit_bottom_left">
                      <div
                        class="comment_unit_bottom_btn"
                        @mouseenter="mouseHoverSupComBtn(firstIndex,true)"
                        @mouseleave="mouseHoverSupComBtn(firstIndex,false)"
                        @click="commentLike(firstItem._id)"
                        v-bind:class="{comment_unit_bottom_btn_selected: firstItem.firstComIsLike}"
                      >
                        <img
                          v-if="firstItem.firstComIsLike || (firstComIndex === firstIndex && supportComBtnIsHover)"
                          src="@/assets/img/icon/icon-support-hover.svg"
                          alt
                        />
                        <img
                          v-if="!(firstItem.firstComIsLike || (firstComIndex === firstIndex && supportComBtnIsHover))"
                          src="@/assets/img/icon/icon-support.svg"
                          alt
                        />
                        {{firstItem.likeNum}}
                      </div>
                      <div
                        class="comment_unit_bottom_btn margin_left_15"
                        @click="replyFirstComBtn(firstItem._id)"
                        v-bind:class="{comment_unit_bottom_btn_selected: firstItem.isShowReplyFirstCom}"
                      >回复</div>
                      <div
                        class="comment_unit_bottom_btn margin_left_15"
                        v-if="userInfo._id === firstCommenterId && firstComIndex === firstIndex && deleteComBtnIsHover"
                        @click="deleteFirstCom(firstItem._id)"
                      >删除</div>
                    </div>
                    <div class="comment_unit_bottom_right">{{firstItem.createAt | formatDateDay}}</div>
                  </div>
                </div>
                <!-- 发表二级评论(回复一级评论) -->
                <div class="margin_top_40" v-if="firstItem.isShowReplyFirstCom">
                  <div class="current_user inline">
                    <img src="@/assets/img/image/code_presenter.png" />
                  </div>
                  <div class="current_edit inline">
                    <my-editor
                      @change="onEditorChangeSecondCom($event,firstItem)"
                      :height="'104px'"
                      :placeholder="'我有一个大胆的想法～'"
                    ></my-editor>
                    <br />
                    <div class="text-right">
                      <el-checkbox v-model="isAnonymous">匿名只是你穿的保护色～</el-checkbox>&emsp;&emsp;
                      <el-button
                        type="primary"
                        round
                        size="small"
                        @click="submitSecondCom(firstItem)"
                      >&emsp;评&nbsp;论&emsp;</el-button>
                    </div>
                  </div>
                </div>
                <!-- 二级评论 -->
                <!-- <template v-for="(secondItem, secondIndex) in list">
                  <div class="two_commment_div margin_top_40" :key="secondIndex">
                    <div class="current_user inline">
                      <img src="@/assets/img/image/code_presenter.png" />
                    </div>
                    <div class="comment_text inline">
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
                </div>-->
                <!-- 发表二级评论(回复二级评论) -->
                <!-- <div class="margin_top_40" v-if="isShowReply" :key="secondIndex">
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
                </template>-->
                <div class="btn_blue margin_top_30">查看更多回复</div>
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
      Id: "", // 当前问题Id
      detailInfo: {}, // 详情信息
      praiseNum: 0, // 点赞数
      praiseIncrement: 0, // 点赞增量
      interestList: [], // 感兴趣List
      interestOriginal: [], // 原始bugList
      interestUnfiltered: [], // 未过滤兴趣List
      visualScroll: null, // 点赞滚动可视区
      praiseOnly: false, // 左侧点赞icon回归上方
      isAnonymous: false,
      resultMsg: "",
      resultImage: "",
      showDialog: false,
      firstComContent: "", // 一级评论内容
      haveFirstComContent: false, // 监听一级评论内容
      supportComBtnIsHover: false, // 评论点赞按钮是否悬浮
      deleteComBtnIsHover: false, // 评论删除按钮是否悬浮
      userInfo: "", // 用户信息
      commentList: [], // 评论列表
      firstCommenterId: "", // 评论列表中一级评论人id
      firstComIndex: "", // 评论列表中一级评论数组下标
      list: [{ id: 10 }, { id: 11 }],
    };
  },
  mounted() {
    this.Id = this.$route.query.bugId ? this.$route.query.bugId : "";
    if (this.Id) {
      this.getInfo();
      this.getCommentList();
    }
    this.userInfo = JSON.parse(localStorage.getItem("user")); // 获取当前用户信息
    // 可视区内保留一个点赞icon
    this.visualScroll = new IntersectionObserver(([entry]) => {
      if (entry && entry.isIntersecting) {
        // bigPraise已在可视范围内
        this.praiseOnly = true;
      } else {
        this.praiseOnly = false;
      }
    }),
    this.visualScroll.observe(document.querySelector('#praise'))
  },
  destroyed() { 
    this.visualScroll.disconnect() 
  },
  methods: {    
    // 获取详情信息
    async getInfo() {
      let params = {
        bugId: this.Id
      };
      const url =
        `${process.env.BASE_URL}/web_api/GetBugDetail?bugId=` + this.Id;
      const res = await this.$axios.get(url);
      if (res.status === 200) {
        if (res.data.data && res.data.data !== null) {
          this.detailInfo = res.data.data;
          // 获取当前登录人对当前详情的点赞数
          const user = JSON.parse(localStorage.getItem("user"));
          let userParams = {            
            userId: user._id,
            bugId: this.Id,
          }
          const { data } = await this.$axios.post(`${process.env.BASE_URL}/web_api/getThisBugUserLikeNum`, userParams);
          if (data.status_code === 200) {
            if (data.data !== null) {
               this.praiseNum = data.data.count ? data.data.count : 0;
            } else {
              this.praiseNum = 0;
            }           
          } else {
            this.$notify.error({
              title: '错误',
              message: data.message
            });
          }
          // setTimeout(() => {
          //   this.loading = false;
          // }, 500);
        } else {
          // setTimeout(() => {
          //   this.loading = false;
          // }, 500);
          this.$notify.error({
            title: "错误",
            message: "未查询到相关数据，请联系管理员。"
          });
        }
      } else {
        // setTimeout(() => {
        //   this.loading = false;
        // }, 500);
        this.$notify.error({
          title: "错误",
          message: res.data.message
        });
      }
      const tagList = this.detailInfo.tags;
      this.getInterestInfo(tagList);
    },
    // 获取感兴趣信息
    async getInterestInfo(tagList) {
      let listParams = {
        pageIndex: 1,
        pageSize: 10,
        filters: {
          title: "",
          bugStatus: "",
          author: "", //作者，置空
          tags: tagList
        }
      };
      const { data } = await this.$axios.post(
        `${process.env.BASE_URL}/web_api/GetBugList`,
        listParams
      );
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
        if (
          this.interestUnfiltered.length < 4 &&
          this.interestOriginal.length === 0
        ) {
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
        } else if (
          this.interestUnfiltered.length < 4 &&
          this.interestOriginal.length > 0
        ) {
          // 合并两个List，当前详情tag的List在前
          const copyUnfiltered = JSON.stringify(this.interestUnfiltered);
          const deepcopyUnfiltered = JSON.parse(copyUnfiltered);
          for (let o = 0; o < this.interestOriginal.length; o++) {
            const flag = false;
            for (let u = 0; u < deepcopyUnfiltered.length; u++) {
              if (this.interestOriginal[o]._id === deepcopyUnfiltered[u]._id) {
                flag = true;
              }
            }
            if (!flag) {
              this.interestUnfiltered.push(this.interestOriginal[o]);
            }
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
          title: "错误",
          message: data.message
        });
      }
    },
    // 查看感兴趣内容
    showDetail(id) {
      this.$router.push({
        path: "/coding/detail",
        query: {
          bugId: id
        }
      });
      this.Id = id;
      this.getInfo();
    },
    // 详情点赞
    async praise() {
      clearTimeout();
      if (this.praiseNum < 50) {
        this.praiseNum++;
        this.praiseIncrement++;
        setTimeout(()=>this.setPraise(), 3000);
      }
    },
    async setPraise() {
      const user = JSON.parse(localStorage.getItem("user"));
      let praiseParams = {
          bugId: this.Id,
          userId: user._id,
          count: this.praiseIncrement,
        }
        const { data } = await this.$axios.post(`${process.env.BASE_URL}/web_api/LikeBugById`, praiseParams);
        if (data.status_code === 200) {          
          this.praiseIncrement = 0;
        } else {
          this.$notify.error({
            title: '错误',
            message: data.message
          });
        }
    },
    // 发表一级评论
    async submitFistCom() {
      if (!this.haveFirstComContent) return;
      console.log(this.firstComContent);
      const params = {
        commenterName: this.userInfo.nickName,
        commenterId: this.userInfo._id,
        bugId: this.Id,
        content: this.firstComContent
      };
      const res = await this.$axios.post(
        `${process.env.BASE_URL}/web_api/commentBug`,
        params
      );
      if (res.status == 200) {
        // this.resultMsg = "评论成功!";
        // this.resultImage = successImg;
        // this.showDialog = true;
        this.getCommentList();
        this.onEditorChange({});
      }
    },
    // 发表二级级评论(回复一级评论)
    async submitSecondCom(firstItem) {
      // this.commentList.forEach(item => {});
      // if (!this.haveFirstComContent) return;
      const params = {
        commentId: firstItem._id,
        replyerName: this.userInfo.nickName,
        replyerId: this.userInfo._id,
        replyTargetName: firstItem.commenterName,
        replyTargetId: firstItem.commenterId,
        bugId: firstItem.bugId,
        content: "回复2"
      };
      const res = await this.$axios.post(
        `${process.env.BASE_URL}/web_api/replyBug`,
        params
      );
      if (res.status == 200) {
        this.resultMsg = "回复成功!";
        this.resultImage = successImg;
        this.showDialog = true;
      }
    },
    // 监听一级评论框
    onEditorChange({ editor, html, text }) {
      console.log(editor, html, text);
      this.firstComContent = text;
      this.haveFirstComContent = html ? true : false;
    },
    // 监听发表二级评论（回复一级）框
    onEditorChangeSecondCom({ editor, html, text }, firstItem) {
      console.log(text, firstItem);
      // this.commentList.forEach(item => {
      //   if (item._id === firstItem._id) {
      //     item["replyFirstComContent"] = text;
      //   }
      // });
      // this.firstComContent = text;
      // this.haveFirstComContent = html ? true : false;
      // console.log(this.firstComContent, this.haveFirstComContent);
    },
    // 评论点赞
    commentLike(comId) {
      this.commentList.forEach(item => {
        if (item._id === comId && !item.firstComIsLike) {
          const res = this.$axios.get(
            `${process.env.BASE_URL}/web_api/bugCommentLike?bugId=` +
              this.Id +
              `&commentId=` +
              item._id
          );
          item.firstComIsLike = !item.firstComIsLike;
          item.likeNum = item.likeNum + 1;
        }
      });
    },
    // 获取评论
    async getCommentList() {
      const res = await this.$axios.get(
        `${process.env.BASE_URL}/web_api/getBugComment?bugId=` + this.Id
      );
      if (res.data.status_code === 200) {
        this.commentList = res.data.data;
        this.commentList.forEach(item => {
          item[`firstComIsLike`] = false;
          item[`isShowReplyFirstCom`] = false;
        });
        console.log(this.commentList);
      } else {
        this.$notify.error({
          title: "错误",
          message: res.data.message
        });
      }
    },
    // 回复一级评论按钮
    replyFirstComBtn(comId) {
      this.commentList.forEach(item => {
        if (item._id === comId) {
          item.isShowReplyFirstCom = !item.isShowReplyFirstCom;
        }
      });
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
    // 删除一级评论
    async deleteFirstCom(comId) {
      const res = await this.$axios.post(
        `${process.env.BASE_URL}/web_api/deleteBugComment`,
        { commentId: comId }
      );
      if (res.data.status_code === 200) {
        this.resultMsg = "删除成功!";
        this.resultImage = successImg;
        this.showDialog = true;
        this.getCommentList();
      }
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
    position: fixed;
    left: 14%;
    top: 217px;
    width: 55px;
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
    position: absolute;
    left: -91px;
    top: 78px;
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
      position: relative;
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
      .praise_badge {
        position: absolute;
        top: 37px;
        left: calc((100% - 102px) / 2 + 76px);
        display: inline-block;
        color: #fe4043;
        font-size: 20px;
        font-weight: 600;
        // background: linear-gradient(185deg, rgba(255,186,89,1) 0%, rgba(255,24,46,1) 100%);
        // -webkit-background-clip: text;
        // -webkit-text-fill-color: transparent;
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
        padding-top: 20px;
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
      // padding-bottom: 30px;
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
// 页面适配
@media (max-width: 1720px) {
  .detail_container {
    width: 75%;
    .support {
      left: calc(12.5% - 91px);
    }
    .support_back {
      left: 0px;
    }
  }
}
@media (max-width: 1520px) {
  .detail_container {
    width: 78%;
    .support {
      left: calc(11% - 91px);
    }
    .support_back {
      left: 0px;
    }
  }
}
@media (max-width: 1320px) {
  .detail_container {
    width: 83%;
    .support {
      left: calc(8.5% - 75px);
    }
    .support_back {
      left: -75px;
    }
  }
}
@media (max-width: 1020px) {
  .detail_container {
    width: 88%;
    .support {
      left: calc(6% - 58px);
    }
    .support_back {
      left: -58px;
    }
  }
}
</style>
<style lang="scss">
// 非私有样式！，格式化富文本
.describe {
  p, ul, ol, li, pre, blockquote, strong, em, #text {
    font-size: 16px;
    color: #000000;
    font-family: PingFangSC-Regular,PingFang SC;
    word-break: break-all;
    word-wrap: break-word;
    white-space: normal;
  }
  // 图片宽度
  p img, blockquote img {
    width: 100%;
  }
}
</style>
