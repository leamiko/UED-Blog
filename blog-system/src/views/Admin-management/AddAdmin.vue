<template>
  <div>
    <FormComponent ref="FormComponent"
                   :formArr="formArr"></FormComponent>
  </div>
</template>

<script>
import FormComponent from '../../components/FormCompoment'
import StaticData from '../../Share/StaticData.js'

export default {
  props: ['record'],
  data () {
    return {
      formArr: [
        { formType: 'input', type: 'text', title: '账号', field: 'account', placeholder: '请输入账号', value: '', isRequired: true, message: '请输入账号', labelCol: { span: 6 }, wrapperCol: { span: 14 } },
        { formType: 'input', type: 'password', title: '密码', field: 'passWord', placeholder: '请输入密码', value: '', isRequired: true, message: '请输入密码', labelCol: { span: 6 }, wrapperCol: { span: 14 } },
        { formType: 'select', type: 'multiple', title: '权限', field: 'authorization', placeholder: '请选择权限', selectArr: [], value: '', isRequired: true, message: '请选择权限', labelCol: { span: 6 }, wrapperCol: { span: 14 } }
      ]
    }
  },
  components: {
    FormComponent
  },
  created () {
    // 加载权限列表
    const selectArr = []
    StaticData.menuList.forEach(item => {
      selectArr.push({
        name: item.name,
        value: item.code
      })
    })
    this.formArr[2].selectArr = selectArr
    // 编辑默认值
    this.formArr[0].value = this.record.account
    this.formArr[2].value = this.record.authorization
    if (this.record) {
      this.formArr.splice(1, 1)
    }
  },
  methods: {
    sublimt () {
      this.$refs.FormComponent.sublimt()
    },
    resetForm () {
      this.$refs.FormComponent.resetForm()
    }
  }
}
</script>
