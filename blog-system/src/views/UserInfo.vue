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
      <a-table :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
               :dataSource="data"
               :columns="columns"
               :rowKey:="data.key"
               :locale="{emptyText: '暂无数据'}">
        <template slot="operation"
                  slot-scope="text, record">
          <a class="right_gap"
             @click="editItems(record.key)">编辑</a>
          <a-popconfirm v-if="data.length"
                        title="确定删除这条信息吗？"
                        okText="确定"
                        cancelText="取消"
                        @confirm="() => onDelete(record.key)">
            <a>删除</a>
          </a-popconfirm>
        </template>
      </a-table>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
export default {
  data () {
    return {
      form: this.$form.createForm(this),
      data: [],
      queryParams: {},
      searchText: '',
      searchInput: null,
      selectedRowKeys: [],
      columns: [
        {
          title: '账号',
          dataIndex: 'title'
        },
        {
          title: '权限',
          dataIndex: 'authorization'
        },
        {
          title: '创建人',
          dataIndex: 'createdId'
        },
        {
          title: '上一次修改人',
          dataIndex: 'changeId'
        },
        {
          title: '创建时间',
          dataIndex: 'createAt'
        },
        {
          title: '更新时间',
          dataIndex: 'updatedAt'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: {
            customRender: 'operation'
          }
        }
      ],
      keywordsData: []
    }
  },
  mounted () {
    this.getList()
  },
  computed: {
  },
  methods: {
    // 获得blog列表
    getList: async function () {
      const params = {
        paging: {
          page: 1,
          limit: 10
        },
        filters: {
          account: this.queryParams !== {} ? this.queryParams.account : ''
        }
      }
      let url = this.api.blogList
      const res = await this.$http.post(url, params)
      if (res.status_code === 200) {
        this.data = res.data.data
      }
      for (let i = 0; i < this.data.length; i++) {
        this.data[i].key = this.data[i]._id
        // 数据显示形式的转换
        this.data[i].isGood = this.data[i].isGood ? '是' : '否'
        this.data[i].isAudit = this.data[i].isAudit ? '是' : '否'
        this.data[i].createAt = moment('2019-04-28T06:54:31.914Z').format(
          'YYYY-MM-DD HH:MM'
        )
      }
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
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
    editItems (blogId) {
      this.$router.push({
        name: 'articleAdd',
        query: {
          blogId: blogId
        }
      })
    },
    // 删除
    onDelete (record) {
      this.deleteBlog(record)
    },
    // 删除方法
    deleteBlog: async function (record) {
      let url = this.api.deleteBlog
      const res = await this.$http.get(url, {
        blogId: record
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

    }
  }
}
</script>
