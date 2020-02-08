<template>
  <div v-loading="loading">
    <my-scrollbar hasHead hasFoot :headStyle="{'background':'white'}" :headActive="'打码'">
      <div slot="container" v-show="detailShow">
        <div class="detail_container">
          <div class="support" :class="{'support_back':praiseOnly}">
            <div class="support_icon pointer" @click="praise()">
              <!-- <img src="@/assets/img/icon/praise_small_icon.svg" /> -->
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
              {{detailInfo.title}}
              <div class="detail_presenter">
                <div class="presenter_head flt inline">
                  <img
                    v-show="!detailInfo.anonymous && detailInfo.headUrl!==null"
                    :src="detailInfo.headUrl"
                  />
                  <img
                    v-show="detailInfo.anonymous || detailInfo.headUrl===null"
                    src="@/assets/img/image/avarot-default.png"
                  />
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
            <div
              class="detail_content"
              v-show="detailInfo.bugSolution!==null&&detailInfo.bugSolution!==''"
            >
              <div class="detail_sign">
                <span class="span_sign inline flt"></span>解决方案
              </div>
              <div class="describe">
                <div class="word" v-html="detailInfo.bugSolution"></div>
              </div>
            </div>
            <div class="praise" :class="{'praise_num50':praiseNum === 50}">
              <div class="praise_img pointer" id="praise" @click="praise()">
                <img src="@/assets/img/icon/praise.png" v-show="praiseNum === 0" />
                <img
                  src="@/assets/img/icon/praise_null.svg"
                  v-show="praiseNum > 0 && praiseNum !== 50"
                />
                <img src="@/assets/img/icon/praise_50.svg" v-show="praiseNum === 50" />
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
                :key="i._id"
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
                <img
                  src="@/assets/img/image/avarot-default.png"
                  v-if="!userInfo.avatar || isAnonymous"
                />
                <img :src="userInfo.avatar" v-if="userInfo.avatar && !isAnonymous" />
              </div>
              <div class="current_edit inline">
                <my-editor
                  @change="onEditorChange"
                  :height="'104px'"
                  :placeholder="'我有一个大胆的想法～'"
                  ref="myEditor"
                ></my-editor>
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
                <img
                  src="@/assets/img/image/avarot-default.png"
                  v-if="!firstItem.authorInfo.avatar || firstItem.anonymous"
                />
                <img :src="firstItem.authorInfo.avatar" v-if="firstItem.authorInfo.avatar" />
              </div>
              <div class="current_edit inline">
                <!-- 一级评论 -->
                <div class="first_comment_box">
                  <div class="comment_unit_name comment_unit_name_adopt">
                    {{firstItem.anonymous && userInfo._id !=firstItem.commenterId ?'匿名':firstItem.anonymous && userInfo._id ==firstItem.commenterId?userInfo.nickName+'(已匿名)':firstItem.commenterName}}
                    <img
                      src="@/assets/img/image/comment_adopt.png"
                      alt
                      v-if="firstItem.adopt"
                    />
                  </div>
                  <div class="comment_unit_content" v-html="firstItem.content"></div>
                  <div class="comment_unit_bottom">
                    <div class="comment_unit_bottom_left">
                      <!-- 点赞 -->
                      <div
                        class="comment_unit_bottom_btn first_comment_like_btn"
                        @click="firstComLike(firstItem)"
                        v-bind:class="{comment_unit_bottom_btn_selected: firstItem.firstComIsLike}"
                      >
                        <img
                          v-if="firstItem.firstComIsLike"
                          src="@/assets/img/icon/icon-support-hover.svg"
                          alt
                        />
                        <img
                          v-if="!firstItem.firstComIsLike"
                          src="@/assets/img/icon/icon-support-hover.svg"
                          alt
                          class="first_comment_like_img_hover"
                        />
                        <img
                          v-if="!firstItem.firstComIsLike"
                          src="@/assets/img/icon/icon-support.svg"
                          alt
                          class="first_comment_like_img"
                        />
                        {{firstItem.likeNum}}
                      </div>
                      <!-- 回复 -->
                      <div
                        class="comment_unit_bottom_btn margin_left_15"
                        @click="replyFirstComBtn(firstItem)"
                        v-bind:class="{comment_unit_bottom_btn_selected: firstItem.isShowReplyFirstCom}"
                      >回复</div>
                      <!-- 删除 -->
                      <div
                        class="comment_unit_bottom_btn margin_left_15 first_comment_delete_btn"
                        v-if="userInfo._id === firstItem.commenterId"
                        @click="deleteFirstCom(firstItem._id)"
                      >删除</div>
                      <!-- 删除 -->
                      <div
                        class="comment_unit_bottom_btn margin_left_15 first_comment_delete_btn"
                        v-if="!detailInfo.bugStatus && userInfo._id === detailInfo.userId && !firstItem.adopt && !haveComAdopt"
                        @click="adoptCom(firstItem._id)"
                      >采纳</div>
                      <div
                        class="comment_unit_bottom_btn margin_left_15 first_comment_delete_btn"
                        v-if="userInfo._id === detailInfo.userId  && firstItem.adopt"
                        @click="adoptCom(firstItem._id)"
                      >取消采纳</div>
                    </div>
                    <div class="comment_unit_bottom_right">{{firstItem.createAt | formatDateDay}}</div>
                  </div>
                </div>
                <!-- 发表二级评论(回复一级评论) -->
                <div class="margin_top_40" v-if="firstItem.isShowReplyFirstCom">
                  <div class="current_user inline">
                    <img
                      src="@/assets/img/image/avarot-default.png"
                      v-if="!userInfo.avatar || firstItem.isAnonymous"
                    />
                    <img :src="userInfo.avatar" v-if="userInfo.avatar && !firstItem.isAnonymous" />
                  </div>
                  <div class="current_edit inline">
                    <my-editor
                      @change="onEditorChangeReplyFirstCom($event,firstItem)"
                      :height="'104px'"
                      :placeholder="'我有一个大胆的想法～'"
                    ></my-editor>
                    <br />
                    <div class="text-right">
                      <el-checkbox v-model="firstItem.isAnonymous">匿名只是你穿的保护色～</el-checkbox>&emsp;&emsp;
                      <el-button
                        type="primary"
                        round
                        size="small"
                        @click="submitSecondCom(firstItem,1)"
                        v-bind:class="{comment_btn_gray: !firstItem.haveComContent}"
                      >&emsp;评&nbsp;论&emsp;</el-button>
                    </div>
                  </div>
                </div>
                <!-- 二级评论 -->
                <template v-for="(secondItem, secondIndex) in firstItem.replies">
                  <!-- 二级评论,默认展示第一条 -->
                  <div
                    v-if="secondIndex == 0 && !firstItem.isShowMoreReplies"
                    class="two_commment_div margin_top_40"
                    :key="secondIndex"
                  >
                    <div class="current_user inline">
                      <img
                        src="@/assets/img/image/avarot-default.png"
                        v-if="!secondItem.authorInfo.avatar || secondItem.anonymous"
                      />
                      <img
                        :src="secondItem.authorInfo.avatar"
                        v-if="!(!secondItem.authorInfo.avatar || secondItem.anonymous)"
                      />
                    </div>
                    <div class="comment_text inline">
                      <div class="comment_unit_name">
                        {{secondItem.anonymous && userInfo._id !=secondItem.replyerId ?'匿名':secondItem.anonymous && userInfo._id ==secondItem.replyerId?userInfo.nickName+'(已匿名)':secondItem.replyerName}}
                        <span>回复</span>
                        <!-- &&secondItem.replyTargetName=='' -->
                        {{secondItem.targetAnonymous&& userInfo._id !=secondItem.replyTargetId ?'匿名':secondItem.targetAnonymous && userInfo._id ==secondItem.replyTargetId?userInfo.nickName+'(已匿名)':secondItem.replyTargetName}}
                      </div>
                      <div class="comment_unit_content" v-html="secondItem.content"></div>
                      <div class="comment_unit_bottom">
                        <div class="comment_unit_bottom_left">
                          <div
                            class="comment_unit_bottom_btn second_comment_like_btn"
                            @click="secondComLike(secondItem)"
                            v-bind:class="{comment_unit_bottom_btn_selected: secondItem.secondComIsLike}"
                          >
                            <img
                              v-if="secondItem.secondComIsLike"
                              src="@/assets/img/icon/icon-support-hover.svg"
                              alt
                            />
                            <img
                              v-if="!secondItem.secondComIsLike"
                              src="@/assets/img/icon/icon-support-hover.svg"
                              alt
                              class="second_comment_like_img_hover"
                            />
                            <img
                              v-if="!secondItem.secondComIsLike"
                              src="@/assets/img/icon/icon-support.svg"
                              alt
                              class="second_comment_like_img"
                            />
                            {{secondItem.likeNum}}
                          </div>
                          <div
                            class="comment_unit_bottom_btn margin_left_15"
                            @click="replySecondComBtn(secondItem)"
                            v-bind:class="{comment_unit_bottom_btn_selected: secondItem.isShowReplySecondCom}"
                          >回复</div>
                          <!-- 删除 -->
                          <div
                            class="comment_unit_bottom_btn margin_left_15 second_comment_delete_btn"
                            v-if="userInfo._id === secondItem.replyerId"
                            @click="deleteSecondCom(secondItem._id)"
                          >删除</div>
                        </div>
                        <div
                          class="comment_unit_bottom_right"
                        >{{secondItem.createAt | formatDateDay}}</div>
                      </div>
                    </div>
                  </div>
                  <!-- 更多二级评论 -->
                  <div
                    v-if="firstItem.isShowMoreReplies"
                    class="two_commment_div margin_top_40"
                    :key="secondIndex"
                  >
                    <div class="current_user inline">
                      <img
                        src="@/assets/img/image/avarot-default.png"
                        v-if="!secondItem.authorInfo.avatar || secondItem.anonymous"
                      />
                      <img
                        :src="secondItem.authorInfo.avatar"
                        v-if="!(!secondItem.authorInfo.avatar || secondItem.anonymous)"
                      />
                    </div>
                    <div class="comment_text inline">
                      <div class="comment_unit_name">
                        <!-- {{secondItem.anonymous?'匿名':secondItem.replyerName}}
                        <span>回复</span>
                        {{secondItem.targetAnonymous&&secondItem.replyTargetName==''?'匿名':secondItem.replyTargetName}}-->
                        {{secondItem.anonymous && userInfo._id !=secondItem.replyerId ?'匿名':secondItem.anonymous && userInfo._id ==secondItem.replyerId?userInfo.nickName+'(已匿名)':secondItem.replyerName}}
                        <span>回复</span>
                        <!-- &&secondItem.replyTargetName=='' -->
                        {{secondItem.targetAnonymous&& userInfo._id !=secondItem.replyTargetId ?'匿名':secondItem.targetAnonymous && userInfo._id ==secondItem.replyTargetId?userInfo.nickName+'(已匿名)':secondItem.replyTargetName}}
                      </div>
                      <div class="comment_unit_content" v-html="secondItem.content"></div>
                      <div class="comment_unit_bottom">
                        <div class="comment_unit_bottom_left">
                          <div
                            class="comment_unit_bottom_btn second_comment_like_btn"
                            @click="secondComLike(secondItem)"
                            v-bind:class="{comment_unit_bottom_btn_selected: secondItem.secondComIsLike}"
                          >
                            <img
                              v-if="secondItem.secondComIsLike"
                              src="@/assets/img/icon/icon-support-hover.svg"
                              alt
                            />
                            <img
                              v-if="!secondItem.secondComIsLike"
                              src="@/assets/img/icon/icon-support-hover.svg"
                              alt
                              class="second_comment_like_img_hover"
                            />
                            <img
                              v-if="!secondItem.secondComIsLike"
                              src="@/assets/img/icon/icon-support.svg"
                              alt
                              class="second_comment_like_img"
                            />
                            {{secondItem.likeNum}}
                          </div>
                          <div
                            class="comment_unit_bottom_btn margin_left_15"
                            @click="replySecondComBtn(secondItem)"
                            v-bind:class="{comment_unit_bottom_btn_selected: secondItem.isShowReplySecondCom}"
                          >回复</div>
                          <div
                            class="comment_unit_bottom_btn margin_left_15 second_comment_delete_btn"
                            v-if="userInfo._id === secondItem.replyerId"
                            @click="deleteSecondCom(secondItem._id)"
                          >删除</div>
                        </div>
                        <div
                          class="comment_unit_bottom_right"
                        >{{secondItem.createAt | formatDateDay}}</div>
                      </div>
                    </div>
                  </div>
                  <!-- 发表二级评论(回复二级评论) -->
                  <div
                    class="margin_top_40"
                    v-if="secondItem.isShowReplySecondCom"
                    :key="secondItem._id"
                  >
                    <div class="current_user inline">
                      <img
                        src="@/assets/img/image/avarot-default.png"
                        v-if="!userInfo.avatar || secondItem.isAnonymous"
                      />
                      <img :src="userInfo.avatar" v-if="userInfo.avatar && !secondItem.isAnonymous" />
                    </div>
                    <div class="current_edit inline">
                      <my-editor
                        @change="onEditorChangeReplySecondCom($event,secondItem)"
                        :height="'104px'"
                        :placeholder="'我有一个大胆的想法～'"
                      ></my-editor>
                      <br />
                      <div class="text-right">
                        <el-checkbox v-model="secondItem.isAnonymous">匿名只是你穿的保护色～</el-checkbox>&emsp;&emsp;
                        <el-button
                          type="primary"
                          round
                          size="small"
                          @click="submitSecondCom(secondItem,2)"
                          v-bind:class="{comment_btn_gray: !secondItem.haveComContent}"
                        >&emsp;评&nbsp;论&emsp;</el-button>
                      </div>
                    </div>
                  </div>
                </template>
                <!-- 查看更多回复 -->
                <div
                  class="btn_blue margin_top_30"
                  @click="showMoreReplies(firstItem)"
                  v-if="firstItem.replies.length>1"
                >{{firstItem.showMoreRepliesName}}</div>
              </div>
              <hr class="comment_hr" />
            </div>
          </div>
        </div>
      </div>
    </my-scrollbar>
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
      loading: true,
      detailShow: false,
      Id: "", // 当前问题Id
      detailInfo: {}, // 详情信息
      praiseNum: 0, // 点赞数
      praiseIncrement: 0, // 点赞增量
      interestList: [], // 感兴趣List
      interestOriginal: [], // 原始bugList
      interestUnfiltered: [], // 未过滤兴趣List
      visualScroll: null, // 点赞滚动可视区
      praiseOnly: false, // 左侧点赞icon回归上方
      isAnonymous: false, // 一级评论框是否匿名
      firstComContent: "", // 一级评论内容
      haveFirstComContent: false, // 监听一级评论内容
      userInfo: "", // 用户信息
      commentList: [], // 评论列表
      haveComAdopt: false // 是否有评论被采纳
    };
  },
  mounted() {
    this.Id = this.$route.query.bugId ? this.$route.query.bugId : "";
    if (this.Id) {
      this.getInfo();
      this.getCommentList();
    }
    this.userInfo = JSON.parse(localStorage.getItem("user")); // 获取当前用户信息
    console.log(this.userInfo, "dld");
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
  beforeDestroy() {},
  destroyed() {
    this.visualScroll.disconnect();
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
          if (
            res.data.data.authorInfo &&
            res.data.data.authorInfo.avatar !== "" &&
            res.data.data.authorInfo.avatar !== null
          ) {
            this.detailInfo.headUrl = res.data.data.authorInfo.avatar; //头像url
          } else {
            this.detailInfo.headUrl = null;
          }
          if (
            res.data.data.authorInfo &&
            res.data.data.authorInfo.nickName !== "" &&
            res.data.data.authorInfo.nickName !== null
          ) {
            this.detailInfo.author = res.data.data.authorInfo.nickName; //作者昵称
          } else {
            this.detailInfo.author = null;
          }
          // 获取当前登录人对当前详情的点赞数
          const user = JSON.parse(localStorage.getItem("user"));
          let userParams = {
            userId: user._id,
            bugId: this.Id
          };
          const { data } = await this.$axios.post(
            `${process.env.BASE_URL}/web_api/getThisBugUserLikeNum`,
            userParams
          );
          if (data.status_code === 200) {
            if (data.data !== null) {
              this.praiseNum = data.data.count ? data.data.count : 0;
            } else {
              this.praiseNum = 0;
            }
          } else {
            this.$notify.error({
              title: "错误",
              message: data.message
            });
          }
          const tagList = this.detailInfo.tags;
          this.getInterestInfo(tagList);
          setTimeout(() => {
            this.loading = false;
            this.detailShow = true;
          }, 500);
        } else {
          setTimeout(() => {
            this.loading = false;
            this.detailShow = true;
          }, 500);
          this.$notify.error({
            title: "错误",
            message: "未查询到相关数据，请联系管理员。"
          });
        }
      } else {
        setTimeout(() => {
          this.loading = false;
          this.detailShow = true;
        }, 500);
        this.$notify.error({
          title: "错误",
          message: res.data.message
        });
      }
    },
    // 获取感兴趣信息
    async getInterestInfo(tagList) {
      this.interestOriginal = [];
      this.interestUnfiltered = [];
      this.interestList = [];
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
      this.loading = true;
      this.detailShow = false;
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
        setTimeout(() => this.setPraise(), 3000);
      }
    },
    async setPraise() {
      const user = JSON.parse(localStorage.getItem("user"));
      let praiseParams = {
        bugId: this.Id,
        userId: user._id,
        count: this.praiseIncrement
      };
      const { data } = await this.$axios.post(
        `${process.env.BASE_URL}/web_api/LikeBugById`,
        praiseParams
      );
      if (data.status_code === 200) {
        this.praiseIncrement = 0;
      } else {
        this.$notify.error({
          title: "错误",
          message: data.message
        });
      }
    },
    // 发表一级评论
    async submitFistCom() {
      if (!this.haveFirstComContent) return;
      console.log(this.firstComContent);
      const params = {
        commenterId: this.userInfo._id,
        bugId: this.Id,
        content: this.firstComContent,
        anonymous: this.isAnonymous
      };
      const res = await this.$axios.post(
        `${process.env.BASE_URL}/web_api/commentBug`,
        params
      );
      if (res.status == 200) {
        this.getCommentList();
        this.clearFirstComEditor();
      }
    },
    // 发表二级评论
    async submitSecondCom(item, replyType) {
      // replyType 1 回复一级评论 2 回复二级评论
      if (!item.haveComContent) return;
      const params = {
        commentId: replyType === 1 ? item._id : item.commentId,
        replyerId: this.userInfo._id,
        replyTargetId: replyType === 1 ? item.commenterId : item.replyerId,
        bugId: item.bugId,
        content: item.replyComContent,
        anonymous: item.isAnonymous ? item.isAnonymous : "false",
        targetAnonymous: item.anonymous
      };
      const res = await this.$axios.post(
        `${process.env.BASE_URL}/web_api/replyBug`,
        params
      );
      if (res.status == 200) {
        this.getCommentList();
      }
    },
    // 监听一级评论框
    onEditorChange({ editor, html, text }) {
      this.firstComContent = html;
      this.haveFirstComContent = html ? true : false;
    },
    // 清空一级评论框
    clearFirstComEditor() {
      this.$refs.myEditor.clear();
    },
    // 监听二级评论（回复一级）框
    onEditorChangeReplyFirstCom({ editor, html, text }, firstItem) {
      this.$forceUpdate();
      this.commentList.forEach(item => {
        if (item._id === firstItem._id) {
          item["replyComContent"] = html;
          item["haveComContent"] = html ? true : false;
        }
      });
    },
    // 监听二级评论（回复二级）框
    onEditorChangeReplySecondCom({ editor, html, text }, secondItem) {
      this.$forceUpdate();
      this.commentList.forEach(item => {
        item.replies.forEach(ele => {
          if (ele._id === secondItem._id) {
            ele["replyComContent"] = html;
            ele["haveComContent"] = html ? true : false;
          }
        });
      });
    },
    // 一级评论点赞&取消点赞
    firstComLike(firstItem) {
      const bugCommentLikeApi = firstItem.firstComIsLike
        ? "cancelBugCommentLike"
        : "bugCommentLike";
      this.commentList.forEach(item => {
        if (item._id === firstItem._id) {
          const res = this.$axios.get(
            `${process.env.BASE_URL}/web_api/` +
              bugCommentLikeApi +
              `?bugId=` +
              this.Id +
              `&commentId=` +
              item._id +
              `&userId=` +
              this.userInfo._id
          );
          firstItem.firstComIsLike ? item.likeNum-- : item.likeNum++;
          item.firstComIsLike = !item.firstComIsLike;
        }
      });
    },
    // 二级评论点赞&取消点赞
    secondComLike(secondItem) {
      const bugReplyLikeApi = secondItem.secondComIsLike
        ? "cancelBugReplyLike"
        : "bugReplyLike";
      this.commentList.forEach(comItem => {
        comItem.replies.forEach(repItem => {
          if (repItem._id === secondItem._id) {
            const res = this.$axios.get(
              `${process.env.BASE_URL}/web_api/` +
                bugReplyLikeApi +
                `?bugId=` +
                this.Id +
                `&replyId=` +
                repItem._id +
                `&userId=` +
                this.userInfo._id
            );
            secondItem.secondComIsLike ? repItem.likeNum-- : repItem.likeNum++;
            repItem.secondComIsLike = !repItem.secondComIsLike;
          }
        });
      });
    },
    // 一级评论回复按钮
    replyFirstComBtn(firstItem) {
      this.$forceUpdate();
      this.commentList.forEach(item => {
        if (item._id === firstItem._id) {
          firstItem.isShowReplyFirstCom = !firstItem.isShowReplyFirstCom;
        }
      });
      console.log(firstItem.isShowReplyFirstCom);
    },
    // 二级评论回复按钮
    replySecondComBtn(secondItem) {
      this.$forceUpdate();
      this.commentList.forEach(item => {
        item.replies.forEach(ele => {
          if (ele._id === secondItem._id) {
            secondItem.isShowReplySecondCom = !secondItem.isShowReplySecondCom;
          }
        });
      });
    },
    // 删除一级评论
    async deleteFirstCom(comId) {
      const params = {
        commentId: comId,
        bugId: this.Id,
        userId: this.userInfo._id
      };
      const res = await this.$axios.post(
        `${process.env.BASE_URL}/web_api/deleteBugComment`,
        params
      );
      if (res.data.status_code === 200) {
        this.getCommentList();
      }
    },
    // 删除二级评论
    async deleteSecondCom(comId) {
      const params = {
        replyId: comId
      };
      const res = await this.$axios.post(
        `${process.env.BASE_URL}/web_api/deleteReply`,
        params
      );
      if (res.data.status_code === 200) {
        this.getCommentList();
      }
    },
    // 采纳&取消采纳评论
    async adoptCom(comId) {
      const params = {
        userId: this.userInfo._id,
        bugId: this.Id,
        commentId: comId
      };
      const res = await this.$axios.post(
        `${process.env.BASE_URL}/web_api/adoptComment`,
        params
      );
      if (res.data.status_code === 200) {
        this.getCommentList();
      }
    },
    // 查看更多回复
    showMoreReplies(firstItem) {
      this.$forceUpdate();
      firstItem.isShowMoreReplies = !firstItem.isShowMoreReplies;
      firstItem.showMoreRepliesName = firstItem.isShowMoreReplies
        ? "收起更多回复"
        : "查看更多回复";
      if (!firstItem.isShowMoreReplies) {
        this.commentList.forEach(item => {
          item.replies.forEach(ele => {
            ele.isShowReplySecondCom = false;
          });
        });
      }
    },
    // 获取评论
    async getCommentList() {
      const res = await this.$axios.get(
        `${process.env.BASE_URL}/web_api/getBugComment?bugId=` + this.Id
      );
      if (res.data.status_code === 200) {
        this.commentList = res.data.data;
        // 循环一级评论
        this.commentList.forEach(firstItem => {
          firstItem[`isShowReplyFirstCom`] = false; // 是否展示发表二级评论(回复一级)框
          firstItem[`isShowMoreReplies`] = false; // 展示更多回复
          firstItem[`showMoreRepliesName`] = "查看更多回复"; // 展示更多回复按钮文本
          // 判断当前用户是否对一级评论点赞
          firstItem.likerList.forEach(ele => {
            if (this.userInfo._id === ele.userId) {
              firstItem.firstComIsLike = true;
            }
          });
          // 循环二级评论
          firstItem.replies.forEach(secondItem => {
            secondItem[`isShowReplySecondCom`] = false; // 是否展示发表二级评论(回复二级)框
            // 判断当前用户是否对二级评论点赞
            secondItem.likerList.forEach(ele => {
              if (this.userInfo._id === ele.userId) {
                secondItem.secondComIsLike = true;
              }
            });
          });
        });
        for (var value of this.commentList) {
          console.log(value);
          if (value.adopt) {
            this.haveComAdopt = true;
            return;
          } else {
            this.haveComAdopt = false;
          }
        }
      } else {
        this.$notify.error({
          title: "错误",
          message: res.data.message
        });
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
.comment_unit_name_adopt {
  display: flex;
  justify-content: space-between;
  img {
    position: relative;
    top: -17px;
    left: 35px;
  }
}
.comment_unit_content {
  font-size: 1rem;
  font-weight: 400;
  color: rgba(0, 0, 0, 1);
  word-break: break-word;
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
  .second_comment_delete_btn {
    display: none;
  }
}
// 二级评论悬浮显示删除
.two_commment_div:hover {
  .second_comment_delete_btn {
    display: block;
  }
}
// 一级评论悬浮显示删除
.first_comment_box {
  .first_comment_delete_btn {
    display: none;
  }
}
.first_comment_box:hover {
  .first_comment_delete_btn {
    display: block;
  }
}
// 一级评论点赞悬浮切换图片
.first_comment_like_btn {
  .first_comment_like_img_hover {
    display: none;
  }
  .first_comment_like_img {
    display: inline-block;
  }
}
.first_comment_like_btn:hover {
  .first_comment_like_img_hover {
    display: inline-block;
  }
  .first_comment_like_img {
    display: none;
  }
}
// 二级评论点赞悬浮切换图片
.second_comment_like_btn {
  .second_comment_like_img_hover {
    display: none;
  }
  .second_comment_like_img {
    display: inline-block;
  }
}
.second_comment_like_btn:hover {
  .second_comment_like_img_hover {
    display: inline-block;
  }
  .second_comment_like_img {
    display: none;
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
  p,
  ul,
  ol,
  li,
  pre,
  blockquote,
  strong,
  em,
  #text {
    font-size: 16px;
    color: #000000;
    font-family: PingFangSC-Regular, PingFang SC;
    word-break: break-all;
    word-wrap: break-word;
    white-space: normal;
  }
  // 图片宽度
  p img,
  blockquote img {
    width: 100%;
  }
}
// 评论图片限制
.comment_unit_content {
  p img {
    width: 100%;
  }
}
</style>
