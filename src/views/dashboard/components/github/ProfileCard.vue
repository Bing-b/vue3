<template>
  <div class="flex h-full flex-col justify-between rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white shadow-lg transition-all hover:shadow-xl dark:from-indigo-600 dark:to-purple-800">
    <!-- Header -->
    <div class="flex items-start justify-between">
      <div class="flex items-center gap-3">
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h3 class="text-lg font-bold">FlyMe Admin</h3>
          <p class="text-[10px] text-white/70">v1.2.0 • Pro</p>
        </div>
      </div>
      <div class="rounded-full bg-green-400/20 px-2 py-1 text-[10px] font-bold text-green-300 backdrop-blur-md">
        ACTIVE
      </div>
    </div>
    
    <!-- Description -->
    <p class="mt-4 text-xs leading-relaxed text-white/80">
      Built with Vue 3, Vite, and TypeScript. <br>
      High performance & scalable architecture.
    </p>

    <!-- Stats Footer -->
    <div class="mt-auto flex justify-between border-t border-white/10 pt-4">
      <div>
        <p class="text-lg font-bold">Vue 3</p>
        <p class="text-[10px] text-white/50">Core</p>
      </div>
      <div>
        <p class="text-lg font-bold">TS</p>
        <p class="text-[10px] text-white/50">Typed</p>
      </div>
       <div>
        <p class="text-lg font-bold">Pia</p>
        <p class="text-[10px] text-white/50">Store</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Static Project Info Card
</script>
