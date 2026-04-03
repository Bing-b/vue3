<template>
  <div class="flex h-full items-center gap-6 px-8 py-6">
    <div class="relative">
      <div class="absolute inset-0 rounded-full bg-blue-500/20 blur-2xl"></div>
      <svgIcon name="milkcat" size="100" class="relative z-10 drop-shadow-xl" />
    </div>
    <div class="flex flex-col gap-3">
      <h2 class="text-2xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]"
        >Admin，上午好！欢迎回来</h2
      >
      <div class="max-w-2xl">
        <TextType
          :text="[
            '我们相信代码不仅是逻辑的延伸，更是思想的载体。在每一行实现与每一次重构之间，潜藏着对秩序、优雅与未来的探索。',
          ]"
          :typingSpeed="60"
          :pauseDuration="2000"
          :showCursor="true"
          :textColors="['#86868b']"
          cursorCharacter="|" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import TextType from './textType.vue';
</script>

<style scoped></style>
