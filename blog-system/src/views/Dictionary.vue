<template>
  <div class="ant-page">
    <div class="add_row">
      <span>字典管理</span>
      <a-button type="primary" icon="plus" @click="AddModal = true" >新增</a-button>
    </div>
    <div class="select_block" id="components-form-demo-advanced-search">
      <a-form class="ant-advanced-search-form" :form="searchform" @submit="handleSearch">
        <a-row :gutter="24">
          <a-col :span="7">
            <a-form-item v-bind="searchformItemLayout" :label="`字典名称:`">
              <a-input v-decorator="[ `name`, { rules: [{ required: false, message: '请输入字典名称!', }], } ]" placeholder="请输入字典名称"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24" :style="{ textAlign: 'right' }" >
            <a-button type="primary" html-type="submit" > 查询 </a-button>
            <a-button :style="{ marginLeft: '8px' }" @click="handleReset" > 清空 </a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 表格 -->
    <div class="tables">
      <a-table :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" :dataSource="data" :columns="columns" :rowKey:="columns.key" :loading="loading">
        <template slot="operation" slot-scope="text, record">
          <a @click="editDictionary(record)" class="right_gap"> 编辑 </a>
          <a @click="showDictionary(record)" class="right_gap"> 查看 </a>
          <a @click="delDictionary(record.key)"> 删除 </a>
        </template>
      </a-table>
    </div>

    <!-- 模态框 -->
    <!-- 新增 -->
    <a-modal title="新增字典库" v-model="AddModal" @ok="addTreeNode" okText="保存" cancelText="取消">
      <a-spin :spinning="modalloading">
        <div class="spin-content">
          <a-form :form="addform">
            <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" label="所属模块">
              <a-tree-select v-model="addValue" :dropdownStyle="treeConfig" placeholder='请选择' allowClear treeDefaultExpandAll :treeData="treeData">
              </a-tree-select>
            </a-form-item>
            <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" label="字典名称">
              <a-input v-decorator="['name', {rules: [{ required: true, message: '请填写字典名称' }]}]" placeholder="请填写字典名称"/>
            </a-form-item>
          </a-form>
        </div>
      </a-spin>
    </a-modal>

    <!-- 编辑 -->
    <a-modal title="编辑字典库" v-model="EditModal" @ok="editTreeNode" okText="保存" cancelText="取消">
      <a-spin :spinning="modalloading">
        <div class="spin-content">
          <a-form :form="editform">
            <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" label="所属模块">
              <a-tree-select v-model="editValue" :dropdownStyle="treeConfig" placeholder='请选择' allowClear treeDefaultExpandAll @change="editBelong" :treeData="treeData">
              </a-tree-select>
            </a-form-item>
            <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" label="字典名称">
              <a-input v-decorator="['name', {rules: [{ required: true, message: '请填写字典名称' }]}]" placeholder="请填写字典名称"/>
            </a-form-item>
          </a-form>
        </div>
      </a-spin>
    </a-modal>

    <!-- 查看 -->
    <a-modal title="查看字典库" v-model="ShowModal" :footer="null">
      <a-spin :spinning="modalloading">
        <a-tree showLine :defaultExpandedKeys="['0-0-0']" @select="onSelect" :treeData="showtreeData"></a-tree>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import { setTimeout } from 'timers'
import moment from 'moment'
import { log } from 'util';
const BASE_URL = 'http://ued.lunz.cn/api/'
export default {
  data () {
    return {
      loading: false,
      searchform: this.$form.createForm(this),
      searchformItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 4 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 }
        }
      },
      data: [],
      status: [],
      searchText: '',
      searchInput: null,
      selectedRowKeys: [],
      columns: [
        {
          title: '字典名称',
          dataIndex: 'name'
        },
        {
          title: '父级名称',
          dataIndex: 'parentName'
        },
        {
          title: '创建时间',
          dataIndex: 'creatDate'
        },
        {
          title: '更新时间',
          dataIndex: 'updateDate'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: {
            customRender: 'operation'
          }
        }
      ],
      // 模态框
      AddModal: false,
      EditModal: false,
      ShowModal: false,
      // 新建/编辑
      modalloading: false,
      treeData: [],
      treeExpandedKeys: [],
      addValue: '',
      editValue: '',
      editNodeId: '',
      treeConfig: {
        maxHeight: '400px',
        overflow: 'auto'
      },
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 12 }
      },
      addform: this.$form.createForm(this),
      editform: this.$form.createForm(this),
      // 展示
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      showtreeData: []
    }
  },
  methods: {
    // 公共方法
    error (msg) {
      this.$notification['error']({
        message: '字典管理',
        placement: 'bottomRight',
        description: msg
      })
    },
    async postDictionaryUpdateInfo (name, parentId, id) {
      const params = {
        name: name,
        parentId: parentId,
        id: id
      }
      const blogURL = BASE_URL + 'dictionary/CreateOrEditDictionary'
      const res = await this.$http.post(blogURL, params)
      if (res.status_code === 200) {
        this.modalloading = false
        if (id) {
          this.EditModal = false
        } else {
          this.AddModal = false
        }
        this.$notification['success']({
          message: '字典管理',
          placement: 'bottomRight',
          description: res.message
        })
        this.getDictionaryList()
        this.getAddList()
      } else {
        this.modalloading = false
        this.error(res.message)
      }
    },
    // 获得列表
    async getDictionaryList () {
      this.loading = true
      const params = {
        paging: {
          pagesize: 10,
          pageIndex: 1
        },
        filter: {
          name: this.searchform.getFieldValue('name') ? this.searchform.getFieldValue('name') : ''
        }
      }
      const blogURL = BASE_URL + 'dictionary/GetDictionaryList'
      const res = await this.$http.post(blogURL, params)
      if (res.status_code === 200) {
        this.loading = false
        if (res.data.data && res.data.data.length && res.data.data.length > 0) {
          this.data = res.data.data.map(item => {
            item['key'] = item['_id']
            item['creatDate'] = moment(item['createAt']).format('YYYY-MM-DD HH:mm')
            item['updateDate'] = moment(item['updateAt']).format('YYYY-MM-DD HH:mm')
            return item
          })
        }
      } else {
        this.loading = false
        this.error(res.message)
      }
    },
    async getAddList () {
      // const blogURL = BASE_URL + 'dictionary/GetModelList'
      const blogURL = BASE_URL + 'dictionary/GetDictionaryTree'
      const res = await this.$http.post(blogURL)
      if (res.status_code === 200) {
        this.treeData = this.changeTreeNodeData(res.data)
      } else {
        this.error(res.message)
      }
    },
    handleSearch (e) {
      // 阻止事件冒泡
      e.preventDefault()
      this.getDictionaryList()
    },
    // 搜索栏重置
    handleReset () {
      this.searchform.resetFields()
    },
    // 选中
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    // 删除字典库
    async onDelete (key) {
      const blogURL = BASE_URL + 'dictionary/DeleteDictionaryById?_id=' + key
      const res = await this.$http.get(blogURL)
      if (res.status_code === 200) {
        this.loading = false
        this.$notification['success']({
          message: '字典管理',
          placement: 'bottomRight',
          description: res.message
        })
        this.getDictionaryList()
        this.getAddList()
      } else {
        this.loading = false
        this.error(res.message)
      }
    },
    // 删除字典库模态
    delDictionary (key) {
      const that = this
      this.$confirm({
        title: '删除字典库',
        content: '确定删除该项字典库?',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          that.onDelete(key)
        },
        onCancel () {
        }
      })
    },
    // 新增
    addTreeNode () {
      this.addform.validateFields(
        (err) => {
          if (!err) {
            this.postDictionaryUpdateInfo(this.addform.getFieldValue('name'), this.addValue)
          }
        }
      )
    },
    // 编辑
    editDictionary (data) {
      this.editValue = data.parentId
      this.editNodeId = data.key
      this.modalloading = true
      this.EditModal = true
      // 这里一定要用计时器，不然会报错，大概意思是在modal页面未渲染完成就执行了赋值
      setTimeout(() => {
        this.editform.setFieldsValue({ name: data.name })
        this.modalloading = false
      }, 300)
    },
    editTreeNode () {
      this.editform.validateFields(
        (err) => {
          if (!err) {
            this.postDictionaryUpdateInfo(this.editform.getFieldValue('name'), this.editValue, this.editNodeId)
          }
        }
      )
    },
    // 查看
    async showDictionary (data) {
      this.ShowModal = true
      this.modalloading = true
      const params = {
        _id: data.key
      }
      const blogURL = BASE_URL + 'dictionary/GetDictionaryTree'
      const res = await this.$http.post(blogURL, params)
      if (res.status_code === 200) {
        this.showtreeData = this.changeTreeNodeData(res.data)
        this.modalloading = false
      } else {
        this.modalloading = false
        this.error(res.message)
      }
    },
    changeTreeNodeData (data) {
      data.forEach(element => {
        element['title'] = element.name
        element['value'] = element._id
        element['key'] = element.name
        if (element.children && element.children.length > 0) {
          this.changeTreeNodeData(element.children)
        }
      })
      return data
    },
    onSelect (selectedKeys, info) {
      // console.log('selected', selectedKeys, info)
    }
  },
  mounted () {
    this.getDictionaryList()
    this.getAddList()
  }
}
</script>

<style lang='scss' scoped>
</style>
