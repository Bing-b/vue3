<template>
  <div class="w-full h-full">
    <div id="graph" class="w-full h-full"></div>
  </div>
</template>

<script lang='ts' setup>
import { Horizon as Graph, DataSet } from 'gdm-horizon';
import { onMounted } from 'vue';

const data = {
  nodes: [
    { id: '1', text: '张飞' },
    { id: '2', text: '刘备' },
    { id: '3', text: '张亮' },
    { id: '4', text: '项羽' },
    { id: '5', text: '吕布' }

  ],
  edges: [
    { id: '1', source: '1', target: '2', text: '朋友' },
    { id: '2', source: '1', target: '3', text: '朋友' },
    { id: '3', source: '2', target: '3', text: '朋友' },
    { id: '4', source: '1', target: '4', text: '朋友' },
    { id: '5', source: '2', target: '5', text: '朋友' }
  ]
};

const createGraph = ($data) => {
  const container = document.getElementById('graph') as HTMLElement;

  const options = {
    nodes: {
      size: 20,
      color: '#dedede',
      textPosition: 'bottom',
      borderWidth: 4,
      borderColor: '#F44336',
      font: {
        fontSize: 12
      },
      selected: {
        type: 'normal', //  animate |  normal
        color: '#F44336'

      }
    },
    edges: {
      color: '#E3F2FD',
      font: {
        size: 12
      },
      arrow: false
    },
    layout: {
      type: 'forceatlas2',
      circular: {
        nodeSpacing: 70
      }
    },
    interaction: {
      createEdge: true
      // hideEdgeOnDrag: true,
      // hideNodeTextOnDrag: true,
      // hideEdgeOnZoom: true,
      // hideNodeTextOnZoom: true
    }
  };

  const dataSet = new DataSet($data.nodes, $data.edges);
  const graph = new Graph(container, dataSet, options);
};

onMounted(() => {
  createGraph(data);
});
</script>

<style scoped></style>
