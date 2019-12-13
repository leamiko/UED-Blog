<template>
  <div>
    <div class="add_row">
      <span>正则管理</span>
      <!-- <a-button type="primary" icon="plus" @click="addBlog()">新增</a-button> -->
    </div>
    <!-- 筛选 -->
    <div class="select_block" id="ant-advanced-search-form">
      <a-form class="ant-advanced-search-form" :form="form" @submit="handleSearch">
        <a-row :gutter="24">
          <a-col
            v-for="i in fiedls"
            :key="i.id"
            :span="7"
            :style="{ display: i.id < count ? 'block' : 'none' }"
          >
          <a-form-item v-if="i.id!==4" :label="`${i.name}:`">
              <a-input v-decorator="[ `${i.field}`, { rules: [{ required: false, message: '请输入', }], } ]"  :placeholder="'请选择' + i.name" />
           </a-form-item>
            <a-form-item   v-if="i.id===4" :label="`${i.name}:`">
              <a-select allowClear showSearch  notFoundContent="无匹配项" :placeholder="'请选择' + i.name"
                :tokenSeparators="[',']" @change="handleChange" v-decorator="[ `${i.field}`, { rules: [{required: false, message: '请输入',}] }]">
                <a-select-option v-for="item in statusList" :key="item.id">{{item.name}}</a-select-option>
            </a-select>
           </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24" :style="{ textAlign: 'right' }">
            <a-button type="primary" html-type="submit">查询</a-button>
            <a-button :style="{ marginLeft: '8px' }" @click="handleReset">清空</a-button>
            <a :style="{ marginLeft: '8px', fontSize: '12px' }" @click="toggle">
              {{expand?'折叠':'展开'}}
              <a-icon :type="expand ? 'up' : 'down'" />
            </a>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="tables">
      <!-- <a-input /> -->
      <a-table
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        :dataSource="data"
        :columns="columns"
        :rowKey:="data.key"
        :locale="{emptyText: '暂无数据'}"
        :loading="loading"
      >
        <template slot="operation" slot-scope="text, record">
          <a class="right_gap" @click="showItems(record.key)">查看</a>
          <a class="right_gap" @click="editItems(record.key)">编辑</a>
          <a-popconfirm
            v-if="data.length"
            title="确定删除这条信息吗？"
            okText="确定"
            cancelText="取消"
            @confirm="() => onDelete(record.key)"
          >
            <a>删除</a>
          </a-popconfirm>
        </template>
      </a-table>
    </div>
  </div>
</template>
<script>
import moment from "moment";
export default {
  data() {
    return {
      loading:false,
      expand: false,
      form: this.$form.createForm(this),
      fiedls: [
        {
          id: 1,
          name: '名称',
          field: 'regularName',
        },
        {
          id: 2,
          name: '描述',
          field: 'regularDescribe',
        },
        {
          id: 3,
          name: '表达式',
          field: 'regular',
        },
        {
          id: 4,
          name: '状态',
          field: 'status',
        },
        {
          id: 5,
          name: '分类',
          field: 'regularCategory',
        }],
      data: [],
      queryParams: {},
      searchText: "",
      searchInput: null,
      selectedRowKeys: [],
      columns: [
        {
          title: '名称',
          dataIndex: 'regularName'
        },
          {
          title: '描述',
          dataIndex: 'regularDescribe'
        },
         {
          title: '表达式',
          dataIndex: 'regular'
        },
           {
          title: '状态',
          dataIndex: 'status'
        },
        {
          title: '分类',
          dataIndex: 'regularCategory',
        },
        {
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: {
            customRender: 'operation'
          }
        }
      ],
      keywordsData: [],
      authorList: [],
      statusList: [
       {id: 0,name: '未审核' },
       {id: 1,name: '已审核' }]
    }
  },
  mounted () {
    this.getList()
  },
  computed: {
    count () {
      return this.expand ? 6 : 4
    }
  },
  methods: {
    // 获得blog列表
    getList: async function () {
      this.loading = true
      const params = {
        filters: {
          regularName: this.form.getFieldValue('regularName') ? this.form.getFieldValue('regularName') : '',
          regularDescribe: this.form.getFieldValue('regularDescribe') ? this.form.getFieldValue('regularDescribe') : '',
          regular: this.form.getFieldValue('regular') ? this.form.getFieldValue('regular') : '',
          status: this.form.getFieldValue('status') ? this.form.getFieldValue('status') : '',
          regularCategory: this.form.getFieldValue('regularCategory') ? this.form.getFieldValue('regularCategory') : ''
        }
      }
      let url = this.api.getRegularList
      const res = await this.$http.post(url, params)
      if (res.status_code === 200) {
        this.loading = false
        this.data = res.data
        if (res.data.data && res.data.data.length && res.data.data.length > 0) {
          this.data = res.data.data.map(item => {
            item['key'] = item['_id']  
          })
        }
      } else {
        this.loading = false
        this.error(res.message)
      }
    },

    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    handleSearch (e) {
      e.preventDefault()
      this.getList()
    },
    handleReset (clearFilters) {
      this.form.resetFields()
      this.getList()
    },
    handleChange (e) {
      this.cacheKeywords = e
    },
    // 展开折叠查询项
    toggle () {
      this.expand = !this.expand
    },
    // 查看
    showItems (blogId) {
      this.$router.push({
        name: 'articleShow',
        query: {
          blogId: blogId
        }
      })
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
    addBlog () {
      this.$router.push({
        name: 'articleAdd'
      })
    }
  }
}
</script>
