<template>
  <el-dialog title="选择分类" v-model="$visible" width="300">
    <el-radio-group v-model="selectedLabelCategory" class="ml-4">
      <template v-for="item in LabelCategorys" :key="item.id">
        <el-radio :label="item.id" size="large">{{ item.text }}</el-radio>
      </template>
    </el-radio-group>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$visible = false">取消</el-button>
        <el-button type="primary" @click="updateLabel">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
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
const selectedLabelCategory = ref<number>();

// 新增或修改label分类
const updateLabel = () => {
  if (selectedLabelCategory.value !== null) {
    emits('updateLable', selectedLabelCategory.value);
  }
};

</script>
