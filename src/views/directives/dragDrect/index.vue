<template>
  <div class="card content-box h-full">
    <h2 class="title">拖拽指令 🍇🍇🍇🍓🍓🍓</h2>
    <div v-draggable class="drag-box">我可以拖拽哦~</div>
  </div>
</template>

<script setup lang="ts" name="dragDirect"></script>

<style scoped lang="scss">
.content-box {
  position: relative;
  .drag-box {
    position: absolute;
    top: 110px;
    width: 300px;
    height: 300px;
    font-size: 23px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: var(--el-color-primary-light-3);
    background: var(--el-color-primary-light-9);
    border-radius: 50%;
  }
}
</style>
