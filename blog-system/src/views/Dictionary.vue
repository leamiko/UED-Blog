<template>
  <div class="ant-page">
    <div class="add_row">
      <span>字典管理</span>
      <a-button type="primary" icon="plus" @click="AddModal = true">新增</a-button>
    </div>
    <div class="select_block" id="components-form-demo-advanced-search">
      <a-form class="ant-advanced-search-form" :form="searchform" @submit="handleSearch">
        <a-row :gutter="24">
          <a-col :span="7">
            <a-form-item v-bind="searchformItemLayout" :label="`字典名称:`">
              <a-input v-decorator="[ `name`, { rules: [{ required: false, message: '请输入字典名称!', }], } ]" placeholder="请输入字典名称" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24" :style="{ textAlign: 'right' }">
            <a-button type="primary" html-type="submit"> 查询 </a-button>
            <a-button :style="{ marginLeft: '8px' }" @click="handleReset"> 清空 </a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 表格 -->
    <div class="tables">
      <a-table :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" :dataSource="data" :columns="columns" :rowKey:="columns.key" :loading="loading" :locale="{emptyText: '暂无数据'}">
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
              <a-input v-decorator="['name', {rules: [{ required: true, message: '请填写字典名称' }]}]" placeholder="请填写字典名称" />
            </a-form-item>
          </a-form>
        </div>
      </a-spin>
    </a-modal>

    <!-- 编辑 -->
    <a-modal title="编辑字典库" v-model="EditModal" @ok="editTreeNode" :okText="editModalStatus == 'show' ? '确定' : '保存'" cancelText="取消" :width="800">
      <a-spin :spinning="modalloading">
        <div class="spin-content">
          <a-row>
            <a-col :span="12">
              <a-tree :treeData="editTreeData">
                <template slot="custom" slot-scope="item">
                  <span @click="editModalChange(item, 'show')">{{item.title}}</span>&emsp;
                  <a-icon type="cluster" title="新增子级" @click="()=> editModalChange(item, 'new')"/>&emsp;
                  <a-icon type="edit" title="编辑" @click="()=> editModalChange(item, 'edit')"/>
                  <span v-if="item.level >= 1">&emsp;</span>
                  <a-icon type="delete" title="删除" @click="(e)=> editModalRemove(item)" v-if="item.level >= 1"/>
                </template>
              </a-tree>
            </a-col>
            <a-col :span="12">
              <!-- 新建 -->
              <div class="ant-row ant-form-item" v-if="editModalStatus === 'new'">
                <div class="ant-col-6 ant-form-item-label">
                  <label class="ant-form-item-required" title="子级名称">子级名称</label>
                </div>
                <div class="ant-col-16 ant-form-item-control-wrapper">
                  <div class="ant-form-item-control">
                    <span class="ant-form-item-children">
                      <a-input v-model="editNewNode" placeholder="请填写子级名称" />
                    </span>
                  </div>
                </div>
              </div>
              <!-- 展示 -->
              <div class="ant-row ant-form-item" v-if="editModalStatus === 'show'">
                <div class="ant-col-6 ant-form-item-label">
                  <label title="字典名称">字典名称</label>
                </div>
                <div class="ant-col-16 ant-form-item-control-wrapper">
                  <div class="ant-form-item-control">
                    <span class="ant-form-item-children">
                      <span v-if="editSelectNode">{{editSelectNode.title}}</span>
                    </span>
                  </div>
                </div>
              </div>
              <!-- 编辑 -->
              <div class="ant-row ant-form-item" v-else-if="editModalStatus === 'edit'">
                <div class="ant-col-6 ant-form-item-label">
                  <label class="ant-form-item-required" title="字典名称">字典名称</label>
                </div>
                <div class="ant-col-16 ant-form-item-control-wrapper">
                  <div class="ant-form-item-control">
                    <span class="ant-form-item-children">
                      <a-input v-model="editSelectNode.title" placeholder="请填写字典名称" />
                    </span>
                  </div>
                </div>
              </div>
            </a-col>
          </a-row>
        </div>
      </a-spin>
    </a-modal>

    <!-- 查看 -->
    <a-modal title="查看字典库" v-model="ShowModal" :footer="null">
      <a-spin :spinning="modalloading">
        <a-tree showLine :defaultExpandedKeys="['0-0-0']" :treeData="showtreeData"></a-tree>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import moment from 'moment'
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
      editTreeData: [],
      editModalStatus: 'show',
      editSelectNode: null,
      editNewNode: '',
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
      const blogURL = this.api.GetDictionaryList
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
      const blogURL = this.api.GetDictionaryTree
      const res = await this.$http.post(blogURL)
      if (res.status_code === 200) {
        this.treeData = this.changeTreeNodeData(res.data, 0)
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
      const blogURL = this.api.DeleteDictionaryById
      const res = await this.$http.get(`${blogURL}?_id=${key}`)
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
    async postDictionaryUpdateInfo (name, parentId) {
      const params = {
        name: name,
        parentId: parentId
      }
      const blogURL = this.api.CreateOrEditDictionary
      const res = await this.$http.post(blogURL, params)
      if (res.status_code === 200) {
        this.modalloading = false
        this.AddModal = false
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
    // 编辑
    async editDictionary (data) {
      this.editValue = data.parentId
      this.editNodeId = data.key
      this.modalloading = true
      this.EditModal = true
      // 获取对应的数据结构
      const params = {
        _id: data.key
      }
      const blogURL = this.api.GetDictionaryTree
      const res = await this.$http.post(blogURL, params)
      if (res.status_code === 200) {
        this.editTreeData = this.changeTreeNodeData(res.data, 0, true)
        this.editSelectNode = this.editTreeData[0]
        this.modalloading = false
      } else {
        this.modalloading = false
        this.error(res.message)
      }
    },
    // 编辑中的状态改变
    editModalChange (data, status) {
      this.editSelectNode = data
      this.editModalStatus = status
    },
    // 编辑模态框中的删除
    editModalRemove (data) {
      const that = this
      this.$confirm({
        title: '删除字典库',
        content: '确定删除该项字典库?',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        async onOk () {
          const blogURL = that.api.DeleteDictionaryById
          const res = await that.$http.get(`${blogURL}?_id=${data.value}`)
          if (res.status_code === 200) {
            that.removeOption(data.value, that.editTreeData)
            that.$notification['success']({
              message: '字典管理',
              placement: 'bottomRight',
              description: res.message
            })
          } else {
            that.error(res.message)
          }
        },
        onCancel () {
        }
      })
    },
    // 编辑模态框中的保存操作
    editTreeNode () {
      switch (this.editModalStatus) {
        case 'new':
          this.UpdateNode(this.editNewNode, this.editSelectNode._id)
          this.EditModal = false
          break
        case 'show':
          this.EditModal = false
          break
        case 'edit':
          this.UpdateNode(this.editSelectNode.title, this.editSelectNode.parentId, this.editSelectNode._id)
          this.editModalStatus = 'show'
          break
        default:
          break
      }
    },
    // 更新操作
    async UpdateNode (name, parentId, id) {
      const params = {
        name: name,
        parentId: parentId,
        _id: id
      }
      const blogURL = this.api.CreateOrEditDictionary
      const res = await this.$http.post(blogURL, params)
      if (res.status_code === 200) {
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
    // 查看
    async showDictionary (data) {
      this.ShowModal = true
      this.modalloading = true
      const params = {
        _id: data.key
      }
      const blogURL = this.api.GetDictionaryTree
      const res = await this.$http.post(blogURL, params)
      if (res.status_code === 200) {
        this.showtreeData = this.changeTreeNodeData(res.data, 0)
        this.modalloading = false
      } else {
        this.modalloading = false
        this.error(res.message)
      }
    },
    // 递归实现树形结构数据自定义
    changeTreeNodeData (data, level, isCus) {
      data.forEach(element => {
        element['title'] = element.name
        element['value'] = element._id
        element['key'] = element.name
        element['level'] = level
        if (isCus) {
          element['scopedSlots'] = { title: 'custom' }
        }
        if (element.children && element.children.length > 0) {
          this.changeTreeNodeData(element.children, level + 1, isCus)
        }
      })
      return data
    },
    // 递归删除
    removeOption (data, tree) {
      tree.forEach((item, index) => {
        if (item.value === data) {
          tree.splice(index, 1)
        } else {
          if (item.children && item.children.length > 0) {
            this.removeOption(data, item.children)
          }
        }
      })
      return tree
    }
  },
  mounted () {
    this.getDictionaryList()
    this.getAddList()
  }
}
</script>
