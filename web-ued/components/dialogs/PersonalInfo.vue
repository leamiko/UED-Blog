<template>
    <el-dialog :visible.sync="show" width="610px" :custom-class="classStyle" :before-close="handleClose"
        destroy-on-close append-to-body>
        <img src="@/assets/img/bg/bg-dialog-info.png" slot="title" class="dialog-img">
        <div class="content_block">
            <!-- <el-avatar :size="40" :src="avator" class="align-top"></el-avatar> -->
            <p>昵称</p>
            <div class="cus-flex cus-align-center nickname">
                <el-input v-model="name" placeholder="听说，好看的人都会给自己起一个与众不同的名字~" maxlength="20"></el-input>
                <span @click="generate">想不起名字</span>
            </div>
            <p>头像</p>
            <div class="cus-flex cus-align-center">
                <div class="avator_list" v-for="item in avatorList" @click="chooseAvator(item)" :key="item._id">
                    <el-avatar :size="50" :src="item.url" class="align-top" shape="square"
                        :class="{'img_selected': item.isSelect}"></el-avatar>
                    <img class="selected" src="../../assets/img/icon/avator-checked.png" alt="" v-if="item.isSelect">
                </div>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" round size="large" @click="submit">确定</el-button>
        </div>
    </el-dialog>


</template>
<style lang="scss" scoped>
    .info_dialog {
        .content_block {
            //padding: 15px 38px 10px 16px;
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

        .img_selected {
            border-radius: 50%;
            border: 3px solid #3376FF;
            width: 54px !important;
            height: 54px !important;
            line-height: 54px !important;
        }

        .avator_list {
            position: relative;

            img.selected {
                position: absolute;
                bottom: 2px;
                right: 16px;
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
            isShow(newVal, oldVal) {
                this.show = newVal;
            }
        },
        data() {
            return {
                name: null,
                show: false,
                config: custom.write,
                nameList: [],
                memberInfo: {}, // 用户信息
                imgUrl: null,
                avatorList: [], // 头像列表
            }
        },
        mounted() {
            if (localStorage.user) {
                this.memberInfo = JSON.parse(localStorage.getItem('user'))
                this.name = this.memberInfo.nickName
            }
            this.getAvatarList()
        },
        methods: {
            handleClose(done) {
                this.$emit('hide', true);
                this.show = false;
                done();
            },
            // 获取头像
            async getAvatarList() {
                const res = await this.$axios.get(`${process.env.BASE_URL}/web_api/getAvatarList`);
                if (res.status == 200) {
                    this.avatorList = res.data.data
                    this.avatorList.forEach(e => {
                        this.$set(e, 'isSelect', false)
                    })
                }

            },
            // 生成随机昵称
            async generate() {
                const data = await this.$axios.get('/name.txt')
                data.data = data.data.replace(/[\r\n]/g, " ")
                this.nameList = data.data.split(' ')
                this.nameList = this.nameList.filter(s => {
                    return s && s.trim()
                })
                console.log(this.nameList)
                this.name = this.nameList[Math.floor((Math.random() * this.nameList.length))]
            },
            // // 选择头像
            chooseAvator(item) {
                this.avatorList.forEach(e => {
                    e.isSelect = false
                })
                item.isSelect = true
                this.imgUrl = item.url
                // this.uploadImgToBase64(item.srcElement.currentSrc, (res) => {
                //     this.imgUrl = res
                //     console.log(this.imgUrl)
                // })
            },
            uploadImgToBase64(img, callback) {
                let image = new Image()
                image.crossOrigin = '';
                image.src = img;
                image.onload = function () {
                    var canvas = document.createElement("canvas");
                    canvas.width = image.width;
                    canvas.height = image.height;
                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(image, 0, 0, image.width, image.height);
                    var ext = image.src.substring(image.src.lastIndexOf(".") + 1).toLowerCase();
                    var dataURL = canvas.toDataURL("image/" + ext);
                    callback ? callback(dataURL) : null; //调用回调函数
                }
            },

            async submit() {
                const params = {
                    _id: this.memberInfo._id,
                    nickName: this.name,
                    avatar: this.imgUrl
                }
                const res = await this.$axios.post(`${process.env.BASE_URL}/web_api/editInfo`, params);
                if (res.data.status_code == 200) {
                    let user = res.data.data
                    console.log(user)
                    if (user) {
                        localStorage.removeItem('user')
                        localStorage.setItem("user", JSON.stringify(user));
                        this.$emit('hide', true);
                        this.show = false;
                        this.$notify({
                            title: '成功',
                            message: '信息更新成功',
                            type: 'success'
                        });
                    }
<<<<<<< HEAD
                    this.$store.commit("flag", new Date().toLocaleTimeString());
=======
                } else {
                    this.$notify.error({
                        title: '错误',
                        message: res.data.message
                    });
>>>>>>> 2fde39d4bf76017eb40e071fcb447bfac0daea1c
                }
            }
        }
    }
</script>