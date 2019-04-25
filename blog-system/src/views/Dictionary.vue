<template>
  <div class="ant-page">
    <div class="ant-page--head">
      <a-button class="editable-add-btn" @click="handleAdd">Add</a-button>
    </div>
    <div class="ant-page--body scroll-content">
      <a-table :columns="columns" :rowKey="record => record.login.uuid" :dataSource="data" :pagination="pagination" :loading="loading" @change="handleTableChange">
        <template slot="name" slot-scope="name">
          {{name.first}} {{name.last}}
        </template>
      </a-table>
    </div>
    <div class="ant-page--foot"></div>
  </div>
</template>

<script>
const columns = [
  { title: 'Name',
    dataIndex: 'name',
    sorter: true,
    width: '20%',
    scopedSlots: { customRender: 'name' }
  }, {
    title: 'Gender',
    dataIndex: 'gender',
    filters: [
      { text: 'Male', value: 'male' },
      { text: 'Female', value: 'female' }
    ],
    width: '20%'
  }, {
    title: 'Email',
    dataIndex: 'email'
  }
]
export default {
  data () {
    return {
      data: [],
      pagination: {},
      loading: false,
      columns
    }
  },
  mounted () {
    this.fetch()
  },
  methods: {
    handleTableChange (pagination, filters, sorter) {
      console.log(pagination)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.fetch({
        results: pagination.pageSize,
        page: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters
      })
    },
    async fetch (params = {}) {
      console.log('params:', params)
      this.loading = true
      const parma = {
        results: 10,
        ...params
      }
      const result = await this.$http.get('https://randomuser.me/api', { params: parma })
      const pagination = { ...this.pagination }
      pagination.total = result.totalCount
      this.data = result.data.results
      this.loading = false
      this.pagination = pagination
    },
    handleAdd () {
      const { count, dataSource } = this
      const newData = {
        key: count,
        name: `Edward King ${count}`,
        age: 32,
        address: `London, Park Lane no. ${count}`
      }
      this.dataSource = [...dataSource, newData]
      this.count = count + 1
    }
  }
}
</script>

<style lang="scss" scoped>
.scroll-content {
  overflow-y: auto;
}

.ant-page {
  height: 100%;

  .ant-page--body {
    @extend .ant-page
  }

  ::-webkit-scrollbar {
    width:6px;
    height:2px;
    background:white;
    border-radius:10px;
  }

  ::-webkit-scrollbar-thumb{
    display:block;
    width:6px;
    margin:0 auto;
    border-radius: 10px;
    background:#ccc;
  }
}

.demo-loadmore-list {
  min-height: 350px;
}
</style>
