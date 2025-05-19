<template>
  <div class="dark:bg-dark-bg h-full">
    <h2 class="title">文档库</h2>
    <div class="flex h-[calc(100%-20px)] p-5">
      <doc-tree v-model:docLabel="docLabel" />

      <div class="h-full flex-1 items-center justify-center">
        <pdf-view :docLabel v-if="docLabel" />
        <Google v-else />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import DocTree from './docTree/index.vue';
import PdfView from './pdfView/index.vue';
import Google from '../lottie-web/google.vue';
import { computed } from 'vue';

const docLabel = ref('');
</script>

<style scoped></style>
