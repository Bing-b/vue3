<template>
  <div class="w-[500px] h-[1000px]">
    <virtual-list :data="items" :itemSize="50" :maxSize="20">
      <template #default="{ row }">
        <div class="list-item"
          >{{ row.text }}

          <el-dropdown placement="bottom">
            <el-button> bottom </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>The Action 1st</el-dropdown-item>
                <el-dropdown-item>The Action 2st</el-dropdown-item>
                <el-dropdown-item>The Action 3st</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </template>
    </virtual-list>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const items = ref(Array.from({ length: 100 }, (_, i) => ({ text: `Item ${i + 1}` })));
</script>

<style>
.list-item {
  height: 60px;
  display: flex;
  align-items: center;
  gap: 20px;
  justify-content: center;
  border-bottom: 1px solid #ddd;
}
</style>
