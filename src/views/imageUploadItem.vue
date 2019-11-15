<template>
  <div class="wrapper">
    <div class="item-title">{{ title }}</div>
    <div class="item-content">
      <div class="preview" v-if="type === 'image' && previewUrl">
        <img class="image" :src="previewUrl">
      </div>
      <div class="upload">
        <input class="file-input" type="file" multiple @change="$emit('fileChanged', $event, title)">
        <div class="upload-icon">
          <img src="../assets/add_icon.png">
        </div>
      </div>
      <div class="file-list" v-if="Array.isArray(fileList) && fileList.length > 0 && type === 'image'">
        <img class="small-image" :src="fileList[0]">
        <div style="align-self: flex-end" >x {{ fileList.length }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      require: true
    },
    previewUrl: {
      type: String,
      require: false
    },
    fileList: {
      type: Array,
      require: false
    },
    type: {
      type: String,
      default: 'image'
    }
  }
}
</script>

<style>
.wrapper {
  padding: 10px 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 200px;
}
.item-title {
  font-size: 18px;
  font-weight: bold;
}
.item-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.image {
  border: 1px dashed lightgrey;
  width: 100px;
}
.file-list {
  display: flex;
}
.small-image {
  padding: 1px;
  width: 100px;
  border: 1px dashed lightgray;
}
.upload {
  width: 60px;
  height: 60px;
  position: relative;
}
.file-input {
  width: 60px;
  height: 60px;
  position: absolute;
  left: 0;
  top: 0;
}
.upload-icon {
  width: 60px;
  height: 60px;
  position: absolute;
  z-index: 2;
  left: 0;
  top: 0;
  pointer-events: none;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}
.upload-icon i {
  width: 100%;
  height: 100%;
}
</style>