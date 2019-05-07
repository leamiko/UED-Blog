<template>
  <div>
    <a-button type="primary" @click="addBug()">新增</a-button>
    <!-- <a-input /> -->
    <a-table :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" :dataSource="data"
      :columns="columns" :rowKey:="data.key">
      <template slot="operation" slot-scope="text, record">
        <a @click="showItems(record)">查看</a>
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
            onFilter: (value, record) => record.name.toLowerCase().includes(value.toLowerCase()),
          }, {
            title: '关键词',
            dataIndex: 'keyword',
            scopedSlots: {
              customRender: 'customRender',
            },
            onFilter: (value, record) => record.age.toLowerCase().includes(value.toLowerCase()),
          }, {
            title: '内容',
            dataIndex: 'content',
            onFilter: (value, record) => record.address.toLowerCase().includes(value.toLowerCase()),
          },
          {
            title: '状态',
            dataIndex: 'bugStatus'
          },
          {
            title: '解决方案',
            dataIndex: 'bugSolution'
          },
          {
            title: '作者',
            dataIndex: 'author'
          },
          {
            title: '采用数',
            dataIndex: 'useNum'
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
      // 获得bug列表
      getList: async function () {
        let url = this.api.bugList;
        const res = await this.$http.post(url);
        console.log(res);
        this.data = res.Data; 
        for (let i = 0; i < this.data.length; i++) {
         this.data[i].key = this.data[i]._id;
        // this.renderStatus(this.data[i].bugStauts );
         this.data[i].bugStatus = this.data[i].bugStatus  ? '已解决' : '未解决'
        }
        console.log(this.data);
      },
      onSelectChange(selectedRowKeys) {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.selectedRowKeys = selectedRowKeys
      },
      handleSearch(selectedKeys, confirm) {
        confirm()
        this.searchText = selectedKeys[0]
      },

      handleReset(clearFilters) {
        clearFilters()
        this.searchText = ''
      },
      renderStatus(status){
        if(status){
           status = '已解决'
        } else{
          status = '未解决'
        }
        return status;
      },
      // 点击删除
      onDelete(record) {
        this.deleteBug(record);
      },
      // 删除方法
      deleteBug: async function (data) {
        let url = this.api.deleteBug;
        const res = await this.$http.post(url, {
          id: data
        });
        if(res.message == 'success'){
          
        }
        console.log(res);
      },

      // 点击编辑
      editItems(record) {
        this.$router.push({
          name: 'edit',
          params: {
            entity: record
          }
        });

      },
      // 新增bug
      addBug() {
        this.$router.push({
          name: 'add'
        });
      },
      // 查看bug
      showItems(record) {
        this.$router.push({
          name: 'bugShow',
          params: {
            entity: record
          }
        })
      }
    },
    mounted() {
      this.getList();
    }
    // data() {
    //   return {
    //     sites: [{
    //       title: '',
    //       content: ''
    //     }, ]
    //   }
    // },
    // methods: {
    //    getList() {
    //   this.$ajax.post('/bugs/GetBugList').then((res) => {
    //     console.log('data', res.data.Data);
    //     this.data = res.data.Data;
    //   })
    // },


    //   deleteBug: async function (data) {
    //     let id = '5cb3e10d65b60425a44005c6'
    //     let url = this.api.deleteBug;
    //     const res = await this.$http.post(url, {
    //       id: id
    //     });
    //     console.log(res);
    //   },

    //   updateBug: async function(){
    //     let id = this.sites[0]._id;
    //     let url = this.api.updateBug;
    //     let params = {
    //       id: id,
    //       title: '我是修改后的title',
    //       content: '我是修改后的content'
    //     }; 
    //     const res = await this.$http.post(url, params);
    //   }
    // }

  }
</script>

<style>

</style>
