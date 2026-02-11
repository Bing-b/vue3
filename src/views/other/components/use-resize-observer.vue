<template>
  <div class="demo-card">
    <div class="demo-info">
      <h4 class="title">尺寸变化观察 (Resize Observer)</h4>
      <p class="desc">实时监测容器尺寸的变化，适用于响应式布局组件开发</p>
    </div>

    <div class="demo-content">
      <div class="resize-target-wrapper">
        <el-input
          ref="testResizeObserver"
          type="textarea"
          :rows="4"
          placeholder="拖动右下角的小手柄来改变文本框尺寸..."
          class="custom-textarea" />

        <div class="dimension-badge">
          <div class="badge-item">
            <span class="label">WIDTH</span>
            <span class="value">{{ currentWidth }}<small>px</small></span>
          </div>
          <div class="divider"></div>
          <div class="badge-item">
            <span class="label">HEIGHT</span>
            <span class="value">{{ currentHeight }}<small>px</small></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useResizeObserver } from '@vueuse/core';
import { ref } from 'vue';

const currentWidth = ref(0);
const currentHeight = ref(0);

const testResizeObserver = ref(null);

useResizeObserver(testResizeObserver, (entries) => {
  const [entry] = entries;
  const { width, height } = entry.contentRect;
  currentWidth.value = Math.round(width);
  currentHeight.value = Math.round(height);
});
</script>

<style lang="scss" scoped>
.demo-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
  border: 1px solid #f1f5f9;
  max-width: 800px;

  .demo-info {
    margin-bottom: 32px;
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
    .resize-target-wrapper {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 24px;

      .custom-textarea {
        :deep(.el-textarea__inner) {
          border-radius: 12px;
          padding: 16px;
          border-color: #e2e8f0;
          background: #f8fafc;
          resize: both;
          transition: border-color 0.3s;

          &:focus {
            border-color: #409eff;
            background: white;
          }
        }
      }

      .dimension-badge {
        display: flex;
        align-items: center;
        align-self: flex-start;
        background: #1e293b;
        padding: 12px 24px;
        border-radius: 12px;
        color: white;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

        .badge-item {
          display: flex;
          flex-direction: column;
          gap: 2px;

          .label {
            font-size: 10px;
            color: #64748b;
            font-weight: 800;
            letter-spacing: 1px;
          }

          .value {
            font-size: 18px;
            font-weight: 700;
            font-family: 'Fira Code', monospace;
            color: #409eff;

            small {
              font-size: 10px;
              color: #64748b;
              margin-left: 2px;
            }
          }
        }

        .divider {
          width: 1px;
          height: 30px;
          background: #334155;
          margin: 0 24px;
        }
      }
    }
  }
}
</style>
