<template>
  <div class="p-5">
    <h2 class="title">模拟进度条</h2>
    <div class="flex gap-10">
      <el-progress :percentage="percentage" :striped="true" :striped-flow="true" class="w-1/2" />
      <el-progress type="circle" :percentage="percentage" />
    </div>
    <div>
      <el-button type="primary" @click="start()">开始</el-button>
      <el-button type="danger" @click="end()">结束</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFakeProgress } from '@/hooks/useFakeProgress';

const fakeProgress = useFakeProgress();
const percentage = fakeProgress.percentage;
const { start, end } = fakeProgress;
</script>
