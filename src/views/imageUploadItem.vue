<template>
  <div class="upload-item-wrapper">
    <div class="header">
      <div style="display:flex;">
        <div class="item-title">{{ name }}</div>
        <el-tooltip :content="description" placement="top" v-if="description">
          <i class="el-icon-question"></i>
        </el-tooltip>
      </div>
      <div class="upload-wrapper">
        <img src="../assets/upload.png" alt="">
        <input class="file-input" type="file" multiple @change="$emit('changed', $event, name)">
      </div>
    </div>

    <div class="image-wrapper" style="width:100%" v-if="fileType==='image'">
      <el-image
        class="image"
        fit="scale-down" 
        :src="imageUrls[0]"
        :preview-src-list="imageUrls"
        lazy
      >
        <div slot="error" style="font-size:12px;width:60px;height:60px;line-height:60px;">
          请上传图片
        </div>
      </el-image>
      <div style="font-size:10px">点击图片查看更多</div>
    </div>

    <div class="file-cotainer" v-if="fileType === 'file'">
      <img class="image" style="width:60px;height:60px;" src="../assets/file.png" v-if="fileUrl">
      <a :href="fileUrl" download v-if="fileUrl">
        <span style="font-size:10px;">点击下载</span>
      </a>
      <div class="file-empty" v-if="!fileUrl">未上传</div>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String
    },
    imageUrls: {
      type: Array
    },
    description: {
      type: String
    },
    fileUrl: {
      type: String
    },
    fileType: {
      type: String,
      default: "image"
    }
  },
  methods: {
    filename (url) {
      let file = url.split('/').pop()
      let name = file.split('.').shift()
      return name
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-item-wrapper {
  margin: 10px;
  padding: 10px;
  background-color: #EBF3FF;
  border-radius: 5px;
  position: relative;
  min-width: 180px;
}
.item-title {
  font-size: 13px;
  font-weight: bold;
  text-align: left;
  padding: 0 5px;
}
.image-wrapper {
  display: flex;
  align-items: center;
  flex-direction: column;
}
.image {
  border: 1px dashed lightgrey;
  border-radius: 5px;
  margin: 5px;
  width:100px;
  height:100px;
}
.upload-wrapper {
  position: relative;
  width: 30px;
  height: 30px;
}
.upload-wrapper img {
  width: 100%;
  height: 100%;
  background-color: #EBF3FF;
  z-index: 2;
  position: absolute;
  top: 0;
  right: 0;
  pointer-events: none;
}
.file-input {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
}
.image-item .filename {
  width: 100%;
  color: gray;
  font-size: 10px;
  text-align: center;
}
.header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  justify-content: space-between;
}
.file-cotainer {
  display: flex;
  align-items: center;
  flex-direction: column;
}
.file-cotainer .file-empty {
  width:60px;
  height:60px;
  border: 1px dashed lightgray;
  border-radius: 5px;
  line-height:60px;
  text-align: center;
  font-size: 15px;
  font-weight: bolder;
  color: #aaa;
}
</style>
