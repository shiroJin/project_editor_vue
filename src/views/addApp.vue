<template>
  <div>
    <div class="nav">
      <div class="title">新增应用</div>
      <el-button type="primary" icon="el-icon-message" @click="submit" style="margin-right: 20px">保存</el-button>
    </div>

    <div class="content">
      <div class="section-wrapper">
        <div class="section-title">版本选择:</div>
        <el-dropdown class="dropdown" @command="selectTag">
          <span class="el-dropdown-link">
            <div>{{ this.form.Tag || "请选择" }}</div>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu class="dropdown-menu" slot="dropdown">
            <el-dropdown-item v-for="(item, index) in tags" :key="index" :command="item">
              {{ item }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      
      <div class="section-wrapper">
        <div class="section-title">Xcode配置</div>
        <table class="table" cellspacing="0" cellpadding="4">
          <tr v-for="(value, key) in form.pbxproj" :key="key">
            <td>
              <div class="text-field">{{ fieldName(key) }}</div>
            </td>
            <td>
              <input class="text-input" placeholder="请输入" type="text" v-model="form.pbxproj[key]">
            </td>
          </tr>
        </table>
      </div>

      <div class="section-wrapper">
        <div class="section-title">项目配置</div>
        <table class="table" cellspacing="0" cellpadding="4">
          <tr v-for="(value, key, index) in form.plist" :key="index">
            <td>
              <div class="text-field">{{ fieldName(key) }}</div>
            </td>
            <td>
              <input class="text-input" placeholder="请输入" type="text" v-model="form.plist[key]">
            </td>
          </tr>
          <tr v-for="(value, key) in form.headfile" :key="key">
            <td>
              <div class="text-field">{{ fieldName(key) }}</div>
            </td>
            <td>
              <input class="text-input" placeholder="请输入" type="text" v-model="form.headfile[key]">
            </td>
          </tr>
        </table>
      </div>

      <div class="section-wrapper">
        <div class="section-title">图片</div>
        <upload-item
          v-for="(urls, name) in form.imageAssets"
          :key="name"
          :name="name"
          :imageUrls="urls"
          fileType="image"
          description="iconx9 launchx7 normalx2"
          @changed="uploadImages"
        />
      </div>

      <div class="section-wrapper">
        <div class="section-title">文件</div>
        <upload-item
          v-for="(url, name) in form.files" :key="name"
          description="ocr文件"
          fileType="file"
          :name="name"
          :fileUrl="url"
          @changed="uploadFile"
        />
      </div>

    </div>
  </div>
</template>

<script>
import { translate, getRequestDomain } from './helper'
import uploadItem from './imageUploadItem'

export default {
  name: 'addApp',
  components: {
    'upload-item': uploadItem
  },
  data() {
    return {
      form: {},
      result: undefined,
      resultShow: false,
      tags: []
    }
  },
  created () {
    this.tags = JSON.parse(this.$route.params.tags)
    this.$axios
      .get(getRequestDomain() + '/project/app-form')
      .then(res => {
        this.form = res.data
      })
  },
  methods: {
    selectTag (tag) {
      this.form.Tag = tag
    },
    uploadImages (event, name) {
      this.upload(event, name, 'image')
    },
    uploadFile (event, name) {
      this.uploadFile(event, name, 'file')
    },
    upload (event, name, type) {
      let data = new FormData()
      for (let i = 0; i < event.target.files.length; i++) {
        data.append(String(i), event.target.files[i])
      }
      this.$axios
        .post(getRequestDomain() + '/files/upload', data)
        .then(res => {
          if (type == 'image') {
            this.form.images[name] = res.data
          } else if (type == 'file') {
            this.form.files[name] = res.data[0]
          }
        })
        .catch(() => { _this.$toast.fail('文件上传失败' + name) })
    },
    submit () {
      let postData = JSON.parse(JSON.stringify(this.form))
      this.$toast.loading({
        mask: true,
        message: '提交中...'
      })
      this.$axios
        .post(getRequestDomain() + '/project/addProject', postData)
        .then(res => {
          this.$toast.clear()
          this.result = res.data
        })
        .catch(() => this.$toast.fail())
    },
    fieldName (field) {
      return translate(field)
    }
  }
}
</script>

<style scoped>
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
  border: 1px solid #eaeaea;
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
}
.el-dropdown-link {
  cursor: pointer;
  color: #2f85ff;
  padding: 8px;
  border-radius: 3px;
  font-weight: bold;
  font-size: 17px;
  display: flex;
  align-items: center;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.dropdown {
  width: 100px;
}
</style>