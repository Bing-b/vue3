import { MarkerType } from '@vue-flow/core';

export const initialNodes = [
  { id: '1', type: 'input', label: '人', position: { x: 250, y: 0 }, class: 'light' },
  { id: '2', type: 'output', label: '车', position: { x: 100, y: 100 }, class: 'light' },
  { id: '3', label: '手机', position: { x: 400, y: 100 }, class: 'light' },
  { id: '4', label: '银行', position: { x: 150, y: 200 }, class: 'light' },
  { id: '5', type: 'output', label: 'money', position: { x: 300, y: 300 }, class: 'light' }
];

export const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', label: '持有', source: '1', target: '3', markerEnd: MarkerType.ArrowClosed },
  {
    id: 'e4-5',
    type: 'step',
    label: '取出',
    source: '4',
    target: '5',
    style: { stroke: 'orange' },
    labelBgStyle: { fill: 'orange' }
  },
  { id: 'e3-4', type: 'smoothstep', label: '绑定', source: '3', target: '4' }
];
