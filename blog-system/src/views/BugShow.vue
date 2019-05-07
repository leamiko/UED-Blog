<template>
  <div class="show">
    <h2>{{model.title}}</h2>
    <p class="bug-info h6">
      关键词： <span>{{model.keyword}}</span>
      时间： <span>{{model.updateAt | formatDateDay}}</span>
      作者： <span>{{model.author}}</span>
      状态： <span>{{model.bugStatus}}</span>
      采用数： <span>{{model.useNum}}</span>
    </p>
    <h3>bug描述</h3>
    <div v-html="model.content"></div>
    <h3>bug解决方案</h3>
    <div v-html="model.bugSolution"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      model: []
    };
  },
  mounted() {
    this.model = this.$route.params.entity;
    console.log(this.model)
  },
  methods: {
    
  }
};
</script>

<style scoped>
h2, p{
    text-align: center;
}
.bug-info span{
    margin-right: 18px;
}
</style>

