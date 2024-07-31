<template>
  <div class="h-full">
    <h2 class="title">复制指令</h2>
    <div class="box-content p-5">
      <el-input v-model="data" placeholder="请输入内容" style="width: 500px">
        <template #append>
          <el-button v-copy="data"> 复制 </el-button>
        </template>
      </el-input>
    </div>
  </div>
</template>

<script setup lang="ts" name="copyDirect">
import { ref } from 'vue';

const data = ref<string>('我是被复制的内容 🍒 🍉 🍊');
</script>
