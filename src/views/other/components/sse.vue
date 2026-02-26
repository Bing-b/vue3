<template>
  <div class="sse-container p-6 bg-white rounded-xl shadow-sm">
    <div class="header flex items-center justify-between mb-6">
      <div class="info">
        <h3 class="text-xl font-bold text-slate-800">SSE 实时通信示例</h3>
        <p class="text-sm text-slate-500 mt-1">
          状态: 
          <span :class="statusClass" class="font-medium">
            {{ statusText }}
          </span>
        </p>
      </div>
      <div class="actions space-x-3">
        <el-button 
          v-if="!isConnected" 
          type="primary" 
          @click="connect"
        >
          开始连接
        </el-button>
        <el-button 
          v-else 
          type="danger" 
          @click="disconnect"
        >
          断开连接
        </el-button>
        <el-button @click="clearMessages">清空日志</el-button>
      </div>
    </div>

    <div class="message-list-wrapper border border-slate-100 rounded-lg overflow-hidden bg-slate-50">
      <div v-if="messages.length === 0" class="empty-state p-12 text-center text-slate-400">
        <el-icon class="text-4xl mb-2"><ChatDotRound /></el-icon>
        <p>等待接收服务器推送的消息...</p>
      </div>
      
      <div ref="scrollContainer" class="message-list p-4 max-h-[400px] overflow-y-auto">
        <transition-group name="list">
          <div 
            v-for="msg in messages" 
            :key="msg.id" 
            class="message-item mb-3 last:mb-0 p-3 bg-white rounded-lg border-l-4 border-blue-500 shadow-sm"
          >
            <div class="flex justify-between items-start mb-1">
              <span class="text-xs font-bold text-blue-600 uppercase tracking-wider">#{{ msg.id }}</span>
              <span class="text-[10px] text-slate-400 font-mono">{{ msg.time }}</span>
            </div>
            <p class="text-slate-700 leading-relaxed">{{ msg.message }}</p>
          </div>
        </transition-group>
      </div>
    </div>

    <div class="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-100 italic text-sm text-amber-700">
      <el-icon class="mr-1 align-middle"><InfoFilled /></el-icon>
      提示：请确保后端服务已启动 (node src/views/other/server.js)
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, computed } from 'vue';
import { ChatDotRound, InfoFilled } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

const messages = ref<any[]>([]);
const isConnected = ref(false);
const eventSource = ref<EventSource | null>(null);

const statusText = computed(() => isConnected.value ? '已连接' : '已断开');
const statusClass = computed(() => isConnected.value ? 'text-green-500' : 'text-rose-500');

// 建立 sse 连接
const connect = () => {
  if (eventSource.value) return;

  try {
    eventSource.value = new EventSource('http://localhost:3001/events');
    isConnected.value = true;

    eventSource.value.onmessage = (event) => {
      const data = JSON.parse(event.data);
      messages.value.unshift(data); // 新消息在最前
      
      // 保持一定数量的消息
      if (messages.value.length > 50) {
        messages.value.pop();
      }
    };

    eventSource.value.onerror = (err) => {
      console.error('SSE Error:', err);
      ElMessage.error('SSE 连接出错，请检查服务器是否启动');
      disconnect();
    };
  } catch (error) {
    console.error('Failed to create EventSource:', error);
    ElMessage.error('无法创建连接');
  }
};

const disconnect = () => {
  if (eventSource.value) {
    eventSource.value.close();
    eventSource.value = null;
  }
  isConnected.value = false;
};

const clearMessages = () => {
  messages.value = [];
};

onUnmounted(() => {
  disconnect();
});
</script>

<style scoped>
.list-enter-active, .list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.message-list::-webkit-scrollbar {
  width: 6px;
}
.message-list::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 3px;
}
.message-list::-webkit-scrollbar-track {
  background: transparent;
}
</style>
