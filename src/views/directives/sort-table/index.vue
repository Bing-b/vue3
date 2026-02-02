<template>
  <div class="demo-card">
    <div class="demo-info">
      <el-alert
        title="v-sortable-table 指令"
        type="info"
        :closable="false"
        show-icon
      >
        <p class="description">
          结合 SortableJS 为 Element Plus 表格赋予动态排序能力。只需添加指令，即可通过直观的拖拽操作调整数据行顺序，所有变更将实时同步至原始数据模型。
        </p>
      </el-alert>
    </div>

    <div class="demo-content">
      <div class="table-container">
        <el-table :data="data" border stripe highlight-current-row class="custom-table">
          <el-table-column label="排序" width="80" align="center">
            <template #default>
              <el-icon class="drag-handle"><Rank /></el-icon>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="姓名">
            <template #default="{ row }">
              <span class="user-name">{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="age" label="年龄" align="center">
            <template #default="{ row }">
              <el-tag :type="row.age > 25 ? 'warning' : 'success'">{{ row.age }} 岁</el-tag>
            </template>
          </el-table-column>
        </el-table>

        <div class="data-preview">
          <div class="preview-header">
            <el-icon><Monitor /></el-icon>
            <span>实时数据 JSON 预览</span>
          </div>
          <pre class="json-content">{{ JSON.stringify(data, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Rank, Monitor } from '@element-plus/icons-vue';

const data = ref([
  {
    name: '张三',
    age: 21,
  },
  {
    name: '李四',
    age: 33,
  },
  {
    name: '赵钱',
    age: 23,
  },
  {
    name: '孙俪',
    age: 23,
  },
]);
</script>

<style lang="scss" scoped>
.demo-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
  border: 1px solid #f1f5f9;
  max-width: 900px;

  .demo-info {
    margin-bottom: 24px;
    .description {
      margin-top: 8px;
      line-height: 1.6;
      color: #64748b;
    }
  }

  .demo-content {
    .table-container {
      display: flex;
      flex-direction: column;
      gap: 32px;

      .custom-table {
        border-radius: 12px;
        overflow: hidden;

        .drag-handle {
          cursor: grab;
          color: #94a3b8;
          font-size: 18px;
        }

        .user-name {
          font-weight: 600;
          color: #334155;
        }
      }

      .data-preview {
        background: #1e293b;
        border-radius: 12px;
        overflow: hidden;

        .preview-header {
          background: #334155;
          padding: 8px 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #94a3b8;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .json-content {
          padding: 16px;
          margin: 0;
          color: #4ade80;
          font-family: 'Fira Code', monospace;
          font-size: 13px;
          max-height: 200px;
          overflow-y: auto;
        }
      }
    }
  }
}
</style>
