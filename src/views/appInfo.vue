<template>
  <div>
    <div class="nav">
      <div class="title">{{ greeting }}</div>
      <div class="action">
        <el-dropdown class="dropdown" @command="checkout">
          <div class="el-dropdown-link" style="margin:5px 8px;height:27px;">
            <span>切换应用</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <el-dropdown-menu class="dropdown-menu" slot="dropdown">
            <el-dropdown-item
              v-for="(item, index) in apps" 
              :key="index"
              :command="item"
            >
              {{ item.displayName }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button type="primary" @click="pull">Git Pull</el-button>
        <el-button type="primary" @click="addApp">新增应用</el-button>
      </div>
    </div>
    <div class="info-container" v-if="appInfo">
      <div class="header">
        <div class="app-wrapper">
          <img :src="iconUrl">
          <div class="base-info">
            <h2>{{ appInfo.plist.CFBundleDisplayName }}</h2>
            <p>version: {{ appInfo.plist.CFBundleShortVersionString }}</p>
            <p>build: {{ appInfo.plist.CFBundleVersion }}</p>
          </div>
          <div style="padding: 5px; display: flex; height: 100%" v-if="dirty">
            <el-tooltip class="text-break" :content="status" placement="bottom" popper-class="poper">
              <el-tag type="danger" style="margin-right: 15px">WorkTree Dirty</el-tag>
            </el-tooltip>          
          </div>
        </div>
        <div class="menu">
          <div class="menu-worktree" v-if="dirty">
            <el-button type="warning" icon="el-icon-delete" @click="trash">Recover</el-button>
            <el-button type="success" icon="el-icon-check" @click="preCommit">Commit</el-button>
            <el-button type="primary" @click="editInfo" icon="el-icon-edit">Edit</el-button>
          </div>
          <div class="menu-edit" v-if="!dirty">
            <el-button type="primary" @click="updateCurrent" icon="el-icon-refresh-left">Update</el-button>
            <el-button type="primary" @click="editInfo" icon="el-icon-edit">Edit</el-button>
            <el-button type="primary" disabled icon="el-icon-s-operation">Merge</el-button>
          </div>
        </div>
      </div>
      
      <div class="content-wrapper">
        <div class="section-wrapper">
          <div class="section-title"><i class="el-icon-setting" />  Xcode配置</div>
          <div class="item" v-for="(value, key, index) in appInfo.pbxproj" :key="index">
            <p>{{ fieldName(key) }}:</p>
            <p>{{ value || "未配置" }}</p>
          </div>
          <div style="margin-top:15px;width:100%;display:flex;" v-if="appInfo.plist.urlTypes.length">
            <div style="flex:1;text-align:left;font-weight:bolder">URL TYPES</div>
            <div class="url-types-wrapper" style="flex:3">
              <div style="color:gray;line-height:20px;font-size:13px;display:flex;justify-content:space-between;padding-left:30px;font-weight:bold">
                <span>URL Identify</span><span>URL Scheme</span>
              </div>
              <div style="display:flex;justify-content: space-between;padding-left:30px;" v-for="(item, index) in appInfo.plist.urlTypes" :key="index">
                <span>{{ item.identify }}</span><span>{{ item.scheme }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="section-wrapper">
          <div class="section-title"><i class="el-icon-document" />  项目配置</div>
          <div class="item" v-for="(value, key) in appInfo.headfile" :key="key">
            <p>{{ fieldName(key) }}:</p>
            <p :class="{'gray-color' : !value}">{{ value || "未配置" }}</p>
          </div>
        </div>

        <div class="section-wrapper">
          <div class="section-title"><i class="el-icon-picture-outline" />  切图</div>
          <div class="image-slices">
            <div class="slice-item" v-for="(item, key, index) in appInfo.imageAssets" :key="index">
              <div>{{ key }}</div>
              <img :src="item[0]" class="slice">
            </div>
          </div>
        </div>

        <div class="section-wrapper">
          <div class="section-title"><i class="el-icon-tickets" />  文件</div>
          <div class="file-wrapper">
            <div class="file-item" v-for="(item, key) in appInfo.files" :key="key">
              <div>{{ key }}</div>
              <div>{{ item.length > 0 ? "FILE" : "无" }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { translate, requestDomain } from './helper'
export default {
  data() {
    return {
      item: undefined,
      appInfo: undefined,
      tags: [],
      apps: [],
      loading: undefined,
      dirty: false,
      status: '',
      greeting: ''
    }
  },
  created () {
    let date = new Date()
    let hour = date.getHours()
    if (hour < 12) {
      this.greeting = "Good morning"
    }
    else if (hour < 18) {
      this.greeting = "Good afternoon"
    }
    else {
      this.greeting = "Good evening"
    }
    this.reloadData()
  },
  computed: {
    iconUrl: function () {
      let icon = this.appInfo.imageAssets.AppIcon
      return icon[0]
    }
  },
  activated () {
    let refresh = this.$store.state.needRefresh
    if (refresh) {
      this.reloadData()
      this.$store.commit('setRefreshed')
    }
  },
  methods: {
    filename (url) {
      return url.split('/').pop()
    },
    preCommit () {
      this.$prompt('请输入Commit内容', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        this.commit(value)
      });
    },
    commit (message) {
      this.$axios
        .post(requestDomain() + '/project/commit', {
          msg: message
        })
        .then(() => {
          this.reloadData()
        })
    },
    reloadData () {
      this.fetchCurrentApp()
      this.fetchRepositoryInfo()
    },
    trash () {
      this.loading = this.$loading({ fullscreen: true })
      this.$axios
        .post(requestDomain() + '/project/trash')
        .then(() => {
          this.loading.close()
          this.reloadData()
        })
        .catch(() => {
          this.loading.close()
        })
    },
    pull () {
      this.loading = this.$loading({ fullscreen: true })
      this.$axios
        .post(requestDomain() + '/project/pull')
        .then(res => {
          let msg = res.data.msg
          this.loading.close()
          this.$message({
            message: msg,
            duration: 3000,
            showClose: true
          })
        })
    },
    checkout (app) {
      this.loading = this.$loading({ fullscreen: true })
      this.$axios
        .post(requestDomain() + '/project/checkout', {
          companyCode: app.code
        })
        .then(() => {
          this.fetchCurrentApp()
        })
        .catch(() => {
          this.loading.close()
        })
    },
    fetchCurrentApp () {
      if (!this.loading) {
        this.loading = this.$loading({ fullscreen: true })
      }
      this.$axios
        .get(requestDomain() + '/project/current')
        .then(res => {
          this.appInfo = res.data
          this.loading.close()
        })
        .catch(() => {
          this.loading.close()
        })
    },
    fetchRepositoryInfo () {
      this.$axios
        .get(requestDomain() + '/project/repositoryInfo')
        .then(res => {
          this.dirty = res.data.dirty
          this.apps = res.data.project_list
          this.tags = res.data.tags
          // this.status = res.data.msg
        })
    },
    editInfo () {
      this.$router.push({
        name: 'appEdit',
        params: { info: JSON.stringify(this.appInfo) }
      })
    },
    addApp () {
      this.$router.push({
        name: 'addApp',
        params: { tags: JSON.stringify(this.tags) }
      })
    },
    fieldName (field) {
      return translate(field)
    },
    updateCurrent () {
      this.loading = this.$loading({ fullscreen: true })
      this.$axios.post(requestDomain() + "/project/pullCurrent")
        .then(() => {
          this.reloadData()
        })
        .catch(() => {
          this.loading.close()
        })
    }
  }
}
</script>

<style scoped>
.info-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 60px;
  font-size: 15px;
}
.header {
  display: flex;
  justify-content: space-between;
  padding-bottom: 15px;
  border-bottom: 1px dashed lightgrey;
  min-width: 800px;
}
.app-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}
.header img {
  width: 90px;
  height: 90px;
  border-radius: 5px;
}
.header .base-info {
  padding-left: 30px;
  position: relative;
}
.base-info {
  text-align: left;
}
.base-info p {
  line-height: 20px;
  margin: 0;
}
.base-info h2 {
  margin: 0 0 10px 0;
}
.item {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.item p {
  margin: 5px 0;
}
.section-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  margin: 30px 0;
}
.content h2 {
  margin-bottom: 5px;
  text-align: left;
}
.image-snapshot h2 {
  margin-bottom: 5px;
  text-align: left;
}
.image-slices {
  width: 100%;
  display: flex;
}
.slice {
  margin: 10px 15px;
  border: 1px dashed lightgrey;
  width: 100px;
}
.content-wrapper {
  min-width: 800px;
}
.action {
  margin-right: 15px;
  display: flex;
}
.action button {
  padding: 5px;
  margin: 5px;
}
.el-dropdown-link {
  cursor: pointer;
  margin: 8px;
  border-radius: 3px;
  font-weight: bold;
  font-size: 15px;
  display: flex;
  align-items: center;
  background-color:#409EFF;
  color:white;
  border-radius: 4px;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.file-wrapper {
  width: 100%;
  display: flex;
}
.file-item {
  padding: 20px;
  border: 1px solid lightgray;
  border-radius: 10px;
  font-size: 15px;
}
.gray-color {
  color: lightgray;
}
.menu {
  align-self: flex-start;
}
</style>
