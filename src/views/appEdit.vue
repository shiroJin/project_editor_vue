<template>
  <div class="edit-wrapper">
    
  </div>
</template>

<script>
export default {
  data() {
    return {
      info: {}  
    }
  },
  created () {
    let data = this.$route.params.data
    this.info = JSON.parse(data)
  },
  methods: {
    submit: function () {
      
    }
  }
}
</script>

<style scoped>

</style>
