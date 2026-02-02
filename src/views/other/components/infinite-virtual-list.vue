<template>
  <div class="demo-card">
    <div class="demo-info">
      <h4 class="title">虚拟长列表 (Virtual List)</h4>
      <p class="desc">高效渲染海量数据，仅在视口区域内生成 DOM 节点</p>
    </div>

    <div class="demo-content">
      <div class="list-container">
        <virtual-list :data="items" :itemSize="60" :maxSize="20">
          <template #default="{ row }">
            <div class="list-item">
              <div class="item-info">
                <div class="item-avatar">{{ row.text.charAt(0) }}{{ row.id }}</div>
                <span class="item-text">{{ row.text }}</span>
              </div>

              <el-dropdown placement="bottom" trigger="click">
                <el-button link :icon="MoreFilled"></el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item :icon="Edit">编辑项目</el-dropdown-item>
                    <el-dropdown-item :icon="Share">分享此项</el-dropdown-item>
                    <el-dropdown-item :icon="Delete" divided type="danger">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </virtual-list>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { MoreFilled, Edit, Delete, Share } from '@element-plus/icons-vue';

const items = ref(
  Array.from({ length: 1000 }, (_, i) => ({
    id: i + 1,
    text: `这是虚拟列表中的第 ${i + 1} 个数据项`,
  })),
);
</script>

<style lang="scss" scoped>
.demo-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
  border: 1px solid #f1f5f9;
  max-width: 800px;
  height: 640px;
  display: flex;
  flex-direction: column;

  .demo-info {
    margin-bottom: 24px;
    flex: none;
    .title {
      font-size: 18px;
      font-weight: 700;
      color: #1e293b;
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
    border: 1px solid #f1f5f9;
    border-radius: 12px;
    background: #f8fafc;
    overflow: hidden;

    .list-container {
      height: 100%;
    }
  }
}

.list-item {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 1px solid #f1f5f9;
  background: white;
  transition: background 0.2s;

  &:hover {
    background: #f8fafc;
  }

  .item-info {
    display: flex;
    align-items: center;
    gap: 16px;

    .item-avatar {
      width: 36px;
      height: 36px;
      background: #409eff;
      color: white;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
    }

    .item-text {
      font-size: 14px;
      color: #1e293b;
      font-weight: 500;
    }
  }
}
</style>
