<template>
  <div class="card content-box h-full">
    <h2 class="title">拖拽表格指令 🍇🍇🍇🍓🍓🍓</h2>

    <el-table v-sort-table="data" :data="data" style="width: 100%">
      <el-table-column prop="name" label="姓名"> </el-table-column>
      <el-table-column prop="age" label="年龄"> </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
const data = [
  {
    name: '张三',
    age: 21,
  },
  {
    name: '李四',
    age: 33,
  },
  {
    name: '赵钱',
    age: 23,
  },
  {
    name: '孙俪',
    age: 23,
  },
];
</script>

<style scoped></style>
