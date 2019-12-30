<template>
  <div class="cus-full-screen cus-full-height hidden">
    <my-scrollbar>
      <div slot="container">
        <div class="cus-fixed cus-header">
          <my-header activeLabel="打码"></my-header>
        </div>
        <div class="my-content cus-box-center">
          <el-card>
            <template slot="header">
              <div class="flex space-between">
                <h5 class="font-size--lg">在线验证</h5>
              </div>
            </template>
            <div class="card-content">
              <div class="inline inline_auto">
                <el-form
                  :label-position="labelPosition"
                  :model="form"
                  label-width="120px"
                  status-icon
                  :rules="rules"
                  ref="form"
                  class="demo-ruleForm"
                  hide-required-asterisk
                >
                  <el-form-item label="正则表达式" prop="name" class="from-label">
                    <el-input
                      type="textarea"
                      :rows="8"
                      v-model="form.name"
                      autocomplete="off"
                      placeholder="请在此处输入正则表达式"
                      class="textarea"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="测试内容" prop="content" class="from-label">
                    <el-input
                      type="textarea"
                      :rows="8"
                      v-model="form.content"
                      autocomplete="off"
                      placeholder="请在此处输入测试内容"
                      class="textarea"
                    ></el-input>
                  </el-form-item>
                  <!-- <el-form-item label="测试结果" prop="result" class="from-label">
                    <span class="result">{{testResult}}</span>
                  </el-form-item>-->
                </el-form>
                <div class="result">
                  <label>测试结果</label>
                  <span>{{testResult}}</span>
                </div>
                <div class="text-right">
                  <button @click="$router.back()" class="cancel-btn">返回</button>

                  <el-button type="primary" round size="small" @click="submitForm('form')">测试匹配</el-button>
                </div>
              </div>
            </div>
          </el-card>
        </div>
        <my-footer :hasMenu="true"></my-footer>
      </div>
    </my-scrollbar>
  </div>
</template>

<script>
import MyScrollbar from "@/components/scroller/Scrollbar";
import MyHeader from "@/components/header/Header";
import MyFooter from "@/components/footer/Footer";
import MySearch from "@/components/search/Search";
import MyTag from "@/components/Tag";
export default {
  components: {
    MyScrollbar,
    MyHeader,
    MyFooter,
    MySearch
  },
  data() {
    return {
      form: {
        name: this.reg,
        content: "",
        result: ""
      },
      labelPosition: "top",
      rules: {
        name: [
          { required: true, message: "请输入正则表达式", trigger: "blur" }
        ],
        content: [
          { required: true, message: "请输入测试内容", trigger: "blur" }
        ]
      },
      testResult: ""
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (new RegExp(this.form.name).test(this.form.content)) {
            this.testResult = "验证匹配";
          } else {
            this.testResult = "没有匹配";
          }
        } else {
          return false;
        }
      });
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/cus.scss";
.flex {
  display: flex;
}

.space-between {
  justify-content: space-between;
}
.cus-header {
  top: 0;
  width: 100%;
  z-index: 11;
  background: white;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 0px 2px;
}
// .textarea {
//   box-shadow: rgb(236, 236, 236) 0px 0px 5px 0px;
//   border: 1px solid rgb(243, 245, 246);
// }
.my-content {
  padding-top: 100px;
  padding-bottom: 60px;
  min-height: 560px;
  min-width: 600px;
  max-width: 1200px;
}
.card-content {
  padding: 20px;
}
.inline_auto {
  width: 902px;
  padding: 0 26px;
}
.cancel-btn {
  color: #9199a1;
  border-radius: 20px;
  height: 32px;
  line-height: 32px;
  background: #f2f5f6;
  margin-right: 15px;
  width: 80px;
  border: none;
}
.cancel-btn:focus {
  outline: none;
}
.result {
  label {
    font-weight: 600;
    color: #000;
  }
  span {
    color: #f24724;
    margin-left: 30px;
  }
}
.text-right{
  margin: 25px 0 40px 0;
}
</style>