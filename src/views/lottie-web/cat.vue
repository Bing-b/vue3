<template>
  <div class="flex h-full w-full items-center justify-center">
    <LottieWeb
      :options="options"
      :style="{
        height: '200px',
        opacity: showLottieWeb ? 1 : 0,
        'margin-top': '0px',
      }"
      @DOMLoaded="DOMLoaded" />
  </div>
</template>

<script lang="ts" setup>
import LottieWeb from '@/views/error/LottieWeb/index.vue';
import { ref } from 'vue';

const showLottieWeb = ref(false);
const options = ref({
  path: new URL('./BlackCat.json', import.meta.url).href,
});

const DOMLoaded = () => {
  const $rectList = document.querySelectorAll('.lottie-web rect[fill="#ffffff"]');
  $rectList.forEach((element) => {
    element.setAttribute('fill', 'transparent');
  });
  showLottieWeb.value = true;
};
</script>

<style scoped lang="scss">
.not-found-hint {
  padding-bottom: 0;
}
</style>
