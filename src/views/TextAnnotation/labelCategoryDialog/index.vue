<template>
  <div>
    <el-dialog title="选择分类" v-model="$visible" width="240">
      <el-select v-model="selectedLabelCategory" placeholder="请选择" @change="updateLabel">
        <el-option v-for="item in LabelCategorys" :key="item.id" :label="item.text" :value="item.id">
          <span class="w-3 h-3 mr-1 inline-block" :style="{ backgroundColor: item.color }"></span>
          <span>{{ item.text }}</span>
        </el-option>
      </el-select>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { LabelCategory } from 'poplar-annotation/dist/Store/LabelCategory';

const props = withDefaults(defineProps<{
  visible: boolean,
  LabelCategorys: LabelCategory.Entity[]
}>(), {
  visible: () => false
});

const emits = defineEmits(['update:visible', 'updateLable']);

const $visible = computed({
  get() {
    return props.visible;
  },
  set(val: boolean) {
    emits('update:visible', val);
  }
});

// 选择分类id
const selectedLabelCategory = ref<number | string>();

// 新增或修改label分类
const updateLabel = () => {
  if (selectedLabelCategory.value !== null) {
    emits('updateLable', selectedLabelCategory.value);
  }
  selectedLabelCategory.value = undefined;
};

</script>
<style lang="scss" scoped>
:deep(.el-dialog__title) {
  font-size: 16px;
}

:deep(.el-dialog__body) {
  padding: 10px 20px 15px;
}
</style>
