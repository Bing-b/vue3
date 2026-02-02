<template>
  <div class="demo-card">
    <div class="demo-info">
      <el-alert
        title="v-draggable 指令"
        type="success"
        :closable="false"
        show-icon
      >
        <p class="description">
          通过自定义指令 `v-draggable` 让任意元素具备拖拽能力。它支持边界控制和流畅的交互体验，非常适合用于浮动仪表盘、看板卡片等场景。
        </p>
      </el-alert>
    </div>

    <div class="demo-content">
      <div class="drag-canvas">
        <div v-draggable class="drag-box">
          <div class="inner-content">
            <el-icon class="drag-icon"><Rank /></el-icon>
            <span>拖拽我</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Rank } from '@element-plus/icons-vue';
</script>

<style lang="scss" scoped>
.demo-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
  border: 1px solid #f1f5f9;
  max-width: 800px;
  height: 600px;
  display: flex;
  flex-direction: column;

  .demo-info {
    margin-bottom: 24px;
    flex: none;
    .description {
      margin-top: 8px;
      line-height: 1.6;
      color: #64748b;
    }
  }

  .demo-content {
    flex: 1;
    min-height: 0;
    background: #f8fafc;
    border-radius: 12px;
    border: 1px dashed #e2e8f0;
    position: relative;
    overflow: hidden;

    .drag-canvas {
      width: 100%;
      height: 100%;
      position: relative;
    }

    .drag-box {
      position: absolute;
      top: 50px;
      left: 50px;
      width: 140px;
      height: 140px;
      background: white;
      border-radius: 20px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: grab;
      border: 1px solid #e2e8f0;
      transition: box-shadow 0.2s, transform 0.2s;
      z-index: 10;

      &:active {
        cursor: grabbing;
        transform: scale(1.05);
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
      }

      .inner-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        color: #409eff;

        .drag-icon {
          font-size: 32px;
        }

        span {
          font-size: 13px;
          font-weight: 700;
          color: #475569;
        }
      }

      &::before {
        content: '';
        position: absolute;
        top: 8px;
        left: 8px;
        right: 8px;
        bottom: 8px;
        border: 2px dashed rgba(64, 158, 255, 0.1);
        border-radius: 14px;
        pointer-events: none;
      }
    }
  }
}
</style>
