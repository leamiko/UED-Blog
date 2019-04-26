<template>
  <div class="ant-page scroll-content">
    <div id="components-form-demo-advanced-search">
        <a-form class="ant-advanced-search-form" :form="form" @submit="handleSearch">
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item v-bind="formItemLayout" :label="`名称:`">
                <a-input v-decorator="[ `title`, { rules: [{ required: false, message: 'Input something!', }], } ]" placeholder="请输入"/>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item v-bind="formItemLayout" :label="`关键词：`">
                <a-input v-decorator="[ `keyword`, { rules: [{ required: false, message: 'Input something!', }], } ]" placeholder="请输入"/>
              </a-form-item>
            </a-col>
            <a-col :span="12" :style="{'display': count == 3 ? 'none' : 'block'}">
              <a-form-item v-bind="formItemLayout" :label="`状态：`">
                <a-input v-decorator="[ `bugStatus`, { rules: [{ required: false, message: 'Input something!', }], } ]" placeholder="请输入"/>
              </a-form-item>
            </a-col>
            <a-col :span="12" :style="{'display': count == 3 ? 'none' : 'block'}">
              <a-form-item v-bind="formItemLayout" :label="`作者：`">
                <a-input v-decorator="[ `author`, { rules: [{ required: false, message: 'Input something!', }], } ]" placeholder="请输入"/>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="12" :style="{ textAlign: 'left' }">
              <a-button type="primary" icon="plus"> 新建 </a-button> &emsp;
              <a-button> 批量操作 </a-button> &emsp;
              <a-dropdown :trigger="['click']">
                <a-menu slot="overlay" @click="handleMenuClick">
                  <a-menu-item key="1"> 操作1 </a-menu-item>
                  <a-menu-item key="2"> 操作2 </a-menu-item>
                  <a-menu-item key="3"> 操作3 </a-menu-item>
                </a-menu>
                <a-button> 更多操作 <a-icon type="down" />
                </a-button>
              </a-dropdown>
            </a-col>
            <a-col :span="12" :style="{ textAlign: 'right' }">
              <a-button type="primary" html-type="submit"> 查询 </a-button>
              <a-button :style="{ marginLeft: '8px' }" @click="handleReset" > 重置 </a-button>
              <a :style="{ marginLeft: '8px', fontSize: '12px' }" @click="toggle" > {{expand ? '收起' : '展开'}} <a-icon :type="expand ? 'up' : 'down'" /></a>
            </a-col>
          </a-row>
        </a-form>
        <div class="search-result-list scroll-content">
          <a-table :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" :dataSource="data" :columns="columns" :rowKey:="data.key" :loading="loading">
            <template slot="operation" slot-scope="text, record">
              <a @click="editItems(record)">编辑</a>
              <a-popconfirm v-if="data.length" title="Sure to delete?" @confirm="() => onDelete(record.key)">
                <a>删除</a>
              </a-popconfirm>
            </template>
          </a-table>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      expand: false,
      count: 3,
      form: this.$form.createForm(this),
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 4 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
      },
      data: [],
      status: [],
      searchText: '',
      searchInput: null,
      selectedRowKeys: [],
      columns: [
        {
          title: '名称',
          dataIndex: 'title',
        },
        {
          title: '关键词',
          dataIndex: 'keyword',
        },
        {
          title: '内容',
          dataIndex: 'content',
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
          }
        }
      ]
    };
  },
  methods: {
    handleMenuClick(e) {
      console.log('click', e);
    },
    handleSearch  (e) {
      e.preventDefault();
      this.form.validateFields((error, values) => {
        console.log('error', error);
        console.log('Received values of form: ', values);
      });
    },

    handleReset() {
      this.form.resetFields();
    },

    toggle() {
      if (this.expand) {
        this.count = 3;
      } else {
        this.count = 5;
      }
      this.expand = !this.expand;
    },
    // 获得列表
    async getList() {
      this.loading = true;
      const url = this.api.bugList;
      const params = {
        paging: {
            page: 1,
            limit: 10
        },
        filters: {
            title: '',
            blogType: ''
        }
      };
      const blogURL = 'http://ued.lunz.cn/api//bugs/GetBugList';
      const res = await this.$http.post(blogURL, params);
      console.log(res);
      if(res.Data) {
        this.loading = false;
        this.data = res.Data;
      } else {
        this.loading = false;
        this.$notification['error']({
          message: '错误',
          placement: 'bottomRight',
          description: res.msg,
        });
        return;
      }
      if (this.data && this.data.length && this.data.length > 0) {
        for(let item of this.data){
          item['key'] = item['_id'];
          item['bugStatus'] = item['bugStatus'] ? '已解决' : '未解决';
        }
      }
    },
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },
    // 点击删除
    async onDelete(record) {
      let url = this.api.deleteBug;
      const res = await this.$http.post(url, {
        id: record
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
  },
  mounted() {
    this.getList();
  }
};
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
