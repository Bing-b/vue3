<template>
  <div class="flex h-full flex-col rounded-xl bg-white p-5 shadow-sm transition-all hover:shadow-md dark:bg-[#1c1e23]">
    <h3 class="mb-4 text-sm font-bold text-gray-800 dark:text-white">Top Repositories</h3>
    
    <div class="grid grid-cols-1 gap-3 overflow-y-auto pr-2 custom-scrollbar">
      <div 
        v-for="repo in repos" 
        :key="repo.id" 
        class="group flex cursor-pointer flex-col justify-between rounded-lg border border-gray-100 p-3 transition-colors hover:border-blue-500 dark:border-gray-700 dark:hover:border-blue-500"
        @click="openRepo(repo.html_url)"
      >
        <div>
          <h4 class="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-200">
            {{ repo.name }}
            <span v-if="repo.private" class="rounded bg-gray-100 px-1 py-0.5 text-[8px] text-gray-500 dark:bg-gray-800">Private</span>
          </h4>
          <p class="mt-1 line-clamp-1 text-[10px] text-gray-500 dark:text-gray-400">{{ repo.description || 'No description' }}</p>
        </div>
        
        <div class="mt-3 flex items-center justify-between text-[10px] text-gray-400">
          <div class="flex items-center gap-3">
             <span v-if="repo.language" class="flex items-center gap-1">
               <span class="h-2 w-2 rounded-full bg-yellow-400"></span> {{ repo.language }}
             </span>
             <span class="flex items-center gap-0.5">⭐ {{ repo.stargazers_count }}</span>
             <span class="flex items-center gap-0.5">🍴 {{ repo.forks_count }}</span>
          </div>
          <span>{{ formatDate(repo.updated_at) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';

defineProps({
  repos: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
});

const openRepo = (url: string) => {
  window.open(url, '_blank');
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #eee;
  border-radius: 4px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #333;
}
</style>
