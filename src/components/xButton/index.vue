<template>
  <button class="custom-button" :class="{ 'is-active': isActive }" @click="handleClick" @mousedown="handleMouseDown"
    @mouseup="handleMouseUp">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isActive = ref<boolean>(false);

const emits = defineEmits(['click']);

const handleClick = () => {
  emits('click');
  isActive.value = false; // 恢复默认样式
};

const handleMouseDown = () => {
  isActive.value = true; // 添加活动样式
};

const handleMouseUp = () => {
  isActive.value = false; // 移除活动样式
};

</script>

<style lang="scss" scoped>
.custom-button {
  position: relative;
  display: inline-block;
  padding: 4px 16px;
  font-size: 14px;
  line-height: 1.5;
  border-radius: 4px;
  cursor: pointer;
  outline: none;
  transition: all .3s cubic-bezier(.645, .045, .355, 1);
  border: none;
  color: #fff;
  background-color: #1890ff;
  touch-action: manipulation;

  &:hover {
    //background-color: #096dd9;
  }
}

.custom-button:active {

  transform: translateY(2px);

}

.custom-button.is-active {
  background-color: #096dd9;
  /* 自定义活动样式颜色 */
}
</style>
