<template>
  <div ref="dragBox" id="dragBox" class="flex w-full h-full">
    <slot></slot>
  </div>
</template>

<script lang='ts' setup>
import { onMounted, ref } from 'vue';

const dragBox = ref(null);

const currentBox = ref();

const resizeBox = ref();

const rightBox = ref();

const startX = ref();

const curlen = ref();

const otherBoxWidth = ref();

const setDragItemFlex = () => {
  const d = document.getElementById('dragBox');
  console.log(d);
  if (d.children) {
    console.log(d.children);
    for (const ele of d?.children) {
      console.log(ele);
      // ele.style.flex = 1;
    }
  }
};

const onMouseMove = (e) => {
  const endX = e.clientX;
  const moveLen = endX - startX.value;
  const CurBoxLen = curlen.value + moveLen;
  const rightBoxLen = dragBox.value.clientWidth - CurBoxLen - otherBoxWidth.value;
  // if (CurBoxLen <= 200 || rightBoxLen <= 200) return;
  requestAnimationFrame(() => {
    currentBox.value.style.width = `${CurBoxLen}px`;
    resizeBox.value.style.left = `${CurBoxLen}px`;
    rightBox.value.style.width = `${rightBoxLen}px`;
  });
};

const onMouseUp = () => {
  resizeBox.value.style.background = '#d6d6d6';
  document.removeEventListener('mousedown', onMouseDown);
  document.removeEventListener('mousemove', onMouseMove);
};

const onMouseDown = (e) => {
  resizeBox.value = e.target;
  currentBox.value = resizeBox.value!.parentNode;
  rightBox.value = getNextElement(currentBox.value);
  console.log(rightBox.value);
  if (!rightBox.value) return;
  curlen.value = currentBox.value.clientWidth;
  otherBoxWidth.value = dragBox.value.clientWidth - curlen.value - rightBox.value.clientWidth;

  resizeBox.value.style.background = 'red';
  startX.value = e.clientX;
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};

const getNextElement = (element) => {
  let next = element.nextElementSibling;
  while (next && next.nodeType !== 1) {
    next = next.nextElementSibling;
  }
  return next;
};

const dragControllerDiv = () => {
  const resize = document.getElementsByClassName('resize');

  for (let i = 0; i < resize.length; i++) {
    // 鼠标按下事件
    resize[i].addEventListener('mousedown', onMouseDown);
  }
};

onMounted(() => {
  if (dragBox.value) {
    setDragItemFlex();
  }

  dragControllerDiv();
});

</script>

<style scoped></style>
