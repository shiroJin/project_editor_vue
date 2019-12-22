<template>
  <div class="root-container" v-if="loaded">
    <div class="nav">
      <div class="title">新增应用</div>
    </div>

    <div class="content">
      <el-steps class="steps" :space="200" :active="active" direction="vertical">
        <el-step title="步骤一" description="分支及Target信息配置"></el-step>
        <el-step title="步骤二" description="应用信息配置"></el-step>
      </el-steps>

      <div class="container">
        <div class="step1" v-if="active === 1">

          <!-- <div class="form-item">
            <div class="form-item-title"><span style="color:red;" v-if="requiredList.includes(key)">*</span>exist branch</div>
            <div class="form-item-content">
              <el-switch
                v-model="existBranch"
                active-color="#13ce66"
                inactive-color="#eaeaea">
              </el-switch>
            </div>
          </div> -->

          <div class="form-item">
            <div class="form-item-title"><span style="color:red;">*</span>branch</div>
            <div class="form-item-content">
              <el-input 
                placeholder="请输入内容"
                v-model="branch"
                clearable>
              </el-input>
            </div>
          </div>

          <div class="form-item">
            <div class="form-item-title"><span style="color:red;">*</span>tag</div>
            <div class="form-item-content">
              <el-input 
                placeholder="请输入内容"
                v-model="tag"
                clearable>
              </el-input>
            </div>
          </div>

          <div class="form-item" v-for="(value, key) in configuration" :key="key">
            <div class="form-item-title"><span style="color:red;" v-if="requiredList.includes(key)">*</span>{{ key }}</div>
            <div class="form-item-content">
              <el-input 
                v-if="key !== 'store'"
                placeholder="请输入内容"
                v-model="configuration[key]"
                clearable>
              </el-input>
              <el-switch
                v-if="key === 'store'"
                v-model="configuration.store"
                active-color="#13ce66"
                inactive-color="#eaeaea">
              </el-switch>
            </div>
          </div>

          <el-button @click="next">下一步</el-button>
        </div>

        <div class="step2" v-if="active === 2">
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
                  <div style="font-size:15px;font-weight:bold;">URL Types</div>
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

            <div>
              <el-button @click="prev">上一步</el-button>
              <el-button type="primary" @click="submit">提交</el-button>
            </div>

          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
import { translate, requestDomain } from '../js/helper'
import uploadItem from './uploadItem'

export default {
  components: {
    'upload-item': uploadItem
  },
  data() {
    return {
      loaded: false,
      active: 1,
      appInfo: {},
      tags: [],
      configuration: {
        target: '',
        identify: '',
        store: false,
        privateGroup: '',
        imageAssets: '',
        headfile: ''
      },
      requiredList: ['target', 'identify', 'branch'],
      existBranch: false,
      branch: '',
      tag: ''
    }
  },
  created () {
    // this.tags = JSON.parse(this.$route.params.tags)
    this.$axios
      .get(requestDomain() + '/project/app-form')
      .then(res => {
        this.loaded = true
        this.appInfo = res.data
      })
  },
  methods: {
    prev: function () {
      this.active = 1
    },
    next: function () {
      let checkValue = this.validateConfiguration()
      if (checkValue) {
        this.active = 2
      } else {
        alert("填写相关信息")
      }
    },
    validateConfiguration: function () {
      if (!this.branch.length) return false
      if (!this.tag.length) return false
      if (!this.configuration.target.length) return false
      if (!this.configuration.identify.length) return false
      return true
    },
    deleteUrlType: function(item) {
      this.appInfo.plist.urlTypes = this.appInfo.plist.urlTypes.filter(type => type != item)
    },
    adddUrlType: function () {
      this.appInfo.plist.urlTypes.push({identify:'', scheme: ''})
    },
    submit: function () {
      let postData = {
        branch: this.branch,
        tag: this.tag,
        configuration: this.configuration,
        form: this.appInfo
      }
      this.$axios.post(requestDomain() + '/project/addProject', postData)
        .then(() => {
          this.alertShow = false
          this.$store.commit('setNeedsRefresh')
          this.$router.go(-1)
        })
        .catch(() => {})
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

<style lang="scss" scoped>
@import '../edit.css';
.content {
  margin: 30px;
  display: flex;
}
.container {
  flex: 1;
  max-width: 700px;
}
.steps {
  height:300px;
  width:200px;
}
.form-item {
  display: flex;
  align-items: center;
  height: 60px;
  
  .form-item-title {
    width: 100px;
    text-align: right;
    font-size: 15px;
    margin-right: 15px;
  }
  
  .form-item-content {
    flex: 1;
    display: flex;
  }
}
</style>
