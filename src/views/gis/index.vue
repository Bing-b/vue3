<template>
  <div class="relative h-full w-full">
    <!-- 地图容器 -->
    <div id="gisMap" class="absolute inset-0"></div>

    <!-- 顶部演示功能菜单 -->
    <div class="absolute top-4 left-1/2 z-[1000] -translate-x-1/2">
      <div
        class="flex items-center gap-4 rounded-xl border border-white/30 bg-white/70 p-2 shadow-2xl backdrop-blur-md">
        <div class="flex items-center gap-1 border-r border-gray-300 pr-4">
          <span class="text-sm font-bold text-gray-700">演示功能:</span>
          <el-select v-model="currentDemo" placeholder="选择演示内容" size="small" class="!w-32">
            <el-option label="轨迹任务" value="trajectory" />
            <el-option label="区域板块" value="region" />
            <el-option label="数据聚合" value="cluster" />
            <el-option label="高发路段" value="highroad" />
          </el-select>
        </div>

        <!-- 轨迹播放控制栏 -->
        <div v-if="currentDemo === 'trajectory'" class="flex items-center gap-2">
          <div class="divider mx-2 h-4 w-[1px] bg-white/30"></div>
          
          <el-tooltip :content="playbackState.isRunning ? '暂停' : '播放'" placement="top">
            <el-button
              type="primary"
              :icon="playbackState.isRunning ? VideoPause : VideoPlay"
              size="small"
              class="playback-btn"
              @click="togglePlayback"
            />
          </el-tooltip>

          <el-tooltip content="重播" placement="top">
            <el-button 
              type="warning" 
              :icon="RefreshLeft" 
              size="small" 
              class="playback-btn"
              @click="resetPlayback" 
            />
          </el-tooltip>

          <div class="divider mx-2 h-4 w-[1px] bg-white/30"></div>

          <div class="status-indicator flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/10 text-[10px] font-bold uppercase tracking-wider">
            <span class="relative flex h-2 w-2">
              <span 
                class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                :class="playbackState.isRunning ? 'bg-green-400' : 'bg-orange-400'"
              ></span>
              <span 
                class="relative inline-flex rounded-full h-2 w-2"
                :class="playbackState.isRunning ? 'bg-green-500' : 'bg-orange-500'"
              ></span>
            </span>
            <span :class="playbackState.isRunning ? 'text-green-500' : 'text-orange-500'">
              {{ playbackState.statusText }}
            </span>
          </div>

          <el-tooltip content="清除轨迹" placement="top">
            <el-button 
              type="danger" 
              link 
              :icon="Delete" 
              size="small" 
              class="playback-btn !text-red-400 hover:!text-red-500"
              @click="clearDemo" 
            />
          </el-tooltip>
        </div>

        <!-- 区域板块说明 -->
        <div v-if="currentDemo === 'region'" class="flex items-center gap-2 px-4 text-xs text-gray-600">
          <el-icon class="text-blue-500"><InfoFilled /></el-icon>
          <span>将鼠标悬停在区域上查看详情</span>
          <el-button type="danger" link size="small" icon="Delete" @click="clearDemo">
            清空
          </el-button>
        </div>
      </div>
    </div>

    <!-- 区域信息浮窗 -->
    <div
      v-if="currentDemo === 'region' && hoverInfo.show"
      class="absolute right-4 bottom-20 z-[1000] w-48 rounded-lg bg-white/90 p-3 shadow-xl backdrop-blur-sm pointer-events-none">
      <h4 class="mb-2 border-b pb-1 text-sm font-bold text-blue-600">板块信息</h4>
      <div class="space-y-1 text-xs text-gray-700">
        <p><span class="font-semibold">名称:</span> {{ hoverInfo.name }}</p>
        <p><span class="font-semibold">代码:</span> {{ hoverInfo.adcode }}</p>
        <p><span class="font-semibold">级别:</span> {{ hoverInfo.level }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, shallowRef, reactive, watch } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { antPath } from 'leaflet-ant-path';
import { InfoFilled, VideoPlay, VideoPause, RefreshLeft, Delete, Search, Connection } from '@element-plus/icons-vue';
import { setIcon, generateMockMarkers } from './ts/utils';
import * as chengduJson from './js/成都市.json';
import { hainanRiverCoordinates, highRoadData } from './js/route';

// 引入插件
import './js/leaflet.ChineseTmsProviders';
import './js/movingMarker';
import './js/Control.OSMGeocoder';
import './js/Control.MiniMap';
import './js/fullScreen';
import 'leaflet.markercluster';

// 地图实例
const map = shallowRef<any | null>(null);

// 演示功能状态
const currentDemo = shallowRef('trajectory');
const playbackState = reactive({
  isRunning: false,
  isEnded: false,
  statusText: '未开始',
});

// 区域悬停状态
const hoverInfo = reactive({
  show: false,
  name: '',
  adcode: '',
  level: '',
});

// 演示实例
const movingMarker = shallowRef<any>(null);
const trajectoryPath = shallowRef<any>(null);
const regionLayer = shallowRef<any>(null);
const clusterGroup = shallowRef<any>(null);
const highRoadLayer = shallowRef<any>(null);
const demoMarkers = L.layerGroup(); // 用于存放演示过程中产生的标记

// 演示数据
const pathCoords = [
  [30.657, 104.066],
  [30.665, 104.075],
  [30.68, 104.09],
  [30.69, 104.1],
  [30.71, 104.12],
  [30.72, 104.14],
];
const stationPoints = [
  { loc: [30.665, 104.075], name: '成都市中心站' },
  { loc: [30.69, 104.1], name: '东路口站' },
  { loc: [30.72, 104.14], name: '终点站' },
];

const initMap = () => {
  const gaoDeNormal = (L.tileLayer as any).chinaProvider('GaoDe.Normal.Map', {
    maxZoom: 18,
    minZoom: 5,
  });

  const tianDiTuNormal = (L.tileLayer as any).chinaProvider('TianDiTu.Normal.Map', {
    maxZoom: 18,
    minZoom: 5,
  });
  const tianDiTuAnnotion = (L.tileLayer as any).chinaProvider('TianDiTu.Normal.Annotion', {
    maxZoom: 18,
    minZoom: 5,
  });
  const tianDiTuLayer = L.layerGroup([tianDiTuNormal, tianDiTuAnnotion]);

  map.value = L.map('gisMap', {
    center: [30.657, 104.066],
    zoom: 13,
    layers: [gaoDeNormal],
    zoomControl: false,
    attributionControl: false,
    preferCanvas: true,
  });

  L.control
    .layers({ 高德地图: gaoDeNormal, 天地图: tianDiTuLayer }, {}, { position: 'topright' })
    .addTo(map.value);

  // 自定义缩放控件
  const zoomControl = L.control.zoom({
    position: 'topleft',
    zoomInTitle: '放大',
    zoomOutTitle: '缩小',
  });
  map.value.addControl(zoomControl);

  // 初始化全屏控件
  (L.control as any).fullscreen({
    position: 'topleft',
    title: '全屏切换',
    titleCancel: '退出全屏',
    forceSeparateButton: true,
  }).addTo(map.value);

  // 初始化搜索控件
  const osmGeocoder = new (L.Control as any).OSMGeocoder({
    placeholder: '搜索地点...',
    position: 'topright',
    text: '',
  });
  map.value.addControl(osmGeocoder);

  demoMarkers.addTo(map.value);

  // 初始化小地图
  const miniMapLayer = (L.tileLayer as any).chinaProvider('GaoDe.Normal.Map', {
    maxZoom: 18,
    minZoom: 5,
  });
  new (L.Control as any).MiniMap(miniMapLayer, {
    toggleDisplay: true,
    minimized: false,
    position: 'bottomright',
    strings: { hideText: '收起', showText: '展开' },
  }).addTo(map.value);
};

// --- 轨迹播放逻辑 ---

const initTrajectory = () => {
  clearDemo();
  const carIcon = setIcon('mycar.svg', [32, 32], [16, 16]);
  const trail: any[] = [];

  movingMarker.value = (L.Marker as any)
    .movingMarker(pathCoords, 10000, {
      autostart: false,
      icon: carIcon,
    })
    .addTo(map.value!);

  trajectoryPath.value = L.polyline([], { color: '#3388ff', weight: 4, opacity: 0.8 }).addTo(
    map.value!,
  );

  let currentStationIndex = 0;
  movingMarker.value.on('move', (e: any) => {
    const latlng = [e.latlng.lat, e.latlng.lng];
    trail.push(latlng);
    trajectoryPath.value?.setLatLngs(trail);
    map.value?.panTo(latlng);

    if (currentStationIndex < stationPoints.length) {
      const station = stationPoints[currentStationIndex];
      const dist = L.latLng(latlng).distanceTo(L.latLng(station.loc));
      if (dist < 50) {
        // 50米半径内视为到达
        const marker = L.marker(station.loc as any, {
          icon: setIcon('point.svg', [20, 20], [10, 10]),
        })
          .bindPopup(`<b>到达站点:</b> ${station.name}`)
          .addTo(demoMarkers);
        marker.openPopup();
        currentStationIndex++;
      }
    }
  });

  movingMarker.value.on('end', () => {
    playbackState.isRunning = false;
    playbackState.isEnded = true;
    playbackState.statusText = '已结束';
    movingMarker.value.bindPopup('<b>轨迹演示结束</b>').openPopup();
  });
};

const togglePlayback = () => {
  if (!movingMarker.value) initTrajectory();
  if (movingMarker.value.isRunning()) {
    movingMarker.value.pause();
    playbackState.isRunning = false;
    playbackState.statusText = '已暂停';
  } else {
    if (playbackState.isEnded) {
      resetPlayback();
      return;
    }
    movingMarker.value.start();
    playbackState.isRunning = true;
    playbackState.statusText = '进行中';
  }
};

const resetPlayback = () => {
  initTrajectory();
  movingMarker.value.start();
  playbackState.isRunning = true;
  playbackState.isEnded = false;
  playbackState.statusText = '进行中';
};


// --- 区域板块逻辑 ---
const initRegionDemo = () => {
  clearDemo();
  map.value?.flyTo([30.657, 104.066], 9, { duration: 2 });

  // 预置颜色列表
  const colors = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#FFA07A',
    '#98D8C8',
    '#F06292',
    '#AED581',
    '#FFD54F',
    '#4DB6AC',
    '#7986CB',
    '#9575CD',
    '#4FC3F7',
  ];

  const getColor = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const style = (feature: any) => {
    return {
      color: '#ffffff',
      weight: 1.5,
      opacity: 0.8,
      fill: true,
      fillColor: getColor(feature.properties.name),
      fillOpacity: 0.5,
    };
  };

  const highlightFeature = (e: any) => {
    const layer = e.target;
    layer.setStyle({
      fillOpacity: 0.8,
      weight: 3,
      color: '#fff',
    });
    const { name, adcode, level } = layer.feature.properties;
    hoverInfo.name = name;
    hoverInfo.adcode = adcode;
    hoverInfo.level = level;
    hoverInfo.show = true;
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }
  };

  const resetHighlight = (e: any) => {
    regionLayer.value?.resetStyle(e.target);
    hoverInfo.show = false;
  };

  const onEachFeature = (feature: any, layer: any) => {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: (e: any) => {
        map.value?.fitBounds(e.target.getBounds());
      },
    });

    // 添加区域名称标注
    const center = layer.getBounds().getCenter();
    const labelIcon = L.divIcon({
      className: 'region-label',
      html: `<span>${feature.properties.name}</span>`,
      iconSize: [80, 20],
      iconAnchor: [40, 10],
    });
    L.marker(center, { icon: labelIcon, interactive: false }).addTo(demoMarkers);
  };

  regionLayer.value = L.geoJSON(chengduJson as any, {
    style,
    onEachFeature,
  }).addTo(map.value!);
};

// --- 通用清空 ---

// --- 数据聚合逻辑 ---

const initClusterDemo = () => {
  clearDemo();
  map.value?.flyTo([30.657, 104.066], 11, { duration: 2 });

  // 初始化聚合组
  clusterGroup.value = (L as any).markerClusterGroup({
    disableClusteringAtZoom: 16,
    chunkedLoading: true,
    showCoverageOnHover: false,
    spiderfyOnMaxZoom: false,
  });

  const mockData = generateMockMarkers(5000, [30.657, 104.066]);
  renderClusterMarkers(mockData);
};

const renderClusterMarkers = (data: any[]) => {
  const canvasRenderer = L.canvas({ padding: 0.5 });
  let index = 0;
  const CHUNK_SIZE = 1000;
  const allTempMarkers: any[] = [];

  const processChunks = () => {
    const end = Math.min(index + CHUNK_SIZE, data.length);

    for (; index < end; index++) {
      const node = data[index];
      const marker = L.circleMarker(node.coordinate, {
        radius: 12,
        color: '#fff',
        fillColor: '#409eff',
        fillOpacity: 0.8,
        weight: 1,
        renderer: canvasRenderer,
      });

      marker.bindPopup(`名称: ${node.name}<br>坐标: ${node.coordinate}`);
      allTempMarkers.push(marker);
    }

    if (index < data.length) {
      if ((window as any).requestIdleCallback) {
        (window as any).requestIdleCallback(processChunks);
      } else {
        setTimeout(processChunks, 1);
      }
    } else {
      clusterGroup.value.addLayers(allTempMarkers);
      map.value.addLayer(clusterGroup.value);
    }
  };

  processChunks();
};

// --- 高发路段逻辑 ---

const initHighRoadDemo = () => {
  clearDemo();
  map.value?.flyTo([30.4069143, 104.0739315], 15, { duration: 2 });

  highRoadLayer.value = L.layerGroup().addTo(map.value);

  // 渲染路段 - 结合蚂蚁路径使其生动
  // 顺畅路段 (绿色，快)
  const drawAntSegment = (coords: number[][], color: string, pulseColor: string, delay: number, weight: number = 8) => {
    // 数据转换：[lng, lat] -> [lat, lng]
    const latLngs = coords.map(p => [p[1], p[0]]);
    
    const path = antPath(latLngs, {
      delay: delay,
      dashArray: [10, 20],
      weight: weight,
      color: color,
      pulseColor: pulseColor,
      paused: false,
      opacity: 0.8
    });
    
    highRoadLayer.value.addLayer(path);
  };

  const { road1, road2 } = highRoadData;

  // Road 1 细分渲染
  drawAntSegment(road1.slice(0, 4), '#2E7D32', '#A5D6A7', 1000);  // 顺畅 - 绿色快
  drawAntSegment(road1.slice(3, 7), '#F9A825', '#FFF59D', 3000);  // 拥堵 - 黄色中
  drawAntSegment(road1.slice(6, 10), '#B71C1C', '#EF9A9A', 6000); // 严重 - 红色慢
  drawAntSegment(road1.slice(9, 17), '#2E7D32', '#A5D6A7', 1000); // 恢复 - 绿色快

  // Road 2 全段顺畅
  drawAntSegment(road2, '#2E7D32', '#A5D6A7', 1200);

  // 添加一些动态标记点作为更生动的提示
  road1.slice(7, 8).forEach(p => {
    const marker = L.circleMarker([p[1], p[0]], {
      radius: 12,
      fillColor: '#B71C1C',
      color: '#fff',
      weight: 2,
      fillOpacity: 0.9,
      className: 'animate-pulse'
    }).addTo(highRoadLayer.value);
    marker.bindPopup('<b>交通预警</b><br>当前路段严重拥堵，预计延迟15分钟').openPopup();
  });
};

const clearDemo = () => {
  if (movingMarker.value) map.value?.removeLayer(movingMarker.value);
  if (trajectoryPath.value) map.value?.removeLayer(trajectoryPath.value);
  if (regionLayer.value) map.value?.removeLayer(regionLayer.value);
  if (clusterGroup.value) map.value?.removeLayer(clusterGroup.value);
  if (highRoadLayer.value) map.value?.removeLayer(highRoadLayer.value);
  demoMarkers.clearLayers();

  movingMarker.value = null;
  trajectoryPath.value = null;
  regionLayer.value = null;
  clusterGroup.value = null;
  highRoadLayer.value = null;

  playbackState.isRunning = false;
  playbackState.isEnded = false;
  playbackState.statusText = '未开始';
  hoverInfo.show = false;
};

// 监听演示切换
watch(currentDemo, (val) => {
  clearDemo();
  if (val === 'region') {
    initRegionDemo();
  } else if (val === 'cluster') {
    initClusterDemo();
  } else if (val === 'highroad') {
    initHighRoadDemo();
  }
});

onMounted(() => {
  initMap();
});
</script>

<style>
/* 插件全局样式更新 */
@import url('./css/Control.OSMGeocoder.css');
@import url('./css/Control.MiniMap.css');
@import url('leaflet.markercluster/dist/MarkerCluster.css');
@import url('leaflet.markercluster/dist/MarkerCluster.Default.css');
</style>

<style scoped>
#gisMap {
  background: #f0f2f5;
}

:deep(.leaflet-control-layers) {
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15) !important;
  border-radius: 8px !important;
  background: rgba(255, 255, 255, 0.75) !important;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 4px !important;
  margin-right: 20px !important;
  margin-top: 20px !important;
}

/* 并排显示容器优化 */
:deep(.leaflet-top.leaflet-right) {
  display: flex;
  flex-direction: row-reverse;
  align-items: flex-start;
  padding-right: 0;
}

:deep(.leaflet-control-zoom),
:deep(.leaflet-control-zoom-fullscreen.leaflet-bar) {
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
  border-radius: 8px !important;
  overflow: hidden;
  margin-left: 20px !important;
}

:deep(.leaflet-control-zoom-in),
:deep(.leaflet-control-zoom-out),
:deep(.leaflet-control-zoom-fullscreen) {
  background: rgba(255, 255, 255, 0.8) !important;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: #333 !important;
  border: none !important;
  width: 32px !important;
  height: 32px !important;
  line-height: 32px !important;
  transition: all 0.3s ease;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

:deep(.leaflet-control-zoom-in:hover),
:deep(.leaflet-control-zoom-out:hover),
:deep(.leaflet-control-zoom-fullscreen:hover) {
  background: rgba(255, 255, 255, 1) !important;
  color: #409eff !important;
}

:deep(.el-select .el-input__wrapper) {
  background-color: transparent !important;
  box-shadow: none !important;
  border-bottom: 1px solid #dcdfe6;
  border-radius: 0;
}

/* 区域名称标注样式 */
:deep(.region-label) {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
}

:deep(.region-label span) {
  color: #333;
  font-weight: 800;
  font-size: 12px;
  text-shadow:
    1px 1px 0 #fff,
    -1px -1px 0 #fff,
    1px -1px 0 #fff,
    -1px 1px 0 #fff,
    0 0 8px #fff;
  white-space: nowrap;
  pointer-events: none;
}

/* 搜索控件样式优化 */
:deep(.leaflet-control-geocoder) {
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15) !important;
  border-radius: 12px !important;
  background: rgba(255, 255, 255, 0.75) !important;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  overflow: hidden;
  margin-right: 12px !important;
  margin-top: 20px !important;
  transition: all 0.3s ease;
  display: flex !important;
  align-items: center;
}

:deep(.leaflet-control-geocoder:hover) {
  background: rgba(255, 255, 255, 0.9) !important;
}

:deep(.leaflet-control-geocoder-form) {
  display: flex !important;
  align-items: center;
}

:deep(.leaflet-control-geocoder-form input[type='text']) {
  border: none !important;
  padding: 8px 16px !important;
  font-size: 14px !important;
  outline: none !important;
  width: 180px !important;
  height: 32px !important;
  background: transparent !important;
  transition: width 0.3s ease;
  color: #333;
}

:deep(.leaflet-control-geocoder-form input[type='text']:focus) {
  width: 260px !important;
}

:deep(.leaflet-control-geocoder-form input[type='submit']) {
  border: none !important;
  border-radius: 0 12px 12px 0 !important;
  background-color: #409eff !important;
  width: 40px !important;
  height: 32px !important;
  color: transparent !important;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 1024'%3E%3Cpath fill='white' d='m795.904 750.72 124.992 124.928a32 32 0 0 1-45.248 45.248L750.656 795.904a416 416 0 1 1 45.248-45.248zM480 832a352 352 0 1 0 0-704 352 352 0 0 0 0 704z'/%3E%3C/svg%3E") !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
  background-size: 14px 14px !important;
  transition: background-color 0.3s ease;
  flex-shrink: 0;
}

:deep(.leaflet-control-geocoder-form input[type='submit']:hover) {
  background-color: #66b1ff !important;
}

/* 小地图样式优化 */
:deep(.leaflet-control-minimap) {
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15) !important;
  border-radius: 12px !important;
  background: rgba(255, 255, 255, 0.75) !important;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 4px !important;
  transition: all 0.3s ease;
}

:deep(.leaflet-control-minimap:hover) {
  background: rgba(255, 255, 255, 0.9) !important;
}

:deep(.leaflet-control-minimap-toggle-display) {
  background-color: #409eff !important;
  border-radius: 4px !important;
}

/* 全屏控件样式优化 */
/* 已在上方统一处理 */

/* 状态指示器动画与样式 */
.status-indicator {
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.playback-btn {
  border-radius: 6px !important;
  font-weight: bold !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
  width: 32px !important;
  height: 28px !important;
  padding: 0 !important;
}

.playback-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

/* 移除 Leaflet 默认的 leaflet-bar 边框和背景，防止黑色边框出现 */
:deep(.leaflet-bar) {
  border: none !important;
  background: none !important;
}

:deep(.leaflet-bar a) {
  border: none !important;
}

:deep(.leaflet-control-zoom-fullscreen.fullscreen-icon) {
  background-image: none !important;
}

:deep(.leaflet-control-zoom-fullscreen::after) {
  content: '';
  display: block;
  width: 18px;
  height: 18px;
  background-color: #333;
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 1024'%3E%3Cpath fill='currentColor' d='M160 160h256v64H224v192h-64V160zm0 704V608h64v192h192v64H160zm704-704v256h-64V224H608v-64h256zm0 704H608v-64h192V608h64v256z'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 1024'%3E%3Cpath fill='currentColor' d='M160 160h256v64H224v192h-64V160zm0 704V608h64v192h192v64H160zm704-704v256h-64V224H608v-64h256zm0 704H608v-64h192V608h64v256z'/%3E%3C/svg%3E");
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
  transition: all 0.3s ease;
}

:deep(.leaflet-control-zoom-fullscreen:hover) {
  background: rgba(255, 255, 255, 1) !important;
}

:deep(.leaflet-control-zoom-fullscreen:hover::after) {
  background-color: #409eff;
  transform: scale(1.1);
}

/* 全屏状态下的布局兼容 */
:deep(.leaflet-pseudo-fullscreen) {
  z-index: 10000 !important;
}
</style>
