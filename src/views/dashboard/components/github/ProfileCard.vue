<template>
  <div class="project-profile-card h-full flex flex-col p-6 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-100 dark:border-white/5 relative overflow-hidden group transition-colors duration-500">
    <!-- 动态网格背景装饰 (Mesh Gradient) -->
    <div class="absolute inset-0 z-0">
      <!-- Light Mode Blobs -->
      <div class="dark:hidden absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-blue-400/10 rounded-full blur-[80px]"></div>
      <div class="dark:hidden absolute top-[40%] -right-[10%] w-[60%] h-[60%] bg-emerald-400/10 rounded-full blur-[60px]"></div>
      <div class="dark:hidden absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] bg-indigo-400/10 rounded-full blur-[70px]"></div>
      
      <!-- Dark Mode Blobs -->
      <div class="hidden dark:block absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-blue-600/20 rounded-full blur-[100px] animate-pulse"></div>
      <div class="hidden dark:block absolute top-[40%] -right-[10%] w-[60%] h-[60%] bg-emerald-500/15 rounded-full blur-[80px]"></div>
      <div class="hidden dark:block absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[90px]"></div>
    </div>

    <!-- 玻璃光泽遮罩 -->
    <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 dark:via-white/20 to-transparent z-10"></div>

    <div class="relative z-10 flex flex-col h-full">
      <!-- Header -->
      <div class="flex items-start justify-between">
        <div class="flex items-center gap-4">
          <div class="app-avatar-ring p-0.5 rounded-2xl bg-gradient-to-tr from-blue-500 to-emerald-500 shadow-lg shadow-blue-500/10 dark:shadow-blue-500/20">
            <div class="flex h-12 w-12 items-center justify-center rounded-[14px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-transparent bg-clip-text bg-gradient-to-br from-blue-500 to-emerald-500 dark:from-blue-300 dark:to-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <div>
            <h3 class="text-xl font-black text-slate-800 dark:text-white tracking-tight">FlyMe Admin</h3>
            <div class="flex items-center gap-2 mt-0.5">
              <span class="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 px-2 py-0.5 rounded-full uppercase tracking-widest">v1.2.0</span>
              <span class="text-[10px] font-bold text-slate-400 dark:text-slate-400/80 uppercase tracking-tighter">Enterprise</span>
            </div>
          </div>
        </div>
        
        <div class="flex flex-col items-end gap-1.5">
          <div class="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 flex items-center gap-2">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span class="text-[10px] font-black text-emerald-600 dark:text-emerald-400 tracking-widest uppercase">Active</span>
          </div>
        </div>
      </div>
      
      <!-- Description -->
      <div class="mt-8 flex-1">
        <p class="text-sm leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
          The next generation <span class="text-blue-600 dark:text-blue-400 font-bold">Enterprise Hub</span>. <br>
          <span class="text-xs text-slate-400 dark:text-slate-500 mt-2 block font-normal leading-normal italic">
            "Engineered for performance, designed for excellence."
          </span>
        </p>
      </div>

      <!-- Stats Grid -->
      <div class="mt-8 grid grid-cols-3 gap-3">
        <div v-for="tag in ['Vue 3.5', 'Vite 6', 'TS 5']" :key="tag" 
             class="group/item py-2 px-1 rounded-xl bg-slate-50/80 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:bg-white hover:border-blue-200 dark:hover:bg-white/10 dark:hover:border-white/10 transition-all text-center shadow-sm">
          <p class="text-[11px] font-black text-slate-700 dark:text-slate-200 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-300 transition-colors">{{ tag.split(' ')[0] }}</p>
          <p class="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">{{ tag.split(' ')[1] }}</p>
        </div>
      </div>
    </div>

    <!-- 底部互动装饰 -->
    <div class="absolute bottom-0 right-0 p-2 opacity-5 dark:opacity-10 group-hover:opacity-10 dark:group-hover:opacity-30 transition-opacity">
      <svg class="w-16 h-16 text-slate-900 dark:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="10" stroke-width="1" stroke-dasharray="2 4"/>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
// Static Project Info Card
</script>
