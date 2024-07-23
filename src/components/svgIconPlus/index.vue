<template>
  <svg
    aria-hidden="true"
    :class="['icon', customClass]"
    :width="size"
    :height="size"
    :style="{ color: color }">
    <use :xlink:href="`${spritePath}#${iconName}`"></use>
  </svg>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  iconName: {
    type: String,
    required: true,
  },
  size: {
    type: [String, Number],
    default: 24,
  },
  color: {
    type: String,
  },
  customClass: {
    type: String,
    default: '',
  },
});

const spritePath = '/assets/sprites/spritemap.svg';
</script>

<style scoped>
.icon {
  display: inline-block;
  vertical-align: middle;
  /* fill: currentColor; */
  overflow: hidden;
}
</style>
