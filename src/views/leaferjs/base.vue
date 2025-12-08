<template>
  <div ref="canvasContainer" class="h-[600px] w-full"></div>
</template>

<script lang="ts" setup>
import { App, Leafer, Line, Rect, PointerEvent } from 'leafer-ui';
import { onMounted, ref } from 'vue';
import { shallowRef } from 'vue';

// const leafer = shallowRef<Leafer | null>(null);

let leafer: Leafer | null = null;

const canvasContainer = ref<HTMLElement | null>(null);

const init = () => {
  leafer = new Leafer({
    view: canvasContainer.value as HTMLElement,
    fill: '#333',
  });

  const rect = new Rect({
    x: 100,
    y: 200,
    width: 100,
    height: 100,
    fill: '#32cd79',
    cornerRadius: [6, 2, 6, 2],
    draggable: true,
    // dashPattern: [3, 3],
    // strokeWidth: 5,
    // stroke: '#32cd79',
    event: {
      [PointerEvent.ENTER]: function (e: PointerEvent) {
        (e.current as Rect).fill = 'red';
      },
      [PointerEvent.LEAVE]: function (e: PointerEvent) {
        (e.current as Rect).fill = '#32cd79';
      },
    },
  });

  const line = new Line({
    x: 200,
    y: 250,
    width: 100,
    strokeWidth: 5,
    stroke: '#32cd79',
  });

  leafer.add(rect);
  leafer.add(line);
};

onMounted(() => {
  init();
});
</script>

<style scoped></style>
