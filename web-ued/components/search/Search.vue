<template>
  <div class="cus-flex">
    <el-input v-if="!isAsync" class="input_content" v-model="value" :placeholder="placeholder"></el-input>
    <el-select v-if="isAsync" class="input_content" v-model="selectValue" filterable :placeholder="placeholder"
      remote :remote-method="remoteMethod" :loading="loading" @change="goDetail" :no-data-text="'暂无数据'">
      <el-option v-for="item in options" :key="item._id" :label="item.title" :value="item._id">
      </el-option>
    </el-select>
    &emsp;&emsp;<el-button type="primary" class="search_btn" round @click="emit()"> &emsp;&emsp;搜&nbsp;索&emsp;&emsp; </el-button>
  </div>
</template>
<script>
export default {
  props: {
    placeholder: {
      default: '有Bug，这里搜～',
      type: String,
      required: false
    },
    value: {
      default: '',
      type: String,
      required: false
    },
    isAsync: {
      default: false,
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      options: [],
      selectValue: [],
      loading: false
    }
  },
  mounted() {},
  methods: {
    emit() {
      if (!this.isAsync) {
        this.$emit('search', this.value);
      } else {
        this.$emit('select', this.selectValue);
      }
    },
    async remoteMethod(query) {
      if (query) {
        this.loading = true;
        const parmas = {
          pageIndex: 1,
          filters:{
            title: query
          }
        };
        const res = await this.$axios.post(`${process.env.BASE_URL}/web_api/GetBugList`, parmas);
        if (res.status === 200 && res.data.message === 'success') {
          this.loading = false;
          if (res.data.data && res.data.data.length > 0) {
            this.options = res.data.data;
          } else {
            this.options = [];
          }
        } else {
          this.loading = false;
          this.$notify.error({
            title: '错误',
            message: res.data.message
          });
        }
      } else {
        this.options = [];
      }
    },
    goDetail(el) {
      this.$router.push({
        path: '/coding/detail',
        query: {
          bugId: el
        }
      });
    }
  }
}
</script>
<style lang="scss" scoped>
.input_content {
  width: 100%;
  overflow: hidden;
  border-radius: 8px;
  border: 1.5px solid #3376ff;
}

.search_btn {
  border-radius: 23px;
}
</style>>
