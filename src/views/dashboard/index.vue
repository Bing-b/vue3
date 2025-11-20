<template>
  <div id="home" class="relative h-full overflow-auto bg-[#f0f2f5] dark:bg-black dark:text-white">
    <h2 class="title flex items-center justify-between" data-intro="这是第一步😃" data-step="1"
      >组件 <el-button @click="initIntor">引导</el-button></h2
    >
    <div class="flex gap-8 rounded bg-white p-5 dark:bg-black">
      <!-- 倒计时 -->
      <CountDown data-intro="这是第二步🦝" data-step="2" />

      <!-- 日历 -->
      <calendar />

      <!-- 天气 -->
      <weather />

      <!-- 代码统计 -->
      <am-charts data-intro="结束了你嘞" data-step="3" />

      <div class="lottie rounded-[25px]">
        <!-- 动画 -->
        <LottieWeb />
      </div>
    </div>

    <div class="mt-2 h-[calc(100%-300px)] bg-[#f0f2f5] dark:bg-black dark:text-white">
      <h2 class="title flex items-center justify-between">概览</h2>
      <!-- 仓库提交统计图 -->
      <div class="flex h-[calc(100%-50px)]">
        <img
          v-show="!globalConfigStore.appDark"
          class="inline-block h-full w-[750px] object-cover"
          src="https://raw.githubusercontent.com/Bing-b/Bing-b/main/profile-3d-contrib/profile-gitblock.svg"
          alt="" />
        <img
          v-show="globalConfigStore.appDark"
          class="inline-block h-full w-[750px] object-cover"
          src="https://raw.githubusercontent.com/Bing-b/Bing-b/main/profile-3d-contrib/profile-night-green.svg"
          alt="" />

        <!-- 欢迎 -->
        <div
          class="flex h-full flex-1 flex-col gap-4 overflow-hidden border-l border-l-[#ececec] p-3 dark:!border-l-[#333]">
          <Welcome />
          <div
            class="relative flex h-[calc(100%-120px)] w-full items-center justify-between overflow-hidden rounded-xl bg-white px-10 dark:bg-black">
            <svgIcon name="hands-ok" size="160" />
            <LottieCat />
            <svgIcon name="hands-clac" size="160" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, onMounted, useTemplateRef, ref } from 'vue';
import intro from 'intro.js';
import 'intro.js/introjs.css';
import useCancelRequest from '@/hooks/useCancelRequest';
import { getGitHubProject, testCancelApi } from '@/api/common';
import useGlobalConfig from '@/store/modules/global';
import Calendar from './components/calendar.vue';
import CountDown from './components/countdown.vue';
import Weather from './components/weather.vue';
import AmCharts from './components/amCharts.vue';
import LottieWeb from '@/views/lottie-web/index.vue';
import Welcome from './components/welcome.vue';
import LottieCat from '@/views/lottie-web/cat.vue';
// const { loadCancelAlert, cancelPendingAlert, signal } = useCancelRequest();

// 获取全局配置
const globalConfigStore = useGlobalConfig();

const projectList = ref<any[]>([]);

// 启动引导页
const initIntor = () => {
  intro()
    .setOption('nextLabel', ' 下一步 ')
    .setOption('prevLabel', ' 上一步 ')
    .setOption('doneLabel', ' 完成 ')
    .start();
};

/** 获取github 项目信息 */
const getGitHubInof = async () => {
  const { data } = await getGitHubProject();
  if (data && data.length) projectList.value = [...data];
};

// const testCancel = () => {
//   loadCancelAlert();
//   testCancelApi('', signal.value)
//     .then(() => {
//       cancelPendingAlert();
//     })
//     .finally(() => {
//       cancelPendingAlert();
//       ElMessageBox.close();
//     });
// };

onMounted(() => {
  // getGitHubInof();
});
</script>
<style lang="scss" scoped>
:deep(.el-progress__text) {
  color: #555 !important;
  font-size: 15px !important;
  font-family: 'MapleMono' !important;
}

:deep(.el-progress-circle__track) {
  stroke: #e7f0fd !important;
}

.dark .lottie {
  background-image: linear-gradient(120deg, #3e3e3e 0%, #2c2c2c 100%);
}

.lottie {
  background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
}

.tec {
  > div {
    display: flex;
    align-items: center;
    width: 33.33%;
    padding: 20px;
    //box-shadow: 1px 0 #f0f0f0, 0 1px #f0f0f0, 1px 1px #f0f0f0, 1px 0 #f0f0f0 inset, 0 1px #f0f0f0 inset;
    // transition: all .3s;

    p {
      margin-left: 24px;
      font-size: 18px;
      color: #444;
      display: flex;
      flex-direction: column;

      span {
        font-size: 14px;
        color: #666;
      }
    }
  }
}

:deep(.el-progress__text) {
  color: #fff;
}

:deep(.el-progress-circle__track) {
  stroke: #8c746d;
}
</style>
