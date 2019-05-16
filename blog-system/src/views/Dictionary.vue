<template>
  <div class="ant-page scroll-content">
    <div id="components-form-demo-advanced-search">
      <a-form class="ant-advanced-search-form" :form="searchform" @submit="handleSearch">
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item v-bind="searchformItemLayout" :label="`字典名称:`">
              <a-input v-decorator="[ `name`, { rules: [{ required: false, message: '请输入字典名称!', }], } ]" placeholder="请输入字典名称"/>
            </a-form-item>
          </a-col>
          <!-- <a-col :span="12">
            <a-form-item v-bind="searchformItemLayout" :label="`关键词：`">
              <a-input v-decorator="[ `keyword`, { rules: [{ required: false, message: 'Input something!', }], } ]" placeholder="请输入"/>
            </a-form-item>
          </a-col>
          <a-col :span="12" :style="{'display': count == 3 ? 'none' : 'block'}">
            <a-form-item v-bind="searchformItemLayout" :label="`状态：`">
              <a-input v-decorator="[ `bugStatus`, { rules: [{ required: false, message: 'Input something!', }], } ]" placeholder="请输入"/>
            </a-form-item>
          </a-col>
          <a-col :span="12" :style="{'display': count == 3 ? 'none' : 'block'}">
            <a-form-item v-bind="searchformItemLayout" :label="`作者：`">
              <a-input v-decorator="[ `author`, { rules: [{ required: false, message: 'Input something!', }], } ]" placeholder="请输入"/>
            </a-form-item>
          </a-col> -->
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12" :style="{ textAlign: 'left' }">
            <a-button type="primary" icon="plus" @click="AddModal = true"> 新建 </a-button> &emsp;
            <!-- <a-button> 批量操作 </a-button> &emsp;
            <a-dropdown :trigger="['click']">
              <a-menu slot="overlay" @click="handleMenuClick">
                <a-menu-item key="1"> 操作1 </a-menu-item>
                <a-menu-item key="2"> 操作2 </a-menu-item>
                <a-menu-item key="3"> 操作3 </a-menu-item>
              </a-menu>
              <a-button> 更多操作 <a-icon type="down" />
              </a-button>
            </a-dropdown> -->
          </a-col>
          <a-col :span="12" :style="{ textAlign: 'right' }">
            <a-button type="primary" html-type="submit"> 查询 </a-button>
            <a-button :style="{ marginLeft: '8px' }" @click="handleReset" > 重置 </a-button>
            <!-- <a :style="{ marginLeft: '8px', fontSize: '12px' }" @click="toggle" > {{expand ? '收起' : '展开'}} <a-icon :type="expand ? 'up' : 'down'" /></a> -->
          </a-col>
        </a-row>
      </a-form>
      <div class="search-result-list scroll-content">
        <a-table :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" :dataSource="data" :columns="columns" :rowKey:="columns.key" :loading="loading">
          <template slot="operation" slot-scope="text, record">
            <a @click="editDictionary(record)"> 编辑 </a>
            <a @click="showDictionary(record)"> 查看 </a>
            <a @click="delDictionary(record.key)"> 删除 </a>
            <!-- <a-popconfirm v-if="data.length" title="确定删除该项字典库?" cancelText="取消" okText="确定" @confirm="() => onDelete(record.key)">
              <a>删除</a>
            </a-popconfirm> -->
          </template>
        </a-table>
      </div>
    </div>

    <!-- 模态框 -->
    <!-- 新增 -->
    <a-modal title="新增字典库" v-model="AddModal" @ok="addTreeNode" okText="保存" cancelText="取消">
      <a-spin :spinning="modalloading">
        <div class="spin-content">
          <a-form :form="addform">
            <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" label="所属模块">
              <a-tree-select :value="addValue" :dropdownStyle="treeConfig" placeholder='请选择' allowClear treeDefaultExpandAll @change="addBelong">
                <a-tree-select-node :value='tree._id' :title='tree.name' :key='tree._id' v-for="tree in treeData">
                </a-tree-select-node>
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
              <a-tree-select :value="editValue" :dropdownStyle="treeConfig" placeholder='请选择' allowClear treeDefaultExpandAll @change="editBelong">
                <a-tree-select-node :value='tree._id' :title='tree.name' :key='tree._id' v-for="tree in treeData">
                </a-tree-select-node>
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
        <a-tree showLine :defaultExpandedKeys="['0-0-0']" @select="onSelect" v-if="showtreeData && showtreeData.length > 0">
          <a-tree-node :key="showtreeData[0]._id">
            <span slot="title" style="color: #1890ff">{{showtreeData[0].name}}</span>
            <a-tree-node :title="item.name" :key="item._id" v-for="item in showtreeData[0].children">
              <a-tree-node :title="items.name" :key="items._id" v-for="items in item.children"/>
            </a-tree-node>
          </a-tree-node>
        </a-tree>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import { setTimeout } from 'timers'
import moment from 'moment'
const BASE_URL = 'http://ued.lunz.cn/api/'
export default {
  data () {
    return {
      loading: false,
      // expand: false,
      // count: 3,
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
        // {
        //   title: 'KEY',
        //   dataIndex: 'key'
        // },
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
      const blogURL = BASE_URL + 'dictionary/GetModelList'
      const res = await this.$http.post(blogURL)
      if (res.status_code === 200) {
        this.treeData = res.data
      } else {
        this.error(res.message)
      }
    },
    // 检索栏
    // handleMenuClick (e) {
    //   console.log('click', e)
    // },
    handleSearch (e) {
      // 阻止事件冒泡
      e.preventDefault()
      this.getDictionaryList()
      // this.form.validateFields((error, values) => {
      //   console.log('Received values of form: ', values)
      // })
    },
    // 搜索栏重置
    handleReset () {
      this.searchform.resetFields()
    },
    // toggle () {
    //   if (this.expand) {
    //     this.count = 3
    //   } else {
    //     this.count = 5
    //   }
    //   this.expand = !this.expand
    // },
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
    addBelong (value) {
      this.addValue = value
    },
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
    editBelong (value) {
      this.editValue = value
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
        this.showtreeData = res.data
        this.modalloading = false
      } else {
        this.modalloading = false
        this.error(res.message)
      }
    },
    onSelect (selectedKeys, info) {
      console.log('selected', selectedKeys, info)
    }
  },
  mounted () {
    this.getDictionaryList()
    this.getAddList()
  }
}
</script>

<style lang='scss' scoped>
::-webkit-scrollbar {
  width: 6px;
  height: 2px;
  background: white;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  display: block;
  width: 6px;
  margin: 0 auto;
  border-radius: 10px;
  background: #ccc;
}

.scroll-content {
  overflow-y: auto;
}

.ant-page {
  height: 100%;

  > div {
    @extend .ant-page;
  }

  .search-result-list {
    height: calc( 100% - 175px );
  }
}

.ant-advanced-search-form {
  padding: 24px;
}

.ant-advanced-search-form .ant-form-item {
  display: flex;
}

.ant-advanced-search-form .ant-form-item-control-wrapper {
  flex: 1;
}
</style>
