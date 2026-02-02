<template>
  <div class="demo-card">
    <div class="demo-info">
      <h4 class="title">并发控制 (P-Limit)</h4>
      <p class="desc">模拟受限并发环境下的异步请求执行，确保系统稳定性</p>
    </div>

    <div class="demo-content">
      <div class="control-panel">
        <div class="config-item">
          <span class="label">最大并发数</span>
          <el-tag type="warning" effect="dark">1</el-tag>
        </div>
        <el-button type="primary" @click="sendRequest" :icon="Position" large>
          开始模拟并发请求
        </el-button>
      </div>

      <div class="console-wrapper">
        <div class="console-header">
          <span class="dot red"></span>
          <span class="dot yellow"></span>
          <span class="dot green"></span>
          <span class="title">Terminal Output</span>
        </div>
        <div class="console-body" ref="consoleRef">
          <div v-for="(log, index) in logs" :key="index" class="log-line">
            <span class="time">[{{ log.time }}]</span>
            <span class="msg" :class="log.type">{{ log.text }}</span>
          </div>
          <div v-if="logs.length === 0" class="empty-msg">等待执行任务...</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import pLimit from 'p-limit';
import { ref, nextTick } from 'vue';
import { Position } from '@element-plus/icons-vue';
import dayjs from 'dayjs';

interface LogEntry {
  time: string;
  text: string;
  type: 'info' | 'success';
}

const logs = ref<LogEntry[]>([]);
const consoleRef = ref<HTMLElement | null>(null);

const addLog = (text: string, type: 'info' | 'success' = 'info') => {
  logs.value.push({
    time: dayjs().format('HH:mm:ss.SSS'),
    text,
    type,
  });
  nextTick(() => {
    if (consoleRef.value) {
      consoleRef.value.scrollTop = consoleRef.value.scrollHeight;
    }
  });
};

// 模拟并发请求发送
const fetchFn = (params: string) => {
  return new Promise((resolve) => {
    addLog(`Task [${params}] - 开始执行 (等待 2s)`);
    setTimeout(() => {
      addLog(`Task [${params}] - 执行完毕`, 'success');
      resolve(params);
    }, 2000);
  });
};

const sendRequest = async () => {
  logs.value = [];
  addLog('初始化最大并发限额: 1');
  const limit = pLimit(1); // 设置最大并发为1

  const input = [
    limit(() => fetchFn('Task-X')),
    limit(() => fetchFn('Task-Y')),
    limit(() => fetchFn('Task-Z')),
  ];

  await Promise.all(input);
  addLog('所有请求已完成', 'success');
};
</script>

<style lang="scss" scoped>
.demo-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
  border: 1px solid #f1f5f9;
  max-width: 900px;

  .demo-info {
    margin-bottom: 24px;
    .title {
      font-size: 18px;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 4px;
    }
    .desc {
      font-size: 13px;
      color: #94a3b8;
    }
  }

  .demo-content {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 24px;

    .control-panel {
      display: flex;
      flex-direction: column;
      gap: 24px;
      padding: 24px;
      background: #f8fafc;
      border-radius: 12px;
      border: 1px solid #e2e8f0;

      .config-item {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .label {
          font-size: 14px;
          color: #475569;
          font-weight: 500;
        }
      }
    }

    .console-wrapper {
      background: #1e293b;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

      .console-header {
        background: #334155;
        padding: 8px 16px;
        display: flex;
        align-items: center;
        gap: 6px;

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          &.red {
            background: #ff5f56;
          }
          &.yellow {
            background: #ffbd2e;
          }
          &.green {
            background: #27c93f;
          }
        }

        .title {
          margin-left: 10px;
          font-size: 11px;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
      }

      .console-body {
        height: 300px;
        padding: 16px;
        font-family: 'Fira Code', 'Monaco', monospace;
        font-size: 13px;
        overflow-y: auto;
        color: #e2e8f0;

        .log-line {
          margin-bottom: 6px;
          line-height: 1.5;

          .time {
            color: #64748b;
            margin-right: 12px;
          }

          .msg {
            &.success {
              color: #4ade80;
            }
          }
        }

        .empty-msg {
          color: #475569;
          text-align: center;
          margin-top: 100px;
          font-style: italic;
        }

        &::-webkit-scrollbar {
          width: 8px;
        }
        &::-webkit-scrollbar-thumb {
          background: #475569;
          border-radius: 4px;
        }
      }
    }
  }
}
</style>
