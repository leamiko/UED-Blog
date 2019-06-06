<template>
  <div class="add_form">
    <a-form :form="form"
            @submit="handleSubmit">
      <a-form-item v-bind="formItemLayout"
                   label="名称">
        <a-input v-decorator="[
            'model.title',
            {
                rules: [{
                  required: true, 
                  message: '请输入bug名称!', 
                },{
                  max:40,
                  message: '名称不能超过40个字!', 
                }],
            }
          ]" />
      </a-form-item>
      <a-form-item v-bind="formItemLayout"
                   label="关键词">
        <a-select mode="tags"
                  style="width: 100%"
                  :tokenSeparators="[',']"
                  @change="handleChange"
                  v-decorator="[
            'model.keyword',
            {
                rules: [{
                required: true, message: '请输入关键词!',
                },{
                  validator:validatorKeywordsLength
                }],
                initialValue:model.keyword
            }
            ]">
          <a-select-option v-for="item in keywordsData"
                           :key="item">
            {{item}}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item v-bind="formItemLayout"
                   label="内容">
        <quill-editor v-model="model.content"
                      ref="myTextEditor"
                      :options="editorOption">
        </quill-editor>
      </a-form-item>
      <a-form-item v-bind="formItemLayout"
                   label="状态">
        <a-radio-group name="radioGroup"
                       @change="radioChange"
                       v-decorator="[
            'model.bugStatus',{
                rules: [{ required: true, message: '请选择状态!' }],
                initialValue:model.bugStatus
            }
            ]">
          <a-radio :value="false">未解决</a-radio>
          <a-radio :value="true">已解决</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item v-if="isResolve"
                   v-bind="formItemLayout"
                   label="解决方案">
        <quill-editor v-model="model.bugSolution"
                      ref="myTextEditor"
                      :options="editorOption">
        </quill-editor>
      </a-form-item>
      <a-form-item v-bind="formItemLayout"
                   label="作者">
        <a-input v-decorator="[
            'model.author',
            {
                rules: [{ required: true, message: '请填写作者姓名!' }],
                initialValue:model.author
            }
            ]">
        </a-input>
      </a-form-item>
      <a-form-item v-bind="tailFormItemLayout">
        <a-button type="primary"
                  html-type="submit">
          确定
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      editorOption: {
      },
      confirmDirty: false,
      model: { bugStatus: false },
      autoCompleteResult: [],
      formItemLayout: {
        labelCol: {
          xs: {
            span: 24
          },
          sm: {
            span: 5
          },
        },
        wrapperCol: {
          xs: {
            span: 24
          },
          sm: {
            span: 13
          },
        },
      },
      tailFormItemLayout: {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0,
          },
          sm: {
            span: 13,
            offset: 5,
          },
        },
      },
      hasKeyword: false,
      oriKeywordsData: [],
      keywordsData: [], // 关键词数据
      cacheKeywords: [],
      isResolve: false
    };
  },
  beforeCreate () {
    this.form = this.$form.createForm(this);
  },
  mounted () {
    this.getBugKeywords();
  },
  methods: {
    // 提交
    handleSubmit (e) {
      let flag;
      let params;
      e.preventDefault();
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          flag = true;
          console.log('Received values of form: ', values);
          params = values.model;
        }
      });
      if (flag) {
        params.id = this.model._id;
        params.content = this.model.content;
        params.bugSolution = this.model.bugSolution;
        console.log(params);
        this.addBug(params);
        this.addBugKeywords();
      }
    },
    // 自定义表单验证keyword
    validatorKeywordsLength (rule, value, callback) {
      if (value.length > 3) {
        callback('关键词最多选择3个')
      } else {
        callback()
      }
    },
    handleConfirmBlur (e) {
      const value = e.target.value;
      this.confirmDirty = this.confirmDirty || !!value;
    },

    // 新增bug
    addBug: async function (data) {
      let url = this.api.addBug;
      const res = await this.$http.post(url, data);
      if (res.message == 'success') {
        this.$message.success('添加成功！');
        history.back(-1);
      } else {
        this.$message.error(res.message);
      }
    },
    // 获取bug的关键词
    getBugKeywords: async function (data) {
      const res = await this.$http.get(this.api.getBugKeywords);
      if (res.message == 'success') {
        console.log(res);
        let managedData = res.data.map((el) => {
          return el.label;
        })
        this.oriKeywordsData = managedData;
        this.keywordsData = managedData
        console.log(this.keywordsData);
      }
    },
    // 新增/更新关键词
    addBugKeywords () {
      console.log(0);
      let paramsArr = []
      this.cacheKeywords.forEach((els) => {
        if (this.oriKeywordsData.indexOf(els) == -1) {
          console.log(1);
          const res = this.$http.post(this.api.addBugKeywords, {
            label: els,
            value: els
          });
          console.log(res);
          if (res.message == 'success') {
            console.log(res);
          }
        }
      })
      console.log(2);
    },
    // 关键词选择处理函数
    handleChange (e) {
      console.log(e);
      this.cacheKeywords = e;
    },
    // 改变radio
    radioChange () {
      this.isResolve = !this.isResolve;
    }
  },
};
</script>
<style scoped>
div.add_form {
  padding: 48px 0 24px;
}
</style>
