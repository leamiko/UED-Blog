<template>
  <div class="cus-full-width cus-full-height hidden">
    <my-scrollbar>
      <div slot="container">
        <div class="cus-fixed cus-header">
          <my-header activeLabel="打码"></my-header>
        </div>
        <div class="my-content">
          <el-card class="box-card" header="卡片名称">
            <div v-for="o in 4" :key="o" class="text item">
              {{'列表内容 ' + o }}
            </div>
          </el-card>
        </div>
        <my-footer :hasMenu="true"></my-footer>
      </div>
    </my-scrollbar>
  </div>
</template>

<script>
import * as custom from '@/assets/js/custom.config';
import MyScrollbar from '@/components/scroller/Scrollbar';
import MyHeader from '@/components/header/Header';
import MyFooter from '@/components/footer/Footer';
import MySearch from '@/components/search/Search';
export default {
  components: {
    MyScrollbar,
    MyHeader,
    MyFooter,
    MySearch
  },
  data() {
    return {
      searchVal: '',
      className: 'custom-dialog'
    }
  },
  methods: {
    getSearch(val) {
      console.log(val);
    }
  }
}
</script>

<style lang="scss" scoped>
.center {
  margin: 0 auto;
}
.cus-header {
  top: 0;
  width: 100%;
  z-index: 11;
  background: white;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 0px 2px;
}

.my-search {
  padding-top: 66px;
  padding-bottom: 40px;
  border-top: 1px solid #ECECEC;

  > div {
    @extend .center;
    width: 62.5%;
    min-width: 600px;
    max-width: 922px;
  }
}
.my-content {
  padding-top: 100px;
  padding-bottom: 60px;
  min-height: 560px;
  min-width: 600px;
  max-width: 1200px;
  @extend .center;
}
</style>>
