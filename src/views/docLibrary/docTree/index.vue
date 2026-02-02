<template>
  <div class="doc-tree-wrapper h-full flex flex-col p-4">
    <div class="tree-header mb-6">
      <div class="search-box">
        <el-input
          v-model="keywords"
          placeholder="搜索文档..."
          @input="search"
          class="custom-search">
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>
    </div>

    <div class="tree-container flex-1 overflow-hidden">
      <el-scrollbar>
        <el-tree
          ref="xTree"
          :data="treeData"
          :props="defaultProps"
          :expand-on-click-node="false"
          :default-expand-all="true"
          node-key="id"
          highlight-current
          @node-click="handleNodeClick"
          class="modern-tree"
        >
          <template #default="{ node, data }">
            <div class="tree-node-content group">
              <span class="node-icon">
                <svgIcon name="word" v-if="!data.children" />
                <svgIcon name="folderOpen" v-else-if="node.expanded" />
                <svgIcon name="folderClose" v-else />
              </span>
              
              <span class="node-label">
                <span v-if="!data.showInput">{{ node.label }}</span>
                <el-input
                  v-else
                  size="small"
                  v-model="data.label"
                  @blur="blur(node, data)"
                  @keydown.enter="blur(node, data)"
                  v-focus
                  class="node-input"
                />
              </span>

              <div class="node-actions opacity-0 group-hover:opacity-100">
                <el-dropdown trigger="click">
                  <span class="action-trigger">
                    <el-icon><MoreFilled /></el-icon>
                  </span>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <template v-if="data.children">
                        <el-dropdown-item @click="handleOperation(OPERATION.CREATE_FOLDER, node, data)">新增文件夹</el-dropdown-item>
                        <el-dropdown-item @click="handleOperation(OPERATION.CREATE_FILE, node, data)">新增文件</el-dropdown-item>
                        <el-divider class="my-1" />
                      </template>
                      <el-dropdown-item @click="handleOperation(OPERATION.EDIT, node, data)">重命名</el-dropdown-item>
                      <el-dropdown-item @click="handleOperation(OPERATION.DELETE, node, data)" class="!text-red-500">删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>
          </template>
        </el-tree>
      </el-scrollbar>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, ref } from 'vue';
import { ElMessage, ElMessageBox, ElTree } from 'element-plus';
import { Search, MoreFilled } from '@element-plus/icons-vue';
import type Node from 'element-plus/es/components/tree/src/model/node';
import { Tree } from './type';
import { OPERATION } from './enum';

// 文档路径
const docLabel = defineModel('docLabel', { default: '' });

const xTree = ref<InstanceType<typeof ElTree>>();
let id = 100;
const operationType = ref<OPERATION>(OPERATION.CREATE_FILE);
const historyLabel = ref<string>('');

const vFocus = {
  mounted: (el: any) => {
    nextTick(() => {
      el.querySelector('.el-input__inner').focus();
    });
  },
};

const keywords = ref('');
const defaultProps = {
  children: 'children',
  label: 'label',
};

const treeData = ref<Tree[]>([
  {
    id: 1,
    label: '技术方案',
    children: [
      { id: 11, label: 'leaflet技术调研.pdf' },
      { id: 12, label: 'AceEditor调研文档.pdf' },
    ],
  },
  {
    id: 2,
    label: '产品文档',
    children: [
      { id: 21, label: '接口协议规范.pdf' },
      { id: 22, label: '需求分析报告.pdf' },
    ],
  },
]);

const handleNodeClick = (data: Tree) => {
  if (data.children) return;
  docLabel.value = data.label;
};

const handleOperation = (type: OPERATION, node: Node, data: any) => {
  operationType.value = type;
  if (type === OPERATION.CREATE_FOLDER || type === OPERATION.CREATE_FILE) {
    const newNode: Tree = {
      id: id++,
      label: '',
      showInput: true,
      ...(type === OPERATION.CREATE_FOLDER ? { children: [] } : {}),
    };
    if (!data.children) data.children = [];
    data.children.push(newNode);
    node.expand();
  } else if (type === OPERATION.EDIT) {
    historyLabel.value = data.label;
    data.showInput = true;
  } else if (type === OPERATION.DELETE) {
    ElMessageBox.confirm('确定删除该项吗？', '提示', { type: 'warning' }).then(() => {
      const parent = node.parent;
      const children: Tree[] = parent.data.children || parent.data;
      const index = children.findIndex((d) => d.id === data.id);
      children.splice(index, 1);
      ElMessage.success('已删除');
    });
  }
};

const blur = (node: Node, data: Tree) => {
  data.showInput = false;
  if (!data.label) {
    if (operationType.value === OPERATION.EDIT) {
      data.label = historyLabel.value;
    } else {
      const parent = node.parent;
      const children: Tree[] = parent.data.children || parent.data;
      const index = children.findIndex((d) => d.id === data.id);
      children.splice(index, 1);
    }
  }
};

const search = () => {
  xTree.value?.filter(keywords.value);
};
</script>

<style lang="scss" scoped>
.doc-tree-wrapper {
  background: white;

  .search-box {
    :deep(.el-input__wrapper) {
      background-color: #f1f5f9;
      box-shadow: none !important;
      border: 1px solid transparent;
      border-radius: 10px;
      padding: 4px 12px;
      
      &:hover, &.is-focus {
        background-color: white;
        border-color: #6366f1;
      }
    }
  }

  .modern-tree {
    background: transparent;

    :deep(.el-tree-node__content) {
      height: 48px;
      margin: 2px 0;
      border-radius: 8px;
      padding: 0 8px !important;

      &:hover {
        background-color: #f8fafc;
      }
    }

    :deep(.el-tree-node.is-current > .el-tree-node__content) {
      background-color: #6366f110;
      color: #6366f1;
      font-weight: 600;
    }
  }

  .tree-node-content {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    min-width: 0;

    .node-icon {
      flex: none;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
    }

    .node-label {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .node-actions {
      flex: none;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      transition: all 0.2s;

      &:hover {
        background: #e2e8f0;
      }

      .action-trigger {
        color: #94a3b8;
        cursor: pointer;
        padding: 4px;
      }
    }
  }
}

:deep(.el-tree-node__expand-icon) {
  color: #94a3b8;
  font-size: 14px;
  
  &.expanded {
    transform: rotate(90deg);
  }
}
</style>
