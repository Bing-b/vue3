<template>
  <div>
    <el-dialog title="选择关系" v-model="$visible" width="300">
      <el-select v-model="selectedConnectionCategory" placeholder="请选择" @change="updateConnection">
        <el-option v-for="item in connectionCategories" :key="item.id" :label="item.text" :value="item.id">
          <el-icon color="#fb9776" size="16" class="mr-1 translate-y-[2px]">
            <Link />
          </el-icon>
          <span>{{ item.text }}</span>
        </el-option>
      </el-select>
    </el-dialog>
  </div>
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
  selectedConnectionCategory.value = undefined;
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
