<template>
  <div>
    <div class="add_row">
      <span>文章管理</span>
      <a-button type="primary"
                icon="plus"
                @click="addBlog()">新增</a-button>
    </div>
    <!-- 筛选 -->
    <div class="select_block"
         id="ant-advanced-search-form">
      <a-form class="ant-advanced-search-form"
              :form="form"
              @submit="handleSearch">
        <a-row :gutter="24">
          <a-col v-for="i in fiedls"
                 :key="i.id"
                 :span="7"
                 :style="{ display: i.id < count ? 'block' : 'none' }">
            <a-form-item v-if="i.name!=='分类' && i.name!=='精选' && i.name!=='审核'"
                         :label="`${i.name}`">
              <a-input v-decorator="[
                  `${i.field}`,
                  {
                    rules: [
                      {
                        required: false,
                        message: 'Input something!'
                      }
                    ]
                  }
                ]"
                       v-bind:placeholder="'请输入' + i.name" />
            </a-form-item>
            <a-form-item v-if="i.name==='分类'"
                         :label="`${i.name}`">
              <a-select mode="multiple"
                        notFoundContent="无匹配项"
                        v-bind:placeholder="'请选择' + i.name"
                        :tokenSeparators="[',']"
                        @change="handleChange"
                        v-decorator="[
            `${i.field}`,
            {
                rules: [{
                required: false, message: '请输入分类!',
                }]
            }
            ]">
                <a-select-option v-for="item in keywordsData"
                                 :key="item">{{item}}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item v-if="i.name==='精选'"
                         :label="`${i.name}`">
              <a-select v-decorator="[
                `${i.field}`,
                {
                  rules: [{
                    required: false,
                    message: 'Input something!',
                  }],
                }
              ]"
                        style="width: 120px"
                        v-bind:placeholder="'请选择'">
                <a-select-option value="false">否</a-select-option>
                <a-select-option value="true">是</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item v-if="i.name==='审核'"
                         :label="`${i.name}`">
              <a-select v-decorator="[
                `${i.field}`,
                {
                  rules: [{
                    required: false,
                    message: 'Input something!',
                  }],
                }
              ]"
                        style="width: 120px"
                        v-bind:placeholder="'请选择'">
                <a-select-option value="false">否</a-select-option>
                <a-select-option value="true">是</a-select-option>
              </a-select>
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
            <a :style="{ marginLeft: '8px', fontSize: '12px' }"
               @click="toggle">
              {{expand?'折叠':'展开'}}
              <a-icon :type="expand ? 'up' : 'down'" />
            </a>
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
             @click="showItems(record.key)">查看</a>
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
      expand: false,
      form: this.$form.createForm(this),
      fiedls: [
        { id: 1, name: '名称', field: 'title' },
        { id: 2, name: '作者', field: 'author' },
        { id: 3, name: '分类', field: 'blogType' },
        { id: 4, name: '精选', field: 'isGood' },
        { id: 5, name: '审核', field: 'isAudit' }
      ],
      data: [],
      queryParams: {},
      searchText: '',
      searchInput: null,
      selectedRowKeys: [],
      columns: [
        {
          title: '名称',
          dataIndex: 'title'
        },
        {
          title: '分类',
          dataIndex: 'blogType',
          scopedSlots: {
            customRender: 'blogType'
          }
        },
        {
          title: '作者',
          dataIndex: 'author'
        },
        {
          title: '点赞数',
          dataIndex: 'likeNum',
          scopedSlots: {
            customRender: 'likeNum'
          }
        },
        {
          title: '精选',
          dataIndex: 'isGood',
          scopedSlots: {
            customRender: 'isGood'
          }
        },
        {
          title: '审核',
          dataIndex: 'isAudit',
          scopedSlots: {
            customRender: 'isAudit'
          }
        },
        {
          title: '创建时间',
          dataIndex: 'createAt'
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
    count () {
      return this.expand ? 6 : 4
    }
  },
  methods: {
    // 下拉框选择分类
    // handleChange (value) {
    //   console.log(`selected ${value}`)
    //   this.blogType = value
    // },
    // handleBlur () {
    //   console.log('blur')
    // },
    // handleFocus () {
    //   console.log('focus')
    // },
    // filterOption (input, option) {
    //   return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    // },

    // 查询
    // handleSearch (e) {
    //   e.preventDefault()
    //   this.form.validateFields((error, values) => {
    //     if (values.title === undefined) {
    //       values.title = ''
    //     };
    //     const params = {
    //       paging: {
    //         page: 1,
    //         limit: 10
    //       },
    //       filters: {
    //         title: values.title,
    //         blogType: this.blogType
    //       }
    //     }
    //     this.getList(params)
    //   })
    // },

    // 重置
    // handleReset () {
    //   this.form.resetFields()
    //   this.placeholder = 'Select a blogType'
    //   const params = {
    //     paging: {
    //       page: 1,
    //       limit: 10
    //     },
    //     filters: {
    //       title: '',
    //       blogType: ''
    //     }
    //   }
    //   this.getList(params)
    // },

    // 获得blog列表
    getList: async function () {
      const params = {
        paging: {
          page: 1,
          limit: 10
        },
        filters: {
          title: this.queryParams !== {} ? this.queryParams.title : '',
          author: this.queryParams !== {} ? this.queryParams.author : '',
          blogType: this.queryParams !== {} ? this.queryParams.blogType : '',
          isGood: this.queryParams !== {} ? this.queryParams.isGood : '',
          isAudit: this.queryParams !== {} ? this.queryParams.isAudit : ''
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
    handleChange (e) {
      console.log(e)
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
      this.$router.push({ name: 'articleAdd' })
    }
  }
}
</script>
