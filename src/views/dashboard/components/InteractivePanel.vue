<template>
  <div
    class="interactive-panel flex h-full w-[800px] gap-4 p-4 pr-0 transition-colors duration-500">
    <!-- Left: 3D Visualization -->
    <div
      class="vison-container glass-card group relative flex w-1/3 min-w-[260px] flex-col items-center justify-center overflow-hidden rounded-[24px] border border-transparent bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-white/10 dark:!bg-[linear-gradient(35deg,_#1c1e23_0%,_#555555_100%)]">
      <div class="absolute top-4 left-4 z-10">
        <h3 class="text-sm font-black tracking-widest text-indigo-500 italic dark:text-indigo-400"
          >SYSTEM CORE</h3
        >
        <p class="font-mono text-[10px] text-gray-400 dark:text-gray-500">NEURAL_DENSITY: 0.84</p>
      </div>

      <!-- Orb Visualizer -->
      <div class="orb-visualizer relative h-40 w-40">
        <div
          class="orb-inner absolute inset-0 animate-pulse rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 opacity-30 blur-xl dark:opacity-50"></div>
        <div
          class="orb-core animate-spin-slow absolute inset-4 flex items-center justify-center rounded-full border-2 border-indigo-400/50 dark:border-indigo-300/40">
          <div class="absolute h-32 w-1 rotate-45 bg-indigo-500/20 dark:bg-indigo-300/20"></div>
          <div class="absolute h-32 w-1 -rotate-45 bg-indigo-500/20 dark:bg-indigo-300/20"></div>
        </div>
        <div class="orb-content absolute inset-0 flex flex-col items-center justify-center">
          <span class="text-2xl font-black text-indigo-600 dark:text-indigo-400">9800</span>
          <span class="text-[8px] font-bold tracking-tighter text-gray-400 dark:text-gray-500"
            >ALIVE</span
          >
        </div>
      </div>

      <div class="mt-8 w-full space-y-2">
        <div
          class="flex justify-between text-[10px] font-bold text-gray-500 uppercase dark:text-gray-400">
          <span>Synapse Load</span>
          <span>{{ load }}%</span>
        </div>
        <div class="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
          <div
            class="h-full bg-indigo-500 shadow-sm transition-all duration-1000 dark:bg-indigo-400"
            :style="{ width: load + '%' }"></div>
        </div>
      </div>
    </div>

    <!-- Right: Metrics & Interactive Grid -->
    <div class="metrics-grid flex flex-1 flex-col gap-4">
      <!-- Top Row: Vitals -->
      <div class="grid h-1/2 grid-cols-2 gap-4">
        <div
          class="glass-card group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-[24px] border border-transparent bg-white p-4 shadow-sm transition-all hover:border-indigo-500/50 hover:shadow-md dark:border-white/10 dark:bg-[#1c1e23] dark:hover:border-indigo-400/50">
          <div class="flex items-start justify-between">
            <span
              class="text-[10px] font-black tracking-widest text-indigo-500 uppercase dark:text-indigo-400"
              >进程</span
            >
            <el-icon class="text-indigo-500 opacity-50"><Monitor /></el-icon>
          </div>
          <div class="flex items-end gap-2 text-gray-800 dark:text-gray-100">
            <span class="text-3xl font-black tracking-tighter">{{ cpu }}</span>
            <span class="mb-1.5 text-xs font-bold text-gray-400 dark:text-gray-500">Mhz</span>
          </div>
          <div class="mt-2 flex h-2 items-end gap-1">
            <div
              v-for="(h, n) in cpuHeights"
              :key="n"
              class="flex-1 rounded-sm bg-indigo-500/20 transition-all group-hover:bg-indigo-500/40 dark:bg-indigo-400/20"
              :style="{ height: h + '%' }"></div>
          </div>
        </div>

        <div
          class="glass-card group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-[24px] border border-transparent bg-white p-4 shadow-sm transition-all hover:border-emerald-500/50 hover:shadow-md dark:border-white/10 dark:bg-[#1c1e23] dark:hover:border-emerald-400/50">
          <div class="flex items-start justify-between">
            <span
              class="text-[10px] font-black tracking-widest text-emerald-500 uppercase dark:text-emerald-400"
              >内存 Ops</span
            >
            <el-icon class="text-emerald-500 opacity-50"><Cpu /></el-icon>
          </div>
          <div class="flex items-end gap-2 text-emerald-600 dark:text-emerald-400">
            <span class="text-3xl font-black tracking-tighter">{{ memory }}</span>
            <span class="mb-1.5 text-xs font-bold text-gray-400 dark:text-gray-500">Gbps</span>
          </div>
          <div class="mt-2 flex h-2 items-end gap-1">
            <div
              v-for="(h, n) in memoryHeights"
              :key="n"
              class="flex-1 rounded-sm bg-emerald-500/20 transition-all group-hover:bg-emerald-500/40 dark:bg-emerald-400/20"
              :style="{ height: h + '%' }"></div>
          </div>
        </div>
      </div>

      <!-- Bottom Row: Stack Info -->
      <div
        class="glass-card relative flex flex-1 flex-col overflow-hidden rounded-[24px] border border-transparent bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-white/10 dark:bg-[#1c1e23]">
        <h4
          class="mb-4 text-[10px] font-black tracking-widest text-gray-400 uppercase dark:text-gray-500"
          >Project 技术栈</h4
        >
        <div class="flex flex-wrap gap-4">
          <div
            v-for="tech in stack"
            :key="tech.name"
            class="flex scale-95 cursor-default items-center gap-2 rounded-full border border-transparent bg-gray-100/80 px-3 py-1.5 transition-all hover:scale-100 hover:border-indigo-500/30 dark:bg-gray-800/80">
            <div
              class="h-1.5 w-1.5 rounded-full shadow-sm"
              :style="{ backgroundColor: tech.color }"></div>
            <span class="text-xs font-bold text-gray-600 dark:text-gray-300">{{ tech.name }}</span>
          </div>
        </div>
        <!-- Decorative curve -->
        <div
          class="absolute -right-6 -bottom-6 h-32 w-32 rounded-full border-4 border-indigo-500/5 dark:border-indigo-400/5"></div>
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
