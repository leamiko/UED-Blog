<template>
  <my-scrollbar hasHead hasFoot :headStyle="{'background':'white'}" :headActive="'打码'">
    <div slot="container">
        <div class="detail_container">
            <div class="support"></div>
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
                </div>
                <div class="detail_content">
                    <div class="detail_sign"><span class="span_sign inline flt"></span>解决方案</div>
                </div>
            </div>
            <div class="interest inline frt">
                <div class="interest_title">
                    你可能感兴趣
                    <router-link class="more frt" :to="'/coding'">更多&nbsp;></router-link>
                </div>
                <div class="interest_list">
                    <div class="interest_info">mysql批量插入数据，一次插入多少 行数据效率最高？</div>
                    <div class="interest_info active">LUNZ+——select选择项为请选择时 表单不验证</div>
                    <div class="interest_info">Vue框架在ios微信端存在input输入时 系统键盘会将整个浏览器推上去</div>
                    <div class="interest_info">小程序手机端数字键盘无法输入小数</div>
                    <div class="interest_info">Java如何实现五分钟内重复获取返回 同一个短信验证码</div>
                </div>
            </div>
        </div>
    </div>
  </my-scrollbar>
</template>
<script>
import * as custom from "@/assets/js/custom.config";
import MyScrollbar from '@/components/scroller/Scrollbar';
import { async } from 'q';
export default {
  components: {
    MyScrollbar
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
  width: 62.5%;
  margin: 57px auto 48px;
  .support {
      width: 55px;
  }
  .detail_info {
    width: 75%;
    height: 500px;
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
        margin-top: 50px;
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
</style>
