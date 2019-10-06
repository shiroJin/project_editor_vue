<template>
  <div class="wrapper">
    <div class="text-wrapper">
      <div
        class="text-item"
        v-for="(field, index) in textFields"
        :key="index"
      >
        <div>{{ field }}</div>
        <input type="text" v-model="appInfo[field]">
      </div>
    </div>

    <div class="image-wrapper">
      <div
        class="image-item"
        v-for="(imageUrl, imageName) in appInfo.images"
        :key="imageName"
      >
        <div>{{ imageName }}</div>
        <input type="file" @change="uploadImages($event, imageName)">
        <img :src="imageUrl" style="maxWidth: 100px;">
      </div>
    </div>
    <button @click="submit">submit</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      origData: {},
      appInfo: {},
      updateInfo: {}
    }
  },
  computed: {
    textFields: function () {
      let res = []
      for (const key in this.appInfo) {
        if (key !== 'images') {
          res.push(key)
        }
      }
      return res
    }
  },
  created () {
    let _this = this
    this.$axios
      .get('http://localhost:5000/project/appInfo/butler', {
        params: {
          "companyCode": "mh"
        }
      })
      .then(res => {
        let data = JSON.stringify(res.data)
        _this.appInfo = JSON.parse(data)
        _this.origData = JSON.parse(data)
      })
      .catch(() => {})
  },
  methods: {
    submit: function () {
      this.updateInfo = this.getUpdateInfo()
      console.log(this.updateInfo)
    },
    getUpdateInfo: function () {
      let result = {}
      // text-field
      this.textFields.forEach(key => {
        if (this.origData.hasOwnProperty(key) && this.appInfo.hasOwnProperty(key)) {
          if (this.origData[key] != this.appInfo[key]) result[key] = this.appInfo[key]
        }
      })
      // images
      let images = {}
      Object
        .keys(this.appInfo.images)
        .forEach(key => {
          let value = this.appInfo.images[key]
          if (Array.isArray(value)) {
            images[key] = value
          }
        })
      result.images = images
      return result
    },
    uploadImages: function (event, name) {
      let form = new FormData()
      let files = event.target.files
      for (let index = 0; index < files.length; index++) {
        const file = files[index];
        form.append('image', file)
      }
      this.$axios
        .post('http://localhost:5000/image/upload', form)
        .then(res => {
          this.appInfo.images[name] = res.data
        })
    }
  }
}
</script>

<style scoped>
.wrapper {
  color: rgb(150, 37, 37);
}
</style>
