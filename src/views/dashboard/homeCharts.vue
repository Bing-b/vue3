<template>
  <div>
    <v-chart class="chart" :option="option" />
  </div>
</template>

<script setup lang="ts">
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LabelLayout } from 'echarts/features';
import { PieChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import VChart from 'vue-echarts';
import { ref } from 'vue';

use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent, LabelLayout]);

const option = ref({
  tooltip: {
    trigger: 'item',
  },
  legend: {
    top: '5%',
    left: '2%',
    orient: 'vertical',
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: ['40%', '70%'],
      label: {
        normal: {
          show: true,
          formatter: '{c}%',
          textStyle: {
            fontSize: 13,
          },
          position: 'outside',
        },
        emphasis: {
          show: true,
        },
      },

      labelLine: {
        normal: {
          show: true,
          length: 20,
          length2: 35,
        },
        emphasis: {
          show: true,
        },
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 40,
          fontWeight: 'bold',
        },
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },

      data: [
        { value: 60, name: 'GitHub' },
        { value: 40, name: 'GitLab' },
      ],
    },
  ],
});
</script>

<style scoped>
.chart {
  height: 400px;
}
</style>
