<template>
  <div class="cus-full-screen hidden">
    <my-scrollbar
      hasHead
      hasFoot
      :headActive="'打码'"
      :isFootMenu="true"
      :headStyle="styleConf"
    >
      <div slot="head_custom">
        <el-dropdown
          trigger="click"
          size="medium"
          split-button
          type="primary"
          @command="handleCommand"
        >
          创建
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="askShow">
              <p>我要提问</p>
            </el-dropdown-item>
            <el-dropdown-item command="answer">
              <p>提供解决方案</p>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div slot="container" class="body-search">
        <div class="my-search">
          <my-search @search="getSearch" :value="searchVal" :placeholder="'请输入关键词~'"></my-search>
        </div>
      </div>
      <div slot="container" class="container">
        <div class="other_article">
          <div class="left_menu">
            <ul>
              <li
                v-for="item in menuItems"
                :key="item.id"
                @click="chooseType(item)"
                :class="{'active': item.id == regClass}"
              >{{item.name}}</li>
            </ul>
          </div>
          <div class="right_articles">
            <span class="reg_title">正则表达式</span>
            <div class="reg_btn">
              <button class="online-verify" @click="onlineVerify()">在线验证</button>
              <button
                class="add-verify"
                type="primary"
                round
                size="small"
                @click="form1Visible=true"
              >新增</button>
            </div>
            <el-table :data="tableData" class="data_table">
              <el-table-column label="名称" prop="regularName">
                <template slot-scope="scope">
                  <div slot="reference" class="name-wrapper">{{scope.row.regularName}}</div>
                </template>
              </el-table-column>
              <el-table-column label="描述" prop="regularDescribe">
                <template slot-scope="scope">
                  <el-popover trigger="hover" placement="top">
                    <p>{{ scope.row.regularDescribe }}</p>
                    <div
                      slot="reference"
                      class="name-wrapper"
                    >{{shortString(scope.row.regularDescribe) }}</div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="分类" prop="regularCategory">
                <template slot-scope="scope">
                  <div slot="reference" class="name-wrapper">{{scope.row.regularCategory|category}}</div>
                </template>
              </el-table-column>
              <el-table-column label="正则表达式" prop="regular"></el-table-column>
              <el-table-column label="状态" prop="status">
                <template slot-scope="scope">
                  <div slot="reference" class="name-wrapper">
                    <span v-if="scope.row.status==='1'">
                      <span class="green-circle"></span>
                      <span>已审核</span>
                    </span>
                    <span v-if="scope.row.status==='0'">
                      <span class="orange-circle"></span>
                      <span>未审核</span>
                    </span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-link type="primary" @click="handleVerify(scope.$index, scope.row)">验证</el-link>
                </template>
              </el-table-column>
            </el-table>
            <!-- no result -->
            <formula-verify
              ref="form"
              v-if="formVisible"
              :visible.sync="formVisible"
              :disabled="disabled"
              :reg="reg"
            ></formula-verify>
            <add-formula ref="form1" v-if="form1Visible" :visible.sync="form1Visible"></add-formula>
          </div>
        </div>
      </div>
    </my-scrollbar>
    <!-- 模态框 -->
    <quiz-dialog
      :isShow="askShow"
      :classStyle="className"
      placeholder="请一句话描述你的问题"
      @hide="askShow=false"
    ></quiz-dialog>
  </div>
</template>
<style lang="scss" >
.el-table thead {
  color: #000;
}
.data_table th {
  background-color: #f7f8fa !important;
}
.data_table .el-link.el-link--primary.is-underline:hover:after {
  content: none;
}
.data_table.el-table--group::after,
.data_table.el-table--border::after,
.data_table::before {
  content: none;
}
.data_table tr:last-child td {
  border-bottom: none;
}
</style>
<style lang="scss" scoped>
.body-search {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 1px 5px 0px rgba(236, 236, 236, 1);
  margin: 2px 0 20px 0;
  padding: 60px 0;
  .my-search {
    margin: 0 auto;
    width: 922px;
  }
}
.flex {
  display: flex;
}

.container {
  padding: 0 0 48px;
  width: 1200px;
  margin: 0 auto;
}

.right_articles {
  width: 100%;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 1px 5px 0px rgba(236, 236, 236, 0.53);
  padding: 0 30px 50px;
  overflow: hidden;
  .reg_title {
    padding: 20px 0;
    float: left;
    font-weight: 600;
    color: rgba(52, 72, 94, 1);
    font-size: 24px;
  }
  .reg_btn {
    padding: 20px 0;
    float: right;
    margin-top: 5px;
    .online-verify {
      color: #3376ff;
      border: 1px solid #3376ff;
      border-radius: 20px;
      height: 30px;
      line-height: 27px;
      font-size: 14px;
      background: transparent;
      margin-right: 15px;
      width: 80px;
    }
    .online-verify:focus {
      outline: none;
    }
    .add-verify {
      color: #fff;
      border: 1px solid #3376ff;
      border-radius: 20px;
      height: 30px;
      line-height: 27px;
      font-size: 14px;
      background: #3376ff;
      width: 80px;
    }
    .add-verify:focus {
      outline: none;
    }
  }
}
.data_table {
  width: 100%;
}

.orange-circle {
  display: inline-block;
  background: #f24724;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  vertical-align: middle;
  margin-right: 2px;
  margin-top: -2px;
}

.green-circle {
  display: inline-block;
  width: 6px;
  height: 6px;
  background: #52c41a;
  border-radius: 50%;
  vertical-align: middle;
  margin-right: 2px;
  margin-top: -2px;
}

.other_article {
  display: flex;
  word-break: keep-all;
}

.left_menu {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 1px 5px 0px rgba(236, 236, 236, 0.5);
  border-radius: 2px;
  margin-right: 12px;
  height: 315px;
}

.left_menu ul {
  padding-left: 0;
  list-style: none;
}

.left_menu li {
  color: #34485e;
  font-size: 16px;
  margin: 9px 10px 9px 10px;
  text-align: center;
  padding: 9px 34px;
  cursor: pointer;

  &:hover,
  &:focus {
    background: rgba(234, 241, 255, 1);
    border-radius: 6px;
    color: #3376ff;
    font-weight: bold;
  }
}

.active {
  background: rgba(234, 241, 255, 1);
  border-radius: 6px;
  color: #3376ff !important;
  font-weight: bold;
}

@media screen and (max-width: 1366px) {
  .container {
    width: 1100px;
  }
}

@media screen and(min-width: 1280px) {
  .my-search {
    margin: 0 auto;
    width: 840px;
  }
}
</style>
<script>
import * as custom from "@/assets/js/custom.config";
import MyScrollbar from "@/components/scroller/Scrollbar";
import FormulaVerify from "@/components/dialogs/FormulaVerify";
import AddFormula from "@/components/dialogs/AddFormula";
import QuizDialog from "@/components/dialogs/QuizDialog";
import MySearch from "@/components/search/Search";

export default {
  components: {
    MyScrollbar,
    FormulaVerify,
    AddFormula,
    MySearch,
    QuizDialog
  },
  data() {
    return {
      styleConf: {
        background: "white",
        borderBottom: "1px solid #DCDFE6",
        boxShadow: "0 0 2px rgba(0, 0, 0, 0.12)",
        marginBottom: "0"
      },
      searchVal: "",
      disabled: false,
      menuItems: [
        {
          id: "0",
          name: "全部"
        },
        {
          id: "1",
          name: "数字校验"
        },
        {
          id: "2",
          name: "字符校验"
        },
        {
          id: "3",
          name: "个人信息"
        },
        {
          id: "4",
          name: "公式验证"
        }
      ],
      // 表格数据
      tableData: [],
      search: "",
      regClass: "0",
      formVisible: false,
      form1Visible: false,
      reg: "",
      askShow: false,
      className: "custom-dialog"
    };
  },
  filters: {
    category: function(value) {
      if (value === "1") {
        return "数字校验";
      }
      if (value === "2") {
        return "字符校验";
      }
      if (value === "3") {
        return "个人信息";
      }
      if (value === "4") {
        return "公式校验";
      }
      return "无";
    }
  },
  mounted() {
    this.getRegList();
  },
  watch: {
    form1Visible(val) {
      if (!val) {
        this.getRegList();
      }
    }
  },
  methods: {
    handleCommand(command) {
      if (command === "answer") {
        this.$router.push({
          path: "/coding/solve"
        });
        return;
      }
      this[command] = !this[command];
    },
    // 列表
    async getRegList() {
      let params = {
        regularCategory: this.regClass,
        searchValue: this.searchVal
      };
      const { data } = await this.$axios.post(
        `${process.env.BASE_URL}/web_api/getRegularList`,
        params
      );
      if (data.status_code === 200) {
        this.tableData = data.data;
        this.searchVal = "";
      } else {
        this.$notify.error({
          title: "失败",
          message: data.message
        });
      }
    },

    getSearch(val) {
      this.searchVal = val;
      this.getRegList();
    },

    // 操作列验证方法
    handleVerify(index, row) {
      this.reg = row.regular;
      this.formVisible = true;
      this.disabled = true;
    },

    // 在线验证
    onlineVerify() {
      // this.reg = "";
      // this.formVisible = true;
      // this.disabled = false;
      this.$router.push({
        path: "/coding/verify"
      });
      return;
    },

    // 截取正则描述前十个字符串
    shortString(string) {
      if (string.length > 6) {
        return string.substring(0, 5) + "...";
      } else {
        return string;
      }
    },

    // 选择正则分类
    chooseType(item) {
      this.regClass = item.id;
      this.getRegList();
    }
  }
};
</script>
