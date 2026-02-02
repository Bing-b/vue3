<template>
  <div class="demo-card">
    <div class="demo-info">
      <el-alert
        title="v-drag-list 指令"
        type="info"
        :closable="false"
        show-icon
      >
        <p class="description">
          基于原生拖拽事件封装的列表排序指令。支持复杂的九宫格或线性列表布局，通过计算拖拽轨迹实现平滑的项交换交互。
        </p>
      </el-alert>
    </div>

    <div class="demo-content">
      <div class="grid-showcase">
        <header class="showcase-header">
          <h4 class="title">交互式九宫格</h4>
          <p class="subtitle">尝试拖动下方的彩色方块来重新排列它们</p>
        </header>

        <div
          class="grid-container"
          v-drag-list="{
            list: gridItems,
            canDrag: true,
            dragItemClass: 'app-item',
          }"
          @drag-mode-end="handleDragModeEnd"
          @drag-mode-start="onDragModeStart"
        >
          <div v-for="item in gridItems" :key="item.id" :data-id="item.id" class="app-item">
            <span class="item-label">{{ item.id.split('-')[1] }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';

const gridItems = reactive(
  Array.from({ length: 9 }, (_, index) => ({
    id: `item-${index + 1}`,
  })),
);

function onDragModeStart() {
  console.log('拖拽开始');
}

function handleDragModeEnd(event) {
  const { draggedItemData, updatedData } = event.detail;
  console.log('拖拽完成', { draggedItemData, updatedData });
}
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
    .grid-showcase {
      background: #f8fafc;
      padding: 40px;
      border-radius: 20px;
      border: 1px solid #e2e8f0;

      .showcase-header {
        text-align: center;
        margin-bottom: 32px;

        .title {
          font-size: 18px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 4px;
        }

        .subtitle {
          font-size: 13px;
          color: #94a3b8;
        }
      }

      .grid-container {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        max-width: 360px;
        margin: 0 auto;
        aspect-ratio: 1;

        .app-item {
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          position: relative;
          overflow: hidden;

          .item-label {
            font-size: 28px;
            font-weight: 800;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          &::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 100%);
          }

          &:hover {
            transform: scale(1.05) translateY(-5px);
            box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15);
          }

          &[data-id='item-1'] { background: linear-gradient(135deg, #ff6b6b, #ee5a52); }
          &[data-id='item-2'] { background: linear-gradient(135deg, #4ecdc4, #44a08d); }
          &[data-id='item-3'] { background: linear-gradient(135deg, #45b7d1, #96c93d); }
          &[data-id='item-4'] { background: linear-gradient(135deg, #f093fb, #f5576c); }
          &[data-id='item-5'] { background: linear-gradient(135deg, #4facfe, #00f2fe); }
          &[data-id='item-6'] { background: linear-gradient(135deg, #43e97b, #38f9d7); }
          &[data-id='item-7'] { background: linear-gradient(135deg, #fa709a, #fee140); }
          &[data-id='item-8'] { background: linear-gradient(135deg, #a8edea, #fed6e3); }
          &[data-id='item-9'] { background: linear-gradient(135deg, #667eea, #764ba2); }
        }
      }
    }
  }
}
</style>
