<template>
  <div class="relative h-full w-full">
    <div
      class="text-md absolute top-2 left-[150px] z-[888] flex items-center gap-1 rounded bg-white p-1">
      <el-button @click="drawBezier" size="small">绘制标记</el-button>
      <el-button @click="markTarget" size="small">标记目标</el-button>
      <el-button @click="restrictedArea" size="small">限制视图</el-button>
      <el-button @click="startPlay" size="small">开始/暂停</el-button>
      <el-button @click="rebroadcast" size="small">重播</el-button>
      <el-button @click="polylineAnimation" size="small">河流效果</el-button>
      <el-button @click="initAntLine" size="small">蚂蚁路径</el-button>
      <el-button @click="trafficRoute" size="small">交通轨迹</el-button>
      <el-button @click="initChinaLine" size="small">边界线</el-button>
      <el-button @click="highlightGeoJson" size="small">定制中国</el-button>
      <el-button @click="highlightChina" size="small">突出四川</el-button>
      <el-button @click="toggleMarker" size="small">标记分类显示</el-button>
      <el-button @click="createArrowPath" size="small">迁徙效果</el-button>
      <el-button @click="initRouteMachine" size="small">路径分析</el-button>
      <el-button @click="highRoad" size="small">高发路段</el-button>
    </div>

    <!-- 地图 -->
    <div id="gisMap" class="absolute top-0 right-0 bottom-0 left-0"></div>

    <el-dialog v-model="infoDialogVisible" title="文档预览" width="60%">
      <div class="pdf-container">
        <embed
          src="/leaflet技术调研.pdf#navpanes=0&view=FitH#scrollbars=0&toolbar=0&statusbar=0"
          type="application/pdf" />
      </div>
    </el-dialog>

    <div class="absolute bottom-1 left-1 z-[888]">
      <el-button @click="infoDialogVisible = !infoDialogVisible" circle />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive } from 'vue';
// import { Warning } from '@element-plus/icons-vue';
import L from 'leaflet';
import utils from '@/utils/commonFuction';
import 'leaflet-draw';
import 'leaflet-polylinedecorator';
import 'leaflet-boundary-canvas'; // 控制显示边界
import 'leaflet-control-mini-map'; // 小地图
import 'leaflet-pulse-icon'; // 标记目标
import 'leaflet-easyprint';
import { antPath } from 'leaflet-ant-path'; // 蚂蚁路径
import 'leaflet.fullscreen'; // 全屏
import './ts/leaflet.draw-cn';
import './ts/L.Edit.Circle';
import './js/movingMarker'; // 可移动标记 pnpm 包有问题
import './js/leaflet-search.src';
import './js/leaflet.ChineseTmsProviders';
import './js/L.Path.DashFlow'; // 河流效果轨迹
import './js/leaflet.motion.min'; // 轨迹交通路线
import './js/leaflet-tilelayer-colorizr';
import './js/leaflet.migrationLayer';
import './js/L.Control.ResetView';
import './js/leaflet-routing-machine';
import './js/Control.Geocoder';
import { hainanRiverCoordinates } from './js/route';
import * as cnGeoJson from './js/china.json';
import * as siChuanJson from './js/sichuan.json';
import * as chinaLine from './js/chinaLine.json';
import { GCJ02TOWGS84, setIcon } from './ts/utils';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet.vectorgrid';
import './js/Control.OSMGeocoder.js';

// 小汽车图标
const iconCar = setIcon('mycar.svg');

// 点图标
const iconPoint = setIcon('point.svg');

// 画布宽高变化监测
let resizeObserver: ResizeObserver;

// gisMap 实例
let baseMap = {} as L.Map;

// 覆盖图编辑控件
const editControls = new L.FeatureGroup();

// 标记
const markers = new L.FeatureGroup();

// 圆
// const circles = new L.LayerGroup();

// 路径图层
// const paths = new L.FeatureGroup();

// 演示数据
const cityMarkers = new L.FeatureGroup();

const peopleMarkers = new L.FeatureGroup();

// 自定义编辑图层
const editFeatureGroup = L.featureGroup();

// 自定义编辑图层工具栏
const editToolbar = new L.EditToolbar({
  featureGroup: editFeatureGroup,
});

const editHandler = editToolbar.getModeHandlers()[0].handler;

// 标记搜索框
let controlSearch = null as any;

// 演示标记
let marker2 = null as any;

let marker2Path = [] as any[];

// const pathMarkers = new L.FeatureGroup();

const infoDialogVisible = ref(false);

const areaParams = reactive({
  location: '',
  geoType: '',
});

// 地理位置坐标
const parisKievLL = [
  [20.022, 110.348],
  [19.684, 110.879],
  [19.566, 109.948],
  [19.362, 109.18],
  [18.648, 109.614],
];

let layerControl = {} as any;

// 初始化绘图控件
const initControls = () => {
  // baseMap.addLayer(editControls);

  // 搜索区域编辑工具栏
  const drawControl = new L.Control.Draw({
    draw: {
      polyline: true,
      polygon: false, // 多边形
      rectangle: { showArea: false }, // 添加该配置才能解决报错问题
      // rectangle: true,
      circle: true,
      marker: true,
      circlemarker: false,
    },
    edit: {
      featureGroup: editControls,
      edit: false,
      remove: false,
    },
  });
  editControls.addTo(baseMap);
  drawControl.addTo(baseMap);
  // baseMap.addControl(drawControl);
  // eslint-disable-next-line no-underscore-dangle
  editHandler._map = baseMap;
};

// 绑定popoup事件
const bindPopupEvent = (layer: any) => {
  layer.on('click', (ev: any) => {
    // eslint-disable-next-line no-underscore-dangle
    const popupEle = layer._popup.getElement() || ev.sourceTarget._popup.getElement();
    const editBtn = popupEle.querySelector('.gis-edit');
    const saveBtn = popupEle.querySelector('.gis-save');
    const deleteBtn = popupEle.querySelector('.gis-delete');

    if (editBtn) {
      editBtn.addEventListener('click', () => {
        baseMap.closePopup();
        editFeatureGroup.addLayer(ev.target);
        editHandler.enable();
      });
    }
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        baseMap.closePopup();
        editHandler.save();
        editHandler.disable();
        editFeatureGroup.removeLayer(ev.target);
      });
    }
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        baseMap.closePopup();
        editControls.removeLayer(ev.target);
      });
    }
  });
};

// 绑定事件
const bindEvent = () => {
  baseMap.on('click', (e: MouseEvent) => {
    console.log(e);
    markers.eachLayer((marker: any) => {
      marker.options.isSelected = false;
      const { node } = marker.options;
      const iconHtml = `<p class="label h-5 translate-x-[-25%]">${
        (node.text && node.text.content) || node.label
      }</p>
          <img src="${utils.getImg('marker.png')}" class="icon !w-[33px] h-[34px]"/>`;
      const markerIcon = L.divIcon({
        html: iconHtml,
        className: 'gis-icon',
        iconSize: [80, 70],
        iconAnchor: [24, 55],
      });
      marker.options.isSelected = false;
      marker.setIcon(markerIcon);
    });
  });

  baseMap.on('contextmenu', (e: MouseEvent) => {
    // const latlng = baseMap.locate();
    // console.log(latlng);
  });

  baseMap.on(L.Draw.Event.CREATED, (e: any) => {
    e.layer.options.layerType = e.layerType;
    const type = e.layerType;
    const drawlayer = e.layer;
    let latlng = null as any;
    console.log(type);
    if (type === 'circle') {
      latlng = drawlayer.getLatLng();
      areaParams.geoType = 'Circle';
      areaParams.location = `${latlng.lng},${latlng.lat}#${drawlayer.getRadius()}`;
    } else if (type === 'rectangle') {
      const latlngs = drawlayer.getLatLngs();
      latlng = latlngs[0][3];
      areaParams.geoType = 'Rectangle';
      areaParams.location = `${latlngs[0][1].lng},${latlngs[0][1].lat}#${latlng.lng},${latlng.lat}`;
    } else if (type === 'marker') {
      areaParams.geoType = 'Marker';
      latlng = drawlayer.getLatLng();
      areaParams.location = `${latlng.lng},${latlng.lat}`;
    } else if (type === 'polyline') {
      areaParams.geoType = 'Polyline';
      const latlngs = drawlayer.getLatLngs();
      console.log(latlngs);
      const separator = '#';
      let str = '';
      latlngs.forEach((item: any) => {
        str += `${item.lng},${item.lat}${separator}`;
      });
      const latlng = latlngs[0];
      areaParams.location = `${str}${latlng.lng},${latlng.lat}`;
    } else {
      const latlngs = drawlayer.getLatLngs();
      latlng = latlngs[0];
      areaParams.geoType = 'Polygon';
      const separator = '#';
      let str = '';
      latlngs.forEach((item: any) => {
        str += `${item.lng},${item.lat}${separator}`;
      });
      areaParams.location = `${str}${latlng.lng},${latlng.lat}`;
    }

    drawlayer
      .bindPopup(
        `<div class="btns">
              <div class="gis-edit">编辑</div>
              <div class="gis-save">保存</div>
              <div class="gis-delete">删除</div>
            </div>`,
        { closeButton: false, className: 'gis-popup' },
      )
      .openPopup();
    editControls.addLayer(drawlayer);
    bindPopupEvent(drawlayer);
  });

  baseMap.on(L.Draw.Event.EDITED, (e: any) => {
    console.log(e.layers);
    // eslint-disable-next-line no-underscore-dangle
    const layer = Object.values(e.layers._layers)[0] as any;
    if (!layer) return;
    const type = layer.options.layerType;
    console.log(type);
    let latlng = null as any;
    if (type === 'circle') {
      // eslint-disable-next-line no-underscore-dangle
      latlng = layer._latlng;
      areaParams.geoType = 'Circle';
      areaParams.location = `${latlng.lng},${latlng.lat}#${layer.getRadius()}`;
    } else if (type === 'rectangle') {
      // eslint-disable-next-line prefer-destructuring
      latlng = layer.getLatLngs()[0][3];
      areaParams.geoType = 'Rectangle';
      areaParams.location = `${layer.getLatLngs()[0][1].lng},${layer.getLatLngs()[0][1].lat}#${
        latlng.lng
      },${latlng.lat}`;
    } else if (type === 'marker') {
      console.log('s');
    } else {
      // eslint-disable-next-line prefer-destructuring
      latlng = layer.getLatLngs()[0][0];
      areaParams.geoType = 'Polygon';
      const separator = '#';
      let str = '';
      layer.getLatLngs()[0].forEach((item: any) => {
        str += `${item.lng},${item.lat}${separator}`;
      });
      areaParams.location = `${str}${latlng.lng},${latlng.lat}`;
    }
  });
};

// 初始化地图导出插件
const iniPrint = () => {
  L.easyPrint({
    sizeModes: ['Current', 'A4Landscape', 'A4Portrait'],
    filename: 'myMap',
    exportOnly: true,
    defaultSizeTitles: { Current: '视窗', A4Landscape: 'A4 横向', A4Portrait: 'A4 纵向' },
    hideControlContainer: true, // 打印时隐藏控件
  }).addTo(baseMap);
};

// 初始化标记搜索功能
const initSearch = () => {
  const hainanData = [
    { loc: [20.022, 110.348], title: '海口市' },
    { loc: [19.566, 109.948], title: '三亚市' },
    { loc: [18.648, 109.614], title: '儋州市' },
    { loc: [19.362, 109.18], title: '五指山市' },
    { loc: [19.684, 110.879], title: '文昌市' },
  ];

  const markersLayer = new L.LayerGroup();

  baseMap.addLayer(markersLayer);

  controlSearch = new L.Control.Search({
    position: 'topleft',
    layer: markersLayer,
    initial: false,
    zoom: 12,
    // marker: false,
    textPlaceholder: '请输入关键词',
  });

  baseMap.addControl(controlSearch);

  // 添加标记到地图
  // for (const i in hainanData) {
  //   const { title } = hainanData[i];
  //   const { loc } = hainanData[i];
  //   const marker = new L.Marker(L.latLng(loc), { title });
  //   marker.bindPopup(`名称: ${title}`);
  //   markersLayer.addLayer(marker);
  //   if (title === '五指山市') marker.bindTooltip('五指山市').openTooltip();
  // }
};

const isArrived = (pos1: number[], pos2: number[], tolerance = 0.01) => {
  const [lat1, lng1] = pos1;
  const [lat2, lng2] = pos2;
  return Math.abs(lat1 - lat2) < tolerance && Math.abs(lng1 - lng2) < tolerance;
};

const hainanData = [
  { loc: [20.022, 110.348], title: '海口市' },
  { loc: [19.684, 110.879], title: '文昌市' },
  { loc: [19.566, 109.948], title: '三亚市' },
  { loc: [19.362, 109.18], title: '五指山市' },
  { loc: [18.648, 109.614], title: '儋州市' },
];

// 生成标记
const createMarker = () => {
  marker2 = L.Marker.movingMarker(parisKievLL, 10000, {
    autostart: false,
    loop: false,
    icon: iconCar,
    rotate: true,
  }).addTo(baseMap);

  // 地图根据点位移动，一直设置点位为中心点
  // const path = [] as any[]; // 声明绘制线的临时使用变量
  marker2.on('click', () => {
    if (marker2.isRunning()) {
      marker2.pause();
    } else if (!marker2.isEnded()) {
      // 如果动画已结束，重新开始动画
      marker2.start();
    }
  });

  const targetPoints = [...hainanData.map((i) => i.loc)]; // 复制一份，表示每到一个点就打一个标记
  let currentTargetIndex = 0; // 当前目标索引
  const markersLayer = new L.LayerGroup();
  baseMap.addLayer(markersLayer);

  // 轨迹开始
  marker2.on('move', (res: any) => {
    // 监听点位移动事件 move
    baseMap.panTo([res.latlng.lat, res.latlng.lng]); // 回调中会返回经纬度信息，点移动改变地图中心点
    // marker2Path.length > 1 && marker2Path.shift(); // 保持数组长度，避免过度push不断重新绘制之前的路径
    marker2Path.push([res.latlng.lat, res.latlng.lng]);
    L.polyline(marker2Path, { color: '#1E88E5', weight: 2 }).addTo(baseMap); // 绘制线到地图图层
    // const timer = setTimeout(() => {
    //   marker2.bindPopup('<b>运输中...</b>').openPopup();
    //   clearTimeout(timer);
    // }, 1000);
    const currentPos = [res.latlng.lat, res.latlng.lng];
    const targetPos = targetPoints[currentTargetIndex];

    if (targetPos && isArrived(currentPos, targetPos)) {
      const { title } = hainanData[currentTargetIndex];
      const { loc } = hainanData[currentTargetIndex];
      const marker = new L.Marker(L.latLng(loc), { title });
      marker.bindPopup(`名称: ${title}`);
      markersLayer.addLayer(marker);
      currentTargetIndex++;
    }
  });

  // 轨迹结束
  marker2.on('end', () => {
    // marker2.closePopup()
    marker2.bindPopup('<b>轨迹演示结束</b>', { closeOnClick: true }).openPopup();
  });

  // marker2.bindPopup('<b>点击开始 !</b>', { closeOnClick: true }).openPopup();
};

// 轨迹演示手动开始暂定
const startPlay = () => {
  marker2.bindPopup('<b>运输中...</b>', { closeOnClick: true }).openPopup();
  if (marker2.isRunning()) {
    marker2.pause();
  } else if (!marker2.isEnded()) {
    // 如果动画已结束，重新开始动画
    marker2.start();
  }
};

// 轨迹演示手动重播
const rebroadcast = () => {
  marker2.pause();
  baseMap.removeLayer(marker2); // 移除旧的Marker
  if (marker2Path.length > 0) {
    baseMap.eachLayer((layer: any) => {
      if (layer instanceof L.Polyline) {
        layer.removeFrom(baseMap);
      }
    });
    marker2Path = [];
  }

  createMarker();
  marker2.start();
};

// 获取两点间贝赛尔曲线坐标点
// const getBezierPoint = (pointStart, pointEnd, num = 100) => {
//   const startPoint = { x: pointStart.lng, y: pointStart.lat };
//   const endPoint = { x: pointEnd.lng, y: pointEnd.lat };
//   const angleValue = 2.14;
//   const x3 = (startPoint.x * angleValue + endPoint.x * angleValue - startPoint.y + endPoint.y) / (2 * angleValue);
//   const y3 = (startPoint.y * angleValue + endPoint.y * angleValue - endPoint.x + startPoint.x) / (2 * angleValue);
//   const paths = [];
//   for (let i = 0; i <= num; i++) {
//     const t = i / num;
//     const x = (1 - t) * (1 - t) * startPoint.x + 2 * t * (1 - t) * x3 + t * t * endPoint.x;
//     const y = (1 - t) * (1 - t) * startPoint.y + 2 * t * (1 - t) * y3 + t * t * endPoint.y;
//     const resPoint = L.latLng(y, x);
//     paths.push(resPoint);
//   }
//   return paths;
// };

// 绘制标记
const drawBezier = () => {
  const points = [
    { loc: [19.2596, 110.4656], title: '琼海市政府大楼' },
    { loc: [19.2287, 110.5294], title: '琼海观塘温泉度假区' },
    { loc: [19.2572, 110.5742], title: '博鳌亚洲论坛国际会展中心' },
    { loc: [19.2383, 110.4601], title: '琼海万泉河大桥' },
    { loc: [19.1618, 110.5785], title: '琼海市博鳌镇' },
  ];

  const markersLayer = new L.LayerGroup();

  baseMap.addLayer(markersLayer);

  // 添加标记到地图
  for (const i in points) {
    const { title } = points[i];
    const { loc } = points[i];

    // 坐标图标
    const iconGeo = setIcon('marker.svg');
    const marker = new L.Marker(new L.latLng(loc), { title, icon: iconGeo });
    marker.bindPopup(`名称: ${title}`);
    markersLayer.addLayer(marker);
    createAntLine([loc, [19.2287, 110.5294]]);
  }

  const latlngs = [
    [L.latLng(19.2596, 110.4656), L.latLng(19.2287, 110.5294)],
    [L.latLng(19.2287, 110.5294), L.latLng(19.2572, 110.5742)],
    [L.latLng(19.2287, 110.5294), L.latLng(19.2383, 110.4601)],
    [L.latLng(19.2287, 110.5294), L.latLng(19.1618, 110.5785)],
  ];

  // latlngs.forEach(item => {
  //   const bezierLine = getBezierPoint(item[0], item[1]);
  //   L.polyline(bezierLine, { color: 'red' }).addTo(baseMap);
  // });

  L.polyline(latlngs, { color: '#888', weight: 2 }).addTo(baseMap);
  // baseMap.panTo(L.latLng(19.2287, 110.5294)); // 移动画布中心
  baseMap.flyTo(L.latLng(19.2287, 110.5294), 12, { duration: 2 }); // 平滑移动到该点
};

// 轨迹自身动画
const polylineAnimation = () => {
  const latlngs = [] as any[];

  const markersLayer = new L.LayerGroup();
  baseMap.addLayer(markersLayer);

  const start = hainanRiverCoordinates.at(0);
  const end = hainanRiverCoordinates.at(-1);

  const startMarker = new L.Marker(L.latLng(start), { icon: iconPoint });
  const endMarker = new L.Marker(L.latLng(end), { icon: iconPoint });

  markersLayer.addLayer(startMarker);
  markersLayer.addLayer(endMarker);

  baseMap.flyTo(L.latLng(start), 9, { duration: 2 });

  hainanRiverCoordinates.forEach((i) => {
    latlngs.push(new L.LatLng(i[0], i[1]));
  });

  L.polyline(latlngs, {
    dashArray: '15,15',
    dashSpeed: -30,
  }).addTo(baseMap);

  // 小船图标
  const iconBoat = setIcon('boat.svg');
  const movingMarker = L.Marker.movingMarker(latlngs, 20000, {
    autostart: true,
    icon: iconBoat,
  }).addTo(baseMap);

  // 将 MovingMarker 添加到地图
  movingMarker.once('click', function () {
    movingMarker.start();
  });
};

// 绘制路线标记
const drawTrafficPoints = () => {
  const markersLayer = new L.LayerGroup();
  baseMap.addLayer(markersLayer);
  const p1 = new L.Marker(L.latLng([20.9236, 110.0964]), { icon: iconPoint });
  const p2 = new L.Marker(L.latLng([20.3252, 110.1751]), { icon: iconPoint });
  const p3 = new L.Marker(L.latLng([19.9124, 109.6978]), { icon: iconPoint });

  markersLayer.addLayer(p1);
  markersLayer.addLayer(p2);
  markersLayer.addLayer(p3);
};

// 交通路线
const trafficRoute = () => {
  baseMap.flyTo(L.latLng([20.3252, 110.1751]), 9.5, { duration: 2 });

  const path1 = [
    [20.9236, 110.0964],
    [20.3252, 110.1751],
  ];
  const path2 = [
    [20.3252, 110.1751],
    [19.9124, 109.6978],
  ];
  const path3 = [
    [19.9124, 109.6978],
    [20.9236, 110.0964],
  ];
  const trackRoute = [] as any[];
  const shipRoute = [] as any[];
  const planeRoute = [] as any[];

  path1.forEach((i) => {
    trackRoute.push(new L.LatLng(i[0], i[1]));
  });

  path2.forEach((i) => {
    shipRoute.push(new L.LatLng(i[0], i[1]));
  });

  path3.forEach((i) => {
    planeRoute.push(new L.LatLng(i[0], i[1]));
  });

  const seqGroup = L.motion
    .seq([
      L.motion
        .polyline(
          trackRoute,
          {
            color: 'orangered',
          },
          {
            easing: L.Motion.Ease.easeInOutQuad,
          },
          {
            removeOnEnd: false,
            icon: setIcon('car1.svg'),
          },
        )
        .motionDuration(4000),

      L.motion
        .polyline(
          shipRoute,
          {
            color: '#d81e06',
          },
          {
            easing: L.Motion.Ease.easeInOutQuart,
          },
          {
            removeOnEnd: false,
            // showMarker: true,
            icon: setIcon('boat1.svg'),
          },
        )
        .motionDuration(6000),

      L.motion.seq([
        L.motion
          .polyline(
            planeRoute,
            {
              color: '#1296db',
            },
            null,
            {
              removeOnEnd: false,
              icon: setIcon('plane1.svg'),
            },
          )
          .motionDuration(5000),
      ]),
    ])
    .addTo(baseMap);

  seqGroup.on('click', function () {
    seqGroup.motionStart();
  });

  seqGroup.on('dblclick', function (e) {
    seqGroup.motionToggle();
  });
  setTimeout(function () {
    seqGroup.motionStart();
  }, 1000);
};

// 区域边界
const highlightChina = () => {
  // 区域信息弹窗
  const info = L.control({
    position: 'bottomleft',
  });

  info.onAdd = function () {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
  };

  info.update = function (properties: any) {
    // console.log(properties)
    this._div.innerHTML =
      '<h4>基础信息</h4>' +
      (properties
        ? `名称: ${properties.name}<br>
         adcode: ${properties.adcode}<br>
         level:${properties.level}<br>
         `
        : 'Hover over a state');
  };

  const setStyleLayer = (layer: any, styleSelected: any) => {
    layer.setStyle(styleSelected);
  };

  const highlightFeature = (e) => {
    const layer = e.target;
    layer.setStyle({
      fillColor: '#0d5eff',
    });
    info.update(layer.feature.properties);
  };

  const featuresSelected = [] as any[];

  const checkExistsLayers = (feature: any) => {
    let result = false;
    for (let i = 0; i < featuresSelected.length; i++) {
      if (featuresSelected[i].adcode === feature.properties.adcode) {
        result = true;
        break;
      }
    }
    return result;
  };

  const resetHighlight = (e: any) => {
    const layer = e.target;
    const feature = e.target.feature;
    if (checkExistsLayers(feature)) {
      setStyleLayer(layer, {
        color: '#0D8BE7',
        fillColor: '#0d5eff',
      });
    } else {
      setStyleLayer(layer, {
        color: '#333232', // 边框颜色
        weight: 2, // 边框粗细
        opacity: 0.6, // 透明度
        fill: true, // 开启填充区域
        fillColor: '#f5f4f1', // 区域填充颜色
        fillOpacity: 0.8, // 区域填充颜色的透明
      });
    }
  };

  const onEachFeature = (feature: any, layer: any) => {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
    });
  };

  baseMap.flyTo(L.latLng([30.5728, 104.0668]), 6.5, { duration: 5 });

  const style = {
    color: '#333232', // 边框颜色
    weight: 2, // 边框粗细
    opacity: 0.6, // 透明度
    fill: true, // 开启填充区域
    fillColor: '#f5f4f1', // 区域填充颜色
    fillOpacity: 0.8, // 区域填充颜色的透明
  };

  L.geoJSON(siChuanJson, { style, onEachFeature }).addTo(baseMap);
  info.addTo(baseMap);
};

// 定制区域颜色
const highlightGeoJson = () => {
  const geoStyle = L.geoJSON(cnGeoJson, {
    style: (feature: any) => {
      //  console.log(feature);
      const style = {
        color: '#333232', // 边框颜色
        weight: 1, // 边框粗细
        opacity: 0.6, // 透明度
        fill: false, // 开启填充区域
        fillColor: '#FFEB3B', // 区域填充颜色
        fillOpacity: 0.8, // 区域填充颜色的透明
      };

      switch (feature.properties.name) {
        case '四川省':
          style.fillColor = '#FDD835';
          style.fill = true;
          break;
        case '重庆市':
          style.fillColor = '#E64A19';
          style.fill = true;
          break;
        case '陕西省':
          style.fillColor = '#2E7D32';
          style.fill = true;
          break;
        case '湖北省':
          style.fillColor = '#1565C0';
          style.fill = true;
          break;
        case '甘肃省':
          style.fillColor = '#4527A0';
          style.fill = true;
          break;
        default:
          break;
      }

      return style;
    },
    onEachFeature: function (feature: any, layer) {
      console.log(feature.properties);
      const center = layer.getBounds().getCenter();
      L.marker(center, {
        icon: L.divIcon({
          className: 'geo-label',
          html: feature.properties.name,
        }),
      }).addTo(baseMap);
    },
  });
  geoStyle.on('click', (e: L.LeafletMouseEvent) => {
    const layer = e.sourceTarget; // 获取被点击的地理要素图层
    // layer.setStyle({
    //   fillColor: '#0d5eff'
    // });
    const properties = layer.feature.properties; // 获取该要素的属性信息
    // console.log(properties);
    // 构建弹出窗口内容
    const popupContent = `
          <h3>${properties.name}</h3>
          <p>adcode: ${properties.adcode}</p>
          <p>包含区域: ${properties.childrenNum}</p>
      `;

    layer.bindPopup(popupContent).openPopup();
  });

  geoStyle.addTo(baseMap);
};

// 区域合并边界
const initChinaLine = () => {
  const style = {
    color: '#E53935', // 边框颜色
    weight: 2, // 边框粗细
    opacity: 0.6, // 透明度
    fill: false, // 开启填充区域
  };

  L.geoJSON(chinaLine, { style }).addTo(baseMap);
};

// 设置地图的最大边界，限制用户拖拽地图的范围
const restrictedArea = () => {
  const hainanBounds = [
    [18.17, 108.62],
    [20.08, 111.05],
  ];
  baseMap.setMaxBounds(hainanBounds);
  baseMap.setMinZoom(9);
  baseMap.maxBoundsViscosity(0);
};

// 生成城市、人标记
const toggleMarker = () => {
  baseMap.flyTo(L.latLng([18.9757, 109.6785]), 10, { duration: 2 });
  const citys = [
    [18.8656, 109.8748],
    [18.9352, 109.7521],
    [19.0124, 109.8963],
    [18.9757, 109.6785],
    [18.8143, 109.7054],
  ];
  const peoples = [
    [18.8312, 109.8436],
    [18.9227, 109.7885],
    [18.9875, 109.9198],
    [18.9481, 109.7002],
    [18.7814, 109.7203],
  ];

  citys.forEach((item) => {
    const marker = new L.Marker(L.latLng(item), { icon: setIcon('city.svg') });
    cityMarkers.addLayer(marker);
  });

  peoples.forEach((item) => {
    const marker = new L.Marker(L.latLng(item), { icon: setIcon('people.svg') });
    peopleMarkers.addLayer(marker);
  });
  baseMap.addLayer(cityMarkers);
  baseMap.addLayer(peopleMarkers);
  // 添加到control
  layerControl.addOverlay(cityMarkers, '城市');
  layerControl.addOverlay(peopleMarkers, '人');
};

// 箭头迁徙轨迹
const createArrowPath = () => {
  baseMap.flyTo(L.latLng([31, 121]), 7.5, { duration: 2 });

  // 绘制上海地标
  const myIcon = L.divIcon({
    html: `<div class="myIcon">
        <img src='${utils.getImg('sh.png')}'>
      </div>`,
  });

  L.marker(L.latLng([31.228593584576306, 121.47212494824217]), { icon: myIcon }).addTo(baseMap);

  const data = [
    {
      from: [121.47212494824217, 31.228593584576306],
      to: [118.79146088574217, 32.05167302545262],
      labels: ['上海', '南京'],
      color: '#ff3a31',
    },
    {
      from: [121.47212494824217, 31.228593584576306],
      to: [117.24238862011717, 31.82792015449264],
      labels: [null, '合肥'],
      color: '#2196F3',
    },
    {
      from: [121.47212494824217, 31.228593584576306],
      to: [115.84712494824217, 28.668234615414136],
      labels: [null, '南昌'],
      color: '#2196F3',
    },
    {
      from: [121.47212494824217, 31.228593584576306],
      to: [120.21968354199217, 30.275016452654977],
      labels: [null, '杭州'],
      color: '#FFEE58',
    },
  ];

  const intData = data.map((item) => {
    return { ...item, value: parseInt(Math.random() * 20) };
  });

  const migrationLayer = new L.MigrationLayer({
    map: baseMap,
    data: intData,
    pulseRadius: 30,
    pulseBorderWidth: 2,
    arcWidth: 1,
    arcLabel: true,
    arcLabelFont: '14px sans-serif',
    maxWidth: 2,
  });
  migrationLayer.addTo(baseMap);
};

// 重置视图
const initResetView = () => {
  const coordinate = GCJ02TOWGS84(110, 19);
  L.control
    .resetView({
      position: 'topleft',
      title: '重置视图',
      latlng: L.latLng(coordinate),
      zoom: 9,
    })
    .addTo(baseMap);
};

// 路径分析
const initRouteMachine = () => {
  const control = L.Routing.control(
    {
      waypoints: [L.latLng(31.2049, 121.5934), L.latLng(31.2304, 121.4737)],
      // routeWhileDragging: false
      // createMarker: function () { return null; } // 可隐藏默认标记
    },

    // L.extend({}, {
    //   waypoints: [L.latLng(20.022, 110.348), L.latLng(19.566, 109.948)],
    //   geocoder: L.Control.Geocoder.nominatim(),
    //   routeWhileDragging: false,
    //   reverseWaypoints: true,
    //   showAlternatives: true,
    //   altLineOptions: {
    //     styles: [
    //       { color: 'black', opacity: 0.15, weight: 9 },
    //       { color: 'white', opacity: 0.8, weight: 6 },
    //       { color: 'blue', opacity: 0.5, weight: 2 }
    //     ]
    //   }
    // })
  ).addTo(baseMap);

  L.Routing.errorControl(control).addTo(baseMap);

  const createButton = (label, container) => {
    const btn = L.DomUtil.create('button', 'btn', container);
    btn.setAttribute('type', 'button');
    btn.innerHTML = label;
    return btn;
  };

  baseMap.on('click', function (e) {
    const container = L.DomUtil.create('div', 'btnBox');
    const startBtn = createButton('设置为起点', container);
    const destBtn = createButton('设置为终点', container);

    L.popup().setContent(container).setLatLng(e.latlng).openOn(baseMap);

    L.DomEvent.on(startBtn, 'click', function () {
      control.spliceWaypoints(0, 1, e.latlng);
      baseMap.closePopup();
    });
    L.DomEvent.on(destBtn, 'click', function () {
      control.spliceWaypoints(control.getWaypoints().length - 1, 1, e.latlng);
      baseMap.closePopup();
    });
  });
};

// 标记目标
const markTarget = () => {
  baseMap.flyTo(L.latLng([39.9042, 116.4074]), 7.5, { duration: 2 });
  const pulsingIcon = L.icon.pulse({ iconSize: [20, 20], color: 'red' });
  L.marker([39.9042, 116.4074], { icon: pulsingIcon }).addTo(baseMap);
};

// 创建蚂蚁路线
const createAntLine = (paths: number[][]) => {
  const lineLayer = antPath(paths, {
    paused: false, // 暂停  初始化状态
    reverse: false, // 方向反转
    delay: 1500, // 延迟，数值越大效果越缓慢
    dashArray: [40, 20], // 间隔样式
    weight: 6, // 线宽
    opacity: 0.9, // 透明度
    color: '#D32F2F',
    pulseColor: '#cdcdcd', // 块颜色
  });

  const lineGroupLayer = L.layerGroup([]);
  lineGroupLayer.addLayer(lineLayer);

  baseMap.addLayer(lineGroupLayer);
};

// 蚂蚁轨迹效果
const initAntLine = () => {
  const latlngs = [] as any[];

  const paths = [
    [20.0345, 110.3487],
    [19.9348, 110.4762],
    [19.7378, 110.4729],
    [19.3586, 110.4691],
    [19.0394, 110.2941],
  ];

  const makerStart = L.marker(paths[0], { icon: iconCar });
  const makerEnd = L.marker(paths[paths.length - 1], { icon: iconPoint });

  const lineLayer = antPath(paths, {
    paused: false, // 暂停  初始化状态
    reverse: false, // 方向反转
    delay: 2000, // 延迟，数值越大效果越缓慢
    dashArray: [10, 20], // 间隔样式
    weight: 4, // 线宽
    opacity: 0.7, // 透明度
    color: '#459c50',
    pulseColor: '#fff', // 块颜色
  });
  const markerGroup = L.layerGroup([]);
  const lineGroupLayer = L.layerGroup([]);
  markerGroup.addLayer(makerStart);
  markerGroup.addLayer(makerEnd);
  lineGroupLayer.addLayer(lineLayer);

  baseMap.addLayer(markerGroup);
  baseMap.addLayer(lineGroupLayer);

  paths.forEach((i) => {
    latlngs.push(new L.LatLng(i[0], i[1]));
  });

  const movingMarker = L.Marker.movingMarker(latlngs, 20000, {
    autostart: true,
    icon: iconCar,
  }).addTo(baseMap);

  // 将 MovingMarker 添加到地图
  movingMarker.once('click', function () {
    movingMarker.start();
  });
};

// 高发路段demo
const highRoad = () => {
  const road1 = [
    [104.0732989, 30.3958094],
    [104.0732918, 30.3960566],
    [104.0732258, 30.3965098],
    [104.0731247, 30.3968118],
    [104.0729369, 30.3972271],
    [104.0725674, 30.3978234],
    [104.0722332, 30.3983347],
    [104.0719605, 30.3987888],
    [104.0718416, 30.3990559],
    [104.0717653, 30.3993499],
    [104.0717552, 30.3994055],
    [104.0717605, 30.4015218],
    [104.0717505, 30.4043031],
    [104.071743, 30.4044978],
    [104.071744, 30.4046125],
    [104.0717513, 30.4047098],
    [104.0717522, 30.4053696],
  ];

  const road2 = [
    [104.0739315, 30.4069143],
    [104.0738457, 30.4069138],
    [104.0736245, 30.4068857],
    [104.0734327, 30.4068313],
    [104.0732588, 30.4067709],
    [104.0730299, 30.4066839],
    [104.0720183, 30.4062372],
    [104.0718679, 30.4061626],
    [104.0718059, 30.4061063],
    [104.071687, 30.4059339],
    [104.0716558, 30.4058407],
    [104.0716561, 30.4056112],
  ];
  // 辅助函数：转换坐标并绘制
  function drawSegment(coords, color) {
    // Leaflet 需要 [lat, lng]，所以要用 reverse()
    const latLngs = coords.map((p) => [p[1], p[0]]);
    L.polyline(latLngs, {
      color: color,
      weight: 8, // 线宽
      opacity: 0.9, // 透明度
      lineJoin: 'round', // 转角连接处圆润
      lineCap: 'butt',
    }).addTo(baseMap);
  }

  // 注意：每一段的终点应该是下一段的起点，否则路口会有裂缝
  drawSegment(road1.slice(0, 4), '#2E7D32'); // 顺畅
  drawSegment(road1.slice(3, 7), '#F9A825'); // 一般拥堵
  drawSegment(road1.slice(6, 10), '#B71C1C'); // 严重拥堵
  drawSegment(road1.slice(9, 17), '#2E7D32'); // 顺畅
  drawSegment(road2, '#2E7D32'); // 顺畅

  baseMap.flyTo(L.latLng([30.4069143, 104.0739315]), 15, { duration: 2 });
};

// 初始化地图
const initMap = () => {
  // 天地图普通地图瓦片图层
  const normalm = L.tileLayer.chinaProvider('TianDiTu.Normal.Map');
  const normala = L.tileLayer.chinaProvider('TianDiTu.Normal.Annotion');

  // 天地图地形
  const tdTerrainMap = L.tileLayer.chinaProvider('TianDiTu.Terrain.Map');
  const tdTerrainAnno = L.tileLayer.chinaProvider('TianDiTu.Terrain.Annotion');

  // 高德普通地图瓦片图层
  const gaoDem = L.tileLayer.chinaProvider('GaoDe.Normal.Map');

  // 高德卫星地图瓦片图层
  const gaoDems = L.tileLayer.chinaProvider('GaoDe.Satellite.Map');
  const gaoDesa = L.tileLayer.chinaProvider('GaoDe.Satellite.Annotion');

  // OpenStreetMap（OSM）
  const osm = L.tileLayer.chinaProvider('OSM.Normal.Map');

  // 原始leaflet图层
  const defaultMap = L.tileLayer(`${window.api.gis}`);
  const routeMap = L.layerGroup([normalm, normala]);
  const tdTerrain = L.layerGroup([tdTerrainMap, tdTerrainAnno]);
  const gaoDeMap = L.layerGroup([gaoDem]);
  const gaoDeSatelliteMap = L.layerGroup([gaoDems, gaoDesa]);

  // 天地图底图
  const tiandituVecLayer = L.tileLayer(
    `http://t0.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=39a6e2f40d0bf47a673ff64807618838`,
    { tileSize: 256, maxZoom: 18, minZoom: 5 },
  );

  // 天地图矢量注记
  const tiandituCvaLayer = L.tileLayer(
    `http://t0.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=39a6e2f40d0bf47a673ff64807618838`,
    { tileSize: 256, maxZoom: 18, minZoom: 5 },
  );

  const Tianditu = L.layerGroup([tiandituVecLayer, tiandituCvaLayer]);

  // 暗色主题
  const blackLayer = L.tileLayer.colorizr(`${window.api.gis}`, {
    colorize: function (pixel: { r: number; g: number; b: number; a: number }) {
      // 计算灰度
      let grayVal = (pixel.r + pixel.g + pixel.b) / 3;
      grayVal = 255 - grayVal;

      // 将灰度替换掉原始的颜色
      const r = grayVal + 2;
      const g = grayVal + 2;
      const b = grayVal + 2;
      return { r, g, b, a: pixel.a };
    },
  });

  // 灰色主题
  const grayLayer = L.tileLayer.colorizr(`${window.api.gis}`, {
    colorize: function (pixel: { r: number; g: number; b: number; a: number }) {
      const gray = (pixel.r + pixel.g + pixel.b) / 3;
      return { r: gray, g: gray, b: gray, a: pixel.a };
    },
  });

  // 区域控制
  const cn = L.TileLayer.boundaryCanvas(`${window.api.gis}`, {
    boundary: cnGeoJson,
  });

  // 基础图层
  const baseLayers = {
    默认: defaultMap,
    天地: Tianditu,
    高德: gaoDeMap,
    高德卫星: gaoDeSatelliteMap,
    天地图: routeMap,
    地形图: tdTerrain,
    OSM: osm,
    // 幻影黑: blackLayer,
    // 远山黛: grayLayer,
    中国版图: cn,
  };

  // 控制自己添加的覆盖物的显示隐藏
  const overlayLayers = {
    // 城市: cityMarkers,
    // 人: peopleMarkers
  };

  // 中心点位置
  const coordinate = GCJ02TOWGS84(104.0665, 30.5728); // 成都

  baseMap = L.map('gisMap', {
    center: L.latLng(coordinate[0], coordinate[1]), // Leaflet必须纬度(lat)在前经度(lng)在后！
    zoom: 9,
    minZoom: 5,
    maxZoom: 18,
    layers: [osm, markers], // 控制默认显示图层
    attributionControl: false, // 控制版权信息控件
    zoomControl: false, // 缩放控件
    fullscreenControl: true, // 全屏控件
    fullscreenControlOptions: {
      position: 'topleft',
    },
    // maxBounds:[] 区域限制
  });

  // 自定义缩放控件
  const zoomControl = L.control.zoom({
    position: 'topleft',
    zoomInTitle: '放大',
    zoomOutTitle: '缩小',
  });
  baseMap.addControl(zoomControl);

  // 扩展control 增加地图切换
  layerControl = L.control.layers(baseLayers, overlayLayers).addTo(baseMap);

  // 小地图
  const minMap = new L.TileLayer(`${window.api.gis}`, {
    minZoom: 0,
    maxZoom: 20,
  });
  const m = new L.Control.MiniMap(minMap, { toggleDisplay: true }).addTo(baseMap);

  // 加载地图控件
  initControls();
  bindEvent();
  iniPrint();
  initSearch();
  createMarker();
  drawTrafficPoints();
  initResetView();

  // 缩放比例尺
  L.control
    .scale({
      position: 'bottomright',
    })
    .addTo(baseMap);

  var osmGeocoder = new L.Control.OSMGeocoder({ placeholder: '搜索...' });

  baseMap.addControl(osmGeocoder);

  // 监听地图的缩放级别变化
  // baseMap.on('zoomend', function () {
  //   const zoomLevel = baseMap.getZoom();
  //   // console.log(zoomLevel);
  //   // 更新 blackLayer 中的缩放等级
  //   blackLayer.options.leafletMap = zoomLevel;
  //   blackLayer.redraw();
  // });
};

// 手动触发地图容器更新
const handleElementResize = () => {
  baseMap.invalidateSize();
};

// 监听浏览器窗口变化，更新画布尺寸
window.addEventListener('resize', handleElementResize);

onMounted(() => {
  initMap();

  // 监听地图容器窗口变化
  const target = document.getElementById('gisMap') as HTMLElement;
  resizeObserver = new ResizeObserver(() => {
    handleElementResize();
  });

  resizeObserver.observe(target);
});
</script>

<style lang="scss">
@import url('./css/leaflet-search');
@import url('leaflet.fullscreen/Control.FullScreen.css');
@import url('./css/leaflet-routing-machine');
@import url('./css/Control.MiniMap');
@import url('./css/Control.OSMGeocoder');
@import url('leaflet-pulse-icon/src/L.Icon.Pulse.css');

.leaflet-touch .leaflet-control-layers-toggle {
  width: 30px;
  height: 30px;
  background-size: 70%;
}

.btns {
  display: flex;
  gap: 4px;

  div {
    white-space: nowrap;
    font-size: 14px;
    padding: 2px 10px;
    background-color: rgb(140, 177, 232);
    border-radius: 4px;
    color: #fff;
    cursor: pointer;
  }
}

.leaflet-bottom {
  .info {
    padding: 14px;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 4px;
  }
}

.leaflet-control-resetview {
  a {
    cursor: pointer;
    .leaflet-control-resetview-icon {
      display: inline-block;
      width: 16px;
      height: 16px;
      margin: 7px;
      background-color: black;
      -webkit-mask-image: url('../../assets/icons/redo-solid.svg');
      mask-image: url('../../assets/icons/redo-solid.svg');
      -webkit-mask-repeat: no-repeat;
      mask-repeat: no-repeat;
      -webkit-mask-position: center;
      mask-position: center;
    }
  }
}

// .leaflet-div-icon {
//   border: none !important;
//   background-color: transparent !important;
// }

.myIcon {
  width: 100px;
  position: absolute;
  top: -42px;
  left: -35px;

  img {
    width: 100% !important;
  }
}

.btnBox {
  display: flex;

  .btn {
    padding: 5px 14px;
    background-color: rgb(143, 144, 144);
    color: #fff;
    line-height: 1;
    border-radius: 4px;
    margin: 0 4px;
  }
}

.pdf-container {
  width: 100%;
  height: 600px;

  embed {
    width: 100%;
    height: 100%;
  }
}

.geo-label {
  color: #000;
  border: #000;
  font-size: 14px;
  font-weight: bold;
  white-space: nowrap;
}
</style>
