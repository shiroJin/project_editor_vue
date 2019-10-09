<template>
  <div>
    <div class="form-wrapper" v-show="!resultShow">
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
          <input type=file name=image accept="image/*" multiple @change="upload($event, imageName, 'image')">
          <div id="image-display">
            <img class="image" v-for="(item, index) in form.images[imageName]" :key="index" :src="item">
          </div>
        </div>
      </div>
      <div class="files-wrapper">
        <h2>文件配置</h2>
        <div class="file-item" v-for="(value, fileName, index) in form.files" :key="index">
          <div>{{ fileName }}</div>
          <input type="file" name="image" @change="upload($event, fileName, 'file')">
        </div>
      </div>
      <button class="submit-button" @click="submit">submit</button>
    </div>
    <div class="result-wrapper" v-if="resultShow">
      <div style="white-space: pre;text-align: left">{{ result.status }}</div>
      <button class="result-button" @click="commitChanges">confirmed</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'addApp',
  data() {
    return {
      form: {},
      result: undefined,
      resultShow: false
    }
  },
  computed: {
    textFields: function () {
      let res = []
      for (const key in this.form) {
        if (!["images", "files"].includes(key)) {
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
    upload: function (event, imageName, type) {
      let _this = this
      let data = new FormData()
      for (let i = 0; i < event.target.files.length; i++) {
        data.append('image', event.target.files[i])
      }
      this.$axios
        .post('http://localhost:5000/image/upload', data)
        .then(res => {
          if (type == 'image') {
            _this.form.images[imageName] = res.data
          } else if (type == 'file') {
            _this.form.files[imageName] = res.data[0]
          }
        })
        .catch(() => { _this.$toast.fail('文件上传失败' + imageName) })
    },
    submit: function() {
      let _this = this
      let postData = JSON.parse(JSON.stringify(this.form))
      this.$toast.loading({
        mask: true,
        message: '提交中...'
      })
      this.$axios
        .post('http://localhost:5000/project/newApp/butler', postData)
        .then(res => {
          console.log(res)
          _this.$toast.clear()
          _this.result = res.data
          _this.resultShow = true
        })
        .catch(() => _this.$toast.fail())
    },
    commitChanges: function() {
      this.$axios
        .post('http://localhost:5000/project/commitChanges/butler', this.result.app)
        .then(res => {
          console.log(res)
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped>
.form-wrapper {
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
.result-wrapper {
  display: flex;
  align-items: center;
  flex-direction: column;
}
.result-button {
  width: 100px;
  height: 50px;
}
</style>