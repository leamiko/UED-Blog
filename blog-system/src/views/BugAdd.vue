<template>
    <div class="add_form">
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item v-bind="formItemLayout" label="名称">
          <a-input v-decorator="[
            'model.title',
            {
                rules: [{
                required: true, message: '请输入bug名称!', 
                }],
            }
          ]" />
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="关键词">
            <a-input v-decorator="[
            'model.keyword',
            {
                rules: [{
                required: true, message: '请输入关键词!',
                }],
                initialValue:model.keyword
            }
            ]" />
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="内容">
            <quill-editor v-model="model.content" ref="myTextEditor"  :options="editorOption">
            </quill-editor>
            <!-- <a-input v-decorator="[
            'model.content',
            {
                rules: [{
                required: true, message: 'Please confirm your password!',
                }],
                initialValue:model.content
            }
            ]" @blur="handleConfirmBlur" /> -->
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="状态">
            <a-radio-group name="radioGroup" v-decorator="[
            'model.bugStatus',{
                rules: [{ required: true, message: '请选择状态!' }],
                initialValue:model.bugStatus
            }
            ]">
            <a-radio :value="true">已解决</a-radio>
            <a-radio :value="false">未解决</a-radio>
            </a-radio-group>
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="解决方案">
            <quill-editor  v-model="model.bugSolution" ref="myTextEditor"  :options="editorOption">
            </quill-editor>
            <!-- <a-textarea v-decorator="[
            'model.bugSolution',
            {
                initialValue:model.bugSolution
            }
            ]" :autosize="{ minRows: 2, maxRows: 6 }" /> -->
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="作者">
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
            <a-button type="primary" html-type="submit">
            确定
            </a-button>
        </a-form-item>
      </a-form>
    </div>
</template>

<script>
export default {
    data() {
      return {
        editorOption: {
        //   modules: {
        //     toolbar: [
        //       ['bold', 'italic', 'underline', 'strike'],
        //       ['blockquote', 'code-block'],
        //       [{
        //         'header': 1
        //       }, {
        //         'header': 2
        //       }],
        //       [{
        //         'list': 'ordered'
        //       }, {
        //         'list': 'bullet'
        //       }],
        //       [{
        //         'script': 'sub'
        //       }, {
        //         'script': 'super'
        //       }],
        //       [{
        //         'indent': '-1'
        //       }, {
        //         'indent': '+1'
        //       }],
        //       [{
        //         'direction': 'rtl'
        //       }],
        //       [{
        //         'size': ['small', false, 'large', 'huge']
        //       }],
        //       [{
        //         'header': [1, 2, 3, 4, 5, 6, false]
        //       }],
        //       [{
        //         'font': []
        //       }],
        //       [{
        //         'color': []
        //       }, {
        //         'background': []
        //       }],
        //       [{
        //         'align': []
        //       }],
        //       ['clean'],
        //       ['link', 'image', 'video']
        //     ],
        //     syntax: {
        //       highlight: text => hljs.highlightAuto(text).value
        //     }
        //   }
        },
        confirmDirty: false,
        model: {},
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
              span: 16,
              offset: 8,
            },
          },
        },
      };
    },
    beforeCreate() {
      this.form = this.$form.createForm(this);

    },
    mounted() {},
    methods: {
      handleSubmit(e) {
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
          this.addBug(params);
        }
      },
      handleConfirmBlur(e) {
        const value = e.target.value;
        this.confirmDirty = this.confirmDirty || !!value;
      },

      // 新增bug
      addBug: async function (data) {
        let url = this.api.addBug;
        const res = await this.$http.post(url, data);
        if (res.data.message == 'success') {
          history.back(-1);
        }
      }

    },
  };
</script>