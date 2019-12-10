<template>
  <div>
    <div class="nav">
      <div class="title">{{ greeting }}</div>
      <div class="action">
        <el-dropdown class="dropdown">
          <span class="el-dropdown-link">
            <div>Tags</div>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu class="dropdown-menu" slot="dropdown">
            <el-dropdown-item v-for="(item, index) in tags" :key="index">
              {{ item }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown class="dropdown" @command="checkout">
          <span class="el-dropdown-link">
            <div>切换App</div>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
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
          <img :src=appInfo.images.AppIcon>
          <div class="base-info">
            <h2>{{ appInfo.CFBundleDisplayName }}</h2>
            <p>version: {{ appInfo.CFBundleShortVersionString }}</p>
            <p>build: {{ appInfo.CFBundleVersion }}</p>
          </div>
          <div style="padding: 5px; display: flex; height: 100%" v-if="dirty">
            <el-tooltip class="text-break" :content="status" placement="bottom" popper-class="poper">
              <el-tag type="danger" style="margin-right: 15px">WorkTree Dirty</el-tag>
            </el-tooltip>          
          </div>
        </div>
        <div class="menu">
          <div class="menu-worktree" v-if="dirty">
            <el-button type="warning" icon="el-icon-delete" @click="trash">Trash</el-button>
            <el-button type="success" icon="el-icon-check" @click="preCommit">Commit</el-button>
          </div>
          <div class="menu-edit" v-if="!dirty">
            <el-button type="primary" @click="updateCurrent" icon="el-icon-refresh-left">Update</el-button>
            <el-button type="primary" @click="editInfo" icon="el-icon-edit">Edit</el-button>
            <el-button type="primary" disabled icon="el-icon-s-operation">Merge</el-button>
          </div>
        </div>
      </div>
      <div class="content-wrapper">
        <div class="content">
          <h2>配置信息</h2>
          <div class="item" v-for="(value, key, index) in filterInfo()" :key="index">
            <p>{{ fieldName(key) }}:</p>
            <p>{{ value }}</p>
          </div>
        </div>
        <div class="image-snapshot">
          <h2>切图信息</h2>
          <div class="image-slices">
            <div class="slice-item" v-for="(item, key, index) in appInfo.images" :key="index">
              <div>{{ key }}</div>
              <img :src="item" class="slice">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { translate } from './translate'
import { log } from 'util'
import { getRequestDomain } from '../requestDomain'
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
  methods: {
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
        .post(getRequestDomain() + '/project/commit', {
          msg: message
        })
        .then(res => {
          this.reloadData()
        })
    },
    reloadData () {
      this.fetchCurrentApp()
      this.fetchProjectRepositoryInfo()
    },
    trash () {
      this.loading = this.$loading({ fullscreen: true })
      this.$axios
        .post('/project/trash')
        .then(res => {
          this.loading.close()
          this.reloadData()
        })
        .catch(err => {
          this.loading.close()
        })
    },
    pull () {
      this.loading = this.$loading({ fullscreen: true })
      this.$axios
        .post(getRequestDomain() + '/project/pull')
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
        .post(getRequestDomain() + '/project/checkout', {
          companyCode: app.code
        })
        .then(res => {
          this.fetchCurrentApp()
        })
        .catch(err => {
          this.loading.close()
        })
    },
    fetchCurrentApp () {
      if (this.loading === undefined) {
        this.loading = this.$loading({ fullscreen: true })
      }
      this.$axios
        .get(getRequestDomain() + '/project/current')
        .then(res => {
          this.appInfo = res.data
          this.loading.close()
        })
        .catch(err => {
          this.loading.close()
        })
    },
    fetchProjectRepositoryInfo () {
      this.$axios
        .get(getRequestDomain() + '/project/repositoryInfo')
        .then(res => {
          this.dirty = res.data.is_dirty
          this.apps = res.data.project_list
          this.tags = res.data.tags
          // this.status = res.data.msg
        })
    },
    filterInfo () {
      let result = {}
      for (const key in this.appInfo) {
        if (['CFBundleDisplayName', 'CFBundleShortVersionString', 'CFBundleVersion', 'images'].includes(key)) continue
        result[key] = this.appInfo[key]
      }
      return result
    },
    editInfo () {
      this.$router.push({
        name: 'appEdit',
        params: { companyCode: this.appInfo.kCompanyCode }
      })
    },
    addApp () {
      this.$router.push({
        name: 'addApp',
        params: {
          tags: JSON.stringify(this.tags)
        }
      })
    },
    fieldName (field) {
      return translate(field)
    },
    updateCurrent () {
      this.loading = this.$loading({ fullscreen: true })
      this.$axios.post(getRequestDomain() + "/project/pullCurrent")
        .then(res => {
          this.reloadData()
        })
        .catch(err => {
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
  font-size: 18px;
}
.header {
  display: flex;
  justify-content: space-between;
  padding-bottom: 15px;
  border-bottom: 1px dashed lightgrey;
  min-width: 700px;
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
.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
}
.content h2 {
  margin-bottom: 5px;
  text-align: left;
}
.image-snapshot {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  margin: 5px;
  border: 1px dashed black;
  max-width: 100px;
}
.content-wrapper {
  min-width: 700px;
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
</style>
