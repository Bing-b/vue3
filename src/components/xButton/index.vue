<template>
  <button class="custom-button"
    :class="{ 'is-active': isActive, 'primary': type === 'primary', 'default': type === 'default' }"
    :style="{ '--button-bg-color': bgColor }" @click="handleClick" @mousedown="handleMouseDown" @mouseup="handleMouseUp">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue';

withDefaults(defineProps<{
  bgColor?: string // 背景色
  type?: string // 按钮类型， 默认'primary',可选 'default'
}>(), {
  bgColor: '#E77A29',
  type: 'primary'
});

// 活动时样式
const isActive = ref<boolean>(false);

const emits = defineEmits(['click']);

// 处理点击事情回调
const handleClick = () => {
  emits('click');
};

const handleMouseDown = () => {
  isActive.value = true;
};

const handleMouseUp = () => {
  setTimeout(() => {
    isActive.value = false;
  }, 500);
};

</script>

<style lang="scss" scoped>
.custom-button {
  --button-bg-color: '#E77A29'; // 定义全局的 CSS 变量

  position: relative;
  display: inline-block;
  padding: 4px 16px;
  font-size: 14px;
  line-height: 1.5;
  border-radius: 4px;
  cursor: pointer;
  outline: none;
  z-index: 1;

  &::before {
    position: absolute;
    content: '';
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    z-index: -1;
    background-color: transparent;
    border-radius: inherit;
    opacity: 0.35;
    transition: .3s ease;
    pointer-events: none;
  }

}

.primary {
  color: #fff;
  background-color: var(--button-bg-color);
}

.default {
  border: 1px solid #e0e0e0;
  color: #696b6f;
}

.primary:active {
  background-color: var(--button-bg-color);
  opacity: .8;
}

.default:active {
  border-color: var(--button-bg-color);
}

.custom-button.is-active {
  &::before {
    animation: animationShadow .5s linear;
  }
}

@keyframes animationShadow {
  0% {
    box-shadow: 0 0 0 transparent;
  }

  50% {
    box-shadow: 0 0 0 4px var(--button-bg-color);
  }

  100% {
    box-shadow: 0 0 0 6px var(--button-bg-color);
    opacity: 0;
  }
}
</style>
