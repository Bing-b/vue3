<template>
  <el-tooltip v-bind="$attrs" :disabled="disabledTooltip" effect="light" popper-class="maxWidth">
    <template #content>
      <slot :name="$slots.content ? 'content' : 'default'"></slot>
    </template>
    <span
      ref="triggerRef"
      :class="{
        'text-ellipsis': true,
        'text-ellipsis-line-clamp': lineClamp,
      }"
      @mouseenter="setTooltipDisabled">
      <span ref="triggerInnerRef" class="text-ellipsis-inner" :style="lineClampStyle">
        <slot></slot>
      </span>
    </span>
  </el-tooltip>
</template>

<script lang="ts" setup>
import { computed, ComputedRef, ref, StyleValue } from 'vue';

const props = withDefaults(
  defineProps<{
    lineClamp: Number;
  }>(),
  {},
);

// 文本父级DOM
const triggerRef = ref<HTMLElement | null>(null);

// 文本DOM
const triggerInnerRef = ref<HTMLElement | null>(null);

// 控制是否显示tooltip
const disabledTooltip = ref(true);

const lineClampStyle = computed(() => {
  return props.lineClamp
    ? {
        display: '-webkit-inline-box',
        '-webkit-box-orient': 'vertical',
        '-webkit-line-clamp': props.lineClamp,
      }
    : {};
}) as ComputedRef<StyleValue>;

// 判断文本内容是否超出容器，超出显示tooltip
const setTooltipDisabled = () => {
  const { value: $trigger } = triggerRef;
  if ($trigger) {
    if (props.lineClamp) {
      disabledTooltip.value = $trigger.scrollHeight <= $trigger.offsetHeight;
    } else {
      const { value: $triggerInner } = triggerInnerRef;
      if ($triggerInner) {
        disabledTooltip.value =
          $triggerInner.getBoundingClientRect().width <= $trigger.getBoundingClientRect().width;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.text-ellipsis {
  max-width: 100%;
  display: inline-block;
  overflow: hidden;

  &:not(.text-ellipsis-line-clamp) {
    white-space: nowrap;
    vertical-align: bottom;
    text-overflow: ellipsis;
  }
}
</style>

<style>
/* 控制tooltip最大宽度，避免文字过长导致显示不全问题 */
.maxWidth {
  max-width: 400px;
}
</style>
