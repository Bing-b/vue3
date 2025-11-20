<template>
  <div
    class="flex gap-4 rounded-md bg-[#e1eaf9] px-6 py-4 dark:!bg-[linear-gradient(35deg,_#1c1e23_0%,_#555555_100%)]">
    <svgIcon name="milkcat" size="80" />
    <div class="flex flex-col gap-2">
      <h2 class="font-Maoken text-xl text-[#3f6ad8]">Admin，上午好！欢迎回来</h2>

      <TextType
        :text="[
          '我们相信代码不仅是逻辑的延伸，更是思想的载体。在每一行实现与每一次重构之间，潜藏着对秩序、优雅与未来的探索。',
        ]"
        :typingSpeed="75"
        :pauseDuration="1500"
        :showCursor="true"
        :textColors="['#666666']"
        cursorCharacter="_" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import TextType from './textType.vue';
</script>

<style scoped></style>
