<template>
  <div>
    <h2
      >Blob（Binary Large
      Object，二进制大对象）是浏览器提供的一种不可变、类文件的原始数据容器。它可以存储任意类型的二进制或文本数据，例如图片、音频、PDF、甚至一段纯文本。与
      File 对象相比，Blob 更底层，File 实际上继承自 Blob，并额外携带了 name、lastModified
      等元信息.</h2
    >

    <div class="my-5 flex flex-col items-start gap-5">
      <el-button @click="handleDownloadMd" type="primary">下载md</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
const handleDownloadMd = () => {
  const md = '# hhh, 这是Bolb';
  const blob = new Blob([md], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'hello.md';
  a.click();
  // 清理 DOM 元素
  document.body.removeChild(a);

  // 释放内存
  URL.revokeObjectURL(url);
};
</script>

<style scoped></style>
