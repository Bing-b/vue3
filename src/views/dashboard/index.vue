<template>
  <div id="home" class="relative h-full overflow-auto bg-[#f0f2f5] dark:bg-black dark:text-white">
    <h2 class="title flex items-center justify-between" data-intro="这是第一步😃" data-step="1"
      >概览 <el-button @click="initIntor">引导</el-button></h2
    >
    <div class="flex gap-8 rounded bg-white p-5 dark:bg-black">
      <Motion>
        <!-- 倒计时 -->
        <CountDown />
      </Motion>

      <Motion :delay="200">
        <!-- 日历 -->
        <calendar />
      </Motion>

      <Motion :delay="300">
        <!-- 天气 -->
        <weather />
      </Motion>

      <Motion :delay="400">
        <!-- 代码统计 -->
        <am-charts />
      </Motion>

      <Motion :delay="400">
        <div class="lottie rounded-[25px]">
          <!-- 动画 -->
          <LottieWeb />
        </div>
      </Motion>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, onMounted, onUnmounted } from 'vue';
import intro from 'intro.js';
import Calendar from './components/calendar.vue';
import CountDown from './components/countdown.vue';
import Weather from './components/weather.vue';
import AmCharts from './components/amcharts.vue';
import LottieWeb from '@/views/lottie-web/index.vue';
import Motion from '@/utils/motion';

// 启动引导页
const initIntor = () => {
  intro()
    .setOption('nextLabel', ' 下一步 ')
    .setOption('prevLabel', ' 上一步 ')
    .setOption('doneLabel', ' 完成 ')
    .start();
};
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

.sec1 {
  box-sizing: border-box;
  height: 100%;
  width: 30.5%;
  padding: 40px 0 30px 30px;
  overflow: hidden;
  color: #fff;
  background: url(../../assets/images/line.png);
  background-color: #4b4b56;
  background-size: 120%;
  border-radius: 20px;
  h2 {
    font-size: 18px;
    color: #333;
    font-weight: bold;
  }
  img {
    margin: 30px 0 40px;
    width: 100px;
  }
  h3 {
    font-size: 60px;
    color: #fff;
    font-weight: bold;
  }
}

.sec2 {
  display: flex;
  width: 35%;
  flex-wrap: wrap;
  place-content: space-between space-between;
  height: 100%;
  > div {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    width: 47%;
    height: 48%;
    padding: 25px;
    border-radius: 30px;
    &:first-child {
      background: url(../../assets/images/1-bg-CzLsO-qF.png);
      background-color: #e8faea;
      background-size: 100% 100%;
      svg {
        color: #37dc4a;
      }
    }
    &:nth-child(2) {
      background: url(../../assets/images/2-bg-nT9fBbQS.png);
      background-color: #e7e1fb;
      background-size: 100% 100%;
      svg {
        color: #8267da;
      }
    }
    &:nth-child(3) {
      background: url(../../assets/images/3-bg-CCqvwnXm.png);
      background-color: #fdf3e9;
      background-size: 100% 100%;
      svg {
        color: #3944de;
      }
    }
    &:last-child {
      background: url(../../assets/images/4-bg-CVnN36ZN.png);
      background-color: #f0f5fb;
      background-size: 100% 100%;
      svg {
        color: #c8805e;
      }
    }
    div {
      width: 60px;
      height: 60px;
      border-radius: 14px;
      background-color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    p {
      margin-bottom: 4px;
      font-size: 18px;
      font-weight: 700;
      color: #1a1a37;
      span {
        font: inherit;
      }
    }
    span {
      overflow: hidden;
      font-family: DIN;
      font-size: 15px;
      color: #1a1a37;
      white-space: nowrap;
    }
  }
}

.dark .sec2 {
  > div {
    background-color: #141414;
    border: 1px solid #36363a;
    div {
      background-color: #36363a;
    }
    span {
      color: #fafafa !important;
    }
  }
}

.sec3 {
  width: 25%;
  border: 1px solid #dcdfe6;
  border-radius: 25px;
}
</style>
