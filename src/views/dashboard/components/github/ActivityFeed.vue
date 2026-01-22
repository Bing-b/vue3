<template>
  <div class="flex h-full flex-col rounded-xl bg-white p-5 shadow-sm transition-all hover:shadow-md dark:bg-[#1c1e23]">
    <h3 class="mb-4 text-sm font-bold text-gray-800 dark:text-white">Recent Activity</h3>
    
    <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar">
      <div v-for="event in events" :key="event.id" class="mb-4 flex gap-3 last:mb-0">
        <div class="mt-1 flex h-2 w-2 flex-shrink-0 items-center justify-center rounded-full bg-blue-500"></div>
        <div class="flex-1">
          <p class="text-xs text-gray-800 dark:text-gray-200">
            <span class="font-bold">{{ event.type.replace('Event', '') }}</span> 
            on 
            <a :href="`https://github.com/${event.repo.name}`" target="_blank" class="text-blue-500 hover:underline">{{ event.repo.name.split('/')[1] }}</a>
          </p>
          <p class="mt-1 text-[10px] text-gray-400">{{ formatDate(event.created_at) }}</p>
        </div>
      </div>
      
      <div v-if="events.length === 0" class="flex h-full items-center justify-center text-xs text-gray-400">
        No recent activity found.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';

defineProps({
  events: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
