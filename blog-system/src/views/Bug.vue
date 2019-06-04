<template>
  <div>
    <div class="add_row">
      <span>Bug管理</span>
      <a-button type="primary"
                icon="plus"
                @click="addBug()">新增</a-button>
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
            <a-form-item v-if="i.name!=='状态' && i.name!=='关键词'"
                         :label="`${i.name}`">
              <a-input v-decorator="[
                `${i.field}`,
                {
                  rules: [{
                    required: false,
                    message: 'Input something!',
                  }],
                }
              ]"
                       v-bind:placeholder="'请输入' + i.name" />
            </a-form-item>
            <a-form-item v-if="i.name==='关键词'"
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
                required: false, message: '请输入关键词!',
                }]
            }
            ]">
                <a-select-option v-for="item in keywordsData"
                                 :key="item">
                  {{item}}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item v-if="i.name==='状态'"
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
                        style='width: 120px'
                        v-bind:placeholder="'请选择' + i.name">
                <a-select-option value="false">未解决</a-select-option>
                <a-select-option value="true">已解决</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24"
                 :style="{ textAlign: 'right' }">
            <a-button type="primary"
                      html-type="submit">
              查询
            </a-button>
            <a-button :style="{ marginLeft: '8px' }"
                      @click="handleReset">
              清空
            </a-button>
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
               :rowKey:="data.key">
        <span slot="keyword"
              slot-scope="keyword">
          <a-tag v-for="tag in keyword"
                 color="blue"
                 :key="tag">{{tag}}</a-tag>
        </span>
        <span slot="bugStatus"
              slot-scope="bugStatus"
              :class="{'statusTrue':bugStatus=='已解决','statusFalse':bugStatus=='未解决'}">
          {{bugStatus}}
        </span>
        <template slot="operation"
                  slot-scope="text, record">
          <a class="right_gap"
             @click="showItems(record)">查看</a>
          <a class="right_gap"
             @click="editItems(record)">编辑</a>
          <a-popconfirm v-if="data.length"
                        title="Sure to delete?"
                        @confirm="() => onDelete(record.key)">
            <a>删除</a>
          </a-popconfirm>

        </template>
      </a-table>
    </div>

  </div>

</template>

<script>
export default {
  data () {
    return {
      expand: false,
      form: this.$form.createForm(this),
      fiedls: [
        { id: 1, name: '名称', field: 'title' },
        { id: 2, name: '关键词', field: 'keyword' },
        { id: 3, name: '状态', field: 'bugStatus' },
        { id: 4, name: '作者', field: 'author' }
      ],
      data: [],
      queryParams: {},
      status: [],
      searchText: '',
      searchInput: null,
      selectedRowKeys: [],
      columns: [{
        title: '名称',
        dataIndex: 'title',
        onFilter: (value, record) => record.name.toLowerCase().includes(value.toLowerCase())
      }, {
        title: '关键词',
        dataIndex: 'keyword',
        scopedSlots: {
          customRender: 'keyword'
        }
      },
      {
        title: '状态',
        dataIndex: 'bugStatus',
        scopedSlots: {
          customRender: 'bugStatus'
        }
      },
      {
        title: '作者',
        dataIndex: 'author'
      },
      {
        title: '采用数',
        dataIndex: 'useNum',
        sorter: true
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
    this.getList();
    this.getBugKeywords();
  },
  computed: {
    count () {
      return this.expand ? 6 : 4
    }
  },
  methods: {
    // 获得bug列表
    getList: async function () {
      let url = this.api.bugList
      const res = await this.$http.post(url, this.queryParams)
      console.log(res)
      // this.data = res.Data
      this.data = res.data
      for (let i = 0; i < this.data.length; i++) {
        this.data[i].key = this.data[i]._id
        // this.renderStatus(this.data[i].bugStauts );
        this.data[i].bugStatus = this.data[i].bugStatus ? '已解决' : '未解决'
      }
      console.log(this.data)
    },
    onSelectChange (selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    handleSearch (e) {
      e.preventDefault();
      this.form.validateFields((error, values) => {
        console.log('error', error);
        console.log('Received values of form: ', values);
        this.queryParams.filters = values;
      });
      this.getList();
    },
    handleReset (clearFilters) {
      this.form.resetFields();
      this.queryParams.filters = {};
      this.getList();
    },
    // 获取bug的关键词
    getBugKeywords: async function (data) {
      const res = await this.$http.get(this.api.getBugKeywords);
      if (res.message == 'success') {
        console.log(res);
        let managedData = res.data.map((el) => {
          return el.label;
        })
        this.keywordsData = managedData
      }
    },
    handleChange (e) {
      console.log(e);
      this.cacheKeywords = e;
    },
    renderStatus (status) {
      if (status) {
        status = '已解决'
      } else {
        status = '未解决'
      }
      return status
    },
    // 点击删除
    onDelete (record) {
      this.deleteBug(record)
    },
    // 删除方法
    deleteBug: async function (data) {
      let url = this.api.deleteBug
      const res = await this.$http.post(url, {
        id: data
      })
      if (res.message === 'success') {

      }
      console.log(res)
    },

    // 点击编辑
    editItems (record) {
      this.$router.push({
        path: `/bug/edit/${record._id}`
      })
    },
    // 新增bug
    addBug () {
      this.$router.push({
        name: 'add'
      })
    },
    // 查看bug
    showItems (record) {
      this.$router.push({
        path: `/bug/bugShow/${record._id}`
      })
    },
    toggle () {
      this.expand = !this.expand
    }
  },

}
</script>

<style scoped>
.statusTrue {
  color: #30cc45;
}
.statusFalse {
  color: #fe3401;
}
</style>
