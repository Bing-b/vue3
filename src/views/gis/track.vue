<template>
  <div class="relative h-full w-full">
    <!-- 地图 -->
    <div id="gisMap" class="absolute top-0 right-0 bottom-0 left-0"></div>

    <!-- 控制面板 -->

    <div
      class="absolute top-2 right-2 z-[888] flex items-center gap-5 rounded bg-white px-3 py-2 text-xs">
      <div class="flex items-center">
        <el-button @click="creatTrack">生成路线</el-button>
        <el-button @click="trackControl.start()">开始</el-button>
        <el-button @click="trackControl.pause()">暂停</el-button></div
      >
      <div class="flex w-[300px] items-center gap-5">
        <p class="text-nowrap">速度</p>
        <el-slider @change="handleChangeSpeed" v-model="trackControl.speed" :max="1000" :min="0" />
        <p class="text-nowrap">{{ trackControl.speed }} （km/h）</p>
      </div>
      <div class="flex w-[350px] items-center gap-5">
        <p class="text-nowrap">进程</p>
        <el-slider
          @change="handleChangeProgress"
          v-model="trackControl.progress"
          :max="100"
          :min="0" />
        <p>{{ Math.floor(trackControl.progress) }}%</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import L from 'leaflet';
import { onMounted, reactive } from 'vue';
import { getPlaceGeo, getloadGeo } from '@/api/common';
import 'leaflet-trackplayer';
import { setIcon } from './ts/utils';
import { Arrayable } from 'element-plus/es/utils/typescript';
import './js/leaflet.ChineseTmsProviders';

const iconCar = setIcon('../../../assets/images/car.png', [24, 46], [12, 23]);

let map = {} as any;

let track: any = {};

// 控制面板
const trackControl = reactive({
  speed: track?.options?.speed ?? 600,
  progress: track?.options?.progress * 100 || 0,
  start: () => {
    map.setZoom(17);
    track.start();
  },
  pause: () => track.pause(),
});

// 调用天地图api 获取地名坐标信息
const getAddressGeo = async (address: string) => {
  const res = await getPlaceGeo({ keyword: address });
  return `${res.data.location.lon},${res.data.location.lat}`;
};

// 处理处理驾驶路线接口返回 xml 文件读取路径 geo 数据
const getRouteLatLonStr = (xmlText: string): string => {
  const match = xmlText.match(/<routelatlon>([\s\S]*?)<\/routelatlon>/);
  return match ? match[1].trim() : '';
};

// 获取高速区间信息
const getLoadGeoInfo = async (orig: string, dest: string) => {
  const res = await getloadGeo<{ data: string }>({ orig, dest });
  console.log(getRouteLatLonStr(res.data));
  return getRouteLatLonStr(res.data);
};

// 生成路径geo
const creatLoadlatlng = (routelation: string) => {
  return routelation.split(';').map((i) => {
    if (i !== '') {
      const geo = i.split(',');
      return {
        lng: geo[0],
        lat: geo[1],
      };
    }
  });
};

// 改变进程
const handleChangeProgress = (val: Arrayable<number>) => {
  track.setProgress(Number(val) / 100);
};

const handleChangeSpeed = (val: Arrayable<number>) => {
  track.setSpeed(val);
};

// 创建轨迹
const creatTrack = async () => {
  const startAddress = await getAddressGeo('成都科学城');
  const endAddress = await getAddressGeo('成都天府香山');
  const routelation = await getLoadGeoInfo(startAddress, endAddress);
  let path = creatLoadlatlng(routelation).filter((i) => i);

  map.fitBounds(path);
  track = new L.TrackPlayer(path, {
    markerIcon: iconCar,
    speed: trackControl.speed, // 播放速度
    weight: 8, // 轨迹线宽度
    passedLineColor: '#43A047', // 已行驶轨迹部分的颜色
    notPassedLineColor: '#F44336', // 未行驶轨迹部分的颜色
    panTo: true, // 地图跟随移动
    markerRotation: true, // 是否开启marker的旋转
    markerRotationOffset: 0, // 处理图标偏移角度
  });

  track.addTo(map);

  // 添加车牌
  const carnum = '川A888888';
  const numMarker = L.marker(startAddress.split(','), {
    icon: L.divIcon({
      iconSize: null,
      className: '',
      popupAnchor: [5, 5],
      shadowAnchor: [5, 5],
      html: "<div class='carnumbox'><div class='carnumbox-text'>" + carnum + '</div>' + '</div>',
    }),
  }).addTo(map);

  track.on('progress', (progress: number, { lng, lat }: { lng: string; lat: string }) => {
    numMarker.setLatLng([lat, lng]);
    trackControl.progress = progress * 100;
    // trackControl.status = '行驶中';
  });
};

const drawMap = () => {
  // 天地图底图
  const tiandituVecLayer = L.tileLayer(
    `http://t0.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=b40e3cf3d6fa4b1a6c1dc2d2a5288b7e`,
    { tileSize: 256, maxZoom: 18, minZoom: 5 },
  );

  // 天地图矢量注记
  const tiandituCvaLayer = L.tileLayer(
    `http://t0.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=b40e3cf3d6fa4b1a6c1dc2d2a5288b7e`,
    { tileSize: 256, maxZoom: 18, minZoom: 5 },
  );

  const Tianditu = L.layerGroup([tiandituVecLayer, tiandituCvaLayer]);

  const googleLayer = L.tileLayer('http://www.google.cn/maps/vt?lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 20,
  });

  map = L.map('gisMap', {
    center: L.latLng(30.5728, 104.0665), // Leaflet必须纬度(lat)在前经度(lng)在后！
    zoom: 12,
    minZoom: 5,
    maxZoom: 18,
    layers: [googleLayer], // 控制默认显示图层
    attributionControl: false, // 控制版权信息控件
    zoomControl: true, // 缩放控件
    fullscreenControl: true, // 全屏控件
    fullscreenControlOptions: {
      position: 'topleft',
    },
  });
};

onMounted(() => {
  drawMap();
});
</script>

<style lang="scss">
.carnumbox {
  position: relative;
  background-color: rgb(52, 159, 75);
  margin-left: 30px;
  margin-bottom: 50px;
  border-radius: 4px;
  border: 2px solid #01861a;
  .carnumbox-text {
    color: black;
    white-space: nowrap;
    font-size: 12px;
  }
}
</style>
