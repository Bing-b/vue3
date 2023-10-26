<template>
  <div>
    <el-progress :percentage="percentage" :striped="true" :striped-flow="true" />
  </div>
  <div>
    <el-progress type="circle" :percentage="percentage" />
  </div>
  <div>
    <el-button type="primary" @click="start()">开始</el-button>
    <el-button type="danger" @click="end()">结束</el-button>
  </div>
</template>

<script setup lang="ts">
import { useFakeProgress } from '@/hooks/useFakeProgress';

const fakeProgress = useFakeProgress();
const percentage = fakeProgress.percentage;
const { start, end } = fakeProgress;
</script>
