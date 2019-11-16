<template>
  <label class="my-label pointer" @click="$emit('active')" oncontextmenu="return false"
  ondragstart="return false" onselectstart ="return false" onselect="return false"
  oncopy="return false" onbeforecopy="return false" onmouseup="return false">{{text}}</label>
</template>
<script>
export default {
  props: {
    text: {
      default: '',
      type: String | Number,
      required: false
    },
  }

}
</script>
<style lang="scss" scoped>
.my-label {
  color: #A3B3BF;
  font-size: 14px;
  line-height: 32px;
  border-radius: 32px;
  display: inline-block;
  background: #F7FAFC;
  padding: 0 16px;
  transition: all .5s ease;
}
</style>
