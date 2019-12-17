<template>
  <div>
    <div class="nav">
      <div class="title">编辑</div>
      <el-button type="primary" icon="el-icon-message" @click="diff" style="margin-right: 20px">保存</el-button>
    </div>

    <div class="content">
      <div class="section-wrapper">
        <div class="section-title">Xcode配置</div>
        <div class="table">
          <div class="cell" v-for="(value, key) in appInfo.plist" :key="key">
            <div class="cell-left text-field" v-if="key!=='urlTypes'">{{ fieldName(key) }}</div>
            <input class="cell-right text-input" v-if="key!=='urlTypes'" placeholder="请输入" type="text" v-model="appInfo.plist[key]">
          </div>
          
          <div class="cell"></div>

          <div class="cell" v-for="(value, key) in appInfo.pbxproj" :key="key">
            <div class="cell-left text-field">{{ fieldName(key) }}</div>
            <input class="cell-right text-input" placeholder="请输入" type="text" v-model="appInfo.pbxproj[key]">
          </div>

          <div class="cell" style="border-bottom:1px solid #eaeaea"></div>

          <div style="display:flex;">
            <div class="cell-left" style="display:flex;flex-direction:row-reverse;">
              <div class="add" @click="adddUrlType">+</div>
              <div>URL Types</div>
              </div>
            <div class="cell-right">
              <div class="urltype-item" style="font-size:15px;font-weight:bold">
                <span>URL Identify</span><span>URL Scheme</span>
              </div>
              <div class="urltype-item" v-for="(item, index) in appInfo.plist.urlTypes" :key="index">
                <div style="flex:1;display:flex;">
                  <input v-model="item.identify" type="text" style="flex:1;"/>
                  <input v-model="item.scheme" type="text" style="flex:1;" />
                </div>
                <div class="delete" @click="deleteUrlType(item)">-</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="section-wrapper">
        <div class="section-title">项目配置</div>
        <div class="table">
          <div class="cell" v-for="(value, key) in appInfo.headfile" :key="key">
            <div class="cell-left text-field">{{ fieldName(key) }}</div>
            <input class="cell-right text-input" placeholder="请输入" type="text" v-model="appInfo.headfile[key]">
          </div>
        </div>
      </div>

      <div class="section-wrapper">
        <div class="section-title">项目图片</div>
        <div class="image-wrapper">
          <upload-item
            v-for="(urls, name) in appInfo.imageAssets"
            :key="name"
            :name="name"
            :imageUrls="urls"
            fileType="image"
            description="iconx9 launchx7 normalx2"
            @changed="uploadImages"
          />
        </div>
      </div>

      <div class="section-wrapper">
        <div class="section-title">资源文件</div>
        <div class="file-wrapper">
          <upload-item
            v-for="(url, name) in appInfo.files" :key="name"
            description="ocr文件"
            fileType="file"
            :name="name"
            :fileUrl="url"
            @changed="uploadFile"
          />
        </div>
      </div>
      
    </div>
  </div>
</template>

<script>
import { translate, requestDomain, makeUpdateInfo } from './helper'
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
    }
  },
  created () {
    let data = this.$route.params.info
    this.origInfo = JSON.parse(data)
    this.appInfo = JSON.parse(data)
  },
  methods: {
    deleteUrlType: function(item) {
      this.appInfo.plist.urlTypes = this.appInfo.plist.urlTypes.filter(type => type != item)
    },
    adddUrlType: function () {
      this.appInfo.plist.urlTypes.push({identify:'', scheme: ''})
    },
    diff: function () {
      this.updateInfo = this.getUpdateInfo()
      this.$confirm(this.updateInfo, '修改内容', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.submit()
      }).catch(() => {})
    },
    submit: function () {
      let postData = {
        companyCode: this.code,
        form: this.updateInfo
      }
      this.$axios.post(requestDomain() + '/project/editProject', postData)
        .then(() => {
          this.alertShow = false
          this.$store.commit('setNeedsRefresh')
          this.$router.go(-1)
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
    uploadFile: function (event, name) {
      let form = new FormData()
      let files = event.target.files
      for (let index = 0; index < files.length; index++) {
        const file = files[index];
        form.append('image'+index, file)
      }
      this.$axios
        .post(requestDomain() + '/files/upload', form)
        .then(res => {
          this.$set(this.appInfo.files, name, res.data[0])
        })
    },
    uploadImages: function (event, name) {
      let form = new FormData()
      let files = event.target.files
      for (let index = 0; index < files.length; index++) {
        const file = files[index];
        form.append('image'+index, file)
      }
      this.$axios
        .post(requestDomain() + '/files/upload', form)
        .then(res => {
          this.$set(this.appInfo.imageAssets, name, res.data)
        })
    },
    fieldName: function (field) {
      return translate(field)
    }
  }
}
</script>

<style scoped>
@import '../edit.css';
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
  border: 1px solid #EBF3FF;
}
</style>
