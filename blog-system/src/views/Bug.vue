<template>
<div>
      <!-- <button @click="getList">点我</button>
        <ul v-for="site in sites" :key="site.id">
        <li>{{site.title}}</li> 
        <li>{{site.content}}</li>
        </ul> -->
</div>

</template>

<script>
export default {
    data () {
    return {
     sites: [{title:'', content:''},
             ]
    }
  },
    methods: {
    getList() {
      this.$ajax.post('/bugs/GetBugList').then((res) =>{
        console.log('data', res.data.Data);
          this.sites = res.data.Data;
      })
    }
  }

}
</script>

<style>

</style>
