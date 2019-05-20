<template>
  <div>
    <div class="add_row">
      <span>Bug管理</span>
      <a-button type="primary" icon="plus" @click="addBug()">新增</a-button>
    </div>
    <!-- 筛选 -->
    <div class="select_block" id="ant-advanced-search-form">
      <a-form class="ant-advanced-search-form" :form="form" @submit="handleSearch">
        <a-row :gutter="24">
          <a-col v-for="i in 6" :key="i" :span="8" :style="{ display: i < count ? 'block' : 'none' }">
            <a-form-item :label="`Field ${i}`">
              <a-input v-decorator="[
                  `field-${i}`,
                  {
                    rules: [
                      {
                        required: true,
                        message: 'Input something!'
                      }
                    ]
                  }
                ]" placeholder="placeholder" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24" :style="{ textAlign: 'right' }">
            <a-button type="primary" html-type="submit">
              查询
            </a-button>
            <a-button :style="{ marginLeft: '8px' }" @click="handleReset">
              清空
            </a-button>
            <a :style="{ marginLeft: '8px', fontSize: '12px' }" @click="toggle">
              折叠
              <a-icon :type="expand ? 'up' : 'down'" />
            </a>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="tables">
      <!-- <a-input /> -->
      <a-table :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" :dataSource="data"
        :columns="columns" :rowKey:="data.key">
        <template slot="operation" slot-scope="text, record">
          <a class="right_gap" @click="showItems(record)">查看</a>
          <a class="right_gap" @click="editItems(record)">编辑</a>
          <a-popconfirm v-if="data.length" title="Sure to delete?" @confirm="() => onDelete(record.key)">
            <a>删除</a>
          </a-popconfirm>

        </template>
      </a-table>
    </div>

  </div>

</template>

<script>
  export default {
    data() {
      return {
        expand: false,
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
          },
          //  {
          //   title: '内容',
          //   dataIndex: 'content',
          //   onFilter: (value, record) => record.address.toLowerCase().includes(value.toLowerCase()),
          // },
          {
            title: '状态',
            dataIndex: 'bugStatus'
          },
          // {
          //   title: '解决方案',
          //   dataIndex: 'bugSolution'
          // },
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
    computed: {
      count() {
        return this.expand ? 7 : 4;
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
          this.data[i].bugStatus = this.data[i].bugStatus ? '已解决' : '未解决'
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
      renderStatus(status) {
        if (status) {
          status = '已解决'
        } else {
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
        if (res.message == 'success') {

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
      },
      toggle() {
        this.expand = !this.expand;
      },
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
