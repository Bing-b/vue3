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
  },
};

const mapChart = ref();

const option = ref({ ...baseOption });

const showHeatmap = ref(false); // 控制开关

const image =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAA1hJREFUeF7tm01W4zAMgCVzkGEWlFwAht2Ukww9CXCSMichs2PgAqEsJhykFs9OnXHT/MhJ7IaYbOC9Opb1WZZk2UGI/MHI9YcvAH0tIEmuTkHKG/W+BPyGJE/V/4QiF0DvQJRnby8Pffs372k52+0SEIv+iX4aOeqvIPkHTk7yLHtK+8hysgCjNAHcMoXlCgQC/HaFkSwu7zRYIA2Z8eQEmCogLrJYAJTitN2uAXHJGEhTkwLE5vmurY8kuVqSlGsA0DPe88lRiBXHKjoBqJlwmHHOeNXgrrPsKbcbjwR5Tz4BPmw2f1dtg2oE4GNA1kByJLo3pqplSfmPQ69Hm1rgpp9aAJ6VN7L1kgAhUpLysYdiLq80QqgFcH528ThwvbsMLlTbWggHAGaqfGl1r5vn7zbxPQAeHF6o2WXLqTrGEoBnR8QeYIiGuyikE6cSwGLxY+2QdIQYpz8ZROnr28t1CSCm2S/DX5GLpNoCopp9Q2BnBRrA+eJSJSFDUk9/5uqv51xFBAOA/MmZbs/KGWJydnFDiGrzEd2DAPcY5fq3/EDcAAByjNQB/t+QRQ4AYrcAwJnv/jojW9xOkCjFGLbATWagtsa4q8L6Lkl1muIxGiDRSgHwWZA8hl5smShEsReIMRs0lSENIEYrMFWhsiIUWTjUW+G9klhMzrC2JhiNL7DqgXsWEIsvUJ7fPpc8OBiZc4FEFUCqp9PxHI1VTL+sDtdlDbuwqLLD2RRKq6bfCmDnD9RFhVmkyLbXr0546wWJOWyU6ta9DeEYN0TYufrghg3r3g3AOPeDBuvi3AFD+YM8oElIoBsjzjq2vFCmul2ddi4B08Enigxs5dkW8IkgsK/HdYbB1uVQhMep5QjOyjtbwIQtoZfyvQFYG6cpWEJv5QcBmAgEJ4dXt6zZUWCCPmGw8oMtwPYJUtJtsEtWzCSnKwcYDYBZDur7gZEvVh/qMKLyowIorWH82+UlhK6NDWfGq20G+4A6oT52keoUx+VDCC4MLwBGjhCDwlwXCG8ARoLQete/SznO714BDHKOIzu7JhjeAfRxjj6c3dEBMJeE1/XuJRPkrDO7TeOnd4FMPkgY5EBRZ5FS0i/9kaUQKecTN06/rm2C+QDXgYVq/wUgFOmpyvkACUbjkux97g4AAAAASUVORK5CYII=';
const maskImage = new Image();
maskImage.src = image;
console.log(maskImage.src, maskImage);

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
