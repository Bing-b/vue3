<template>
  <div
    element-loading-background="rgba(225,225,225,0.6)"
    class="relative h-full w-full bg-white"
    id="mapContainer">
    <div id="gisMap" class="absolute inset-0 z-2"></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import * as L from 'leaflet';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet/dist/leaflet.css';
import '@/utils/gis/leaflet-heat';
import 'leaflet-pulse-icon'; // 标记目标脉冲效果
import 'leaflet.markercluster'; // marker 聚合插件
import { GCJ02TOWGS84 } from './ts/utils';

// 标记样式
const STYLES = {
  NORMAL: { radius: 9, color: '#3388ff', fillColor: '#3388ff', fillOpacity: 0.6, weight: 1 },
  SELECTED: { radius: 9, color: '#f44336', fillColor: '#3388ff', fillOpacity: 0.6, weight: 3 },
  HIGHLIGHT: { radius: 9, color: '#ffffff', fillColor: '#E53935', fillOpacity: 0, weight: 1 },
};

// gisMap 实例
let baseMap = {} as any;

const loading = ref(true);

// 聚合标记组
const markers = L.markerClusterGroup({
  disableClusteringAtZoom: 14,
  chunkedLoading: true, // 关键：开启分块加载，防止一次性渲染导致的页面假死
  // chunkInterval: 200, // 处理块之间的时间间隔（ms）
  // chunkDelay: 50, // 延迟
  showCoverageOnHover: false,
  spiderfyOnMaxZoom: false,
});

// 标记id-layer 映射
const markerIdMap = new Map<string, Recordable>();

// 最后选择的markerid
let lastSelectedId: string | null = null;

// 高亮的ids
const highlightMarkerIds = ref<string[]>([]);

// 高亮动画 marker 组
const hightLightMarkerLayers = new L.FeatureGroup();

// 清除选中标记
const clearMarksSelected = () => {
  if (!lastSelectedId) return;
  const marker = markerIdMap.get(lastSelectedId);
  if (!marker) return;
  marker.setStyle({ ...STYLES.NORMAL });
};

// 绑定事件
const bindEvent = () => {
  // 点击地图
  baseMap.on('click', () => {
    clearMarksSelected();
  });
};

// 清除标记
const clearMarker = () => {
  markers.clearLayers();
};

// 高亮
const selectMarker = (id: string) => {
  // 恢复旧样式
  if (lastSelectedId !== null) {
    const prev = markerIdMap.get(lastSelectedId);
    if (prev) prev.setStyle({ ...STYLES.NORMAL });
  }
  const current = markerIdMap.get(id);
  if (current) {
    current.setStyle({ ...STYLES.SELECTED });
    lastSelectedId = id;
  }
};

// 处理点击marker
const onMarkerClick = (e: any, node: any) => {
  selectMarker(node.incidentId);
  L.DomEvent.stopPropagation(e);
};

// 批量渲染markers
const renderMarkers = async (data: any[]) => {
  const canvasRenderer = L.canvas({ padding: 1 });
  let index = 0;
  const CHUNK_SIZE = 5000;

  const allTempMarkers: any[] = [];

  // 重置
  markers.clearLayers();
  markerIdMap.clear();

  if (!baseMap.hasLayer(markers)) {
    baseMap.addLayer(markers);
  }

  // 分批渲染
  const processChunks = () => {
    const end = Math.min(index + CHUNK_SIZE, data.length);

    for (; index < end; index++) {
      const node = data[index];
      const marker = L.circleMarker(node.coordinate, {
        ...STYLES.NORMAL,
        renderer: canvasRenderer,
        node: node,
      });

      marker.on('click', (e: any) => onMarkerClick(e, node));
      markerIdMap.set(node.incidentId, marker);
      allTempMarkers.push(marker);
    }

    if (index < data.length) {
      requestIdleCallback(processChunks);
    } else {
      markers.addLayers(allTempMarkers);
      //  将 marker聚合组添加到地图
      if (!baseMap.hasLayer(markers)) {
        baseMap.addLayer(markers);
      }
    }
  };

  processChunks();
};

// 绘制标记
const drawGisNodes = (nodes: Recordable[]) => {
  if (!baseMap) {
    console.warn('地图实例尚未创建');
    return;
  }
  loading.value = true;
  // 地图加载完成后立即执行绘制标记，避免卡死地图加载
  baseMap.whenReady(() => {
    setTimeout(() => {
      renderMarkers(nodes);
    }, 1000);
  });
};

// 高亮 marker
const highLightMarker = (ids: string[] = []) => {
  // 清除所有高亮动画标记
  if (hightLightMarkerLayers) hightLightMarkerLayers.clearLayers();

  // 恢复上次高亮marker 默认样式
  for (const i of highlightMarkerIds.value) {
    const marker = markerIdMap.get(i);
    if (!marker) continue;
    marker.setStyle({ ...STYLES.NORMAL });
  }

  for (const i of ids) {
    const marker = markerIdMap.get(i);
    if (!marker) continue;
    marker.setStyle({ ...STYLES.HIGHLIGHT });
    // 单独生成动画标记
    const pulsingIcon = L.icon.pulse({
      color: 'red',
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
    const rippleLayer = L.marker(marker.getLatLng(), {
      icon: pulsingIcon,
      interactive: false, // 不捕获鼠标事件，确保下面的 Canvas 点依然能被点中
      zIndexOffset: 1000,
    });

    hightLightMarkerLayers.addLayer(rippleLayer);
    highlightMarkerIds.value.push(i);
  }

  baseMap.addLayer(hightLightMarkerLayers);
  // 移动到第一个id 坐标位置
  const firstLatLng = markerIdMap.get(ids[0])?.getLatLng();
  baseMap.flyTo(L.latLng(firstLatLng), 14, { duration: 2 });
};

// 初始化地图
const initMap = () => {
  // 中心点位置
  const coordinate = GCJ02TOWGS84(103.0133, 29.9805); // 成都

  // 默认瓦片
  const defaultLayer = L.tileLayer(`${window.api.gis}`);

  baseMap = L.map('gisMap', {
    center: L.latLng(coordinate[0], coordinate[1]), // Leaflet必须纬度(lat)在前经度(lng)在后！
    zoom: 10,
    minZoom: 5,
    maxZoom: 18,
    preferCanvas: true,
    layers: [defaultLayer], // 控制默认显示图层
    attributionControl: false, // 控制版权信息控件
    zoomControl: false, // 缩放控件
    fullscreenControlOptions: {
      position: 'topleft',
    },
  });

  // 自定义缩放控件
  const zoomControl = L.control.zoom({
    position: 'topright',
    zoomInTitle: '放大',
    zoomOutTitle: '缩小',
  });

  baseMap.addControl(zoomControl);
  bindEvent();
};

onMounted(() => {
  initMap();
});
</script>


<style lang="scss">
@import url('leaflet-pulse-icon/src/L.Icon.Pulse.css');
@import url('leaflet.markercluster/dist/MarkerCluster.css');
@import url('leaflet.markercluster/dist/MarkerCluster.Default.css');
</style>
<style lang="scss" scoped>
:deep(.leaflet-top.leaflet-right) {
  right: 20px;
  display: flex;
  align-items: center;
  transition: 0.36s;
  .leaflet-draw-actions {
    top: 102% !important;
    right: 0 !important;
    display: flex;
    border-radius: 4px !important;
    overflow: hidden;
    li a {
      color: #fff;
    }
  }
}

:deep(.leaflet-bar) {
  display: flex;
  align-items: center;
  gap: 10px;
  border: none;
  .svg-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    background: #fff;
    border-radius: 2px !important;
    cursor: pointer;
  }
  a {
    border: none;
    border-radius: 2px !important;
  }
}

:deep(.gis-maker) {
  color: #fff;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  position: relative;
  .label {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 100%;
    font-size: 12px;
    display: block;
    background-color: rgba(0, 0, 0, 0.55);
    border-radius: 4px;
    max-width: 120px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: center;
    padding: 0px 2px;
  }

  // .icon {
  //   margin-left: 4px;
  // }
}

:deep(.gis-popup) {
  .leaflet-popup-content {
    margin: 8px;
  }
  .leaflet-popup-content-wrapper {
    border-radius: 4px;
  }
  .btns {
    display: flex;
    align-items: center;

    div {
      padding: 4px 6px;
      background-color: var(--E77A29-1B5FDF);
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 2px;
      cursor: pointer;
      line-height: 1;
      margin-right: 4px;
      color: #fff;
    }

    div:last-child {
      margin-right: 0px;
    }
  }
}
// :deep(.icon) {
//   height: auto !important;
// }

.leaflet-canvas-layer {
  cursor: default;
  pointer-events: auto;
}
</style>
