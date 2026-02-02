<template>
  <div class="demo-card">
    <div class="demo-info">
      <el-alert
        title="v-copy 指令"
        type="warning"
        :closable="false"
        show-icon
      >
        <p class="description">
          通过 `v-copy` 指令快速实现文本复制功能。支持点击任意元素将指定内容同步到系统剪贴板，并提供内置的成功提示反馈。
        </p>
      </el-alert>
    </div>

    <div class="demo-content">
      <div class="copy-action-wrapper">
        <h4 class="input-label">配置复制内容</h4>
        <el-input
          v-model="data"
          placeholder="请输入需要复制的文本内容..."
          clearable
          size="large"
          class="custom-input"
        >
          <template #prefix>
            <el-icon><EditPen /></el-icon>
          </template>
        </el-input>

        <div class="action-buttons">
          <el-button
            v-copy="data"
            type="primary"
            size="large"
            :icon="DocumentCopy"
            class="copy-btn"
          >
            点击执行复制
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { DocumentCopy, EditPen } from '@element-plus/icons-vue';

const data = ref<string>('Antigravity - 让 AI 编程更简单 🍊🍊🍊');
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
    .description {
      margin-top: 8px;
      line-height: 1.6;
      color: #64748b;
    }
  }

  .demo-content {
    .copy-action-wrapper {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 32px;
      background: #f8fafc;
      border-radius: 12px;
      border: 1px solid #e2e8f0;

      .input-label {
        font-size: 14px;
        font-weight: 600;
        color: #475569;
      }

      .custom-input {
        :deep(.el-input__wrapper) {
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
        }
      }

      .action-buttons {
        margin-top: 12px;
        display: flex;
        justify-content: center;

        .copy-btn {
          border-radius: 10px;
          padding: 12px 32px;
          transition: all 0.3s;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
          }
        }
      }
    }
  }
}
</style>
