<template>
  <div class="wrapper">
    <div class="text-wrapper">
      <div
        class="text-item"
        v-for="(field, index) in textFields"
        :key="index"
      >
        <div>{{ field }}</div>
        <input type="text" v-model="appInfo[field]" style="width: 250px;">
      </div>
    </div>

    <div class="image-wrapper">
      <div
        class="image-item"
        v-for="(imageUrl, imageName) in origInfo.images"
        :key="imageName"
      >
        <div>{{ imageName }}</div>
        <div class="edited">
          <img class="slicing" :src="imageUrl">
          <div v-if="Array.isArray(appInfo.images[imageName])" style="font-weight: bold">=></div>
          <img v-if="Array.isArray(appInfo.images[imageName])" class="slicing" :src="appInfo.images[imageName][0]">
        </div>
        <input type="file" multiple @change="uploadImages($event, imageName)">
      </div>
    </div>
    <button class="submit-button" @click="makeDiff">submit</button>
    <div class="alert" v-if="alertShow">
      <div>{{ updateInfo }}</div>
      <button class="cancel">cancel</button>
      <button class="confirmed" @click="submit">confirmed</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      origInfo: {},
      appInfo: {},
      updateInfo: {},
      alertShow: false
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
        _this.origInfo = JSON.parse(data)
      })
      .catch(() => {})
  },
  methods: {
    makeDiff: function () {
      this.updateInfo = this.getUpdateInfo()
      this.alertShow = true
    },
    cancel: function () {
      this.alertShow = false
    },
    submit: function () {
      let _this = this
      console.log(JSON.stringify(this.updateInfo))
      this.updateInfo.companyCode = "mh"
      this.$axios
        .post('http://localhost:5000/project/updateApp/butler', this.updateInfo)
        .then(res => {
          _this.alertShow = false
        })
        .catch(() => {})
    },
    getUpdateInfo: function () {
      let result = {}
      // text-field
      this.textFields.forEach(key => {
        if (this.origInfo.hasOwnProperty(key) && this.appInfo.hasOwnProperty(key)) {
          if (this.origInfo[key] != this.appInfo[key]) result[key] = this.appInfo[key]
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
  padding: 0 30px;
}
.text-wrapper {
  max-width: 600px;
}
.text-item {
  margin: 15px 15px;
  display: flex;
  justify-content: space-between;
}
.image-wrapper {
  display: flex;
}
.image-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.slicing {
  border: 1px dashed lightgrey;
  width: 100px;
}
.submit-button {
  width: 100px;
  height: 50px;
  border: 5px solid green;
  font-size: 20px;
  border-radius: 10px;
}
.alert {
  position: absolute;
  top: 100px;
  background-color: white;
  padding: 15px;
  border: 1px solid red;
}
.edited {
  display: flex;
  align-items: center;
}
</style>
