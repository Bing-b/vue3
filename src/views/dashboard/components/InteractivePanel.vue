<template>
  <div class="interactive-panel flex h-full w-full gap-6 p-1">
    <!-- Left: 3D Visualization -->
    <div class="vison-section relative flex w-2/5 flex-col items-center justify-center">
      <div class="absolute top-0 left-0">
        <span
          class="text-[9px] font-bold tracking-wider text-[#86868b] uppercase dark:text-[#a1a1a6]"
          >Core</span
        >
      </div>

      <!-- Compact Orb -->
      <div class="orb-visualizer relative h-28 w-28">
        <div
          class="orb-inner absolute inset-0 animate-pulse rounded-full bg-gradient-to-tr from-[#007aff] to-[#5856d6] opacity-15 blur-xl"></div>
        <div
          class="orb-core animate-spin-slow absolute inset-2 flex items-center justify-center rounded-full border border-[#007aff]/30">
          <div class="absolute h-20 w-px rotate-45 bg-[#007aff]/20"></div>
          <div class="absolute h-20 w-px -rotate-45 bg-[#007aff]/20"></div>
        </div>
        <div class="orb-content absolute inset-0 flex flex-col items-center justify-center">
          <span class="text-2xl font-bold text-[#007aff] dark:text-[#0a84ff]">9800</span>
          <span class="text-[8px] font-bold tracking-widest text-[#86868b] uppercase">Alive</span>
        </div>
      </div>

      <div class="mt-4 w-full px-1">
        <div class="flex justify-between pb-1 text-[9px] font-bold text-[#86868b] uppercase">
          <span>Load</span>
          <span>{{ load }}%</span>
        </div>
        <div class="h-1 w-full overflow-hidden rounded-full bg-black/5 dark:bg-white/5">
          <div
            class="h-full bg-[#007aff] transition-all duration-1000"
            :style="{ width: load + '%' }"></div>
        </div>
      </div>
    </div>

    <!-- Right: Metrics Grid -->
    <div class="metrics-grid flex flex-1 flex-col gap-4">
      <div class="grid flex-1 grid-cols-2 gap-4">
        <!-- CPU Metric -->
        <div
          class="group flex flex-col justify-between rounded-[16px] bg-black/5 p-3 transition-all hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10">
          <div class="flex items-center justify-between">
            <span class="text-[9px] font-bold tracking-wider text-[#007aff] uppercase">进程</span>
            <el-icon class="text-[#007aff] opacity-60" :size="14"><Monitor /></el-icon>
          </div>
          <div class="flex items-baseline gap-1 pt-1">
            <span class="text-xl leading-none font-bold text-[#1d1d1f] dark:text-white">{{
              cpu
            }}</span>
            <span class="text-[9px] font-bold text-[#86868b]">Mhz</span>
          </div>
          <div class="mt-2 flex h-2 items-end gap-0.5">
            <div
              v-for="(h, n) in cpuHeights"
              :key="n"
              class="flex-1 rounded-full bg-[#007aff]/20"
              :style="{ height: h + '%' }"></div>
          </div>
        </div>

        <!-- RAM Metric -->
        <div
          class="group flex flex-col justify-between rounded-[16px] bg-black/5 p-3 transition-all hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10">
          <div class="flex items-center justify-between">
            <span class="text-[9px] font-bold tracking-wider text-[#34c759] uppercase">内存</span>
            <el-icon class="text-[#34c759] opacity-60" :size="14"><Cpu /></el-icon>
          </div>
          <div class="flex items-baseline gap-1 pt-1">
            <span class="text-xl leading-none font-bold text-[#1d1d1f] dark:text-white">{{
              memory
            }}</span>
            <span class="text-[9px] font-bold text-[#86868b]">Gbps</span>
          </div>
          <div class="mt-2 flex h-2 items-end gap-0.5">
            <div
              v-for="(h, n) in memoryHeights"
              :key="n"
              class="flex-1 rounded-full bg-[#34c759]/20"
              :style="{ height: h + '%' }"></div>
          </div>
        </div>
      </div>

      <!-- Stack -->
      <div
        class="relative min-h-[80px] flex-1 overflow-hidden rounded-[16px] bg-black/5 p-3 dark:bg-white/5">
        <span class="mb-2 block text-[9px] font-bold tracking-wider text-[#86868b] uppercase"
          >Stack</span
        >
        <div class="relative z-10 flex flex-wrap gap-1.5">
          <div
            v-for="tech in stack"
            :key="tech.name"
            class="flex items-center gap-1.5 rounded-full border border-black/5 bg-white/60 px-2 py-0.5 dark:border-white/5 dark:bg-black/40">
            <div class="h-1 w-1 rounded-full" :style="{ backgroundColor: tech.color }"></div>
            <span class="text-[9px] font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">{{
              tech.name
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Monitor, Cpu } from '@element-plus/icons-vue';

const load = ref(45);
const cpu = ref(2.4);
const memory = ref(12.8);
const cpuHeights = ref(Array.from({ length: 12 }, () => Math.floor(Math.random() * 80 + 20)));
const memoryHeights = ref(Array.from({ length: 12 }, () => Math.floor(Math.random() * 80 + 20)));

const stack = [
  { name: 'Vue 3', color: '#42b883' },
  { name: 'Vite 8', color: '#6466f1' },
  { name: 'TypeScript', color: '#3178c6' },
  { name: 'Element Plus', color: '#409eff' },
  { name: 'Three.js', color: '#4f4f4f' },
  { name: 'Tailwind CSS', color: '#38bdf8' },
];

let interval: any;

onMounted(() => {
  interval = setInterval(() => {
    load.value = Math.floor(Math.random() * 20) + 40;
    cpu.value = Number((Math.random() * 0.5 + 2.2).toFixed(1));
    memory.value = Number((Math.random() * 2 + 11).toFixed(1));
    // 更新可视化高度
    cpuHeights.value = cpuHeights.value.map(() => Math.floor(Math.random() * 80 + 20));
    memoryHeights.value = memoryHeights.value.map(() => Math.floor(Math.random() * 80 + 20));
  }, 2000);
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>

<style scoped lang="scss">
.animate-spin-slow {
  animation: spin 8s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.orb-visualizer {
  filter: drop-shadow(0 0 20px rgba(99, 102, 241, 0.2));
}
</style>
