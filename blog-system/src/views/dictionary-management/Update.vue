<template>
  <div class="ant-page">
    <a-spin :spinning="loading">
      <div class="spin-content">
        <a-form :form="form">
          <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" label="所属模块">
          <a-tree-select :value="value" :dropdownStyle="treeConfig" placeholder='请选择' allowClear treeDefaultExpandAll @change="onChange">
            <a-tree-select-node :value='tree._id' :title='tree.name' :key='tree._id' v-for="tree in treeData">
            </a-tree-select-node>
          </a-tree-select>
          </a-form-item>
          <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" label="字典名称">
          <a-input v-decorator="['name', {rules: [{ required: true, message: '请填写字典名称' }]}]" placeholder="请填写字典名称"/>
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
  wrapperCol: { span: 8 }
}
const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 }
}
const BASE_URL = 'http://ued.lunz.cn/api/'
export default {
  data () {
    return {
      editID: this.$route.query.key,
      loading: false,
      treeData: [],
      treeExpandedKeys: [],
      value: '',
      treeConfig: {
        maxHeight: '400px',
        overflow: 'auto'
      },
      formItemLayout,
      formTailLayout,
      form: this.$form.createForm(this)
    }
  },
  methods: {
    onChange (value) {
      this.value = value
    },
    check () {
      this.form.validateFields(
        (err) => {
          if (!err) {
            console.info('success')
            this.postInfo()
          }
        }
      )
    },
    async postInfo () {
      const params = {
        name: this.form.getFieldValue('name'),
        parentId: this.value,
        id: this.editID ? this.editID : null
      }
      const blogURL = BASE_URL + 'dictionary/CreateOrEditDictionary'
      const res = await this.$http.post(blogURL, params)
      if (res.status_code === 200) {
        this.loading = false
        this.$notification['success']({
          message: '字典管理',
          placement: 'bottomRight',
          description: res.message
        })
      } else {
        this.loading = false
        this.$notification['error']({
          message: '字典管理',
          placement: 'bottomRight',
          description: res.message
        })
      }
    },
    async getList () {
      this.loading = true
      const params = {
        paging: {
          pageIndex: 1,
          pagesize: 1000
        },
        filters: {
          name: ''
        }
      }
      const blogURL = BASE_URL + 'dictionary/GetModelList'
      const res = await this.$http.post(blogURL, params)
      if (res.status_code === 200) {
        this.loading = false
        this.treeData = res.data;
      } else {
        this.loading = false
        this.$notification['error']({
          message: '字典管理',
          placement: 'bottomRight',
          description: res.message
        })
      }
    },
  },
  mounted () {
    this.form.setFieldsValue({
      name: this.$route.query.name
    })
    this.getList()
  }
}
</script>
<style lang="scss" scoped>
</style>
