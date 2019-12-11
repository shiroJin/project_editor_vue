<template>
  <div class="item-wrapper">
    <div class="upload-wrapper">
      <input class="file-input" type="file" @change="$emit('changed', $event, imgKey)">
    </div>
    <img class="image" :src="imgUrl">
    <div class="subTitle">{{ imgKey }}</div>
  </div>
</template>

<script>
export default {
  props: {
    imgKey: {
      type: String
    },
    imgUrl: {
      type: String
    }
  }
}
</script>

<style scoped>
.subTitle {
  font-size: 12px;
}
.item-wrapper {
  position: relative;
  margin: 0 4px;
}
.upload-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}
.file-input {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.image {
  max-width: 100px;
  border: 1px dashed lightgrey;
}
</style>
