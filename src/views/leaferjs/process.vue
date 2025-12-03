<template>
  <div class="flow-chart-container">
    <div ref="canvasContainer" class="canvas-view"></div>
    <div class="controls">
      <p>规则: 默认存在开始和结束。点击 "+" 新增中间步骤，所有末端节点会自动连接到结束节点。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, shallowRef } from 'vue';
import { App, Rect, Text, Group, Path, Ellipse, PointerEvent, Box } from 'leafer-ui';

// --- 类型定义 ---
interface TreeNode {
  id: string;
  label: string;
  children: TreeNode[];
  x?: number;
  y?: number;
  width?: number;
  height?: number; // 子树包含间距的总高度
}

// --- 配置常量 ---
const CONFIG = {
  nodeWidth: 120,
  nodeHeight: 50,
  gapX: 100, // 水平间距加大一点，方便看折线
  gapY: 30, // 垂直间距
  nodeColor: '#EBF5FF',
  strokeColor: '#3B82F6',
  endNodeColor: '#F1F5F9', // 结束节点颜色（灰色）
  endNodeStroke: '#64748B',
};

const canvasContainer = ref<HTMLElement | null>(null);
const leaferApp = shallowRef<App | null>(null);

// --- 数据状态 ---
// treeData 只包含 "开始" -> "中间流程"
const treeData = ref<TreeNode>({
  id: 'root',
  label: '开始',
  children: [],
});

// 结束节点的坐标（动态计算）
const endNodePos = ref({ x: 0, y: 0 });

// --- 工具函数 ---
const generateId = () => Math.random().toString(36).substr(2, 9);

const removeNodeFromData = (parentNode: TreeNode, targetId: string): boolean => {
  const index = parentNode.children.findIndex((c) => c.id === targetId);
  if (index !== -1) {
    parentNode.children.splice(index, 1);
    return true;
  }
  for (const child of parentNode.children) {
    if (removeNodeFromData(child, targetId)) return true;
  }
  return false;
};

const addChildToNode = (node: TreeNode, targetId: string) => {
  if (node.id === targetId) {
    node.children.push({
      id: generateId(),
      label: `步骤 ${Math.floor(Math.random() * 100)}`,
      children: [],
    });
    return true;
  }
  for (const child of node.children) {
    if (addChildToNode(child, targetId)) return true;
  }
  return false;
};

// --- 布局算法 ---

/**
 * 1. 计算树的大小
 */
const calculateTreeSize = (node: TreeNode) => {
  if (node.children.length === 0) {
    node.height = CONFIG.nodeHeight;
    return;
  }
  let totalHeight = 0;
  node.children.forEach((child) => {
    calculateTreeSize(child);
    totalHeight += child.height! + CONFIG.gapY;
  });
  totalHeight -= CONFIG.gapY;
  node.height = Math.max(CONFIG.nodeHeight, totalHeight);
};

// 记录树中最远的 X 坐标，用于确定结束节点的位置
let maxTreeX = 0;

/**
 * 2. 分配坐标
 */
const assignCoordinates = (node: TreeNode, x: number, y: number) => {
  const renderY = y + (node.height! - CONFIG.nodeHeight) / 2;
  node.x = x;
  node.y = renderY;

  // 更新最远 X 坐标
  if (x > maxTreeX) {
    maxTreeX = x;
  }

  let childStartY = y;
  node.children.forEach((child) => {
    assignCoordinates(child, x + CONFIG.nodeWidth + CONFIG.gapX, childStartY);
    childStartY += child.height! + CONFIG.gapY;
  });
};

const updateLayout = () => {
  maxTreeX = 0; // 重置
  calculateTreeSize(treeData.value);
  // 根节点起始位置
  assignCoordinates(treeData.value, 50, 50);

  // 计算结束节点位置
  // X: 最深节点的右侧 + 间距
  // Y: 根节点的 Y (保持水平居中对齐)
  endNodePos.value = {
    x: maxTreeX + CONFIG.nodeWidth + CONFIG.gapX,
    y: treeData.value.y!,
  };
};

// --- 绘图逻辑 ---

/**
 * 画折线 (曼哈顿连线)
 */
const drawPolyLine = (startX: number, startY: number, endX: number, endY: number) => {
  // 中间转折 X
  const midX = startX + (endX - startX) / 2;
  const pathCommand = `M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${endX} ${endY}`;

  const line = new Path({
    stroke: '#94A3B8',
    strokeWidth: 2,
    path: pathCommand,
  });

  const arrow = new Path({
    fill: '#94A3B8',
    path: `M ${endX} ${endY} L ${endX - 6} ${endY - 4} L ${endX - 6} ${endY + 4} Z`,
  });

  return [line, arrow];
};

/**
 * 递归绘制普通节点
 */
const drawNode = (node: TreeNode, parentNode?: TreeNode) => {
  if (!leaferApp.value) return;

  const group = new Group({ x: node.x, y: node.y });

  // 1. 绘制与父节点的连线
  if (parentNode && parentNode.x !== undefined && parentNode.y !== undefined) {
    const startX = parentNode.x + CONFIG.nodeWidth;
    const startY = parentNode.y + CONFIG.nodeHeight / 2;
    const endX = node.x!;
    const endY = node.y! + CONFIG.nodeHeight / 2;

    const lines = drawPolyLine(startX, startY, endX, endY);
    lines.forEach((l) => leaferApp.value!.tree.add(l));
  }

  // 2. 关键逻辑：如果当前节点没有子节点（叶子节点），则自动连接到"结束节点"
  if (node.children.length === 0) {
    const startX = node.x! + CONFIG.nodeWidth;
    const startY = node.y! + CONFIG.nodeHeight / 2;
    const endX = endNodePos.value.x;
    const endY = endNodePos.value.y + CONFIG.nodeHeight / 2;

    const lines = drawPolyLine(startX, startY, endX, endY);
    lines.forEach((l) => leaferApp.value!.tree.add(l));
  }

  // 3. 绘制节点 UI (矩形)
  const rect = new Rect({
    width: CONFIG.nodeWidth,
    height: CONFIG.nodeHeight,
    fill: CONFIG.nodeColor,
    stroke: CONFIG.strokeColor,
    strokeWidth: 2,
    cornerRadius: 4,
    shadow: { x: 2, y: 2, blur: 4, color: 'rgba(0,0,0,0.1)' },
  });

  const text = new Text({
    text: node.label,
    fontSize: 14,
    fill: '#1E293B',
    width: CONFIG.nodeWidth,
    height: CONFIG.nodeHeight,
    textAlign: 'center',
    verticalAlign: 'middle',
  });

  group.add(rect);
  group.add(text);

  // 4. 绘制 "+" 按钮
  const addBtnGroup = new Group({
    x: CONFIG.nodeWidth - 10,
    y: CONFIG.nodeHeight / 2,
    cursor: 'pointer',
  });
  addBtnGroup.add(new Ellipse({ width: 20, height: 20, x: -10, y: -10, fill: '#10B981' }));
  addBtnGroup.add(
    new Text({
      text: '+',
      fontSize: 16,
      fill: '#fff',
      x: -10,
      y: -10,
      width: 20,
      height: 20,
      textAlign: 'center',
      verticalAlign: 'middle',
    }),
  );

  addBtnGroup.on(PointerEvent.TAP, (e) => {
    e.stop();
    addChildToNode(treeData.value, node.id);
    renderChart();
  });
  group.add(addBtnGroup);

  // 5. 绘制 "-" 按钮 (根节点不能删)
  if (node.id !== 'root') {
    const delBtnGroup = new Group({ x: CONFIG.nodeWidth, y: 0, cursor: 'pointer' });
    delBtnGroup.add(new Ellipse({ width: 16, height: 16, x: -8, y: -8, fill: '#EF4444' }));
    delBtnGroup.add(
      new Text({
        text: '-',
        fontSize: 14,
        fill: '#fff',
        x: -8,
        y: -9,
        width: 16,
        height: 16,
        textAlign: 'center',
        verticalAlign: 'middle',
      }),
    );

    delBtnGroup.on(PointerEvent.TAP, (e) => {
      e.stop();
      removeNodeFromData(treeData.value, node.id);
      renderChart();
    });
    group.add(delBtnGroup);
  }

  leaferApp.value.tree.add(group);

  // 递归
  node.children.forEach((child) => drawNode(child, node));
};

/**
 * 绘制单独的结束节点
 */
const drawEndNode = () => {
  if (!leaferApp.value) return;

  const group = new Group({
    x: endNodePos.value.x,
    y: endNodePos.value.y,
  });

  // 结束节点样式通常稍微不同（圆角大一点，或者颜色不同）
  const rect = new Rect({
    width: CONFIG.nodeWidth,
    height: CONFIG.nodeHeight,
    fill: CONFIG.endNodeColor,
    stroke: CONFIG.endNodeStroke,
    strokeWidth: 2,
    cornerRadius: 25, // 胶囊形状
    shadow: { x: 2, y: 2, blur: 4, color: 'rgba(0,0,0,0.1)' },
  });

  const text = new Text({
    text: '结束',
    fontSize: 14,
    fontWeight: 'bold',
    fill: '#475569',
    width: CONFIG.nodeWidth,
    height: CONFIG.nodeHeight,
    textAlign: 'center',
    verticalAlign: 'middle',
  });

  group.add(rect);
  group.add(text);
  // 结束节点没有操作按钮

  leaferApp.value.tree.add(group);
};

const renderChart = () => {
  if (!leaferApp.value) return;

  leaferApp.value.tree.clear();

  updateLayout(); // 计算位置

  drawNode(treeData.value); // 画树（含自动连线到结束）
  drawEndNode(); // 画结束节点
};

// --- 生命周期 ---
onMounted(() => {
  if (canvasContainer.value) {
    leaferApp.value = new App({
      view: canvasContainer.value,
      tree: {},
      fill: '#ffffff',
      move: { scroll: true },
    });
    renderChart();
  }
});

onUnmounted(() => {
  if (leaferApp.value) {
    leaferApp.value.destroy();
  }
});
</script>

<style scoped>
.flow-chart-container {
  width: 100%;
  height: 600px;
  position: relative;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background-color: #f8fafc;
}

.canvas-view {
  width: 100%;
  height: 100%;
}

.controls {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  color: #64748b;
  border: 1px solid #cbd5e1;
  pointer-events: none;
}
</style>
