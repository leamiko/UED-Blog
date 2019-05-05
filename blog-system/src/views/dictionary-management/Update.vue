<template>
  <div class="ant-page">
    <a-spin :spinning="loading">
      <div class="spin-content">
        <a-form :form="form">
          <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" label="所属模块">
          <a-tree-select showSearch
              :value="value"
              :dropdownStyle="treeConfig"
              placeholder='请选择'
              allowClear
              treeDefaultExpandAll
              @change="onChange"
          >
              <a-tree-select-node value='parent 1' title='parent 1' key='0-1'>
              <a-tree-select-node value='parent 1-0' title='parent 1-0' key='0-1-1'>
                  <a-tree-select-node :selectable="false" value='leaf1' title='my leaf' key='random' />
                  <a-tree-select-node value='leaf2' title='your leaf' key='random1' />
              </a-tree-select-node>
              <a-tree-select-node value='parent 1-1' title='parent 1-1' key='random2'>
                  <a-tree-select-node value='sss' key='random3'>
                  <b style="color: #08c" slot="title">sss</b>
                  </a-tree-select-node>
              </a-tree-select-node>
              </a-tree-select-node>
          </a-tree-select>
          </a-form-item>
          <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" label="字典名称">
          <a-input v-decorator="['name', {rules: [{ required: true, message: '请填写字典名称' }]}]"
              placeholder="请填写字典名称"/>
          </a-form-item>
          <a-form-item :label-col="formTailLayout.labelCol" :wrapper-col="formTailLayout.wrapperCol">
              <a-button type="primary" @click="check" > 保存 </a-button>
          </a-form-item>
        </a-form>
      </div>
    </a-spin>
  </div>
</template>
<script>
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8 },
};
const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 },
};
export default {
  data() {
    return {
      idEdit: false,
      loading: false,
      treeExpandedKeys: [],
      value: undefined,
      treeConfig: {
          maxHeight: '400px',
          overflow: 'auto'
      },
      formItemLayout,
      formTailLayout,
      form: this.$form.createForm(this),
    };
  },
  methods: {
    onChange (value) {
      console.log(value)
      this.value = value
    },
    check() {
      this.form.validateFields(
        (err) => {
          if (!err) {
            console.info('success');
          }
        },
      );
    },
    async postInfo() {
      const url = this.api.bugList;
      const params = {
        name: '',
        parentId: '',
        id: this.isEdit ? this.editInfo.id : undefined
      };
      const blogURL = 'http://ued.lunz.cn/api/dictionary/CreateOrEditDictionary';
      const res = await this.$http.post(blogURL, params);
      console.log(res);
      if(res.Data) {
        this.loading = false;
        this.data = res.Data;
      } else {
        this.loading = false;
        this.$notification['error']({
          message: '错误',
          placement: 'bottomRight',
          description: res.msg,
        });
        return;
      }
    },
  },
  mounted() {
    this.editInfo = this.localEvent.StorageGetter('editDictionarydata');
    if (this.editInfo) {
      this.form.setFieldsValue({
        name: `${this.editInfo.title}`,
      });
    }
  }
}
</script>
<style lang="scss" scoped>
.ant-page {}
</style>
