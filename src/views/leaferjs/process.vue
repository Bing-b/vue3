<template>
  <div class="flow-chart-container overflow-hidden rounded-3xl border border-slate-200 bg-slate-100/30 transition-all duration-300 dark:border-white/10 dark:bg-black/20" @contextmenu.prevent>
    <div ref="canvasContainer" class="canvas-view" @click="closeMenu"></div>
    
    <!-- Context Menu -->
    <div 
      v-if="menuState.show" 
      class="context-menu fixed z-[1000] min-w-[120px] overflow-hidden rounded-xl border border-white bg-white/80 py-1 shadow-2xl backdrop-blur-md dark:border-white/10 dark:bg-slate-900/90"
      :style="{ left: menuState.x + 'px', top: menuState.y + 'px' }"
    >
      <div 
        class="menu-item flex cursor-pointer items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-blue-500 hover:text-white dark:text-slate-200 dark:hover:bg-blue-600"
        @click="handleMenuAction('expand')"
      >
        <el-icon><Expand /></el-icon> 扩展
      </div>
      <div 
        class="menu-item flex cursor-pointer items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-blue-500 hover:text-white dark:text-slate-200 dark:hover:bg-blue-600"
        @click="handleMenuAction('collapse')"
      >
        <el-icon><Fold /></el-icon> 收拢
      </div>
    </div>

    <div class="controls pointer-events-none absolute bottom-4 left-4 rounded-xl border border-white bg-white/80 p-3 shadow-lg backdrop-blur-md dark:border-white/5 dark:bg-white/5">
      <div class="flex items-center gap-2">
        <el-icon class="text-blue-500"><InfoFilled /></el-icon>
        <p class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Left drag to move nodes | Right click for menu | Wheel to zoom
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, shallowRef, reactive } from 'vue';
import { App, Rect, Text, Group, Path, Ellipse, PointerEvent, DragEvent } from 'leafer-ui';
import { InfoFilled, Expand, Fold } from '@element-plus/icons-vue';

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

interface Connection {
  id: string;
  fromId: string;
  toId: string;
  line: Path;
  arrow: Path;
}

// --- 配置常量 ---
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
    canvasBg: isDark ? '#0f172a' : '#ffffff', // Use solid bg for interaction
  };
};

const canvasContainer = ref<HTMLElement | null>(null);
const leaferApp = shallowRef<App | null>(null);

const linkLayer = shallowRef<Group | null>(null);
const nodeLayer = shallowRef<Group | null>(null);

// --- 菜单状态 ---
const menuState = reactive({
  show: false,
  x: 0,
  y: 0,
  targetNode: null as TreeNode | null
});

const closeMenu = () => menuState.show = false;

const handleMenuAction = (type: 'expand' | 'collapse') => {
  // 仅保留 UI 交互逻辑，暂不实现功能
  console.log('Action triggered:', type, menuState.targetNode?.label);
  closeMenu();
};

// --- 상태追踪 ---
const nodesMap = new Map<string, Group>();
const connections: Connection[] = [];
const treeData = ref<TreeNode>({
  id: 'root',
  label: 'Start Session',
  children: [],
});

// --- 工具 ---
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

// --- 线条更新逻辑 ---
const updateLine = (conn: Connection, config: any) => {
  const fromNode = nodesMap.get(conn.fromId);
  const toNode = nodesMap.get(conn.toId);
  if (!fromNode || !toNode) return;

  const startX = fromNode.x! + config.nodeWidth;
  const startY = fromNode.y! + config.nodeHeight / 2;
  const endX = toNode.x!;
  const endY = toNode.y! + config.nodeHeight / 2;

  const midX = startX + (endX - startX) / 2;
  const pathCommand = `M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${endX} ${endY}`;
  
  conn.line.path = pathCommand;
  conn.arrow.path = `M ${endX} ${endY} L ${endX - 8} ${endY - 5} L ${endX - 8} ${endY + 5} Z`;
};

const createConnection = (fromId: string, toId: string, config: any) => {
  const line = new Path({ stroke: config.lineColor, strokeWidth: 2 });
  const arrow = new Path({ fill: config.lineColor });
  const conn: Connection = { id: generateId(), fromId, toId, line, arrow };
  connections.push(conn);
  updateLine(conn, config);
  linkLayer.value?.add(line);
  linkLayer.value?.add(arrow);
};

// --- 绘图组件 ---
const drawNodeComponent = (node: TreeNode, config: any) => {
  if (!leaferApp.value) return;

  const group = new Group({ 
    id: node.id,
    x: node.x, 
    y: node.y, 
    draggable: true 
  });

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

  // Buttons
  const addBtn = new Group({ x: config.nodeWidth - 10, y: config.nodeHeight / 2, cursor: 'pointer' });
  addBtn.add(new Ellipse({ width: 22, height: 22, x: -11, y: -11, fill: '#10b981' }));
  addBtn.add(new Text({ text: '+', fontSize: 18, fill: '#fff', x: -11, y: -11, width: 22, height: 22, textAlign: 'center', verticalAlign: 'middle' }));
  addBtn.on(PointerEvent.TAP, (e) => {
    e.stop();
    const newNode = { id: generateId(), label: `Task ${Math.floor(Math.random() * 100)}`, children: [] };
    node.children.push(newNode);
    renderChart();
  });
  group.add(addBtn);

  if (node.id !== 'root' && node.id !== 'end') {
    const delBtn = new Group({ x: config.nodeWidth, y: 0, cursor: 'pointer' });
    delBtn.add(new Ellipse({ width: 18, height: 18, x: -9, y: -9, fill: '#ef4444' }));
    delBtn.add(new Text({ text: '×', fontSize: 14, fill: '#fff', x: -9, y: -10, width: 18, height: 18, textAlign: 'center', verticalAlign: 'middle' }));
    delBtn.on(PointerEvent.TAP, (e) => {
      e.stop();
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

  // Right Click Menu
  group.on(PointerEvent.MENU, (e) => {
    e.stop();
    e.preventDefault();
    
    // 计算节点在屏幕上的位置
    const canvasRect = canvasContainer.value?.getBoundingClientRect();
    if (canvasRect && leaferApp.value) {
      // 获取节点的世界坐标并转换为屏幕坐标
      const scale = (leaferApp.value.tree as any).scale || 1;
      const nodeScreenX = canvasRect.left + (node.x! + config.nodeWidth) * scale;
      const nodeScreenY = canvasRect.top + node.y! * scale;
      
      menuState.show = true;
      menuState.x = nodeScreenX + 10; // 节点右侧偏移10px
      menuState.y = nodeScreenY;
      menuState.targetNode = node;
    }
  });

  // Interactivity: Update lines when dragging
  group.on(DragEvent.MOVE, () => {
    connections.forEach(conn => {
      if (conn.fromId === node.id || conn.toId === node.id) {
        updateLine(conn, config);
      }
    });
  });

  nodesMap.set(node.id, group);
  nodeLayer.value?.add(group);
};

const buildConnections = (node: TreeNode, config: any) => {
  node.children.forEach(child => {
    createConnection(node.id, child.id, config);
    buildConnections(child, config);
  });
  if (node.children.length === 0 && node.id !== 'end') {
    createConnection(node.id, 'end', config);
  }
};

const renderChart = () => {
  if (!leaferApp.value) return;
  const config = getThemeConfig();
  
  // Clear previous state
  leaferApp.value.tree.clear();
  nodesMap.clear();
  connections.length = 0;

  // Create Layers (no background needed - App handles panning)
  linkLayer.value = new Group();
  nodeLayer.value = new Group();
  leaferApp.value.tree.add(linkLayer.value);
  leaferApp.value.tree.add(nodeLayer.value);

  // Compute Layout
  maxTreeX = 0;
  calculateTreeSize(treeData.value, config);
  assignCoordinates(treeData.value, 150, 150, config);
  
  const endId = 'end';
  const endNode: TreeNode = { 
    id: endId, 
    label: 'COMPLETE', 
    children: [], 
    x: maxTreeX + config.nodeWidth + config.gapX, 
    y: treeData.value.y! 
  };

  // Draw Nodes
  const drawAllNodes = (n: TreeNode) => {
    drawNodeComponent(n, config);
    n.children.forEach(drawAllNodes);
  };
  drawAllNodes(treeData.value);
  
  // End Node
  const group = new Group({ id: endId, x: endNode.x, y: endNode.y, draggable: true });
  group.add(new Rect({ width: config.nodeWidth, height: config.nodeHeight, fill: config.endNodeColor, stroke: config.endNodeStroke, strokeWidth: 2, cornerRadius: 30 }));
  group.add(new Text({ text: 'COMPLETE', fontSize: 12, fontWeight: 'black', fill: config.endNodeStroke, width: config.nodeWidth, height: config.nodeHeight, textAlign: 'center', verticalAlign: 'middle' }));
  group.on(DragEvent.MOVE, () => {
    connections.forEach(conn => {
      if (conn.fromId === endId || conn.toId === endId) updateLine(conn, config);
    });
  });
  nodesMap.set(endId, group);
  nodeLayer.value.add(group);

  // Draw Connections
  buildConnections(treeData.value, config);
};

// --- 生命周期 ---
onMounted(() => {
  if (canvasContainer.value) {
    leaferApp.value = new App({
      view: canvasContainer.value,
      tree: {},
      sky: { type: 'draw', fill: getThemeConfig().canvasBg },
      // @ts-ignore
      move: true,
      // @ts-ignore
      wheel: true,
    });
    renderChart();
  }

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
.context-menu {
  animation: menuIn 0.15s ease-out;
}
@keyframes menuIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>
