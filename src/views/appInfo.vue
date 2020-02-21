<template>
  <div>
    <div class="nav">
      <div class="title">
        <div>Free my Mac</div>
      </div>
      <div class="action">
        <el-button type="primary" icon="el-icon-refresh-left" @click="pull">Git Pull</el-button>
        <el-dropdown class="dropdown" @command="checkout">
          <div class="el-dropdown-link">
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
        <el-button type="primary" icon="el-icon-plus" @click="addApp">新增应用</el-button>
      </div>
    </div>

    <div class="info-container" v-if="appInfo">
      <div class="header">
        <div class="app-wrapper">
          <img :src="iconUrl()">
          <div class="base-info">
            <h2>{{ appInfo.plist.CFBundleDisplayName }}</h2>
            <p>version: {{ appInfo.plist.CFBundleShortVersionString }}</p>
            <p>build: {{ appInfo.plist.CFBundleVersion }}</p>
          </div>
          <div style="margin: 5px; display: flex;align-self: flex-start;" v-if="dirty">
            <el-tooltip class="text-break" :content="status" placement="bottom" popper-class="poper">
              <el-tag type="danger" style="margin-right: 15px">已编辑</el-tag>
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
            <el-button type="primary" @click="editInfo" icon="el-icon-edit">Edit</el-button>
            <el-button type="primary" icon="el-icon-box" @click="packageIpa">Package</el-button>
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

          <div class="entitlements-wrapper" v-if="appInfo.plist.urlTypes.length">
            <div class="subtitle-wrapper">Url types:</div>
            <div class="url-types-wrapper" style="flex:3">
              <div class="url-types-tag">
                <span>URL Identify</span><span>URL Scheme</span>
              </div>
              <div style="display:flex;justify-content: space-between;padding-left:30px;" v-for="(item, index) in appInfo.plist.urlTypes" :key="index">
                <div>{{ item.identify }}</div>
                <div>{{ item.scheme }}</div>
              </div>
            </div>
          </div>

          <div class="entitlements-wrapper">
            <div class="subtitle-wrapper">Entitlements:</div>
            <div class="url-types-wrapper" style="flex:3">
              <div class="url-types-tag">
                <span>Key</span><span>Value</span>
              </div>
              <div style="display:flex;justify-content: space-between;padding-left:30px;" v-for="(value, key) in appInfo.entitlements" :key="key">
                  <div class="item" v-if="!empty(value)">
                    <div style="padding-right:10px">{{ fieldName(key) }}</div>
                    <div style="white-space: pre-wrap">{{ fieldValue(value) }}</div>
                  </div>
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
              <el-image fit="scale-down" :src="item[0]" class="slice" :preview-src-list="item"></el-image>
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
import { translate, requestDomain, formatPrint } from '../js/helper'
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
      id: undefined
    }
  },
  created () {
    this.reloadData()
  },
  activated () {
    let refresh = this.$store.state.needRefresh
    if (refresh) {
      this.reloadData()
      this.$store.commit('setRefreshed')
    }
  },
  methods: {
    iconUrl () {
      let icon = this.appInfo.imageAssets.AppIcon
      return icon[0]
    },
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
      this.fetchCurrentProject()
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
          let data = res.data
          this.loading.close()
          this.$message({
            message: data.stdout + data.stderr,
            duration: 3000,
            showClose: true
          })
        })
    },
    checkout (app) {
      this.loading = this.$loading({ fullscreen: true })
      this.$axios
        .post(requestDomain() + '/project/checkout', {
          id: app.id
        })
        .then(res => {
          this.$message({
            message: res.data.msg
          })
          this.loading.close()
          this.fetchAppInfo()
        })
        .catch(() => {
          this.loading.close()
        })
    },
    fetchAppInfo () {
      if (!this.loading) {
        this.loading = this.$loading({ fullscreen: true })
      }
      this.$axios
        .get(`${requestDomain()}/project/projectInfo`, {
          params: {
            id: this.id
          }
        })
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
          this.status = res.data.status
        })
    },
    fetchCurrentProject () {
      this.$axios
        .get(requestDomain() + '/project/current')
        .then(res => {
          this.id = res.data.id
          this.fetchAppInfo()
        })
        .catch(err => {
          alert(err.msg)
        })
    },
    editInfo () {
      this.$router.push({
        name: 'appEdit',
        params: { info: JSON.stringify(this.appInfo), id: this.id }
      })
    },
    addApp () {
      this.$router.push({
        name: 'addApp',
        params: { tags: JSON.stringify(this.tags) }
      })
    },
    packageIpa () {
      console.log("package")
    },
    fieldName (field) {
      return translate(field)
    },
    fieldValue (value) {
      return formatPrint(value)
    },
    empty (value) {
      return value.length === 0
    }
  }
}
</script>

<style lang="scss" scoped>
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
  height: 100px;
  background-color: #fafafa;
}
.content-wrapper {
  min-width: 800px;
}
.action {
  margin-right: 15px;
  display: flex;
  button {
    margin: 0 10px;
    padding: 10px;
  }
  .el-dropdown-link {
    height: 37px;
    cursor: pointer;
    border-radius: 3px;
    font-size: 15px;
    display: flex;
    align-items: center;
    background-color:#409EFF;
    color:white;
    padding: 0 5px;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
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
.url-types-tag {
  color:gray;
  line-height:20px;
  font-size:13px;
  display:flex;
  justify-content:space-between;
  padding-left:30px;
  font-weight:bold;
  font-style: italic;
  margin-bottom: 10px;
}
.subtitle-wrapper {
  flex:1;
  text-align:left;
}
.entitlements-wrapper {
  width: 100%;
  border-top: 1px dashed lightgrey;
  display: flex;
  margin-top:5px;
  padding-top: 5px;
}
</style>
