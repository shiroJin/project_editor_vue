<template>
  <div class="apps-container">
    <div
      class="item"
      v-for="(item, index) in apps"
      :key="index"
      @click="appClick(item)"
    >
      <p>{{ item.displayName }}</p>
      <p>{{ item.targetName }}</p>
    </div>
    <div class="item add-item" @click="addApp">
      <div>+</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      apps: []
    }
  },
  mounted() {
    this.$axios.get('http://localhost:5000/project/projectInfo/butler')
      .then(res => {
        this.apps = res.data.data
      })
      .catch(err => {
        console.error(err); 
      })
  },
  methods: {
    appClick: function (item) {
      this.$router.push({
        name: 'appInfo',
        params: {
          item: JSON.stringify(item)
        }
      })
    },
    addApp: function () {
      this.$router.push({
        name: 'addApp'
      })
    }
  }
}
</script>

<style scoped>
.apps-container {
  display: flex;
}
.item {
  width: 200px;
  height: 100px;
  border: 2px solid lightgray;
  padding: 10px;
  margin: 15px;
  border-radius: 20px;
}
.add-item {
  font-size: 80px;
  text-align: center;
  color: lightgrey;
}
</style>