<template>
  <div>
    <el-button @click="checkData1">数据1</el-button>
    <el-button @click="checkData2">数据2</el-button>
    <el-table :data="data" ref="dragWrapperRef" row-key="name">
      <el-table-column label="姓名" prop="name" />
      <el-table-column label="数量" prop="value" />
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useDragTable } from '@/hooks/useSortTable';
import { watch } from 'vue';

// 初始化可拖拽表格
const { dragWrapperRef, dragDataKey, dragData } = useDragTable();

const data = ref([]);

const data1 = ref([
  {
    name: '张三',
    value: '1',
  },
  {
    name: '李四',
    value: '2',
  },
  {
    name: '小帅',
    value: '3',
  },
]);

const data2 = ref([
  {
    name: '哪吒',
    value: '3',
  },
  {
    name: '敖丙',
    value: '4',
  },
  {
    name: '申公豹',
    value: '6',
  },
]);

const checkData1 = () => {
  dragDataKey.value = '1';
  dragData.value = data1.value;
};

const checkData2 = () => {
  dragDataKey.value = '2';
  dragData.value = data2.value;
};

watch(
  () => data.value,
  () => {
    console.log(data1.value, data2.value);
  }
);
</script>

<style lang="scss" scoped>
// 拖拽表格元素样式
:deep(.el-table__body .sortable-ghost) {
  position: relative;
  &::before {
    position: absolute;
    content: '';
    width: 100%;
    height: 2px;
    background-color: #1b5fdfc7;
    top: -10px;
    left: 0;
    z-index: 1;
  }
}
</style>
