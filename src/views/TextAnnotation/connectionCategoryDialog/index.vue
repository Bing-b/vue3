<template>
  <el-dialog title="选择分类" v-model="$visible" width="300">
    <el-radio-group v-model="selectedConnectionCategory" class="ml-4">
      <template v-for="item in connectionCategories" :key="item.id">
        <el-radio :label="item.id" size="large">{{ item.text }}</el-radio>
      </template>
    </el-radio-group>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$visible = false">取消</el-button>
        <el-button type="primary" @click="updateConnection">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { ConnectionCategory } from 'poplar-annotation/dist/Store/ConnectionCategory';

const props = withDefaults(defineProps<{
  visible: boolean,
  connectionCategories: ConnectionCategory.Entity[]
}>(), {
  visible: () => false
});

const emits = defineEmits(['update:visible', 'updateConnection']);

const $visible = computed({
  get() {
    return props.visible;
  },
  set(val: boolean) {
    emits('update:visible', val);
  }
});

// 选择分类id
const selectedConnectionCategory = ref<number>();

// 新增或修改label分类
const updateConnection = () => {
  if (selectedConnectionCategory.value !== null) {
    emits('updateConnection', selectedConnectionCategory.value);
  }
};

</script>
