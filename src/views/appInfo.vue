<template>
  <div class="info-container" v-if="appInfo">
    <div class="header">
        <img :src=appInfo.images.AppIcon>
        <div class="base-info">
          <h2>{{ appInfo.CFBundleDisplayName }}</h2>
          <p>version: {{ appInfo.CFBundleShortVersionString }}</p>
          <p>build: {{ appInfo.CFBundleVersion }}</p>
        </div>
        <div class="edit-item" @click="editInfo">EDIT</div>
    </div>
    <div class="content-wrapper">
      <div class="content">
        <h2>配置信息</h2>
        <div class="item" v-for="(value, key, index) in filterInfo()" :key="index">
          <p>{{ key }}:</p>
          <p>{{ value }}</p>
        </div>
      </div>
      <div class="image-snapshot">
        <h2>切图</h2>
        <div class="image-slices">
          <div class="slice-item" v-for="(item, key, index) in appInfo.images" :key="index">
            <div>{{ key }}</div>
            <img :src="item" class="slice">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      item: undefined,
      appInfo: undefined
    }
  },
  mounted() {
    this.item = JSON.parse(this.$route.params.item)
    this.$axios
      .get('http://localhost:5000/project/appInfo/butler', {
        params: {
          companyCode: this.item.code
        }
      })
      .then(res => {
        this.appInfo = res.data
      })
      .catch(() => {})
  },
  methods: {
    filterInfo: function () {
      let result = {}
      for (const key in this.appInfo) {
        if (['CFBundleDisplayName', 'CFBundleShortVersionString', 'CFBundleVersion', 'images'].includes(key)) continue
        result[key] = this.appInfo[key]
      }
      return result
    },
    editInfo: function () {
      let data = JSON.stringify(this.appInfo)
      this.$router.push({
        name: 'appEdit',
        params: { data: data }
      })
    }
  }
}
</script>

<style scoped>
.info-container {
  display: flex;
  flex-direction: column;
  margin: 0 60px;
}
body {
  margin: 10px 15px;
}
.header {
  display: flex;
  align-items: center;
  justify-content: center;
}
.header img {
  width: 90px;
  height: 90px;
  border-radius: 5px;
}
.header .base-info {
  padding-left: 30px;
  position: relative;
}
.base-info {
  text-align: left;
}
.base-info p {
  line-height: 20px;
  margin: 0;
}
.base-info h2 {
  margin: 0 0 10px 0;
}
.item {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.item p {
  margin: 5px 0;
}
.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
}
.content h2 {
  margin-bottom: 5px;
  text-align: left;
}
.image-snapshot {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.image-snapshot h2 {
  margin-bottom: 5px;
  text-align: left;
}
.image-slices {
  display: flex;
  align-items: flex-end;
}
.slice {
  margin: 5px;
  border: 1px dashed black;
  max-width: 100px;
}
.content-wrapper {
  padding: 5px 15px;
  display: flex;
  justify-content: space-around;
}
.edit-item {
  margin-top: 3px;
  padding: 3px;
  border: 2px solid lightgrey;
  border-radius: 3px;
  font-size: 15px;
  font-weight: bold;
  color: gray;
  align-self: flex-start;
}
</style>
