<template>
  <div class="content">
    <my-header v-if="!isIndexPage"
               :activeLabel="$store.state.headActive"
               :innerStyle="{'background':'white'}">
      <div slot="box_cus"
           v-if="$route.path == '/coding'">
        <el-dropdown trigger="click"
                     size="medium"
                     split-button
                     type="primary"
                     @command="handleCommand">
          创建
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="askShow">
              <p>我要提问</p>
            </el-dropdown-item>
            <el-dropdown-item command="answer">
              <p>提供解决方案</p>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </my-header>
    <my-header v-if="isIndexPage"
               class="cus-fixed my-header"
               :class="{ bg_white: !isAddClass, text_white: isAddClass }"
               activeLabel="首页"
               :isChange="isAddClass"></my-header>
    <div class="main"
         ref="main"
         :style="{ height: !isIndexPage ? 'calc(100% - 82px)' : '100%' }">
      <el-backtop target=".main"
                  :bottom="80"><img :src="backImg" /></el-backtop>
      <nuxt v-show="isRouterAlive"
            v-loading="isloading"></nuxt>
      <my-footer :hasMenu="true"></my-footer>
    </div>
  </div>
</template>

<script>
import MyHeader from '@/components/header/Header'
import MyFooter from '@/components/footer/Footer'
import * as custom from '@/assets/js/custom.config'
export default {
  components: {
    MyHeader,
    MyFooter
  },
  provide () {
    return {
      reload: this.reload,
      isloading: this.reloading
    }
  },
  data () {
    return {
      isRouterAlive: true,
      isloading: false,
      isAddClass: true,
      isIndexPage: true,
      backImg: custom.index.backTopUrl,
      height: Number
    }
  },
  watch: {
    $route (to, from) {
      if (to.path == '/') {
        this.isIndexPage = true
        this.isAddClass = true
      } else {
        this.isIndexPage = false
      }
    }
  },
  methods: {
    handleCommand (command) {
      if (command === 'answer') {
        this.$router.push({
          path: '/coding/solve'
        })
      } else {
        this.$store.commit("askShow", true);
      }
    },
    reload () {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    },
    reloading () {
      this.isloading = true
      this.$nextTick(() => {
        this.isloading = false
      })
    }
  },
  mounted () {
    console.log(this.$route.path)
    if (this.$route.path == '/') {
      this.isIndexPage = true
      this.isAddClass = true
    } else {
      this.isIndexPage = false
      console.log(this.isIndexPage)
    }
    if (this.mainStyle) {
      Object.keys(this.mainStyle).forEach(key => {
        this.$refs.main.style[key] = this.mainStyle[key]
      })
    }
    this.height = (document.body.clientWidth / 1920) * 645
    window.onresize = () => {
      return (() => {
        this.height = (document.body.clientWidth / 1920) * 645
      })()
    }
    window.addEventListener(
      'scroll',
      () => {
        if (this.$refs.main && this.$refs.main.scrollTop) {
          if (this.$refs.main.scrollTop > this.height - 100) {
            this.isAddClass = false
          } else {
            this.isAddClass = true
          }
        }
      },
      true
    )
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
.bg_white {
  transition: all 0.5s ease;
  background: white;
  border-bottom: 1px solid rgb(220, 223, 230);
  box-shadow: rgba(0, 0, 0, 0.12) 0px 0px 2px;
}
.my-header {
  top: 0;
  width: 100%;
  z-index: 11;
}
.text_white {
  color: white !important;
}
</style>
