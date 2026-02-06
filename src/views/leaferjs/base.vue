<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-bold text-slate-700 dark:text-slate-300">Basic Shapes & Interaction</h3>
      <span class="text-[10px] font-medium text-slate-400 font-mono">LEAFER-UI v1.0</span>
    </div>
    <div ref="canvasContainer" class="h-[500px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all dark:border-white/10 dark:bg-black/20"></div>
  </div>
</template>

<script lang="ts" setup>
import { Leafer, Line, Rect, PointerEvent } from 'leafer-ui';
import { onMounted, ref, onUnmounted } from 'vue';

let leafer: Leafer | null = null;
const canvasContainer = ref<HTMLElement | null>(null);

const init = () => {
  if (!canvasContainer.value) return;
  
  const isDark = document.documentElement.classList.contains('dark');
  
  leafer = new Leafer({
    view: canvasContainer.value,
    fill: isDark ? 'transparent' : '#ffffff',
  });

  const rect = new Rect({
    x: 100,
    y: 150,
    width: 120,
    height: 120,
    fill: '#32cd79',
    cornerRadius: [12, 4, 12, 4],
    draggable: true,
    shadow: { x: 0, y: 10, blur: 20, color: 'rgba(50,205,121,0.2)' },
    event: {
      [PointerEvent.ENTER]: function (e: PointerEvent) {
        (e.current as Rect).fill = '#3b82f6';
      },
      [PointerEvent.LEAVE]: function (e: PointerEvent) {
        (e.current as Rect).fill = '#32cd79';
      },
    },
  });

  const line = new Line({
    x: 250,
    y: 200,
    width: 150,
    strokeWidth: 4,
    stroke: '#3b82f6',
    strokeCap: 'round',
  });

  leafer.add(rect);
  leafer.add(line);
};

onMounted(() => {
  init();
  
  // Watch for theme
  const observer = new MutationObserver(() => {
    if (leafer) {
      const isDark = document.documentElement.classList.contains('dark');
      leafer.config.fill = isDark ? 'transparent' : '#ffffff';
    }
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
});

onUnmounted(() => {
  if (leafer) leafer.destroy();
});
</script>

<style scoped></style>
