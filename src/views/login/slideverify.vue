<template>
  <div
    ref="containerRef"
    class="slide-verify"
    :class="{ 'is-success': isSuccess }"
    :style="containerStyle">
    <!-- 进度条背景 (绿色部分) -->
    <div class="slide-verify-bg" :style="{ width: `${dragWidth}px` }"></div>

    <!-- 文字提示 -->
    <div class="slide-verify-text">
      <span v-if="!isSuccess" :style="{ opacity: textOpacity }">{{ text }}</span>
      <span v-else>{{ successText }}</span>
    </div>

    <!-- 滑块手柄 -->
    <div
      ref="handlerRef"
      class="slide-verify-handler"
      :class="{ 'is-moving': isMoving }"
      :style="{ left: `${dragWidth}px` }"
      @mousedown="onDragStart"
      @touchstart="onDragStart">
      <!-- 图标：成功显示对勾，否则显示双箭头 -->
      <slot name="icon" :is-success="isSuccess">
        <svg v-if="isSuccess" viewBox="0 0 1024 1024" width="20" height="20">
          <path
            d="M406.656 706.944L195.84 496.256a32 32 0 1 0-45.248 45.248l256 256 512-512a32 32 0 0 0-45.248-45.248L406.592 706.944z"
            fill="#52c41a" />
        </svg>

        <svgIcon v-else name="dbarrow" />
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';

interface Props {
  width?: string | number; // 组件宽度
  height?: string | number; // 组件高度
  text?: string; // 初始文字
  successText?: string; // 成功文字
  background?: string; // 初始背景色
  progressBarBg?: string; // 进度条背景色
  completedBg?: string; // 完成后的背景色
  radius?: string; // 圆角
}

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: 40,
  text: '请按住滑块，拖动到最右边',
  successText: '验证通过',
  background: '#f2f3f5',
  progressBarBg: '#76c61d',
  completedBg: '#76c61d',
  radius: '4px',
});

const emit = defineEmits(['success', 'fail']);

// DOM 引用
const containerRef = ref<HTMLElement | null>(null);
const handlerRef = ref<HTMLElement | null>(null);

// 状态
const isMoving = ref(false);
const isSuccess = ref(false);
const dragWidth = ref(0); // 当前拖动的距离

// 计算样式
const containerStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  backgroundColor: isSuccess.value ? props.completedBg : props.background,
  borderRadius: props.radius,
}));

// 计算文字透明度 (拖动越远文字越淡)
const textOpacity = computed(() => {
  if (!containerRef.value || !handlerRef.value) return 1;
  const max = containerRef.value.offsetWidth - handlerRef.value.offsetWidth;
  return 1 - dragWidth.value / max;
});

// 获取坐标 (兼容鼠标和触摸)
const getClientX = (e: MouseEvent | TouchEvent) => {
  if (e instanceof MouseEvent) {
    return e.clientX;
  }
  return e.touches[0].clientX;
};

// 拖拽开始
const onDragStart = (e: MouseEvent | TouchEvent) => {
  if (isSuccess.value) return; // 已成功则不再响应

  isMoving.value = true;
  const startX = getClientX(e);
  const handlerWidth = handlerRef.value?.offsetWidth || 0;
  const containerWidth = containerRef.value?.offsetWidth || 0;
  const maxDragWidth = containerWidth - handlerWidth;

  // 拖拽过程
  const onDragMove = (moveEvent: MouseEvent | TouchEvent) => {
    if (!isMoving.value) return;

    const currentX = getClientX(moveEvent);
    const diff = currentX - startX;

    // 限制拖拽范围
    if (diff > 0 && diff <= maxDragWidth) {
      dragWidth.value = diff;
    } else if (diff > maxDragWidth) {
      dragWidth.value = maxDragWidth;
    } else {
      dragWidth.value = 0;
    }
  };

  // 拖拽结束
  const onDragEnd = () => {
    isMoving.value = false;

    // 判断是否到达终点 (允许 2px 的误差)
    if (dragWidth.value >= maxDragWidth - 2) {
      isSuccess.value = true;
      dragWidth.value = maxDragWidth; // 修正位置
      emit('success');
    } else {
      // 失败回弹
      dragWidth.value = 0;
      emit('fail');
    }

    // 移除事件监听
    document.removeEventListener('mousemove', onDragMove);
    document.removeEventListener('touchmove', onDragMove);
    document.removeEventListener('mouseup', onDragEnd);
    document.removeEventListener('touchend', onDragEnd);
  };

  // 绑定全局事件，防止拖出容器后失效
  document.addEventListener('mousemove', onDragMove);
  document.addEventListener('touchmove', onDragMove);
  document.addEventListener('mouseup', onDragEnd);
  document.addEventListener('touchend', onDragEnd);
};

// 重置组件状态 (供父组件调用)
const reset = () => {
  isSuccess.value = false;
  isMoving.value = false;
  dragWidth.value = 0;
};

// 暴露方法
defineExpose({
  reset,
});

// 清理
onUnmounted(() => {
  // 理论上 move/up 事件在 onDragEnd 中已移除，这里只是兜底
});
</script>

<style scoped>
.slide-verify {
  position: relative;
  overflow: hidden;
  user-select: none; /* 禁止文字选中 */
  box-sizing: border-box;
  border: 1px solid #e5e7eb; /* 浅灰色边框 */
  transition: background-color 0.3s;
}

/* 进度条背景 */
.slide-verify-bg {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: #4caf50;
  /* 如果没在拖动，添加过渡动画以实现平滑回弹 */
  transition: width 0s;
}
/* 仅在回弹时添加动画，拖拽时要是实时的 */
.slide-verify:not(:has(.is-moving)) .slide-verify-bg {
  transition: width 0.3s ease;
}

/* 文字层 */
.slide-verify-text {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #666;
  z-index: 1;
  pointer-events: none; /* 确保文字不阻挡点击 */
}

/* 成功后的文字颜色 */
.slide-verify.is-success .slide-verify-text {
  color: #fff;
}

/* 滑块手柄 */
.slide-verify-handler {
  position: absolute;
  top: 0;
  left: 0;
  width: 40px; /* 手柄宽度，可根据 height 动态调整，这里固定 40px 示例 */
  height: 100%;
  background-color: #fff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
  cursor: grab;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  z-index: 2;
  box-sizing: border-box;
  /* 仅在回弹时添加动画 */
  transition: left 0s;
}

.slide-verify:not(:has(.is-moving)) .slide-verify-handler {
  transition: left 0.3s ease;
}

.slide-verify-handler:active {
  cursor: grabbing;
}

.slide-verify.is-success .slide-verify-handler {
  cursor: default;
}
</style>
