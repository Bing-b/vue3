<template>
  <div v-bind="$attrs" class="x-button" :class="{ 'active': isClick }" @click="handleClick">
    <slot></slot>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const isClick = ref(false);
const handleClick = () => {
  isClick.value = true;

  setTimeout(() => {
    isClick.value = false;
  }, 200);
};
</script>
<style lang="scss" scoped>
.x-button {
  position: relative;
  display: inline-block;
  padding: 4px 15px;
  background-color: #E77A29;
  border: 1px solid #dedede;
  font-size: 14px;
  color: #fff;
  box-sizing: border-box;
  border-radius: 4px;
  cursor: pointer;
  z-index: 1;
  overflow: hidden;

  &::before {
    position: absolute;
    content: '';
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: #eab48a;
    border-radius: 4px;
    transform: translateX(-100%);
    transition: .2s;
    z-index: -1;
  }

  &:hover {
    background-color: #E77A29;
  }

}

.active {
  &::before {
    transform: translate(100%);
  }
}
</style>
