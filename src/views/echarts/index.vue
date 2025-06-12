<template>
  <div class="relative h-full w-full">
    <v-chart ref="mapChart" :option="option" autoresize />
    <el-switch class="!absolute right-20 bottom-20 z-10" v-model="showHeatmap" />
  </div>
</template>

<script lang="ts" setup>
import VChart from 'vue-echarts';
import { ref, onMounted, watch, nextTick } from 'vue';
import * as echarts from 'echarts/core';
import { TooltipComponent, VisualMapComponent, TitleComponent } from 'echarts/components';
import { MapChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import yaanGeoJSON from './yaan.json';
import { watchEffect } from 'vue';

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
