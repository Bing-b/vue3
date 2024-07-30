<template>
  <div class="h-full dark:text-white bg-[#f0f2f5] overflow-auto">
    <!-- 统计模块 -->
    <h2 class="title flex justify-between items-center" data-intro="这是第一步😃" data-step="1"
      >概览 <el-button @click="initIntor">引导</el-button></h2
    >
    <div class="flex gap-8 h-[430px] p-5 bg-white rounded">
      <div
        class="sec1"
        v-motion
        :initial="{
          opacity: 0,
          y: 100,
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 160,
          },
        }">
        <h2>访问总量</h2>
        <img src="@/assets/icons/calendar.svg" alt="" />

        <h3><CountTo :startVal="1" :endVal="888" />w</h3>
      </div>
      <div class="sec2">
        <div
          v-for="(item, index) in GrowCardList"
          :key="item.label"
          v-motion
          :initial="{
            opacity: 0,
            y: 100,
          }"
          :enter="{
            opacity: 1,
            y: 0,
            transition: {
              delay: 80 * (index + 1),
            },
          }">
          <div><SvgIcon :name="item.icon" size="24" /></div>
          <p class="my-2"><CountTo :startVal="1" :endVal="item.num" /></p>
          <span>{{ item.label }}</span>
        </div>
      </div>
      <div
        class="sec3"
        v-motion
        :initial="{
          opacity: 0,
          y: 100,
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 260,
          },
        }">
        <Echart data-intro="这是第二步🤣" data-step="2" />
      </div>
    </div>

    <div class="flex mt-2 h-[300px]">
      <div
        class="w-[70%] bg-white dark:bg-bg_color dark:border dark:border-[#414243] rounded"
        v-motion
        :initial="{
          opacity: 0,
          y: 100,
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 160,
          },
        }">
        <h2 class="title">项目技术</h2>
        <div class="flex flex-wrap tec" data-intro="这是第三步🖐️" data-step="3">
          <div>
            <LottieWeb />
          </div>
          <div>
            <Google />
          </div>
        </div>
      </div>
      <div
        class="flex-1 bg-white ml-3 flex items-center justify-between p-5 time"
        data-intro="这是第四步🦝"
        data-step="4"
        v-motion
        :initial="{
          opacity: 0,
          y: 100,
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 240,
          },
        }">
        <div>
          <p class="text-[20px] font-medium">{{ date.year }}余额</p>
          <h4 class="text-[40px] font-bold">{{ date.remainingDays }}<span>天</span></h4>
          <p
            >{{ date.hour }}<span>h</span>{{ date.minute }} <span>m</span>{{ date.second
            }}<span>s</span></p
          >
        </div>
        <div>
          <el-progress
            type="circle"
            :percentage="date.process"
            color="#fff"
            :width="140"
            :stroke-width="20" />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, onMounted, onUnmounted } from 'vue';
import LottieWeb from '../lottieWeb/index.vue';
import Google from '../lottieWeb/google.vue';
import Echart from './homeCharts.vue';
import { GrowCardList } from './index';
import intro from 'intro.js';

// 定时器
let timer: any = null;

// 日期
const date = reactive<{ [key: string]: number }>({
  year: 2022,
  month: 1,
  remainingDays: 0,
  hour: 0,
  minute: 0,
  second: 0,
  process: 0,
});

// 刷新时间
const updateDate = () => {
  const currentDate = new Date();
  date.year = currentDate.getFullYear();
  date.month = currentDate.getMonth() + 1;
  const currentTime = currentDate.getTime();

  // 计算剩余天数
  const endOfYear = new Date(date.year + 1, 0, 1, 0, 0, 0, 0).getTime();
  date.remainingDays = Math.ceil((endOfYear - currentTime) / (1000 * 60 * 60 * 24));

  // 获取当前的小时、分钟、秒钟
  date.hour = currentDate.getHours();
  date.minute = currentDate.getMinutes();
  date.second = currentDate.getSeconds();
  date.process = Math.round((1 - date.remainingDays / 365) * 100);
};

// 启动引导页
const initIntor = () => {
  intro()
    .setOption('nextLabel', ' 下一步 ')
    .setOption('prevLabel', ' 上一步 ')
    .setOption('doneLabel', ' 完成 ')
    .start();
};

onMounted(() => {
  timer = setInterval(() => updateDate(), 1000);
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>
<style lang="scss" scoped>
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

.time {
  position: relative;
  background: url(@/assets/images/bg.jpg) no-repeat center;
  background-size: cover;
  border-radius: 4px;
  overflow: hidden;

  &::before {
    position: absolute;
    content: '';
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    border-radius: inherit;
    background-color: rgba(0, 0, 0, 0.2);
  }

  > div {
    position: relative;
    z-index: 1;
  }

  p,
  h4 {
    color: #fff;
    font-weight: bold;

    span {
      margin: 0 6px;
      font-size: 14px;
      color: #d4d2d2;
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
  width: 22.5%;
  padding: 40px 0 30px 30px;
  overflow: hidden;
  color: #fff;
  background: url('@/assets/images/tj.png');
  background-position: 50%;
  background-size: cover;
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
.sec3 {
  width: 40%;
  border: 1px solid #dcdfe6;
  border-radius: 25px;
}
</style>
