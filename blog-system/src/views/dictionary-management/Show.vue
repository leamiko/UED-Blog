<template>
  <div>
    <a-tree showLine :defaultExpandedKeys="['0-0-0']" @select="onSelect" >
      <a-tree-node :key="treeData[0]._id">
        <span slot="title" style="color: #1890ff">{{treeData[0].name}}</span>
        <a-tree-node :title="item.name" :key="item._id" v-for="item in treeData[0].children">
          <a-tree-node :title="items.name" :key="items._id" v-for="items in item.children"/>
        </a-tree-node>
      </a-tree-node>
    </a-tree>
  </div>
</template>

<script>
const BASE_URL = 'http://ued.lunz.cn/api/'
export default {
  data () {
    return {
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      treeData: []
    }
  },
  methods: {
    onSelect (selectedKeys, info) {
      // console.log('selected', selectedKeys, info)
    },
    async getTree (id) {
      const params = {
        _id: id
      }
      const blogURL = BASE_URL + 'dictionary/GetDictionaryTree'
      const res = await this.$http.post(blogURL, params)
      console.log(res)
      if (res.status_code === 200) {
        this.loading = false
        this.treeData = res.data
      } else {
        this.loading = false
        this.$notification['error']({
          message: '字典管理',
          placement: 'bottomRight',
          description: res.message
        })
      }
    }
  },
  mounted () {
    this.getTree(this.$route.query.key)
  }
}
</script>
