<template>
  <div class="info-container">
    <div class="info-header">
      <h3 class="info-title">系统信息</h3>
      <el-tag :type="systemStatus.type" size="small">
        {{ systemStatus.text }}
      </el-tag>
    </div>

    <div class="info-grid">
      <div class="info-item">
        <div class="info-icon">
          <el-icon><Monitor /></el-icon>
        </div>
        <div class="info-content">
          <div class="info-label">运行时间</div>
          <div class="info-value">{{ uptime }}</div>
        </div>
      </div>

      <div class="info-item">
        <div class="info-icon">
          <el-icon><Cpu /></el-icon>
        </div>
        <div class="info-content">
          <div class="info-label">CPU 使用率</div>
          <div class="info-value">{{ cpuUsage }}%</div>
          <el-progress
            :percentage="cpuUsage"
            :stroke-width="4"
            :show-text="false"
            :color="getProgressColor(cpuUsage)" />
        </div>
      </div>

      <div class="info-item">
        <div class="info-icon">
          <el-icon><Memo /></el-icon>
        </div>
        <div class="info-content">
          <div class="info-label">内存使用</div>
          <div class="info-value">{{ memoryUsage }}%</div>
          <el-progress
            :percentage="memoryUsage"
            :stroke-width="4"
            :show-text="false"
            :color="getProgressColor(memoryUsage)" />
        </div>
      </div>

      <div class="info-item">
        <div class="info-icon">
          <el-icon><Document /></el-icon>
        </div>
        <div class="info-content">
          <div class="info-label">项目版本</div>
          <div class="info-value">v1.2.5</div>
        </div>
      </div>

      <div class="info-item">
        <div class="info-icon">
          <el-icon><Calendar /></el-icon>
        </div>
        <div class="info-content">
          <div class="info-label">最后更新</div>
          <div class="info-value">{{ lastUpdate }}</div>
        </div>
      </div>

      <div class="info-item">
        <div class="info-icon">
          <el-icon><User /></el-icon>
        </div>
        <div class="info-content">
          <div class="info-label">在线用户</div>
          <div class="info-value">{{ onlineUsers }}</div>
        </div>
      </div>
    </div>

    <div class="info-footer">
      <div class="info-stats">
        <span class="stat-item">
          <el-icon><View /></el-icon>
          今日访问: {{ todayVisits }}
        </span>
        <span class="stat-item">
          <el-icon><Download /></el-icon>
          总下载: {{ totalDownloads }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import {
  Monitor,
  Cpu,
  Document,
  Calendar,
  User,
  View,
  Download,
  Memo,
} from '@element-plus/icons-vue';

// 响应式数据
const cpuUsage = ref(45);
const memoryUsage = ref(62);
const onlineUsers = ref(128);
const todayVisits = ref(1234);
const totalDownloads = ref(5678);

// 计算属性
const uptime = computed(() => {
  const hours = Math.floor(Math.random() * 24) + 1;
  const minutes = Math.floor(Math.random() * 60);
  return `${hours}小时${minutes}分钟`;
});

const lastUpdate = computed(() => {
  const date = new Date();
  return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
});

const systemStatus = computed(() => {
  if (cpuUsage.value > 80 || memoryUsage.value > 80) {
    return { type: 'warning', text: '高负载' };
  }
  return { type: 'success', text: '正常' };
});

// 方法
const getProgressColor = (percentage: number) => {
  if (percentage > 80) return '#f56c6c';
  if (percentage > 60) return '#e6a23c';
  return '#67c23a';
};

// 模拟数据更新
const updateStats = () => {
  cpuUsage.value = Math.min(100, Math.max(20, cpuUsage.value + (Math.random() - 0.5) * 10));
  memoryUsage.value = Math.min(100, Math.max(30, memoryUsage.value + (Math.random() - 0.5) * 8));
  onlineUsers.value = Math.max(50, onlineUsers.value + Math.floor((Math.random() - 0.5) * 20));
  todayVisits.value += Math.floor(Math.random() * 5);
};

onMounted(() => {
  // 每5秒更新一次数据
  setInterval(updateStats, 5000);
});
</script>

<style scoped lang="scss">
.info-container {
  width: 100%;
  height: 100%;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .info-title {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
  }
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  flex: 1;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
  }
}

.info-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;

  .el-icon {
    font-size: 20px;
  }
}

.info-content {
  flex: 1;

  .info-label {
    font-size: 12px;
    opacity: 0.8;
    margin-bottom: 4px;
  }

  .info-value {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
  }
}

.info-footer {
  .info-stats {
    display: flex;
    justify-content: space-between;
    padding: 12px 16px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    backdrop-filter: blur(10px);
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;

    .el-icon {
      font-size: 16px;
    }
  }
}

// 暗色主题适配
.dark .info-container {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

:deep(.el-progress-bar__outer) {
  background-color: rgba(255, 255, 255, 0.2);
}

:deep(.el-tag) {
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
}
</style>
