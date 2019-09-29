<template>
  <div class="content">
    <my-header :activeLabel="active" v-if="hasHead" :innerStyle="headStyle">
      <div slot="box_cus">
        <slot name="head_custom"></slot>
      </div>
    </my-header>
    <div class="main" ref="main" :style="{'height': hasHead ? 'calc(100% - 82px)' : '100%'}">
      <el-backtop target=".main" :bottom="bottom"></el-backtop>
      <slot name="container"></slot>
      <my-footer :hasMenu="isMenu" v-if="hasFoot"></my-footer>
    </div>
  </div>
</template>
<script>
import MyHeader from '@/components/Header';
import MyFooter from '@/components/Footer';
export default {
  components: {
    MyHeader,
    MyFooter
  },
  props: {
    hasHead: {
      default: false,
      type: Boolean,
      required: false
    },
    hasFoot: {
      default: false,
      type: Boolean,
      required: false
    },
    active: {
      default: null,
      type: String,
      required: false
    },
    isMenu: {
      default: true,
      type: Boolean,
      required: false
    },
    headStyle: {
      default: null,
      type: Object,
      required: false
    },
    mainStyle: {
      default: null,
      type: Object,
      required: false
    },
    bottom: {
      default: 80,
      type: Number,
      required: false
    }
  },
  mounted() {
    if (this.mainStyle) {
      Object.keys(this.mainStyle).forEach(key => {
        this.$refs.main.style[key] = this.mainStyle[key];
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.content {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .main {
    overflow-y: auto;
  }
}
</style>
