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
    // fitCenter: true,
    autoPaint: false,
    // fitView: true,
    modes: {
      default: ['drag-node', 'drag-canvas', 'zoom-canvas']
    },
    defaultNode: {
      size: [30],
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
      type: 'force2',
      center: [200, 200], // 可选，默认为图的中心
      linkDistance: 50, // 可选，边长
      nodeStrength: 30, // 可选
      edgeStrength: 0.1, // 可选
      nodeSize: 30,
      workerEnabled: true
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

const randomData = () => {
  const data = { nodes: [], edges: [] };
  for (let i = 0; i < 1000; i++) {
    data.nodes.push({
      id: `node${i}`,
      label: `实体${i}`
    });
  }
  for (let j = 1; j < 1000; j++) {
    data.edges.push({
      source: 'node0',
      target: `node${j}`
    });
  }

  return data;
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
  graph.fitCenter();
  count.value = count.value + 1;
};

// 监听拖拽完成
const dragOver = (event: DragEvent) => {
  event.preventDefault();
  event.dataTransfer!.dropEffect = 'move';
};

onMounted(() => {
  const maxData = randomData();
  console.log(maxData);
  createGraph(data);
});
</script>
