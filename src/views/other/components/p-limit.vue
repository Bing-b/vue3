<template>
  <div class="flex gap-5">
    <div>
      <p>p-limit 模拟并发请求发送</p>
      <p>三个请求 一个一个执行</p>
      <el-button type="primary" @click="sendRequest">发送</el-button>
    </div>
    <div class="border border-[#777777] p-5">
      <p>请求结果打印：</p>
      <div v-html="consoleValue"> </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import pLimit from 'p-limit';
import { ref } from 'vue';

const consoleValue = ref('');

// 模拟并发请求发送
const fetchFn = (params: string) => {
  return new Promise((resolve) => {
    consoleValue.value = `${consoleValue.value}<br/>${params}`;
    setTimeout(() => {
      resolve(params);
    }, 2000);
  });
};

const sendRequest = async () => {
  const limit = pLimit(1); // 设置最大并发为1

  const input = [
    limit(() => fetchFn('foo')),
    limit(() => fetchFn('bar')),
    limit(() => fetchFn('s')),
  ];
  // 只有一个promise会被同时运行
  await Promise.all(input);
};
</script>

<style scoped></style>
