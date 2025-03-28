<template>
  <div class="dark:bg-black" >
    <h2 class="title">ACE 代码编辑器</h2>
    <div class="w-1/2 p-5  ">
      <el-link href="https://www.cnblogs.com/China-Dream/p/13883153.html" target="_blank"
        >ace editor</el-link
      >
      <AceEditor :value="value" class="mt-5" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import AceEditor from './editor/index.vue';

const value = ref('');
</script>
