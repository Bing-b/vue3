<template>
  <div class="demo-card">
    <div class="demo-header">
      <div class="header-content">
        <h4 class="title">交互式可拖拽表格</h4>
        <p class="desc">基于 SortableJS 实现，支持跨数据集切换并保持拖拽功能</p>
      </div>
      <div class="actions">
        <el-radio-group v-model="currentDataSet" @change="handleDatasetChange">
          <el-radio-button label="data1">数据集 A</el-radio-button>
          <el-radio-button label="data2">数据集 B</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <div class="table-wrapper">
      <el-table
        :data="dragData"
        ref="dragWrapperRef"
        row-key="name"
        border
        stripe
        highlight-current-row
      >
        <el-table-column label="排序" width="80" align="center">
          <template #default>
            <el-icon class="drag-handle"><Rank /></el-icon>
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="name">
          <template #default="{ row }">
            <span class="user-name">{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="权重/数量" prop="value" align="center">
          <template #default="{ row }">
            <el-tag :type="row.value > 3 ? 'success' : 'info'">{{ row.value }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { Rank } from '@element-plus/icons-vue';
import { useDragTable } from '@/hooks/useSortTable';

// 初始化可拖拽表格
const { dragWrapperRef, dragDataKey, dragData } = useDragTable();

const data = ref([]);

const data1 = ref([
  {
    name: '张三',
    value: '1',
  },
  {
    name: '李四',
    value: '2',
  },
  {
    name: '小帅',
    value: '3',
  },
]);

const data2 = ref([
  {
    name: '哪吒',
    value: '3',
  },
  {
    name: '敖丙',
    value: '4',
  },
  {
    name: '申公豹',
    value: '6',
  },
]);

const currentDataSet = ref('data1');

const handleDatasetChange = (val: string | number | boolean | undefined) => {
  if (val === 'data1') {
    checkData1();
  } else {
    checkData2();
  }
};

const checkData1 = () => {
  dragDataKey.value = 'name';
  dragData.value = data1.value;
};

const checkData2 = () => {
  dragDataKey.value = 'name';
  dragData.value = data2.value;
};

onMounted(() => {
  checkData1();
});
</script>

<style lang="scss" scoped>
.demo-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
  border: 1px solid #f1f5f9;

  .demo-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
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

  .table-wrapper {
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #ebeef5;

    .drag-handle {
      cursor: grab;
      color: #94a3b8;
      font-size: 18px;

      &:active {
        cursor: grabbing;
      }
    }

    .user-name {
      font-weight: 600;
      color: #334155;
    }
  }
}

// 拖拽表格元素样式
:deep(.el-table__body .sortable-ghost) {
  opacity: 0.5;
  background: #ecf5ff !important;
  position: relative;

  &::before {
    position: absolute;
    content: '';
    width: 100%;
    height: 2px;
    background-color: #409eff;
    top: 0;
    left: 0;
    z-index: 10;
  }
}

:deep(.sortable-drag) {
  background: white !important;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}
</style>
