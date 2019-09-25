<template>
  <div>
    <div class="add_row">
      <span>用户管理</span>
      <a-button type="primary"
                icon="plus"
                @click="addAdmin()">新增</a-button>
    </div>
    <!-- 筛选 -->
    <div class="select_block"
         id="ant-advanced-search-form">
      <a-form class="ant-advanced-search-form"
              :form="form"
              @submit="handleSearch">
        <a-row :gutter="24">
          <a-col>
            <a-form-item>
              <a-input style="width: 200px"
                       v-decorator="[
                  'account',
                  {
                    rules: [
                      {
                        required: false,
                        message: 'Input something!'
                      }
                    ]
                  }
                ]"
                       v-bind:placeholder="'账号'" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24"
                 :style="{ textAlign: 'right' }">
            <a-button type="primary"
                      html-type="submit">查询</a-button>
            <a-button :style="{ marginLeft: '8px' }"
                      @click="handleReset">清空</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="tables">
      <!-- <a-input /> -->
      <a-table :dataSource="data"
               :columns="columns"
               :rowKey:="data.key"
               :locale="{emptyText: '暂无数据'}">
        <div slot="authorization"
             slot-scope="text, record">
          <span v-if="record.account === 'admin'">超级账号</span>
          <div v-if="record.account !== 'admin'">
            <span v-for="(authorization, index) in record.authorization"
                  :key="index">{{menuArr[authorization * 1 - 1]}}{{index + 1 == record.authorization.length ? '' : '、'}}</span>
          </div>
        </div>
        <span slot="createdId"
              slot-scope="text, record">{{record.account === 'admin' ? 'admin' : text.account}}</span>
        <span slot="changeId"
              slot-scope="text, record">{{record.account === 'admin' ? 'admin' : text.account}}</span>
        <span slot="createAt"
              slot-scope="text">{{text | formatDateMinSec}}</span>
        <span slot="updateAt"
              slot-scope="text">{{text | formatDateMinSec}}</span>
        <div slot="operation"
             slot-scope="text, record">
          <a v-if="record.account !== 'admin'"
             class="right_gap"
             href="javascript:;"
             @click="editItems(record)">编辑</a>
          <a-popconfirm v-if="record.account !== 'admin'"
                        title="确定删除这条信息吗？"
                        okText="确定"
                        cancelText="取消"
                        @confirm="() => onDelete(record._id)">
            <a href="javascript:;">删除</a>
          </a-popconfirm>
        </div>
      </a-table>
    </div>
    <a-modal title="Title"
             :visible="visible"
             @ok="handleOk"
             :confirmLoading="confirmLoading"
             @cancel="handleCancel">
      <AddAdmin ref="AddAdmin"
                :record="record"></AddAdmin>
    </a-modal>
  </div>
</template>
<script>
import AddAdmin from './AddAdmin'
import StaticData from '../../Share/StaticData.js'

export default {
  data () {
    return {
      form: this.$form.createForm(this),
      data: [],
      queryParams: {},
      menuArr: [],
      columns: [
        {
          title: '账号',
          dataIndex: 'account'
        },
        {
          title: '权限',
          dataIndex: 'authorization',
          scopedSlots: {
            customRender: 'authorization'
          }
        },
        {
          title: '创建人',
          dataIndex: 'createdId',
          scopedSlots: {
            customRender: 'createdId'
          }
        },
        {
          title: '上一次修改人',
          dataIndex: 'changeId',
          scopedSlots: {
            customRender: 'changeId'
          }
        },
        {
          title: '创建时间',
          dataIndex: 'createAt',
          scopedSlots: {
            customRender: 'createAt'
          }
        },
        {
          title: '更新时间',
          dataIndex: 'updateAt',
          scopedSlots: {
            customRender: 'updateAt'
          }
        },
        {
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: {
            customRender: 'operation'
          }
        }
      ],
      visible: false,
      confirmLoading: false,
      record: ''
    }
  },
  components: {
    AddAdmin
  },
  created () {
    this.menuArr = StaticData.menuList.map(item => {
      return item.name
    })
  },
  mounted () {
    this.getList()
  },
  methods: {
    // 获得Admin列表
    getList: async function () {
      const params = {
        paging: {
          page: 1,
          limit: 10
        },
        filters: {
          account: JSON.stringify(this.queryParams) !== '{}' ? this.queryParams.account : ''
        }
      }
      let url = this.api.adminList
      const res = await this.$http.post(url, params)
      if (res.status_code === 200) {
        this.data = res.data.data
        for (let i = 0; i < this.data.length; i++) {
          this.data[i].key = this.data[i]._id
        }
      }
    },
    handleSearch (e) {
      e.preventDefault()
      this.form.validateFields((values) => {
        this.queryParams = values
      })
      this.getList()
    },
    handleReset (clearFilters) {
      this.form.resetFields()
      this.queryParams = {}
      this.getList()
    },
    // 编辑
    editItems (record) {
      this.record = record
      this.visible = true
    },
    // 删除
    onDelete (adminId) {
      this.deleteBlog(adminId)
    },
    // 删除方法
    deleteBlog: async function (adminId) {
      let url = this.api.deleteAdmin
      const res = await this.$http.get(url, {
        adminId: adminId
      })
      if (res.status_code === 200) {
        this.$notification.success({
          placement: 'bottomRight',
          description: '删除成功！'
        })
        this.getList()
      }
    },
    addAdmin () {
      this.record = ''
      this.visible = true
    },
    handleOk: async function (e) {
      this.confirmLoading = true
      this.$refs.AddAdmin.sublimt()
      let loginForm = this.$store.state.loginForm
      if (this.record) {
        loginForm['_id'] = this.record._id
      }
      let url = this.api.AddAdmin
      const res = await this.$http.post(url, loginForm)
      if (res.status_code === 200) {
        this.$refs.AddAdmin.resetForm()
        this.visible = false
        this.confirmLoading = false
        this.getList()
      } else {
        this.confirmLoading = false
      }
    },
    handleCancel (e) {
      this.$refs.AddAdmin.resetForm()
      this.visible = false
    }
  }
}
</script>
