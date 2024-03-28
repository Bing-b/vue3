<template>
  <div style="width: 100%; height: 100vh; border:1px solid #ccc;">
    <dragBox style="width: 100%; height: 100%;">
      <dragItem style="width: 20%;">item1</dragItem>
      <dragItem :showResize="false">item2</dragItem>
    </dragBox>
  </div>
</template>

<script lang="ts" setup>
// 定义指定拖拽监听改变宽度
const vMove = {
  mounted: (el: HTMLElement) => {
    el.onmousedown = (e: MouseEvent) => {
      el.style.userSelect = 'none';
      const init = e.clientX;
      const parent = document.getElementById('targetBox');
      const initWidth = parent!.offsetWidth;
      document.onmousemove = (ev: MouseEvent) => {
        const end = ev.clientX;
        const newWidth = end - init + initWidth;
        parent!.style.width = `${newWidth}px`;
      };
      document.onmouseup = () => {
        // eslint-disable-next-line no-multi-assign
        document.onmousemove = document.onmouseup = null;
      };
    };
  }
};
</script>
