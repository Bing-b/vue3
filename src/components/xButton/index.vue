<template>
  <div v-bind="$attrs" class="x-button">
    <slot></slot>
  </div>
</template>
<style lang="scss" scoped>
.x-button {
  position: relative;
  display: inline-block;
  padding: 8px 12px;
  background-color: #E77A29;
  border: 1px solid #dedede;
  font-size: 14px;
  color: #fff;
  box-sizing: border-box;
  border-radius: 4px;
  cursor: pointer;
  z-index: 1;

  &::before {
    position: absolute;
    content: '';
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: #E77A29;
    border-radius: 4px;
    transform: scale(1.3);
    opacity: 0;
    transition: .36s;
    z-index: -1;
  }

  &:hover {
    &::before {
      transform: scale(1);
      opacity: 1;
    }
  }

}
</style>
