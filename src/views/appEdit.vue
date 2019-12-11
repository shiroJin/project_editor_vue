<template>
  <div>

    <div class="nav">
      <div class="title">编辑</div>
      <el-button type="primary" icon="el-icon-message" @click="diff" style="margin-right: 20px">保存</el-button>
    </div>

    <div class="content">
      <div class="section-wrapper">
        <div class="section-title">文本编辑：</div>
        <table class="table" cellspacing="0" cellpadding="4">
          <tr v-for="(value, key, index) in appInfo.plist" :key="index">
            <td>
              <div class="text-field">{{ fieldName(key) }}</div>
            </td>
            <td>
              <input class="text-input" placeholder="请输入" type="text" v-model="appInfo.plist[key]">
            </td>
          </tr>
          <tr v-for="(value, key) in appInfo.headfile" :key="key">
            <td>
              <div class="text-field">{{ fieldName(key) }}</div>
            </td>
            <td>
              <input class="text-input" placeholder="请输入" type="text" v-model="appInfo.headfile[key]">
            </td>
          </tr>
        </table>
      </div>

      <div class="section-wrapper">
        <div class="section-title">文件编辑</div>
          <upload-item
            v-for="(obj, name) in origInfo.imageAssets"
            :key="name"
            :title="name"
            :imageItems="obj"
            @imageChanged="imageUpdated"
          />
      </div>
      
    </div>
  </div>
</template>

<script>
import { translate } from './translate'
import uploadItem from './imageUploadItem'
import { getRequestDomain } from '../requestDomain'
import { makeUpdateInfo } from './commonHelper'

export default {
  components: {
    'upload-item': uploadItem
  },
  data() {
    return {
      origInfo: {},
      appInfo: {},
      updateInfo: {},
    }
  },
  created () {
    let data = this.$route.params.info
    this.origInfo = JSON.parse(data)
    this.appInfo = JSON.parse(data)
  },
  methods: {
    diff: function () {
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
      this.$axios.post(getRequestDomain() + '/project/editProject', postData)
        .then(res => {
          _this.alertShow = false
          _this.$router.go(-1)
        })
        .catch(() => {})
    },
    getUpdateInfo: function () {
      let result = {}
      Object.keys(this.appInfo).forEach(key => {
        let update = makeUpdateInfo(this.origInfo[key], this.appInfo[key])
        if (Object.getOwnPropertyNames(update).length !== 0) {
          result[key] = update
        }
      })
      return result
    },
    imageUpdated: function (name, subName, url) {
      this.appInfo.imageAssets[name][subName] = url
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
