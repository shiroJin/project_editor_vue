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
              <input class="text-input" placeholder="请输入" type="text" v-model="form[field]">
            </td>
          </tr>
        </table>
      </div>
      <div class="section-wrapper">
        <div class="section-title">文件编辑</div>
        <div class="upload-list image-section">
          <upload-item
            v-for="(imageList, imageName) in form.images"
            :key="imageName"
            :title="imageName"
            :fileList="imageList"
            @fileChanged="uploadImages"
          />
        </div>
        <div class="upload-list">
          <upload-item
            v-for="(value, fileName, index) in form.files"
            :key="index"
            :title="fileName"
            @fileChanged="uploadFiles"
          />
        </div>
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
  computed: {
    textFields: function () {
      let res = []
      for (const key in this.form) {
        if (!["images", "files", "Tag"].includes(key)) {
          res.push(key)          
        }
      }
      return res
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
    uploadFiles (event, name) {
      this.uploadFile(event, name, 'file')
    },
    upload (event, name, type) {
      let _this = this
      let data = new FormData()
      for (let i = 0; i < event.target.files.length; i++) {
        data.append(String(i), event.target.files[i])
      }
      this.$axios
        .post(getRequestDomain() + '/files/upload', data)
        .then(res => {
          if (type == 'image') {
            _this.form.images[name] = res.data
          } else if (type == 'file') {
            _this.form.files[name] = res.data[0]
          }
        })
        .catch(() => { _this.$toast.fail('文件上传失败' + name) })
    },
    submit () {
      let _this = this
      let postData = JSON.parse(JSON.stringify(this.form))
      this.$toast.loading({
        mask: true,
        message: '提交中...'
      })
      this.$axios
        .post(getRequestDomain() + '/project/addProject', postData)
        .then(res => {
          _this.$toast.clear()
          _this.result = res.data
        })
        .catch(() => _this.$toast.fail())
    },
    fieldName (field) {
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
.section-title {
  margin-top: 20px;
  text-align: left;
  font-size: 20px;
  font-weight: bold;
  color: #333;
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