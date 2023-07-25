<template>
  <div class="flex w-full h-full">
    <div class="w-1/4">
      <ul>
        <li v-for="item in data.nodes" :key="item.id" @dragstart="dragStart($event)" @dragend.stop="dragEnd($event, item)"
          draggable="true">{{ item.label }}</li>
      </ul>
    </div>
    <div id="graphG6" class="w-3/4 h-full border" @dragOver="dragOver"></div>
  </div>
</template>

<script lang='ts' setup>
import G6, { Graph, GraphData } from '@antv/g6';
import {
  onMounted, ref
} from 'vue';

let graph: Graph;

const createGraph = ($data: GraphData) => {
  const container = document.getElementById('graphG6') as HTMLElement;
  const width = container.clientWidth;
  const height = container.clientHeight;

  graph = new G6.Graph({
    container: 'graphG6',
    width,
    height,
    fitCenter: true,
    modes: {
      default: ['drag-node', 'drag-canvas']
    },
    defaultNode: {
      size: [40],
      type: 'circle',
      style: {
        fill: '#DEE9FF',
        stroke: '#5B8FF9'
      }
    },
    defaultEdge: {
      lineAppendWidth: 5, // 边响应鼠标事件时的检测宽度
      style: {
        stroke: '#BDBEBF'
      },
      labelCfg: {
        autoRotate: true,
        style: {
          stroke: 'white',
          lineWidth: 5
        }
      }
    },
    layout: {
      type: 'force',
      preventOverlap: true, // 是否防止重叠
      nodeSize: 40, // 节点大小
      linkDistance: 100 // 边距离
    }
  });

  graph.clear();
  graph.data($data);
  graph.render();
};

const count = ref(0);
const data = {
  nodes: [
    {
      id: '0',
      label: '实体1',
      x: 150,
      y: 100
    },
    {
      id: '1',
      label: '实体2',
      x: 350,
      y: 300
    }
  ],
  edges: [
    {
      source: '0',
      target: '1'
    }
  ]
};

const dragStart = (event: DragEvent) => {
  event.dataTransfer!.setData('text/plain', 'dragStart!');
};

const dragEnd = (event: DragEvent, ele: any) => {
  // 新增实体数据，处理鼠标坐标与画布坐标偏移
  const { x, y } = graph.getPointByClient(event.x, event.y);
  const newNode = {
    id: `node${count.value}`,
    label: ele.label,
    x,
    y
  };
  graph.addItem('node', newNode);
  count.value = count.value + 1;
};

// 监听拖拽完成
const dragOver = (event: DragEvent) => {
  event.preventDefault();
  event.dataTransfer!.dropEffect = 'move';
};
onMounted(() => {
  createGraph(data);
});
</script>
