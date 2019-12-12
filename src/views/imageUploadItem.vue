<template>
  <div class="wrapper">
    <div class="header">
      <div class="item-title">{{ name }}</div>
      <el-tooltip :content="description" placement="top">
        <i class="el-icon-question"></i>
      </el-tooltip>
      <input class="file-input" type="file" multiple @change="$emit('changed', $event, name)">
    </div>
    <div class="images-wrapper">
      <div class="image-item" v-for="(item, index) in imageUrls" :key="index">
        <img class="image" :src="item" alt="">
        <div class="filename">{{ filename(item) }}</div>
      </div>
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

<style>
.wrapper {
  margin: 10px 0;
  padding: 10px;
  background-color: #EBF3FF;
  border-radius: 5px;
  position: relative;
}
.item-title {
  font-size: 20px;
  font-weight: bold;
  text-align: left;
  padding: 0 5px;
}
.images-wrapper {
  display: flex;
  align-items: flex-end;
}
.image {
  max-width: 100px;
  border: 1px dashed lightgrey;
  margin: 0 3px;
}
.file-input {
  position: absolute;
  top: 0;
  right: 0;
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
}
</style>
