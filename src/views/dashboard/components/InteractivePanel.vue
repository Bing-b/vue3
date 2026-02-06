<template>
  <div class="interactive-panel flex h-full w-[800px] gap-4 p-4 pr-0 transition-colors duration-500">
    <!-- Left: 3D Visualization -->
    <div class="vison-container glass-card group relative flex w-1/3 min-w-[260px] flex-col items-center justify-center overflow-hidden p-4 bg-white dark:!bg-[linear-gradient(35deg,_#1c1e23_0%,_#555555_100%)] border border-transparent dark:border-white/10 shadow-sm transition-all hover:shadow-md rounded-[24px]">
       <div class="absolute top-4 left-4 z-10">
          <h3 class="text-sm font-black italic tracking-widest text-indigo-500 dark:text-indigo-400">SYSTEM CORE</h3>
          <p class="text-[10px] text-gray-400 dark:text-gray-500 font-mono">NEURAL_DENSITY: 0.84</p>
       </div>
       
       <!-- Orb Visualizer -->
       <div class="orb-visualizer w-40 h-40 relative">
          <div class="orb-inner bg-gradient-to-tr from-indigo-500 to-purple-500 blur-xl opacity-30 dark:opacity-50 animate-pulse absolute inset-0 rounded-full"></div>
          <div class="orb-core border-2 border-indigo-400/50 dark:border-indigo-300/40 absolute inset-4 rounded-full flex items-center justify-center animate-spin-slow">
             <div class="w-1 h-32 bg-indigo-500/20 dark:bg-indigo-300/20 absolute rotate-45"></div>
             <div class="w-1 h-32 bg-indigo-500/20 dark:bg-indigo-300/20 absolute -rotate-45"></div>
          </div>
          <div class="orb-content absolute inset-0 flex flex-col items-center justify-center">
             <span class="text-2xl font-black text-indigo-600 dark:text-indigo-400">9800</span>
             <span class="text-[8px] font-bold text-gray-400 dark:text-gray-500 tracking-tighter">ALIVE</span>
          </div>
       </div>

       <div class="mt-8 w-full space-y-2">
          <div class="flex justify-between text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">
             <span>Synapse Load</span>
             <span>{{ load }}%</span>
          </div>
          <div class="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
             <div class="h-full bg-indigo-500 dark:bg-indigo-400 shadow-sm transition-all duration-1000" :style="{ width: load + '%' }"></div>
          </div>
       </div>
    </div>

    <!-- Right: Metrics & Interactive Grid -->
    <div class="metrics-grid flex-1 flex flex-col gap-4">
       <!-- Top Row: Vitals -->
       <div class="grid grid-cols-2 gap-4 h-1/2">
          <div class="glass-card group relative flex flex-col justify-between overflow-hidden rounded-[24px] bg-white p-4 shadow-sm transition-all hover:shadow-md dark:bg-[#1c1e23] border border-transparent dark:border-white/10 hover:border-indigo-500/50 dark:hover:border-indigo-400/50 cursor-pointer">
             <div class="flex justify-between items-start">
                <span class="text-[10px] font-black tracking-widest text-indigo-500 dark:text-indigo-400 uppercase">进程</span>
                <el-icon class="text-indigo-500 opacity-50"><Monitor /></el-icon>
             </div>
             <div class="flex items-end gap-2 text-gray-800 dark:text-gray-100">
                <span class="text-3xl font-black tracking-tighter">{{ cpu }}</span>
                <span class="text-xs font-bold text-gray-400 dark:text-gray-500 mb-1.5 ">Mhz</span>
             </div>
             <div class="mt-2 flex gap-1 h-2 items-end">
                <div v-for="n in 12" :key="n" 
                   class="flex-1 bg-indigo-500/20 dark:bg-indigo-400/20 rounded-sm group-hover:bg-indigo-500/40 transition-all"
                   :style="{ height: (Math.random() * 80 + 20) + '%' }"></div>
             </div>
          </div>

          <div class="glass-card group relative flex flex-col justify-between overflow-hidden rounded-[24px] bg-white p-4 shadow-sm transition-all hover:shadow-md dark:bg-[#1c1e23] border border-transparent dark:border-white/10 hover:border-emerald-500/50 dark:hover:border-emerald-400/50 cursor-pointer">
             <div class="flex justify-between items-start">
                <span class="text-[10px] font-black tracking-widest text-emerald-500 dark:text-emerald-400 uppercase">内存 Ops</span>
                <el-icon class="text-emerald-500 opacity-50"><Cpu /></el-icon>
             </div>
             <div class="flex items-end gap-2 text-emerald-600 dark:text-emerald-400">
                <span class="text-3xl font-black tracking-tighter">{{ memory }}</span>
                <span class="text-xs font-bold text-gray-400 dark:text-gray-500 mb-1.5 ">Gbps</span>
             </div>
             <div class="mt-2 flex gap-1 h-2 items-end">
                <div v-for="n in 12" :key="n" 
                   class="flex-1 bg-emerald-500/20 dark:bg-emerald-400/20 rounded-sm group-hover:bg-emerald-500/40 transition-all"
                   :style="{ height: (Math.random() * 80 + 20) + '%' }"></div>
             </div>
          </div>
       </div>

       <!-- Bottom Row: Stack Info -->
       <div class="glass-card relative flex flex-1 flex-col overflow-hidden rounded-[24px] bg-white p-4 shadow-sm transition-all hover:shadow-md dark:bg-[#1c1e23] border border-transparent dark:border-white/10">
          <h4 class="text-[10px] font-black text-gray-400 dark:text-gray-500 tracking-widest uppercase mb-4">Project 技术栈</h4>
          <div class="flex flex-wrap gap-4">
             <div v-for="tech in stack" :key="tech.name" class="flex items-center gap-2 bg-gray-100/80 dark:bg-gray-800/80 px-3 py-1.5 rounded-full border border-transparent hover:border-indigo-500/30 transition-all cursor-default scale-95 hover:scale-100">
                <div class="w-1.5 h-1.5 rounded-full shadow-sm" :style="{ backgroundColor: tech.color }"></div>
                <span class="text-xs font-bold text-gray-600 dark:text-gray-300">{{ tech.name }}</span>
             </div>
          </div>
          <!-- Decorative curve -->
          <div class="absolute -bottom-6 -right-6 w-32 h-32 border-4 border-indigo-500/5 dark:border-indigo-400/5 rounded-full"></div>
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
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.orb-visualizer {
  filter: drop-shadow(0 0 20px rgba(99, 102, 241, 0.2));
}
</style>
