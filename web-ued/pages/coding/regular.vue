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
            <el-button type="primary">在线验证</el-button>
            <el-button type="primary">新增</el-button>
          </div>
          <el-table :data="tableData" style="width: 100%" height="600">
            <el-table-column label="名称" prop="name"></el-table-column>
            <el-table-column label="描述" prop="desc">
              <template slot-scope="scope">
                <el-popover trigger="hover" placement="top">
                  <p>{{ scope.row.desc }}</p>
                  <div slot="reference" class="name-wrapper">{{shortString(scope.row.desc) }}</div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="分类" prop="class"></el-table-column>
            <el-table-column label="表达式" prop="reg"></el-table-column>
            <el-table-column label="状态" prop="status">
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">
                  <el-tag size="small" v-if="scope.row.status==='1'">已审核</el-tag>
                  <el-tag size="small" type="info" v-if="scope.row.status==='2'">未审核</el-tag>
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
          <el-dialog title :visible.sync="dialogFormVisible">
            <el-form
              :label-position="labelPosition"
              :model="form"
              label-width="formLabelWidth"
              status-icon
              :rules="rules"
              ref="form"
              class="demo-ruleForm"
            >
              <el-form-item label="正则表达式" prop="name">
                <el-input v-model="form.name" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="测试内容" prop="content">
                <el-input v-model="form.content" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="测试结果" prop="result">
                <el-input v-model="form.result" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="submitForm('form')">确 定</el-button>
            </div>
          </el-dialog>
        </div>
      </div>
    </div>
    <!-- <formula-verify :isShow="regShow"></formula-verify> -->
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
import MyHeader from "@/components/header/Header";
import Detail from "@/pages/writing/detail";
import { log } from "util";
export default {
  components: {
    MyScrollbar
  },
  data() {
    return {
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
      tableData: [
        {
          name: "王小虎",
          desc: "这里填写正则errrrrrrrrrrrrr的描述",
          class: "数字校验",
          reg: "/^d+$/",
          status: "1"
        },
        {
          name: "王小虎",
          desc: "这里填写正则的描述",
          class: "数字校验",
          reg: "/^d+$/",
          status: "2"
        },
        {
          name: "王小虎",
          desc: "这里填写正则的描述",
          class: "数字校验",
          reg: "/^d+$/",
          status: "1"
        },
        {
          name: "王小虎",
          desc: "这里填写正则的描述",
          class: "数字校验",
          reg: "/^d+$/",
          status: "1"
        },
        {
          name: "王小虎",
          desc: "这里填写正则的描述",
          class: "数字校验",
          reg: "/^d+$/",
          status: "1"
        },
        {
          name: "王小虎",
          desc: "这里填写正则的描述",
          class: "数字校验",
          reg: "/^d+$/",
          status: "1"
        },
        {
          name: "王小虎",
          desc: "这里填写正则的描述",
          class: "数字校验",
          reg: "/^d+$/",
          status: "1"
        },
        {
          name: "王小虎",
          desc: "这里填写正则的描述",
          class: "数字校验",
          reg: "/^d+$/",
          status: "1"
        }
      ],
      search: "",
      regClass: null,
      regShow: false,
      dialogFormVisible: false,
      form: {
        name: "",
        content: "",
        result: ""
      },
      formLabelWidth: "120px",
      labelPosition: "right",
      rules: {
        name: [
          { required: true, message: "请输入正则表达式", trigger: "blur" }
        ],
        content: [
          { required: true, message: "请输入测试内容", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {},
  methods: {
    // 操作列方法
    handleVerify(index, row) {
      console.log(index, row);
      this.regShow = true;
      this.dialogFormVisible = true;
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
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
