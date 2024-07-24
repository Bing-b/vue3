<template>
  <div class="p-5">
    <ul>
      <li v-for="file in files" :key="file.name">
        <img class="td-image-thumb w-[100px]" v-if="file.blob" :src="file.blob" />
        <span v-else>No Image</span>
        <span class="txt">文件名：</span> {{ file.name }} <span class="txt">文件大小：</span
        >{{ $formatSize(file.size) }} <span class="txt">上传状态: </span> {{ file.success }}
        <span class="txt">Error: </span>{{ file.error }}
      </li>
    </ul>
    <div class="w-full mb-4 flex gap-5">
      <VueUpload
        ref="upload"
        :post-action="postUrl"
        v-model="files"
        @input-file="inputFile"
        @input-filter="inputFilter"
        :multiple="true">
        <el-button>选择文件</el-button>
      </VueUpload>

      <el-button type="primary" @click.prevent="uploadFiles">上传</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import VueUpload from 'vue-upload-component';

const postUrl = 'http://127.0.0.1:3000/oss/upload';

// 上传文件列表
const files = ref<any[]>([]);

// 上传文件实例
const upload = ref();

const inputFile = (newFile, oldFile) => {
  if (newFile && oldFile && !newFile.active && oldFile.active) {
    // 获得相应数据
    console.log('response', newFile.response);
    if (newFile.xhr) {
      //  获得响应状态码
      console.log('status', newFile.xhr.status);
    }
  }
};

// 文件过滤
const inputFilter = (newFile, oldFile, prevent) => {
  if (newFile && !oldFile) {
    console.log(newFile);
    // 过滤不是图片后缀的文件
    if (!/\.(jpeg|jpe|jpg|gif|png|webp|svg|zip)$/i.test(newFile.name)) {
      alert('文件格式不支持');
      return prevent();
    }
  }

  // 创建 blob 字段 用于图片预览
  newFile.blob = '';
  const URL = window.URL || window.webkitURL;
  if (URL && URL.createObjectURL) {
    newFile.blob = URL.createObjectURL(newFile.file);
  }
};

const uploadFiles = () => {
  if (upload.value) {
    upload.value.active = true;
  }
};
</script>

<style scoped>
.txt {
  color: brown;
}
</style>
