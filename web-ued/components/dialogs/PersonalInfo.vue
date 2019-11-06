<template>
    <el-dialog :visible.sync="isShow" width="750px" :custom-class="classStyle" :before-close="handleClose"
        destroy-on-close append-to-body>
        <img src="@/assets/img/bg/bg-dialog-info.png" slot="title" class="dialog-img">
        <div class="content_block">
            <!-- <el-avatar :size="40" :src="avator" class="align-top"></el-avatar> -->
            <p>昵称</p>
            <div class="cus-flex cus-align-center nickname">
                <el-input v-model="name" placeholder="听说，好看的人都会给自己起一个与众不同的名字~"  maxlength="20"></el-input>
                <span @click="generate">不想起名字</span>
            </div>
            <p>头像</p>
            <div class="cus-flex cus-align-center">
                <el-avatar v-for="(item,index) in config.avatorList" :key="index" :size="60" :src="item"
                    class="align-top" shape="square"></el-avatar>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" round size="large">确定</el-button>
        </div>
    </el-dialog>
</template>
<style lang="scss" scoped>
    .info_dialog {
        .content_block {
            padding: 15px 38px 10px 16px;
        }

        .nickname {
            word-break: keep-all;
            margin-bottom: 26px;

            span {
                color: #3376FF;
                font-size: 16px;
                border-bottom: 1px solid #3376FF;
                line-height: 16px;
                cursor: pointer;
            }
        }

        p {
            color: #000000;
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 14px;
        }
    }
</style>
<script>
    import * as custom from "../../assets/js/custom.config";
    export default {
        props: {
            isShow: {
                default: false,
                type: Boolean,
                required: true
            },
            classStyle: {
                default: null,
                type: String,
                required: false
            },
        },
        watch: {
            // isShow(newVal, oldVal) {
            //   this.show = newVal;
            // }
        },
        data() {
            return {
                show: false,
                name: null,
                config: custom.write,
                nameList: []
                // avatorList: ['avator_1.svg', 'avator_2.svg','avator_3.svg','avator_4.svg','avator_5.svg','avator_6.svg','avator_7.svg','avator_8.svg',]
            }
        },
        methods: {
            handleClose(done) {
                this.$emit('hide', true);
                this.show = false;
                // done();
            },
            // 生成随机昵称
            async generate() {
              const data = await this.$axios.get('/name.txt')
              data.data = data.data.replace(/[\r\n]/g," ")
              this.nameList = data.data.split(' ')
              this.nameList = this.nameList.filter(s =>{
                  return s && s.trim()
              })
            console.log(this.nameList)
              this.name = this.nameList[Math.floor((Math.random()*this.nameList.length))]
            }
        }
        }
</script>