<template>
  <div class="h-full dark:text-white overflow-auto">
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

        <h3>888.88w</h3>
      </div>
      <div class="sec2">
        <div
          v-motion
          :initial="{
            opacity: 0,
            y: 100,
          }"
          :enter="{
            opacity: 1,
            y: 0,
            transition: {
              delay: 180,
            },
          }">
          <div><SvgIcon name="gitlab" size="24" /></div>
          <p>1234</p>
          <span>gitLab 访问</span>
        </div>
        <div
          v-motion
          :initial="{
            opacity: 0,
            y: 100,
          }"
          :enter="{
            opacity: 1,
            y: 0,
            transition: {
              delay: 200,
            },
          }">
          <div><SvgIcon name="github" size="24" /></div>
          <p>6666</p>
          <span>gitHub 访问</span>
        </div>
        <div
          v-motion
          :initial="{
            opacity: 0,
            y: 100,
          }"
          :enter="{
            opacity: 1,
            y: 0,
            transition: {
              delay: 220,
            },
          }">
          <div><SvgIcon name="now" size="24" /></div>
          <p>1111</p>
          <span>今日访问</span>
        </div>
        <div
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
          <div><SvgIcon name="yesterday" size="24" /></div>
          <p>7896</p>
          <span>昨日访问</span>
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
        <Echart />
      </div>
    </div>

    <div class="flex mt-2">
      <div
        class="w-3/4 bg-white dark:bg-bg_color dark:border dark:border-[#414243] rounded"
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
        <h2 class="px-4 py-2 border-b dark:border-[#414243]">项目技术</h2>
        <div class="flex flex-wrap tec" data-intro="这是第三步" data-step="3">
          <div>
            <svgIcon name="Vue" size="40"></svgIcon>
            <p>Vue<span>这是一个很牛的技术</span></p>
          </div>

          <div>
            <svgIcon name="element-plus" size="40" />
            <p>Element-plus<span>这是一个很牛的技术</span></p>
          </div>
          <div>
            <svgIcon name="vitejs" size="40"></svgIcon>
            <p>Vite<span>这是一个很牛的技术</span></p>
          </div>
          <div>
            <svgIcon name="typescript" size="40"></svgIcon>
            <p>TS<span>这是一个很牛的技术</span></p>
          </div>
          <div>
            <svgIcon name="html" size="40"></svgIcon>
            <p>HTML<span>这是一个很牛的技术</span></p>
          </div>
          <div>
            <svgIcon name="css" size="40"></svgIcon>
            <p>CSS<span>这是一个很牛的技术</span></p>
          </div>
        </div>
      </div>
      <div
        class="flex-1 bg-white ml-3 flex items-center justify-between p-5 time"
        data-intro="这是第四步"
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
          <h4 class="text-[40px]">{{ date.remainingDays }}<span>天</span></h4>
          <p
            >{{ date.hour }}<span>h</span>{{ date.minute }} <span>m</span>{{ date.second
            }}<span>s</span></p
          >
        </div>
        <div>
          <el-progress type="circle" :percentage="date.process" color="#fff" :width="100" />
        </div>
      </div>
    </div>
    <!-- <div class="mt-2 w-[500px] h-[300px]">
      <Echarts3D />
    </div> -->
    <LottieWeb />
  </div>
</template>
<script lang="ts" setup>
import { reactive, onMounted, onUnmounted } from 'vue';
import { getWeather } from '@/api/common';
import LottieWeb from '../lottieWeb/index.vue';
import Echart from './homeCharts.vue';
import Motion from '@/utils/motion';
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

// 获取城市天气
const getCityWeather = () => {
  getWeather({ city: '成都' }).then((data) => {
    console.log(data);
  });
};

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

onMounted(() => {
  timer = setInterval(() => updateDate(), 1000);

  // getCityWeather();
  // setTimeout(() => {
  //   proxy!.$intro()
  //     .setOption('nextLabel', ' 下一步 ')
  //     .setOption('prevLabel', ' 上一步 ')
  //     .setOption('doneLabel', ' 完成 ')
  //     .start();
  // }, 500);
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

    &:hover {
      box-shadow: 0 1px 2px -2px #00000029, 0 3px 6px #0000001f, 0 5px 12px 4px #00000017;
    }

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
      background: url(/assets/png/1-bg-CzLsO-qF.png);
      background-color: #e8faea;
      background-size: 100% 100%;
      svg {
        color: #37dc4a;
      }
    }
    &:nth-child(2) {
      background: url(/assets/png/2-bg-nT9fBbQS.png);
      background-color: #e7e1fb;
      background-size: 100% 100%;
      svg {
        color: #8267da;
      }
    }
    &:nth-child(3) {
      background: url(/assets/png/3-bg-CCqvwnXm.png);
      background-color: #fdf3e9;
      background-size: 100% 100%;
      svg {
        color: #3944de;
      }
    }
    &:last-child {
      background: url(/assets/png/4-bg-CVnN36ZN.png);
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
      font-family: DIN;
      font-size: 28px;
      font-weight: 700;
      color: #1a1a37;
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
