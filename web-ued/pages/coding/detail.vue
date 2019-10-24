<template>
  <my-scrollbar hasHead hasFoot :headStyle="{'background':'white'}" :headActive="'打码'">
    <div slot="container">
        <div class="detail_container">
            <div class="support">
              <div class="support_icon pointer">
                <img src="@/assets/img/icon/praise_small_icon.svg">
              </div>
              <div class="support_text">
                <span>点赞</span>
                <span class="separate inline"></span>
                <span>分享</span>
              </div>
              <div class="support_icon pointer">
                <img src="@/assets/img/icon/wechat_icon.svg">
              </div>
              <div class="support_icon pointer">
                <img src="@/assets/img/icon/wechat_share_icon.svg">
              </div>
              <div class="support_icon pointer">
                <img src="@/assets/img/icon/weibo_icon.svg">
              </div>
            </div>
            <div class="detail_info inline bg-white">
                <div class="detail_title">
                    nodeJs使用md5报错
                    <div class="detail_presenter">
                        <div class="presenter_head flt inline">
                            <img src="@/assets/img/image/code_presenter.png">
                        </div>
                        <span class="presenter_info inline">
                            UILEO · 2019-08-28
                        </span>
                        <div class="mark_tags inline">
                            <span class="mark_tag">javascript</span>
                            <span class="mark_tag">php</span>
                            <span class="mark_tag">css</span>
                        </div>
                        <div class="browse inline">
                            <div class="browse_icon inline">
                                <img src="@/assets/img/icon/browse.png"> 
                            </div>
                            6713
                        </div>
                    </div>
                </div>
                <div class="detail_content">
                    <div class="detail_sign"><span class="span_sign inline flt"></span>问题描述</div>
                    <div class="describe">
                      <div class="word">nodeJs报错，如图：</div>
                      <div class="image">
                        <img src="@/assets/img/bg/bg-dialog-ask.png">
                      </div>
                    </div>
                </div>
                <div class="detail_content">
                    <div class="detail_sign"><span class="span_sign inline flt"></span>解决方案</div>
                    <div class="describe">
                      <div class="word">原因是一个crypto实例只能调用digest一次。 <br>解决方法如图：</div>
                      <div class="image">
                        <img src="@/assets/img/bg/bg-dialog-ask.png">
                      </div>
                    </div>
                </div>
                <div class="praise">
                  <div class="praise_img pointer">
                    <img src="@/assets/img/icon/praise.png">
                  </div>
                  <div class="praise_num">136个赞</div>
                </div>
            </div>
            <div class="interest inline frt">
                <div class="interest_title">
                    你可能感兴趣
                    <router-link class="more frt" :to="'/coding/list'">更多<i class="el-icon-arrow-right"></i></router-link>
                </div>
                <div class="interest_list">
                    <div class="interest_info pointer">mysql批量插入数据，一次插入多少 行数据效率最高？</div>
                    <div class="interest_info pointer active">LUNZ+——select选择项为请选择时 表单不验证</div>
                    <div class="interest_info pointer">Vue框架在ios微信端存在input输入时 系统键盘会将整个浏览器推上去</div>
                    <div class="interest_info pointer">小程序手机端数字键盘无法输入小数</div>
                    <div class="interest_info pointer">Java如何实现五分钟内重复获取返回 同一个短信验证码</div>
                </div>
            </div>
        </div>
        <!-- 评论     -->
        <div class="comment_container">
          <div class="comment_title">共8条评论</div>
          <div class="comment_info bg-white">
            <div class="comment_text">
              <div class="current_user inline">
                <img src="@/assets/img/image/code_presenter.png">
              </div>
              <div class="current_edit inline">
                <my-editor :height="'104px'" :placeholder="'我有一个大胆的想法～'"></my-editor>
              </div>
            </div>
          </div>
        </div>
    </div>
  </my-scrollbar>
</template>
<script>
import * as custom from "@/assets/js/custom.config";
import MyScrollbar from '@/components/scroller/Scrollbar';
import MyEditor from '@/components/Editor';
import { async } from 'q';
export default {
  components: {
    MyScrollbar,
    MyEditor,
  },
  data () {
    return {
      config: custom.search,
      list:  custom.search.list[0],
    }
  },
  mounted () {
  },
  methods: {
  },
}
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
        width: 100%
      }
    }
    .support_text {
      padding: 12px 11px;
      font-size: 16px;
      color: #B2BAC1;
      .separate {
        width: 26px;
        height: 1px;
        margin: 4px 2px;
        background: #DCE5ED;
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
          color: #394A58;
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
              color:#9EADBA;
            }
          }
          .browse {
            color:#9EADBA;
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
            font-size:22px;
            font-weight:600;
            color: #000000;
            .span_sign {
                width: 10px;
                height: 30px;
                margin: 4px 14px 14px 0;
                background: #3376FF;
            }
        }
        .describe {
          padding: 30px 52px;
          .word {
            padding: 0 65px 20px;
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
      border-top: 1px solid #EFF3F7;
      .praise_img {
        width: 102px;
        margin-left: calc((100% - 102px)/2); 
        img {
          width: 100%;
        }
      }
      .praise_num {
        margin-left: calc((100% - 102px)/2); 
        padding-left: 13px;
        font-size: 18px;
        color: #394A58;
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
              color: #3376FF;
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
              border-top: 1px solid #EFF3F7;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;
          }
          .interest_info:first-child {
              border-top: none;
          }
          .interest_info.active {
              color: #3376FF;
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
        width: 60px;
        margin-right: 26px;
        vertical-align: top;
        img {
          width: 100%;
        }
      }
      .current_edit {
        width: calc(100% - 92px);
      }
    }
  }
}
</style>
