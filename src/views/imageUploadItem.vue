<template>
  <div class="wrapper">
    <div class="item-title">{{ title }}</div>
    <div class="images-wrapper">
      <upload-item
        v-for="(value, key) in imageItems"
        :key="key"
        :imgKey="key"
        :imgUrl="value"
        @changed="uploadImages"
      ></upload-item>
    </div>
  </div>
</template>

<script>
import UploadItem from './uploadItem'
import { getRequestDomain } from '../requestDomain'

export default {
  components: {
    'UploadItem': UploadItem
  },
  props: {
    title: {
      type: String
    },
    imageItems: {
      type: Object
    }
  },
  methods: {
    uploadImages: function (event, subName) {
      let form = new FormData()
      let files = event.target.files
      for (let index = 0; index < files.length; index++) {
        const file = files[index];
        form.append('image'+index, file)
      }
      this.$axios
        .post(getRequestDomain() + '/files/upload', form)
        .then(res => {
          let url = res.data[0]
          this.imageItems[subName] = url
          this.$emit('imageChanged', this.title, subName, url)
        })
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
}
.item-title {
  font-size: 20px;
  font-weight: bold;
  text-align: left;
  margin-bottom: 10px;
}
.images-wrapper {
  display: flex;
  align-items: flex-end;
}
</style>