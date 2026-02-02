<template>
  <div class="demo-card doc-library-card">
    <div class="demo-info">
      <h4 class="title">企业级文档库</h4>
      <p class="desc">集成文档目录树与多种格式预览功能，支持跨端自适应展示</p>
    </div>

    <div class="demo-content">
      <div class="doc-layout">
        <aside class="doc-sidebar">
          <doc-tree v-model:docLabel="docLabel" />
        </aside>

        <main class="doc-preview-area">
          <transition name="fade-scale" mode="out-in">
            <div v-if="docLabel" :key="docLabel" class="preview-container">
              <pdf-view :docLabel="docLabel" />
            </div>
            <div v-else class="empty-state">
              <div class="empty-icon-box">
                <el-icon><Files /></el-icon>
              </div>
              <p>请从左侧选择一个文档进行预览</p>
            </div>
          </transition>
        </main>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import DocTree from './docTree/index.vue';
import PdfView from './pdfView/index.vue';
import { Files } from '@element-plus/icons-vue';
import { computed } from 'vue';

const docLabel = ref('');
</script>

<style lang="scss" scoped>
.demo-card {
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.03);
  border: 1px solid #f1f5f9;
  height: calc(100vh - 280px);
  display: flex;
  flex-direction: column;

  .demo-info {
    margin-bottom: 24px;
    flex: none;
    .title {
      font-size: 20px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 4px;
    }
    .desc {
      font-size: 14px;
      color: #94a3b8;
    }
  }

  .demo-content {
    flex: 1;
    min-height: 0;
    background: #f8fafc;
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid #e2e8f0;

    .doc-layout {
      height: 100%;
      display: flex;

      .doc-sidebar {
        width: 280px;
        background: white;
        border-right: 1px solid #f1f5f9;
        overflow-y: auto;
      }

      .doc-preview-area {
        flex: 1;
        background: #f1f5f9;
        position: relative;
        overflow: hidden;

        .preview-container {
          height: 100%;
          padding: 24px;
          display: flex;
          justify-content: center;
        }

        .empty-state {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          color: #94a3b8;

          .empty-icon-box {
            width: 80px;
            height: 80px;
            background: white;
            border-radius: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
          }

          p {
            font-size: 14px;
            font-weight: 500;
          }
        }
      }
    }
  }
}

/* Transitions */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-scale-enter-from {
  opacity: 0;
  transform: scale(0.98);
}

.fade-scale-leave-to {
  opacity: 0;
  transform: scale(1.02);
}
</style>
