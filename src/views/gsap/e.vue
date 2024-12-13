<template>
  <div class="h-full dd overflow-y-scroll">
    <div class="body">
      <div class="box green"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { onMounted, ref } from 'vue';

gsap.registerPlugin(ScrollTrigger);

onMounted(() => {
  gsap.to('.green', {
    rotation: 900,
    duration: 1,
    scrollTrigger: {
      trigger: '.box',
      scroller: '.dd',
      scrub: 2,
      markers: true,
    },
  });
});
</script>

<style scoped>
.body {
  display: flex;
  align-items: center;
  justify-content: space-around;
  min-height: 200vh;
  margin: 0;
}

.box {
  display: block;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  width: 75px;
  height: 75px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: greenyellow;
  font-weight: 600;
}
</style>
