<template>
  <div class="ant-page scroll-content">
    <div id="components-form-demo-advanced-search">
      <a-form
        class="ant-advanced-search-form"
        :form="form"
        @submit="handleSearch"
      >
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item
              v-bind="formItemLayout"
              :label="`名称:`"
            >
              <a-input
                v-decorator="[ `title`, { rules: [{ required: false, message: 'Input something!', }], } ]"
                placeholder="请输入"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              v-bind="formItemLayout"
              :label="`分类：`"
            >
              <!-- <a-input v-decorator="[ `blogType`, { rules: [{ required: false, message: 'Input something!', }], } ]" placeholder="请输入"/> -->
              <a-select
                v-model="placeholder"
                showSearch
                allowClear
                optionFilterProp="children"
                style="width: 200px"
                @focus="handleFocus"
                @blur="handleBlur"
                @change="handleChange"
                :filterOption="filterOption"
              >
                <a-select-option
                  v-for="i in blogTypeArr"
                  :key="i"
                >{{i}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col
            :span="12"
            :style="{ textAlign: 'left' }"
          >
            <a-button
              type="primary"
              icon="plus"
            > 新建 </a-button> &emsp;
          </a-col>
          <a-col
            :span="12"
            :style="{ textAlign: 'right' }"
          >
            <a-button
              type="primary"
              html-type="submit"
            > 查询 </a-button>
            <a-button
              :style="{ marginLeft: '8px' }"
              @click="handleReset"
            > 重置 </a-button>
            <!-- <a :style="{ marginLeft: '8px', fontSize: '12px' }" @click="toggle" > {{expand ? '收起' : '展开'}} <a-icon :type="expand ? 'up' : 'down'" /></a> -->
          </a-col>
        </a-row>
      </a-form>
      <div class="search-result-list scroll-content">
        <a-table
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
          :dataSource="data"
          :columns="columns"
          :rowKey:="data.key"
          :loading="loading"
        >
          <template
            slot="operation"
            slot-scope="text, record"
          >
            <a @click="showItems(record.key)">查看 </a>
            <a @click="editItems(record)">编辑 </a>
            <a-popconfirm
              v-if="data.length"
              title="Sure to delete?"
              @confirm="() => onDelete(record.key)"
            >
              <a>删除</a>
            </a-popconfirm>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  data () {
    return {
      loading: false,
      expand: false,
      count: 3,
      form: this.$form.createForm(this),
      formItemLayout: {
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
      blogTypeArr: ['CSS', 'TS', 'VUE', 'JS', 'HTML', '前端'],
      blogType: '',
      placeholder: 'Select a blogType',
      status: [],
      searchText: '',
      searchInput: null,
      selectedRowKeys: [],
      columns: [{
        title: '名称',
        dataIndex: 'title',
        width: 100
      }, {
        title: '分类',
        dataIndex: 'blogType',
        width: 100
      }, {
        title: '作者',
        dataIndex: 'author',
        width: 100
      },
      {
        title: '点赞数',
        dataIndex: 'likeNum',
        width: 100
      },
      {
        title: '精选',
        dataIndex: 'isGood',
        width: 100
      },
      {
        title: '审核通过',
        dataIndex: 'isAudit',
        width: 100
      },
      {
        title: '创建时间',
        dataIndex: 'createAt',
        width: 100
      },
      {
        title: '操作',
        dataIndex: 'operation',
        scopedSlots: {
          customRender: 'operation'
        },
        width: 100
      }
      ]
    }
  },
  methods: {
    // 下拉框选择分类
    handleChange (value) {
      console.log(`selected ${value}`)
      this.blogType = value
    },
    handleBlur () {
      console.log('blur')
    },
    handleFocus () {
      console.log('focus')
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },

    // 查询
    handleSearch (e) {
      e.preventDefault()
      this.form.validateFields((error, values) => {
        if (values.title === undefined) {
          values.title = ''
        };
        const params = {
          paging: {
            page: 1,
            limit: 10
          },
          filters: {
            title: values.title,
            blogType: this.blogType
          }
        }
        this.getList(params)
      })
    },

    // 重置
    handleReset () {
      this.form.resetFields()
      this.placeholder = 'Select a blogType'
      const params = {
        paging: {
          page: 1,
          limit: 10
        },
        filters: {
          title: '',
          blogType: ''
        }
      }
      this.getList(params)
    },

    // 获得blog列表
    getList: async function (params) {
      this.loading = true
      let url = this.api.blogList
      const res = await this.$http.post(url, params)
      console.log(res)
      if (res.data) {
        this.loading = false
        this.data = res.data.data
      } else {
        this.loading = false
        this.$notification['error']({
          message: '错误',
          placement: 'bottomRight',
          description: res.message
        })
        return
      }
      for (let i = 0; i < this.data.length; i++) {
        this.data[i].key = this.data[i]._id
        // 数据显示形式的转换
        if (this.data[i].isGood === false) {
          this.data[i].isGood = '否'
        } else {
          this.data[i].isGood = '是'
        }
        if (this.data[i].isAudit === false) {
          this.data[i].isAudit = '否'
        } else {
          this.data[i].isAudit = '是'
        }
        this.data[i].createAt = moment('2019-04-28T06:54:31.914Z').format('YYYY-MM-DD')
      }
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },

    // 查看
    showItems (record) {
      this.$router.push({
        name: 'articleShow',
        query: {
          blogId: record
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
        const params = {
          paging: {
            page: 1,
            limit: 10
          },
          filters: {
            title: '',
            blogType: ''
          }
        }
        this.getList(params)
      }
    }
  },
  mounted () {
    const params = {
      paging: {
        page: 1,
        limit: 10
      },
      filters: {
        title: '',
        blogType: ''
      }
    }
    this.getList(params)
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
    height: calc(100% - 175px);
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
