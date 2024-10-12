<template>
  <div>
    <el-dialog title="选择分类" v-model="$visible" width="240">
      <el-select v-model="selectedLabelCategory" placeholder="请选择" @change="updateLabel">
        <el-option
          v-for="item in LabelCategorys"
          :key="item.id"
          :label="item.text"
          :value="item.id">
          <span class="w-3 h-3 mr-1 inline-block" :style="{ backgroundColor: item.color }"></span>
          <span>{{ item.text }}</span>
        </el-option>
      </el-select>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { LabelCategory } from 'poplar-annotation/dist/Store/LabelCategory';
import { watchEffect } from 'vue';

const { LabelCategorys } = defineProps<{ LabelCategorys: LabelCategory.Entity[] }>();

const emits = defineEmits(['updateLable']);

const $visible = defineModel('visible', { default: false });

// 选择分类id
const selectedLabelCategory = ref<number | string>();

// 新增或修改label分类
const updateLabel = () => {
  if (selectedLabelCategory.value !== null) {
    emits('updateLable', selectedLabelCategory.value);
  }
  selectedLabelCategory.value = undefined;
};

watchEffect(() => {
  console.log(LabelCategorys); // 是响应式的
});
</script>
<style lang="scss" scoped>
:deep(.el-dialog__title) {
  font-size: 16px;
}

:deep(.el-dialog__body) {
  padding: 10px 20px 15px;
}
</style>
