<template>
  <div class="overflow-auto h-full">
    <div class="card mb10">
      <h4 class="title">简介</h4>
      <span class="font-[xht] font-bold text-[20px]">
        <el-link type="primary" href="https://docs.spicyboy.cn" target="_blank">AgeraRs</el-link>
        一款基于 Vue3.4、TypeScript、Vite5、Pinia、Element-Plus的功能技术系统
      </span>
    </div>
    <div class="card mb10">
      <h4 class="title">项目信息</h4>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="版本号" label-align="left">
          <el-tag>{{ version }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="发布时间" label-align="left">
          <el-tag>{{ lastBuildTime }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="GitHub" label-align="left">
          <el-link type="primary" href="https://github.com/Bing-b/vue3" target="_blank">
            GitHub
          </el-link>
        </el-descriptions-item>
        <el-descriptions-item label="CSDN" label-align="left">
          <el-link
            type="primary"
            href="https://blog.csdn.net/Centenario_0?type=blog"
            target="_blank">
            CSDN
          </el-link>
        </el-descriptions-item>
        <el-descriptions-item label="个人博客" label-align="left">
          <el-link type="primary" href="https://bing-b.github.io/BanBing/" target="_blank">
            个人博客
          </el-link>
        </el-descriptions-item>
        <el-descriptions-item label="预览地址" label-align="left">
          <el-link type="primary" href="https://gsap.com/" target="_blank"> 预览地址 </el-link>
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <div class="card mb10">
      <h4 class="title">生产环境依赖</h4>
      <el-descriptions :column="3" border>
        <el-descriptions-item
          v-for="(value, key) in dependencies"
          :key="key"
          width="400px"
          :label="key">
          <el-tag type="info">
            {{ value }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <div class="card">
      <h4 class="title">开发环境依赖</h4>
      <el-descriptions :column="3" border>
        <el-descriptions-item
          v-for="(value, key) in devDependencies"
          :key="key"
          width="400px"
          :label="key">
          <el-tag type="info">
            {{ value }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as pkg from '../../../package.json';
import dayjs from 'dayjs';
const { dependencies, devDependencies, version } = pkg;

const lastBuildTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
</script>

<style lang="scss" scoped>
.card {
  padding: 20px;
  .title {
    margin: 0 0 15px;
    font-size: 17px;
    font-weight: bold;
    color: var(--el-text-color-primary);
  }
  .text {
    font-size: 15px;
    line-height: 25px;
    color: var(--el-text-color-regular);
    .el-link {
      font-size: 15px;
    }
  }
}
</style>
