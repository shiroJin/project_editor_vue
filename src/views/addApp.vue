<template>
  <div>
    <div class="wrapper">
    <div class="content-wrapper">
      <h2>配置信息</h2>
      <div class="item" v-for="(key, index) in textFields" :key="index">
        <p>{{ key }}</p>
        <input type="text" v-model="form[key]" >
      </div>
    </div>
    <div class="images-wrapper" v-if="form.images">
      <h2>切图配置</h2>
      <div class="image-item" v-for="(value, imageName, index) in form.images" :key="index">
        <b>{{ imageName }}</b>
        <input type=file name=image accept="image/*" multiple @change="upload($event, imageName)">
        <div id="image-display">
          <img class="image" v-for="(item, index) in form.images[imageName]" :key="index" :src="item">
        </div>
      </div>
    </div>
  </div>
  <button class="submit-button" @click="submit">submit</button>
  </div>
</template>

<script>
export default {
  name: 'addApp',
  data() {
    return {
      form: {}
    }
  },
  computed: {
    textFields: function () {
      let res = []
      for (const key in this.form) {
        if (this.form.hasOwnProperty(key) && key !== "images") {
          res.push(key)          
        }
      }
      return res
    }
  },
  created () {
    let _this = this
    this.$axios.get('http://localhost:5000/project/app-form/butler')
      .then(res => {
        _this.form = res.data
      })
      .catch(() => {})
  },
  methods: {
    upload: function (event, imageName) {
      let _this = this
      let data = new FormData()
      for (let i = 0; i < event.target.files.length; i++) {
        data.append('image', event.target.files[i])
      }
      this.$axios
        .post('http://localhost:5000/image/upload', data)
        .then(res => {
          _this.form.images[imageName] = res.data
        })
        .catch(() => {})
    },
    submit: function() {
      let postData = JSON.parse(JSON.stringify(this.form))
      this.$axios
        .post('http://localhost:5000/project/newApp/butler', postData)
        .then(res => {
          console.log(res)
        })
        .catch(err => console.log(err))
    }
  }
}
</script>

<style scoped>
.wrapper {
  display: flex;
}
.images-wrapper {
  flex: 1;
}
.content-wrapper {
  flex: 1;
}
.image {
  border: 1px dashed lightgray;
  max-width: 100px;
  height: auto;
  margin: 5px;
}
.submit-button {
  width: 100px;
  height: 40px;
}
.image-item {
  margin-top: 15px;
}
.item {
  width: 400px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>