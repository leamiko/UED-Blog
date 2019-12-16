<template>
  <div class="page">
    <a-form :form="form" @submit="handleSubmit">
      <a-form-item label="名称" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
        <a-input
          v-decorator="[
          'model.regularName',
          {
            rules: [{ required: true, message: '名称不能为空！' }],
            initialValue:model.regularName
          }
        ]"
          placeholder="请输入正则名称"
          :disabled="disabled"
        />
      </a-form-item>
      <a-form-item label="描述" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
        <a-textarea
          v-decorator="[
          'model.regularDescribe',
          {rules:[{ required: false, message: '' }],initialValue:model.regularDescribe}
        ]"
          placeholder="请输入正则描述"
          :disabled="disabled"
          :autosize="{ minRows: 1, maxRows: 3 }"
        />
      </a-form-item>
      <a-form-item label="表达式" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
        <a-input
          v-decorator="[
          'model.regular',
          {
            rules: [{ required: true, message: '表达式不能为空！' }],
            initialValue:model.regular
          }
        ]"
          placeholder="请输入正则表达式"
          :disabled="disabled"
        />
      </a-form-item>
      <a-form-item label="状态" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
        <a-radio-group
          name="radioGroup"
          v-decorator="[
            'model.status',{
                rules: [{ required: true, message: '请选择状态!' }],
                initialValue:model.status
            }
            ]"
          :disabled="disabled"
        >
          <a-radio :value=0>未审核</a-radio>
          <a-radio :value=1>已审核</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="分类" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
        <a-select
          v-decorator="[
          'model.regularCategory',
          {rules: [{ required: true, message: '分类不能为空!' }],
                initialValue:model.regularCategory}
        ]"
          placeholder="请选择分类"
          :disabled="disabled"
        >
          <!-- 需要所有文章分类 -->
          <a-select-option value="1">数字校验</a-select-option>
          <a-select-option value="2">字符校验</a-select-option>
          <a-select-option value="3">个人信息</a-select-option>
          <a-select-option value="4">公式验证</a-select-option>
        </a-select>
      </a-form-item>

      <!-- 按钮 -->
      <a-form-item :wrapper-col="{ span: 12, offset: 7 }">
        <a-button type="primary" html-type="submit" @click="save()" :hidden="disabled">保存</a-button>
        <a-button :style="{ marginLeft: '30px', marginTop: '40px' }" @click="goBack()">返回</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { client } from "../../assets/js/aliyun_oss";
export default {
  data() {
    return {
      form: this.$form.createForm(this),
      model: {},
      regularId: "",
      disabled: true
    };
  },
  mounted() {
    this.regularId = this.$route.query.regularId
      ? this.$route.query.regularId
      : "";
    this.disabled = this.$route.query.disabled;

    // 解决刷新页面disabled类型改变
    if (this.disabled === "true") {
      this.disabled = true;
    }
    if (this.disabled === "false") {
      this.disabled = false;
    }

    if (this.regularId) {
      this.getRegularInfo();
    }
  },
  methods: {
    // 获取正则信息
    getRegularInfo: async function() {
      const url = this.api.getRegularDetail;
      let params = {
        regularId: this.regularId
      };
      const res = await this.$http.get(url, params);
      if (res.status_code === 200) {
        this.model = res.data;
      }
    },

    // 保存
    save() {
      this.updateInfo();
    },
    async updateInfo() {
      this.model.regularId = this.regularId;
      const url = this.api.updateRegular;
      const res = await this.$http.post(url, this.model);
      if (res.status_code === 200) {
      }

      this.form.validateFields(async (err, values) => {
        if (!err) {
          const url = this.api.updateRegular;
          const params = {
            regularId: this.regularId,
            regular: values.model.regular,
            regularCategory: values.model.regularCategory,
            regularDescribe: values.model.regularDescribe,
            regularName: values.model.regularName,
            status: values.model.status
          };
          const res = await this.$http.post(url, params);
          if (res.status_code === 200) {
            this.$notification.success({
              placement: "bottomRight",
              description: "保存成功！"
            });
            this.$router.push({
              name: "regular"
            });
          }
        }
      });
    },

    // 组件校验
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log("校验的值: ", values);
        }
      });
    },

    // 返回
    goBack() {
      this.$router.push({
        name: "regular"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.page {
  padding: 50px;
  background: #ffffff;
}

.flex_center_wrap {
  display: flex;

  .imgDiv {
    width: 102px;
    height: 102px;
    display: flex;
    margin-right: 10px;
    img {
      width: 100%;
    }
  }
}

.article_addbtn {
  margin-top: 50px;
  text-align: center;
}
</style>
