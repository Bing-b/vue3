<template>
  <div class="flow-chart-container overflow-hidden rounded-3xl border border-slate-200 bg-slate-100/30 transition-all duration-300 dark:border-white/10 dark:bg-black/20">
    <div ref="canvasContainer" class="canvas-view"></div>
    <div class="controls pointer-events-none absolute bottom-4 left-4 rounded-xl border border-white bg-white/80 p-3 shadow-lg backdrop-blur-md dark:border-white/5 dark:bg-white/5">
      <div class="flex items-center gap-2">
        <el-icon class="text-blue-500"><InfoFilled /></el-icon>
        <p class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Click <span class="text-emerald-500">+</span> to add steps. All ends auto-connect to Finish.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, shallowRef, watch } from 'vue';
import { App, Rect, Text, Group, Path, Ellipse, PointerEvent } from 'leafer-ui';
import { InfoFilled } from '@element-plus/icons-vue';

// --- 类型定义 ---
interface TreeNode {
  id: string;
  label: string;
  children: TreeNode[];
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

// --- 配置常量 (Theme-aware) ---
const getThemeConfig = () => {
  const isDark = document.documentElement.classList.contains('dark');
  return {
    nodeWidth: 140,
    nodeHeight: 60,
    gapX: 80,
    gapY: 40,
    nodeColor: isDark ? '#1e293b' : '#ffffff',
    nodeStroke: isDark ? '#3b82f6' : '#3b82f6',
    textColor: isDark ? '#f8fafc' : '#1e293b',
    lineColor: isDark ? '#475569' : '#94a3b8',
    endNodeColor: isDark ? '#334155' : '#f1f5f9',
    endNodeStroke: isDark ? '#64748b' : '#64748b',
    canvasBg: isDark ? 'transparent' : '#ffffff',
  };
};

const canvasContainer = ref<HTMLElement | null>(null);
const leaferApp = shallowRef<App | null>(null);

// --- 数据状态 ---
const treeData = ref<TreeNode>({
  id: 'root',
  label: 'Start Session',
  children: [],
});

const endNodePos = ref({ x: 0, y: 0 });

// --- 工具和布局 ---
const generateId = () => Math.random().toString(36).substr(2, 9);

const calculateTreeSize = (node: TreeNode, config: any) => {
  if (node.children.length === 0) {
    node.height = config.nodeHeight;
    return;
  }
  let totalHeight = 0;
  node.children.forEach((child) => {
    calculateTreeSize(child, config);
    totalHeight += child.height! + config.gapY;
  });
  totalHeight -= config.gapY;
  node.height = Math.max(config.nodeHeight, totalHeight);
};

let maxTreeX = 0;
const assignCoordinates = (node: TreeNode, x: number, y: number, config: any) => {
  const renderY = y + (node.height! - config.nodeHeight) / 2;
  node.x = x;
  node.y = renderY;
  if (x > maxTreeX) maxTreeX = x;

  let childStartY = y;
  node.children.forEach((child) => {
    assignCoordinates(child, x + config.nodeWidth + config.gapX, childStartY, config);
    childStartY += child.height! + config.gapY;
  });
};

const updateLayout = (config: any) => {
  maxTreeX = 0;
  calculateTreeSize(treeData.value, config);
  assignCoordinates(treeData.value, 60, 60, config);
  endNodePos.value = {
    x: maxTreeX + config.nodeWidth + config.gapX,
    y: treeData.value.y!,
  };
};

// --- 绘图逻辑 ---
const drawPolyLine = (startX: number, startY: number, endX: number, endY: number, config: any) => {
  const midX = startX + (endX - startX) / 2;
  const pathCommand = `M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${endX} ${endY}`;
  const line = new Path({ stroke: config.lineColor, strokeWidth: 2, path: pathCommand });
  const arrow = new Path({ fill: config.lineColor, path: `M ${endX} ${endY} L ${endX - 8} ${endY - 5} L ${endX - 8} ${endY + 5} Z` });
  return [line, arrow];
};

const drawNode = (node: TreeNode, config: any, parentNode?: TreeNode) => {
  if (!leaferApp.value) return;

  const group = new Group({ x: node.x, y: node.y });

  // 1. Lines
  if (parentNode && parentNode.x !== undefined) {
    const lines = drawPolyLine(parentNode.x + config.nodeWidth, parentNode.y! + config.nodeHeight / 2, node.x!, node.y! + config.nodeHeight / 2, config);
    lines.forEach((l) => leaferApp.value!.tree.add(l));
  }

  if (node.children.length === 0) {
    const lines = drawPolyLine(node.x! + config.nodeWidth, node.y! + config.nodeHeight / 2, endNodePos.value.x, endNodePos.value.y + config.nodeHeight / 2, config);
    lines.forEach((l) => leaferApp.value!.tree.add(l));
  }

  // 2. Node UI
  const rect = new Rect({
    width: config.nodeWidth,
    height: config.nodeHeight,
    fill: config.nodeColor,
    stroke: config.nodeStroke,
    strokeWidth: 2,
    cornerRadius: 12,
    shadow: { x: 0, y: 10, blur: 20, color: 'rgba(0,0,0,0.05)' },
  });

  const text = new Text({
    text: node.label,
    fontSize: 13,
    fontWeight: 'bold',
    fill: config.textColor,
    width: config.nodeWidth,
    height: config.nodeHeight,
    textAlign: 'center',
    verticalAlign: 'middle',
  });

  group.add(rect);
  group.add(text);

  // 3. Buttons
  const addBtn = new Group({ x: config.nodeWidth - 10, y: config.nodeHeight / 2, cursor: 'pointer' });
  addBtn.add(new Ellipse({ width: 22, height: 22, x: -11, y: -11, fill: '#10b981', shadow: { x: 0, y: 4, blur: 10, color: 'rgba(16,185,129,0.3)' } }));
  addBtn.add(new Text({ text: '+', fontSize: 18, fill: '#fff', x: -11, y: -11, width: 22, height: 22, textAlign: 'center', verticalAlign: 'middle' }));
  addBtn.on(PointerEvent.TAP, (e) => {
    e.stop();
    node.children.push({ id: generateId(), label: `Task ${Math.floor(Math.random() * 100)}`, children: [] });
    renderChart();
  });
  group.add(addBtn);

  if (node.id !== 'root') {
    const delBtn = new Group({ x: config.nodeWidth, y: 0, cursor: 'pointer' });
    delBtn.add(new Ellipse({ width: 18, height: 18, x: -9, y: -9, fill: '#ef4444' }));
    delBtn.add(new Text({ text: '×', fontSize: 14, fill: '#fff', x: -9, y: -10, width: 18, height: 18, textAlign: 'center', verticalAlign: 'middle' }));
    delBtn.on(PointerEvent.TAP, (e) => {
      e.stop();
      // Simple parent find logic for deletion
      const findAndRemove = (parent: TreeNode) => {
        const idx = parent.children.findIndex(c => c.id === node.id);
        if (idx !== -1) { parent.children.splice(idx, 1); return true; }
        return parent.children.some(findAndRemove);
      };
      findAndRemove(treeData.value);
      renderChart();
    });
    group.add(delBtn);
  }

  leaferApp.value.tree.add(group);
  node.children.forEach((child) => drawNode(child, config, node));
};

const drawEndNode = (config: any) => {
  if (!leaferApp.value) return;
  const group = new Group({ x: endNodePos.value.x, y: endNodePos.value.y });
  group.add(new Rect({ width: config.nodeWidth, height: config.nodeHeight, fill: config.endNodeColor, stroke: config.endNodeStroke, strokeWidth: 2, cornerRadius: 30 }));
  group.add(new Text({ text: 'COMPLETE', fontSize: 12, fontWeight: 'black', fill: config.endNodeStroke, width: config.nodeWidth, height: config.nodeHeight, textAlign: 'center', verticalAlign: 'middle' }));
  leaferApp.value.tree.add(group);
};

const renderChart = () => {
  if (!leaferApp.value) return;
  leaferApp.value.tree.clear();
  const config = getThemeConfig();
  leaferApp.value.config.fill = config.canvasBg;
  updateLayout(config);
  drawNode(treeData.value, config);
  drawEndNode(config);
};

// --- 生命周期 ---
onMounted(() => {
  if (canvasContainer.value) {
    leaferApp.value = new App({
      view: canvasContainer.value,
      tree: {},
      fill: getThemeConfig().canvasBg,
      move: { scroll: true },
    });
    renderChart();
  }

  // Watch for theme
  const observer = new MutationObserver(() => renderChart());
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
});

onUnmounted(() => {
  if (leaferApp.value) leaferApp.value.destroy();
});
</script>

<style scoped>
.flow-chart-container {
  width: 100%;
  height: 600px;
  position: relative;
}
.canvas-view {
  width: 100%;
  height: 100%;
}
</style>
