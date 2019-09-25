<template>
  <div>
    <a-form :form="form">
      <a-form-item v-for="(form, index) in formArr"
                   :key="index"
                   :label-col="form.labelCol"
                   :wrapper-col="form.wrapperCol"
                   :label="form.title">
        <a-input v-if="form.formType === 'input'"
                 v-decorator="[
                  form.field,
                  {
                    rules: [{ required: form.isRequired, message: form.message }],
                    initialValue: form.value
                  }
                 ]"
                 :placeholder="form.placeholder"
                 :type="form.type" />
        <a-select v-if="form.formType === 'select'"
                  v-decorator="[
                    form.field,
                    {
                      rules: [{ required: form.isRequired, message: form.message }],
                      initialValue:form.value
                    }
                  ]"
                  :placeholder="form.placeholder"
                  :mode="form.type">
          <a-select-option v-for="(select, index) in form.selectArr"
                           :key="index"
                           :value="select.value">
            {{select.name}}
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
export default {
  props: {
    formArr: Array
  },
  data () {
    return {
      form: this.$form.createForm(this)
    }
  },
  methods: {
    sublimt () {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$store.commit('editLoginForm', values)
        }
      })
    },
    resetForm () {
      this.form.resetFields()
    }
  }
}
</script>
