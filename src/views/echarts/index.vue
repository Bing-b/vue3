<template>
  <div class="flex h-full w-full gap-5 p-5">
    <div class="border-gary-border relative h-[500px] w-[500px] border">
      <v-chart ref="mapChart" :option="option" autoresize />
      <el-switch class="!absolute right-20 bottom-20 z-10" v-model="showHeatmap" />
    </div>
    <div class="border-gary-border relative h-[500px] w-[500px] border">
      <word-cloud :options="state.chartOptions" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import VChart from 'vue-echarts';
import { ref, onMounted, watch, nextTick, reactive } from 'vue';
import * as echarts from 'echarts/core';
import { TooltipComponent, VisualMapComponent, TitleComponent } from 'echarts/components';
import { MapChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import yaanGeoJSON from './yaan.json';
import { watchEffect } from 'vue';
import WordCloud from './wordCloud.vue';

// 注册地图模块
echarts.use([MapChart, TooltipComponent, VisualMapComponent, CanvasRenderer, TitleComponent]);

const colors = [
  '#EDE7F6',
  '#B2DFDB',
  '#E6EE9C',
  '#FFCC80',
  '#FFCCBC',
  '#CE93D8',
  '#EF9A9A',
  '#F48FB1',
];

const baseOption = {
  title: {
    text: '雅安地区地图',
    left: 'center',
  },
  tooltip: {
    trigger: 'item',
    formatter: '{b}<br/>值: {c}',
  },

  series: [
    {
      name: '数据示例',
      type: 'map',
      map: 'yaan',
      roam: true, // 允许缩放平移
      emphasis: {
        label: { show: true },
      },
      label: {
        show: true,
        color: '#000',
        fontSize: 12,
      },
      data: [
        { name: '雨城区', value: 10, itemStyle: { areaColor: colors[0] } },
        { name: '名山区', value: 300, itemStyle: { areaColor: colors[1] } },
        { name: '荥经县', value: 400, itemStyle: { areaColor: colors[2] } },
        { name: '汉源县', value: 200, itemStyle: { areaColor: colors[3] } },
        { name: '石棉县', value: 1000, itemStyle: { areaColor: colors[4] } },
        { name: '天全县', value: 0, itemStyle: { areaColor: colors[5] } },
        { name: '宝兴县', value: 400, itemStyle: { areaColor: colors[6] } },
        { name: '芦山县', value: 500, itemStyle: { areaColor: colors[7] } },
      ],
    },
  ],
};

const heatmapVisualMap = {
  visualMap: {
    min: 0,
    max: 1000,
    calculable: true,
    left: '5%',
    bottom: '5%',
    text: ['高', '低'],
    // inRange: {
    //   color: ['lightskyblue', 'yellow', 'orangered'],
    // },
  },
};

const mapChart = ref();

const option = ref({ ...baseOption });

const showHeatmap = ref(false); // 控制开关

// 词云形状
const image =
  'data:image/png;base64,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';
const maskImage = new Image();
maskImage.src = image;

const state = reactive({
  chartOptions: {
    series: [
      {
        gridSize: 20,
        sizeRange: [10, 80], // 控制词语的大小范围

        rotationRange: [0, 0], // 控制词语的旋转角度范围

        rotationStep: 45, // 控制词语旋转的步长
        shape: 'circle', // 控制词云图的形状，可选值为 'circle', 'cardioid', 'diamond', 'triangle-forward', 'triangle', 'pentagon', 'star'

        drawOutOfBound: false, // 控制词云图是否允许词语超出绘制区域

        // 布局的时候是否有动画

        layoutAnimation: true,

        // 图的位置

        left: 'center',

        top: 'center',
        textStyle: {
          fontFamily: 'sans-serif',

          // fontWeight: 'bold',

          color: function () {
            return (
              'rgb(' +
              [
                Math.round(Math.random() * 160),

                Math.round(Math.random() * 160),

                Math.round(Math.random() * 160),
              ].join(',') +
              ')'
            );
          },
        },
        emphasis: {
          focus: 'self',
          // textStyle: {
          //   fontSize: 20, // 点击的词放大
          // },
        },
        maskImage: maskImage,
        // 赋值给series里的词云轮廓图maskImage
        data: [
          { name: '互联网服务', value: 1000 },
          { name: '交通运输', value: 850 },
          { name: '公司', value: 800 },
          { name: '军工', value: 600 },
          { name: '医药', value: 900 },
          { name: '商务服务', value: 600 },
          { name: '城乡规划', value: 800 },
          { name: '家政服务', value: 400 },
          { name: '安防', value: 850 },
          { name: '医疗服务', value: 200 },
          { name: '电子科技', value: 8000 },
          { name: '航空航天', value: 1500 },
          { name: '食品饮料', value: 1500 },
          { name: '能源', value: 800 },
          { name: '教育培训', value: 200 },
          { name: '金融', value: 100 },
          { name: '文化娱乐', value: 250 },
          { name: '电力', value: 1200 },
          { name: '石油化工', value: 300 },
          { name: '电子商务', value: 900 },
          { name: '建筑', value: 700 },
          { name: '旅游', value: 550 },
          { name: '环保', value: 750 },
          { name: '地产', value: 1100 },
          { name: '体育', value: 300 },
          { name: '通信', value: 950 },
          { name: '科研', value: 1200 },
          { name: '物流', value: 1300 },
          { name: '咨询', value: 600 },
          { name: '游戏', value: 850 },
          { name: '人力资源', value: 500 },
          { name: '水务', value: 300 },
          { name: '舞蹈艺术', value: 150 },
          { name: '汽车制造', value: 1100 },
          { name: '电影制作', value: 350 },
          { name: '游乐园', value: 250 },
          { name: '新能源', value: 900 },
          { name: '服装设计', value: 400 },
          { name: '采矿', value: 700 },
          { name: '信息安全', value: 800 },
          { name: '化妆品', value: 600 },
          { name: '音乐产业', value: 750 },
          { name: '物联网', value: 1200 },
          { name: '绿色建筑', value: 850 },
          { name: '社交媒体', value: 950 },
          { name: '人工智能', value: 1000 },
          { name: '水产养殖', value: 320 },
          { name: '医学研究', value: 1800 },
          { name: '动物保护', value: 130 },
          { name: '航海', value: 1000 },
        ],
      },
    ],
  },
});

watchEffect(() => {
  option.value = showHeatmap.value ? { ...baseOption, ...heatmapVisualMap } : { ...baseOption };
});

const init = () => {
  echarts.registerMap('yaan', yaanGeoJSON as any);
  nextTick(() => {
    if (mapChart.value) {
      mapChart.value.chart.on('click', (params: any) => {
        console.log('点击地图区域', params);
      });
    }
  });
};

onMounted(() => {
  init();
});
</script>
