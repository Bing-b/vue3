<template>
  <div
    class="font-hsans chart relative flex h-[200px] w-[480px] flex-col items-center rounded-[24px] px-3">
    <p class="absolute top-4 left-5 text-sm font-medium">代码统计:</p>
    <div ref="chartdiv" class="half-donut-chart font-hsans"></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

const chartdiv = ref(null);

let root: any = null;

let series: any = null;

const extendedData = ref([]);

// 默认数据
const initChart = async () => {
  // 初始化根元素
  root = am5.Root.new(chartdiv.value);

  // 移出logo
  root._logo.dispose();

  // 设置主题
  root.setThemes([am5themes_Animated.new(root)]);

  // 创建半圆环图表
  const chart = root.container.children.push(
    am5percent.PieChart.new(root, {
      startAngle: 180,
      endAngle: 360,
      width: am5.percent(60),
      layout: root.verticalLayout,
      innerRadius: am5.percent(50), // 调整为圆环
      radius: am5.percent(65),
    }),
  );

  root.container.setAll({
    layout: root.horizontalLayout,
    alignContent: 'center',
  });
  // 创建系列
  series = chart.series.push(
    am5percent.PieSeries.new(root, {
      startAngle: 180,
      endAngle: 360,
      valueField: 'value',
      height: am5.percent(100),
      layout: root.verticalLayout,
      categoryField: 'category',
      fillField: 'color',
      alignLabels: false,
    }),
  );

  // 配置系列状态
  series.states.create('hidden', {
    startAngle: 180,
    endAngle: 180,
  });

  // 切片样式
  series.slices.template.setAll({
    cornerRadius: 5,
    strokeWidth: 2,
    stroke: am5.color(0xffffff),
  });

  // 隐藏刻度线
  series.ticks.template.setAll({
    forceHidden: true,
  });

  // 标签配置
  series.labels.template.setAll({
    fontSize: 12,
    fill: am5.color(0x666666),
    text: '{category}',
    populateText: true,
  });

  const colors = ['#67b7dc', '#6794dc', '#6771dc', '#8067dc', '#a367dc'];
  const res = await fetch('/public/lang-stats.json');
  const langData = await res.json();
  const defaultData = langData.map((i, idx) => ({
    category: i.lang,
    value: i.percent,
    color: colors[idx],
  }));

  extendedData.value = [...defaultData];

  // 配置图例
  let legend = root.container.children.push(
    am5.Legend.new(root, {
      width: am5.percent(40),
      height: am5.percent(60),
      centerY: am5.percent(50),
      y: am5.percent(50),
      layout: root.verticalLayout,
      marginLeft: 30,
      marginTop: 40,
    }),
  );

  legend.labels.template.setAll({
    fontSize: 12, // 设置字体大小（单位：px）
    fill: am5.color(0x333333), // 设置字体颜色（可选）
    fontWeight: '400', // 字体粗细（可选，如 "bold"）
  });

  legend.valueLabels.template.setAll({
    fontSize: 12,
    fill: am5.color(0x999999),
  });

  series.events.on('datavalidated', function () {
    legend.data.setAll(series.dataItems);
  });

  // 设置数据
  series.data.setAll(defaultData);

  // 动画效果
  series.appear(1000, 100);
};

onMounted(() => {
  if (chartdiv.value) initChart();
});

onUnmounted(() => {
  if (root) root.dispose();
});
</script>

<style>
.chart {
  background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
}
.half-donut-chart {
  width: 100%;
  height: 180px;
  margin: 0 auto;
  margin-top: 20px;
}
/* 通过CSS隐藏 */
.amcharts-logo {
  display: none !important;
}
</style>
