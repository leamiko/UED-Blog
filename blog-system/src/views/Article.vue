<template>
  <div>
    <a-button type="primary" @click="addBug()">新增</a-button>
    <!-- <a-input /> -->
    <a-table :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" :dataSource="data"
      :columns="columns" :rowKey:="data.key">
      <template slot="operation" slot-scope="text, record">
        <a @click="editItems(record)">编辑</a>
        <a-popconfirm v-if="data.length" title="Sure to delete?" @confirm="() => onDelete(record.key)">
          <a>删除</a>
        </a-popconfirm>
      </template>
    </a-table>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        data: [],
        status: [],
        searchText: '',
        searchInput: null,
        selectedRowKeys: [],
        columns: [{
            title: '名称',
            dataIndex: 'title',
          }, {
            title: '分类',
            dataIndex: 'blogType',
            scopedSlots: {
              customRender: 'customRender',
            },
          }, {
            title: '简介',
            dataIndex: 'info',
          },
          {
            title: '内容',
            dataIndex: 'content'
          },
          {
            title: '操作',
            dataIndex: 'operation',
            scopedSlots: {
              customRender: 'operation'
            },
          },
        ],
      }
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
              title: '123',
              blogType: '123'
          }
        }
        let url = this.api.blogList;
        const res = await this.$http.post(url, { params: params });
        this.data = res.data.Data;
        for (let i = 0; i < this.data.length; i++) {
         this.data[i].key = this.data[i]._id;
        }
        console.log(this.data);
      },
      onSelectChange(selectedRowKeys) {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.selectedRowKeys = selectedRowKeys
      },
      // 删除
      onDelete(record) {
        this.deleteBlog(record);
      },
      // 删除方法
      deleteBlog: async function (data) {
        let url = this.api.deleteBlog;
        const res = await this.$http.post(url, {
          id: data
        });
        console.log(res);
      },
    },
    mounted() {
      this.getList();
    }
  }
</script>

<style>

</style>
