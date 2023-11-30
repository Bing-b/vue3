<template>
  <div>
    <el-input type="text" v-model="msg" />
  </div>
</template>

<script lang='ts' setup>

import { defineModel } from 'vue';

// 定义双向绑定
const msg = defineModel<string>();

</script>

<style scoped></style>
