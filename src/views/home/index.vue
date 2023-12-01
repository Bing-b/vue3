<template>
  <div class="h-full">
    <div class="head flex items-center px-5 py-4 bg-white shadow-md">
      <div class="w-[100px] h-[100px] rounded-full overflow-hidden border border-[#dedede]" data-intro="这是第一步"
        data-step="1">
        <img class="w-full object-cover" src="@/assets/images/logo_square.png" alt="">
      </div>
      <div class=" ml-5" data-intro="这是第二步" data-step="2">
        <h4>早上好admin!</h4>
        <p>今日晴，20℃ - 32℃！</p>
      </div>
    </div>

    <div class="flex mt-2">
      <div class="w-3/4 bg-white">
        <h2 class="px-4 py-2">项目技术</h2>
        <div class="flex flex-wrap tec" data-intro="这是第三步" data-step="3">
          <div>
            <svgIcon name="Vue" size="40"></svgIcon>
            <p>Vue<span>这是一个很牛的技术</span></p>
          </div>
          <div>
            <svgIcon name="element-plus" size="40"></svgIcon>
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
      <div class="flex-1 bg-white ml-3  flex items-center justify-between p-5 time" data-intro="这是第四步" data-step="4">
        <div>
          <p class="text-[20px] font-medium">{{ date.year }}余额</p>
          <h4 class="text-[40px]">{{ date.remainingDays }}<span>天</span></h4>
          <p>{{ date.hour }}<span>h</span>{{ date.minute }} <span>m</span>{{ date.second }}<span>s</span></p>
        </div>
        <div>
          <el-progress type="circle" :percentage="date.process" color="#fff" :width="100" />
        </div>
      </div>
    </div>
    <div class="mt-2 w-[500px] h-[300px]">
      <Echarts3D />
    </div>

  </div>
</template>
<script lang="ts" setup>
import { reactive, onMounted, onUnmounted } from 'vue';
import { getWeather } from '@/assets/api/common';
import Echarts3D from '../echart/index.vue';

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
  process: 0
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
  >div {
    display: flex;
    align-items: center;
    width: 33.33%;
    padding: 20px;
    box-shadow: 1px 0 #f0f0f0, 0 1px #f0f0f0, 1px 1px #f0f0f0, 1px 0 #f0f0f0 inset, 0 1px #f0f0f0 inset;
    transition: all .3s;

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
    background-color: rgba(0, 0, 0, .2);
  }

  >div {
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
</style>
