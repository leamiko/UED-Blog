<template>
  <my-scrollbar hasHead hasFoot :headStyle="{'background':'white'}" :headActive="'打码'">
    <div slot="container" class="container">
      <!-- top block -->
      <div class="my-search"></div>
      <!-- other block -->
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
          <div class="reg_btn">
            <el-button type="primary" @click="onlineVerify()">在线验证</el-button>
            <el-button type="primary" @click="form1Visible=true">新增</el-button>
          </div>
          <el-table :data="tableData" style="width: 100%" height="400">
            <el-table-column label="名称" prop="regularName"></el-table-column>
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
            <el-table-column label="分类" prop="regularCategory"></el-table-column>
            <el-table-column label="表达式" prop="regular"></el-table-column>
            <el-table-column label="状态" prop="status">
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">
                  <el-tag size="small" v-if="scope.row.status===1">已审核</el-tag>
                  <el-tag size="small" type="info" v-if="scope.row.status===0">未审核</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleVerify(scope.$index, scope.row)">验证</el-button>
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
</template>
<style lang="scss" scoped>
.flex {
  display: flex;
}

.container {
  padding: 48px 0;
  width: 1200px;
  margin: 0 auto;

  .top_article {
    height: 332px;
    display: flex;
    margin-bottom: 42px;
    background: white;
    border-radius: 20px;
  }

  .right_detail {
    width: 419px;
    cursor: pointer;
  }
}

.right_articles {
  width: 100%;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 1px 5px 0px rgba(236, 236, 236, 0.53);
  padding: 0 30px;
  overflow: hidden;

  a {
    color: #394145;
    text-decoration: none;
  }

  .reg_btn {
    padding: 20px;
    float: right;
  }
}

.right_detail {
  padding: 16px 17px 0 31px;
  position: relative;

  img {
    position: absolute;
    right: 15px;
  }

  .title {
    color: #34485e;
    font-size: 22px;
    font-weight: bold;
    margin: 60px 0 84px 0;
  }
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
</style>
<script>
import * as custom from "@/assets/js/custom.config";
import MyScrollbar from "@/components/scroller/Scrollbar";
import FormulaVerify from "@/components/dialogs/FormulaVerify";
import AddFormula from "@/components/dialogs/AddFormula";

export default {
  components: {
    MyScrollbar,
    FormulaVerify,
    AddFormula
  },
  data() {
    return {
      disabled: false,
      menuItems: [
        {
          id: 0,
          name: "全部"
        },
        {
          id: 1,
          name: "数字校验"
        },
        {
          id: 2,
          name: "字符校验"
        },
        {
          id: 3,
          name: "个人信息"
        },
        {
          id: 4,
          name: "公式验证"
        }
      ],
      // 表格数据
      tableData: [],
      search: "",
      regClass: 0,
      formVisible: false,
      form1Visible: false,
      reg: ""
    };
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
    // 列表
    async getRegList() {
      let params = {
        regularCategory: this.regClass,
        searchValue: ""
      };
      const { data } = await this.$axios.post(
        `${process.env.BASE_URL}/web_api/getRegularList`,
        params
      );
      if (data.status_code === 200) {
        this.tableData = data.data;
      } else {
        this.$notify.error({
          title: "失败",
          message: data.message
        });
      }
    },

    // 操作列验证方法
    handleVerify(index, row) {
      this.reg = row.regular;
      this.formVisible = true;
      this.disabled = true;
    },

    // 在线验证
    onlineVerify() {
      this.reg = "";
      this.formVisible = true;
      this.disabled = false;
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
