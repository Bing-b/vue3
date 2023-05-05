<template>
  <el-tooltip v-bind="$attrs" v-model:visible="tooltipVisible" :disabled="disabledTooltip">
    <template #content>
      <slot :name="$slots.content ? 'content' : 'default'"></slot>
    </template>
    <span ref="triggerRef" :class="{
      'text-ellipsis': true,
      'text-ellipsis-line-clamp': lineClamp
    }" @mouseenter="setTooltipDisabled">
      <span ref="triggerInnerRef" class="text-ellipsis-inner" :style="lineClampStyle">
        <slot></slot>
      </span>
    </span>
  </el-tooltip>
</template>

<script lang="ts" setup>
import { computed, ref, type HTMLAttributes } from 'vue';

const props = defineProps({
  lineClamp: Number
});
const tooltipVisible = ref(false);
const triggerRef = ref<HTMLElement | null>(null);
const triggerInnerRef = ref<HTMLElement | null>(null);
const disabledTooltip = ref(true);
const lineClampStyle = computed<HTMLAttributes['style']>(() => {
  return props.lineClamp
    ? {
      display: '-webkit-inline-box',
      '-webkit-box-orient': 'vertical',
      '-webkit-line-clamp': props.lineClamp
    }
    : {};
});

function setTooltipDisabled() {
  const { value: $trigger } = triggerRef;
  if ($trigger) {
    if (props.lineClamp) {
      disabledTooltip.value = $trigger.scrollHeight <= $trigger.offsetHeight;
    } else {
      const { value: $triggerInner } = triggerInnerRef;
      if ($triggerInner) {
        disabledTooltip.value =
          $triggerInner.getBoundingClientRect().width <=
          $trigger.getBoundingClientRect().width;
      }
    }
  }
}
</script>

<style scoped>
.text-ellipsis {
  max-width: 100%;
  display: inline-block;
  overflow: hidden;
}

.text-ellipsis:not(.text-ellipsis-line-clamp) {
  white-space: nowrap;
  vertical-align: bottom;
  text-overflow: ellipsis;
}
</style>
