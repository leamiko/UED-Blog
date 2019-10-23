<template>
  <my-scrollbar hasHead hasFoot :headStyle="{'background':'white'}" :headActive="'打码'">
    <div slot="container">
      <div class="code_search bg-white">
        <div class="search_bar">
          <el-input class="input_content" placeholder="有Bug，这里搜～"></el-input>
          <el-button type="primary" class="search_btn">搜索</el-button>
        </div>
        <div class="design_bar">
          <div class="design_classI inline" v-for="item in config.list">
              <el-link :underline="false" :key="item.id">{{item.name}}</el-link>
          </div>
          <div class="design_classII">
              <!-- <el-tag type="info" v-for="tag in item.content" :key="tag.id">{{tag.name}}</el-tag> -->
              <el-tag type="info" v-for="tag in list.content" :key="tag.id">{{tag.name}}</el-tag>
          </div>
        </div>
      </div>
      <div class="code_noresult bg-white">
        <div class="noresult_img">
          <img src="@/assets/img/image/image-search-noresult-image.png" >
        </div>
        <div class="noresult_prompt">
          如你所料，果然没搜到！不妨试试
          <button type="button" class="ask_btn bg-white pointer">我要提问</button>
        </div>
      </div>
      <div class="code_list bg-white">
        <div class="category_tabs inline">
          <span class="category_tab pointer active">全部</span>
          <span class="category_tab pointer">已解决</span>
          <span class="category_tab pointer">未解决</span>
        </div>
        <div class="code_info">
          <div class="code_content pointer" @click="showDetail()">
            <div class="content_title">
              Spring Cloud异步场景分布式事务怎样做？
            </div>
            <div class="content_question">
              在微服务架构中，我们常常使用异步化的手段来提升系统的 吞吐量 和 解耦 上下游，而构建异步架构最常用的手段就是使用 消息队列(MQ)，那异步架构怎样才能实现数据一致性呢？
            </div>
            <div class="content_mark inline">
              <div class="presenter flt">
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
              </div>
              <div class="respondents frt">已有10人回答</div>
            </div>
          </div>
        </div>
      </div>
      <button @click="testGetListApi()">get</button>
      <button @click="testAddApi()">add</button>
      <button @click="testDetailApi()">detail</button>
      <button @click="testDelApi()">delate</button><br>
      <router-link :to="'/coding/search'">去搜索</router-link><br>
      <router-link :to="'/coding/list'">去搜索列表</router-link><br>
      <router-link :to="'/coding/solve'">去提供解决方案</router-link><br>
      <button @click="testSearchApi()">search</button><br>
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
    async showDetail () {
      this.$router.push({
        path: '/coding/detail'
      })
    },
    async testAddApi () {
      let params = {
        title: 'req.body.title',
        content: 'req.body.content',
        tags: [],
        bugStatus: true,
        bugSolution: 'req.body.bugSolution',
        author: 'req.body.author'
      }
      const { data } = await this.$axios.post(`${process.env.BASE_URL}/web_api/AddBugItems`, params);
      console.log(data);
    },
    async testGetListApi () {
      let params = {
        pageIndex: 1,
        pageSize: 10
      }
      const { data } = await this.$axios.post(`${process.env.BASE_URL}/web_api/GetBugList`, params);
      console.log(data);
    },
    async testDetailApi () {
      const res = await this.$axios.get(`${process.env.BASE_URL}/web_api/GetBugDetail?bugId=5cf8b075c26c2f18a0cb4fa7`);
      console.log(res);
    },
    async testDelApi () {
      let params = {
        id: '5cf8b075c26c2f18a0cb4fa7'
      }
      const { data } = await this.$axios.post('/api_nuxt/DeleteBugById', params);
      console.log(data);
    },
    async testSearchApi() {
      let params = {
        keywords: 'author',
        pageIndex: 1,
        pageSize: 10
      }
      const { data } = await this.$axios.post(`/web_api/SearchByKeywords`, params);
      console.log(data);
    }
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
.code_search {
  padding-top: 66px;
  padding-bottom: 40px;
  border-top: 1px solid #ececec;
  box-shadow: 0px 1px 5px 0px #ececec;
  .search_bar {
    width: 62.5%;
    height: 46px;
    margin: 0 auto;
    .input_content {
      width: 60%;
      height: 44px;
      border-radius: 8px;
      border: 2px solid #3376ff;
    }
    .search_btn {
      width: 130px;
      height: 44px;
      margin-left: 20px;
      border-radius: 23px;
    }
  }
  .design_bar {
    width: 62.5%;
    margin: 30px auto 0;
    .design_classI {
      margin-right: 45px;
      .el-link {
        font-weight: 600;
        .el-link--default{
          color: #34485E;
        }
      }
    }
    .design_classI:active {
      color: #3376FF;
    }
    .design_classII {
      // margin-top: 16px;
      .el-tag.el-tag--info {
        display: inline-block;
        margin-top: 16px;
        margin-right: 20px;
        padding: 0 16px;
        color: #A3B3BF;
        font-size: 14px;
        background:#F0F5F9;
        border-radius:16px;
        border: none;
      }
    }
  }
}
.code_noresult {
  display: flex;
  width: 62.5%;
  height: 218px;
  margin: 20px auto auto;
  padding-top: 38px;
  box-shadow:0px 1px 5px 0px rgba(236,236,236,0.5);
  .noresult_img {
    width: 234px;
    height: 185px;
    margin-left: calc((100% - 614px)/2);
    img {
      width: 100%;
    }
  }
  .noresult_prompt {
    flex: 1;
    margin-top: 60px;
    margin-left: 50px;
    color: #A0A0A0;
    .ask_btn {
      margin-left: 20px;
      padding: 6px 19px;
      color: #3376FF;
      border: 1px solid #3376FF;
      border-radius: 15px;
    }
    .ask_btn:focus {
      outline: none;
    }
  }
}
.code_list {
  width: 62.5%;
  margin: 30px auto 58px auto;
  box-shadow:0px 1px 5px 0px rgba(236,236,236,0.5);
  .category_tabs {
    width: 100%;
    text-align: right;
    padding: 30px 40px;
    .category_tab {
      margin-left:30px;
      font-size: 16px;
      color: #7D7D7D;
    }
    .category_tab.active {
      color: #3376FF;
    }
  }
  .code_info {
    padding: 0 75px 50px;
    .code_content {
      padding: 0 21px;
      border-bottom: 1px solid #EFF3F7;
      .content_title {
        margin-bottom: 21px;
        font-size:20px;
        font-weight:600;
        color:#34485E;
      }
      .content_question {
        width: 85%;
        margin-bottom: 36px;
        font-size:18px;
        color:#394145;
      }
      .content_mark {
        width: 100%;
        margin-bottom: 30px;
        color: #394A58;
        .presenter {
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
        }
        .respondents {
          padding: 5px 0;
        }
      }
    }
  }
}
</style>
