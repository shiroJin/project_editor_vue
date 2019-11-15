<template>
  <div>
    <div class="nav">
      <div class="title">编辑</div>
      <el-button type="primary" icon="el-icon-message" @click="makeDiff" style="margin-right: 20px">保存</el-button>
    </div>
    <div class="content">
      <div class="section-wrapper">
        <div class="section-title">字段编辑：</div>
        <table class="table" cellspacing="0" cellpadding="4">
          <tr>
            <th>字段名称</th>
            <th>字段值</th>
          </tr>
          <tr v-for="(field, index) in textFields" :key="index">
            <td>
              <div class="text-field">{{ fieldName(field) }}</div>
            </td>
            <td>
              <input class="text-input" placeholder="请输入" type="text" v-model="appInfo[field]">
            </td>
          </tr>
        </table>
      </div>
      <div class="section-wrapper">
        <div class="section-title">文件编辑</div>
        <div class="upload-list">
          <upload-item
            v-for="(imageUrl, imageName) in origInfo.images"
            :key="imageName"
            :title="imageName"
            :previewUrl="imageUrl"
            :fileList="appInfo.images[imageName]"
            @fileChanged="uploadImages"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { translate } from './translate'
import uploadItem from './imageUploadItem'
export default {
  components: {
    'upload-item': uploadItem
  },
  data() {
    return {
      origInfo: {},
      appInfo: {},
      updateInfo: {},
      code: undefined
    }
  },
  computed: {
    textFields: function () {
      let res = []
      for (const key in this.appInfo) {
        if (key !== 'images') res.push(key)
      }
      return res
    }
  },
  created () {
    this.code = this.$route.params.companyCode
    this.fetchAppInfo()
  },
  methods: {
    fetchAppInfo () {
      let _this = this
      this.$axios
        .get('http://localhost:3000/project/projectInfo', {
          params: {
            "companyCode": this.code
          }
        })
        .then(res => {
          let data = JSON.stringify(res.data)
          _this.appInfo = JSON.parse(data)
          _this.origInfo = JSON.parse(data)
        })
        .catch(() => {})
    },
    makeDiff: function () {
      let _this = this
      this.updateInfo = this.getUpdateInfo()
      this.$alert(this.updateInfo, '修改内容', {
        confirmButtonText: '确定',
        callback: action => {
          _this.submit()
        }
      })
    },
    submit: function () {
      let _this = this
      let postData = {
        companyCode: this.code,
        updateInfo: this.updateInfo
      }
      this.$axios
        .post('http://localhost:3000/project/editProject', postData)
        .then(res => {
          _this.alertShow = false
          _this.$router.go(-1)
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
      if (Object.entries(images).length) {
        result.images = images
      }
      return result
    },
    uploadImages: function (event, name) {
      let form = new FormData()
      let files = event.target.files
      for (let index = 0; index < files.length; index++) {
        const file = files[index];
        form.append('image'+index, file)
      }
      this.$axios
        .post('http://localhost:3000/files/upload', form)
        .then(res => {
          this.appInfo.images[name] = res.data
        })
    },
    fieldName: function (field) {
      return translate(field)
    }
  }
}
</script>

<style scoped>
.section-wrapper {
  display: flex;
  flex-direction: column;
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
.table {
  width: 100%;
}
.text-field {
  font-size: 18px;
}
.text-input {
  width: 100%;
  height: 100%;
  border-width: 0;
  font-size: 18px;
  text-align: center;
}
tr {
  background-color: white;
}
tr:nth-of-type(odd) {
  background-color: #EBF3FF;
}
tr:nth-of-type(odd) .text-input {
  background-color: #EBF3FF;
}
td:not(:last-child) {
  border-left: 1px solid #eaeaea;
  border-right: 1px solid #eaeaea;
}
td:last-child {
  border-right: 1px solid #eaeaea;
}
.section-title {
  margin-top: 20px;
  text-align: left;
  font-size: 20px;
  font-weight: bold;
  color: #333;
}
.content {
  padding: 0 30px;
}
.upload-list {
  width: 100%;
  display: flex;
  justify-content: space-around;
}
</style>
