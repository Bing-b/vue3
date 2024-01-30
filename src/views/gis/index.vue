<template>
  <div class="relative w-full h-full">
    <div class="absolute top-2 left-[150px] z-[888] flex text-md gap-2 p-1 items-center bg-white rounded">
      <p>轨迹演示</p>
      <el-button @click="startPlay" size="small">开始/暂停</el-button>
      <el-button @click="rebroadcast" size="small">重播</el-button>
      <el-button @click="drawBezier" size="small">绘制标记</el-button>
      <el-button @click="polylineAnimation" size="small">河流效果</el-button>
      <el-button @click="trafficRoute" size="small">交通轨迹</el-button>
      <el-button @click="highlightChina" size="small">突出区域</el-button>
      <el-button @click="restrictedArea" size="small">限制区域</el-button>
      <el-button @click="toggleMarker" size="small">标记分类显示</el-button>
      <el-button @click="createArrowPath" size="small">迁徙效果</el-button>
    </div>

    <!-- 地图 -->
    <div id="gisMap" class="absolute top-0 bottom-0 left-0 right-0"></div>
  </div>
</template>

<script lang='ts' setup>
import {
  onMounted, ref,
  reactive
} from 'vue';
import * as L from 'leaflet';
import utils from '@/utils/commonFuction';
import gcoord from 'gcoord';
import 'leaflet-draw';
import 'leaflet-polylinedecorator';
import './ts/leaflet.draw-cn';
import './ts/L.Edit.Circle';
import './ts/leaflet-heat';
import 'leaflet-easyprint';
import './js/movingMarker';
import './js/leaflet-search.src';
import './js/fullScreen';
import './js/leaflet.ChineseTmsProviders';
import './js/L.Path.DashFlow';
import './js/leaflet.motion.min';
import './js/leaflet-tilelayer-colorizr';
import './js/leaflet.migrationLayer';
import { hainanRiverCoordinates } from './js/route';
// import * as cnGeoJson from './js/china.json';
import * as siChuanJson from './js/sichuan.json';

// 画布宽高变化监测
let resizeObserver: ResizeObserver;

// gisMap 实例
let baseMap = {} as any;

// 控件
const controls = new L.FeatureGroup();

// 标记
const markers = new L.FeatureGroup();

// 圆
const circles = new L.LayerGroup();

// 路径图层
const paths = new L.FeatureGroup();

// 演示数据
const cityMarkers = new L.FeatureGroup();

const peopleMarkers = new L.FeatureGroup();

// 自定义编辑图层
const editFeatureGroup = L.featureGroup();

// 自定义编辑图层工具栏
const editToolbar = new L.EditToolbar({
  featureGroup: editFeatureGroup
});

const editHandler = editToolbar.getModeHandlers()[0].handler;

// 标记搜索框
let controlSearch = null as any;

// 演示标记
let marker2 = null as any;

let marker2Path = [] as any[];

const areaParams = reactive({
  location: '',
  geoType: ''
});

const isDeleteMode = ref<boolean>(false);

// 地理位置坐标
const parisKievLL = [[20.022, 110.348], [19.684, 110.879], [19.566, 109.948], [19.362, 109.18], [18.648, 109.614]];

let layerControl = {} as any;

// 小汽车图标
const carIcon = L.icon({
  iconUrl: new URL('../../assets/icons/mycar.svg', import.meta.url).href,
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

// 坐标图标
const geoIcon = L.icon({
  iconUrl: new URL('../../assets/icons/marker.svg', import.meta.url).href,
  iconSize: [24, 24],
  iconAnchor: [16, 16]
});

// 坐标
const pIcon = L.icon({
  iconUrl: new URL('../../assets/icons/point.svg', import.meta.url).href,
  iconSize: [24, 24],
  iconAnchor: [16, 16]
});

// 船
const boatIcon = L.icon({
  iconUrl: new URL('../../assets/icons/boat.svg', import.meta.url).href,
  iconSize: [24, 24],
  iconAnchor: [16, 16]
});

// 车
const car1 = L.icon({
  iconUrl: new URL('../../assets/icons/car1.svg', import.meta.url).href,
  iconSize: [24, 24],
  iconAnchor: [16, 16]
});

// 大船
const boat1 = L.icon({
  iconUrl: new URL('../../assets/icons/boat1.svg', import.meta.url).href,
  iconSize: [30, 30],
  iconAnchor: [16, 16]
});

// 飞机
const plane1 = L.icon({
  iconUrl: new URL('../../assets/icons/plane1.svg', import.meta.url).href,
  iconSize: [30, 30],
  iconAnchor: [16, 16]
});

// 城市
const cityIcon = L.icon({
  iconUrl: new URL('../../assets/icons/city.svg', import.meta.url).href,
  iconSize: [30, 30],
  iconAnchor: [16, 16]
});

// 人
const peopleIcon = L.icon({
  iconUrl: new URL('../../assets/icons/people.svg', import.meta.url).href,
  iconSize: [30, 30],
  iconAnchor: [16, 16]
});

// 坐标转换
const GCJ02TOWGS84 = (lng: number, lat: number) => {
  const coordinate = [] as number[];
  const WGS84 = gcoord.transform([lng, lat], gcoord.GCJ02, gcoord.WGS84);
  coordinate.push(WGS84[1], WGS84[0]);
  return coordinate;
};

// 初始化绘图控件
const initControls = () => {
  // baseMap.addLayer(controls);

  // 搜索区域编辑工具栏
  const drawControl = new L.Control.Draw({
    draw: {
      polyline: true,
      polygon: false, // 多边形
      // rectangle: { showArea: false }, // 添加该配置才能解决报错问题
      rectangle: false,
      circle: false,
      marker: true,
      circlemarker: false
    },
    edit: {
      featureGroup: controls,
      edit: false,
      remove: false
    }
  });
  controls.addTo(baseMap);
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
        controls.removeLayer(ev.target);
      });
    }
  });
};

// 绑定事件
const bindEvent = () => {
  baseMap.on('click', (e) => {
    console.log(e);
    isDeleteMode.value = false;
    markers.eachLayer((marker: any) => {
      marker.options.isSelected = false;
      const { node } = marker.options;
      const iconHtml = `<p class="label h-5 translate-x-[-25%]">${(node.text && node.text.content) || node.label}</p>
          <img src="${utils.getImg('marker.png')}" class="icon !w-[33px] h-[34px]"/>`;
      const markerIcon = L.divIcon({
        html: iconHtml,
        className: 'gis-icon',
        iconSize: [80, 70],
        iconAnchor: [24, 55]
      });
      marker.options.isSelected = false;
      marker.setIcon(markerIcon);
    });
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

    drawlayer.bindPopup(
      `<div class="btns">
              
              <div class="gis-edit">编辑</div>
              <div class="gis-save">保存</div>
              <div class="gis-delete">删除</div>
            </div>`,
      { closeButton: false, className: 'gis-popup' }
    ).openPopup();
    controls.addLayer(drawlayer);
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
      areaParams.location = `${layer.getLatLngs()[0][1].lng},${layer.getLatLngs()[0][1].lat}#${latlng.lng},${latlng.lat}`;
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
    hideControlContainer: true // 打印时隐藏控件
  }).addTo(baseMap);
};

// 初始化标记搜索功能
const initSearch = () => {
  const hainanData = [
    { loc: [20.022, 110.348], title: '海口市' },
    { loc: [19.566, 109.948], title: '三亚市' },
    { loc: [18.648, 109.614], title: '儋州市' },
    { loc: [19.362, 109.18], title: '五指山市' },
    { loc: [19.684, 110.879], title: '文昌市' }
  ];

  const markersLayer = new L.LayerGroup();
  baseMap.addLayer(markersLayer);

  controlSearch = new L.Control.Search({
    position: 'topright',
    layer: markersLayer,
    initial: false,
    zoom: 12,
    // marker: false,
    textPlaceholder: '请输入关键词'
  });

  baseMap.addControl(controlSearch);

  // 添加标记到地图
  for (const i in hainanData) {
    const { title } = hainanData[i];
    const { loc } = hainanData[i];
    const marker = new L.Marker(L.latLng(loc), { title });
    marker.bindPopup(`名称: ${title}`);
    markersLayer.addLayer(marker);
  }
};

// 生成标记
const createMarker = () => {
  marker2 = L.Marker.movingMarker(parisKievLL, 10000, {
    autostart: false, loop: false, icon: carIcon, rotate: true
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

  // 轨迹开始
  marker2.on('move', (res: any) => { // 监听点位移动事件 move
    baseMap.panTo([res.latlng.lat, res.latlng.lng]); // 回调中会返回经纬度信息，点移动改变地图中心点
    // marker2Path.length > 1 && marker2Path.shift(); // 保持数组长度，避免过度push不断重新绘制之前的路径
    marker2Path.push([res.latlng.lat, res.latlng.lng]);
    L.polyline(marker2Path, { color: '#1E88E5', weight: 2 }).addTo(baseMap); // 绘制线到地图图层
    // const timer = setTimeout(() => {
    //   marker2.bindPopup('<b>运输中...</b>').openPopup();
    //   clearTimeout(timer);
    // }, 1000);
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
    { loc: [19.1618, 110.5785], title: '琼海市博鳌镇' }
  ];

  const markersLayer = new L.LayerGroup();

  baseMap.addLayer(markersLayer);

  // 添加标记到地图
  for (const i in points) {
    const { title } = points[i];
    const { loc } = points[i];
    const marker = new L.Marker(new L.latLng(loc), { title, icon: geoIcon });
    marker.bindPopup(`名称: ${title}`);
    markersLayer.addLayer(marker);
  }

  const latlngs = [
    [
      L.latLng(19.2596, 110.4656),
      L.latLng(19.2287, 110.5294)],
    [
      L.latLng(19.2287, 110.5294),
      L.latLng(19.2572, 110.5742)],
    [
      L.latLng(19.2287, 110.5294),
      L.latLng(19.2383, 110.4601)],
    [
      L.latLng(19.2287, 110.5294),
      L.latLng(19.1618, 110.5785)]
  ];

  // latlngs.forEach(item => {
  //   const bezierLine = getBezierPoint(item[0], item[1]);
  //   L.polyline(bezierLine, { color: 'red' }).addTo(baseMap);
  // });

  L.polyline(latlngs, { color: '#FF5722', weight: 2, dashArray: [10, 5] }).addTo(baseMap);
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

  const startMarker = new L.Marker(L.latLng(start), { icon: pIcon });
  const endMarker = new L.Marker(L.latLng(end), { icon: pIcon });

  markersLayer.addLayer(startMarker);
  markersLayer.addLayer(endMarker);

  baseMap.flyTo(L.latLng(start), 9, { duration: 2 });

  hainanRiverCoordinates.forEach(i => {
    latlngs.push(new L.LatLng(i[0], i[1]));
  });

  L.polyline(latlngs, {
    dashArray: '15,15',
    dashSpeed: -30
  }).addTo(baseMap);

  const movingMarker = L.Marker.movingMarker(latlngs, 20000, { autostart: true, icon: boatIcon }).addTo(baseMap);

  // 将 MovingMarker 添加到地图
  movingMarker.once('click', function () {
    movingMarker.start();
  });
};

// 绘制路线标记
const drawTrafficPoints = () => {
  const markersLayer = new L.LayerGroup();
  baseMap.addLayer(markersLayer);
  const p1 = new L.Marker(L.latLng([20.9236, 110.0964]), { icon: pIcon });
  const p2 = new L.Marker(L.latLng([20.3252, 110.1751]), { icon: pIcon });
  const p3 = new L.Marker(L.latLng([19.9124, 109.6978]), { icon: pIcon });

  markersLayer.addLayer(p1);
  markersLayer.addLayer(p2);
  markersLayer.addLayer(p3);
};

// 交通路线
const trafficRoute = () => {
  baseMap.flyTo(L.latLng([20.3252, 110.1751]), 9.5, { duration: 2 });

  const path1 = [[20.9236, 110.0964], [20.3252, 110.1751]];
  const path2 = [[20.3252, 110.1751], [19.9124, 109.6978]];
  const path3 = [[19.9124, 109.6978], [20.9236, 110.0964]];
  const trackRoute = [] as any[];
  const shipRoute = [] as any[];
  const planeRoute = [] as any[];

  path1.forEach(i => {
    trackRoute.push(new L.LatLng(i[0], i[1]));
  });

  path2.forEach(i => {
    shipRoute.push(new L.LatLng(i[0], i[1]));
  });

  path3.forEach(i => {
    planeRoute.push(new L.LatLng(i[0], i[1]));
  });

  const seqGroup = L.motion.seq([
    L.motion.polyline(trackRoute, {
      color: 'orangered'
    }, {
      easing: L.Motion.Ease.easeInOutQuad
    }, {
      removeOnEnd: true,
      icon: car1
    }).motionDuration(4000),

    L.motion.polyline(shipRoute, {
      color: '#d81e06'
    }, {
      easing: L.Motion.Ease.easeInOutQuart
    }, {
      removeOnEnd: true,
      // showMarker: true,
      icon: boat1
    }).motionDuration(6000),

    L.motion.seq([L.motion.polyline(planeRoute, {
      color: '#1296db'
    }, null, {
      removeOnEnd: false,
      icon: plane1
    }).motionDuration(5000)
    ])
  ]).addTo(baseMap);

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
    position: 'bottomleft'
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

  const setStyleLayer = (layer, styleSelected) => {
    layer.setStyle(styleSelected);
  };

  const highlightFeature = (e) => {
    const layer = e.target;
    layer.setStyle({
      fillColor: '#0d5eff'
    });
    info.update(layer.feature.properties);
  };

  const featuresSelected = [];

  const checkExistsLayers = (feature) => {
    let result = false;
    for (let i = 0; i < featuresSelected.length; i++) {
      if (featuresSelected[i].adcode === feature.properties.adcode) {
        result = true;
        break;
      }
    }
    return result;
  };

  const resetHighlight = (e) => {
    const layer = e.target;
    const feature = e.target.feature;
    if (checkExistsLayers(feature)) {
      setStyleLayer(layer, {
        color: '#0D8BE7',
        fillColor: '#0d5eff'
      });
    } else {
      setStyleLayer(layer, {
        color: '#333232', // 边框颜色
        weight: 2, // 边框粗细
        opacity: 0.6, // 透明度
        fill: true, // 开启填充区域
        fillColor: '#f5f4f1', // 区域填充颜色
        fillOpacity: 0.8 // 区域填充颜色的透明
      });
    }
  };

  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight
    });
  };

  baseMap.flyTo(L.latLng([30.5728, 104.0668]), 6.5, { duration: 5 });

  const style = {
    color: '#333232', // 边框颜色
    weight: 2, // 边框粗细
    opacity: 0.6, // 透明度
    fill: true, // 开启填充区域
    fillColor: '#f5f4f1', // 区域填充颜色
    fillOpacity: 0.8 // 区域填充颜色的透明
  };

  L.geoJSON(siChuanJson, { style, onEachFeature }).addTo(baseMap);
  info.addTo(baseMap);
};

// 设置地图的最大边界，限制用户拖拽地图的范围
const restrictedArea = () => {
  const hainanBounds = [[18.17, 108.62], [20.08, 111.05]];
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
    [18.8143, 109.7054]
  ];
  const peoples = [
    [18.8312, 109.8436],
    [18.9227, 109.7885],
    [18.9875, 109.9198],
    [18.9481, 109.7002],
    [18.7814, 109.7203]
  ];

  citys.forEach(item => {
    const marker = new L.Marker(L.latLng(item), { icon: cityIcon });
    cityMarkers.addLayer(marker);
  });

  peoples.forEach(item => {
    const marker = new L.Marker(L.latLng(item), { icon: peopleIcon });
    peopleMarkers.addLayer(marker);
  });
  baseMap.addLayer(cityMarkers);
  baseMap.addLayer(peopleMarkers);
  // 添加到control
  layerControl.addOverlay(cityMarkers, '城市');
  layerControl.addOverlay(peopleMarkers, '人');
};

// 箭头轨迹
const createArrowPath = () => {
  const data = [

    { from: [18.648, 109.614], to: [20.022, 110.348], labels: [null, 'Los Angeles'], color: '#00ccff' }
    // { from: [18.648, 109.614], to: [19.362, 109.18], labels: [null, 'Boston'], color: '#e9ff20' },
    // { from: [18.648, 109.614], to: [19.684, 110.879], labels: [null, 'Ottawa'], color: '#99ff1b' }
  ];

  const intData = data.map(item => { return { ...item, value: parseInt(Math.random() * 20) }; });
  console.log(intData);

  const migrationLayers = new L.migrationLayer({
    map: baseMap,
    data: intData,
    pulseRadius: 30,
    pulseBorderWidth: 3,
    arcWidth: 1,
    arcLabel: true,
    arcLabelFont: '10px sans-serif',
    maxWidth: 10
  }
  );
  migrationLayers.addTo(baseMap);
};

// 初始化地图
const initMap = () => {
  // 天地图普通地图瓦片图层
  const normalm = L.tileLayer.chinaProvider('TianDiTu.Normal.Map');
  const normala = L.tileLayer.chinaProvider('TianDiTu.Normal.Annotion');

  // 高德普通地图瓦片图层
  const gaoDem = L.tileLayer.chinaProvider('GaoDe.Normal.Map');

  // 高德卫星地图瓦片图层
  const gaoDems = L.tileLayer.chinaProvider('GaoDe.Satellite.Map');
  const gaoDesa = L.tileLayer.chinaProvider('GaoDe.Satellite.Annotion');

  // 原始leaflet图层
  const defaultMap = L.tileLayer(`${window.gis.PROXY_URL}`);
  const routeMap = L.layerGroup([normalm, normala]);
  const gaoDeMap = L.layerGroup([gaoDem]);
  const gaoDeSatelliteMap = L.layerGroup([gaoDems, gaoDesa]);

  // 暗色主题
  const blackLayer = L.tileLayer.colorizr(`${window.gis.PROXY_URL}`, {
    colorize: function (pixel) {
      // 计算灰度
      let grayVal = (pixel.r + pixel.g + pixel.b) / 3;
      grayVal = 255 - grayVal;

      // 将灰度替换掉原始的颜色
      const r = grayVal + 3;
      const g = grayVal + 3;
      const b = grayVal + 3;
      return { r, g, b, a: pixel.a };
    }
  });

  // 灰色主题
  const grayLayer = L.tileLayer.colorizr(`${window.gis.PROXY_URL}`, {
    colorize: function (pixel) {
      const gray = (pixel.r + pixel.g + pixel.b) / 3;
      return { r: gray, g: gray, b: gray, a: pixel.a };
    }
  });

  // 基础图层
  const baseLayers = {
    默认: defaultMap,
    高德: gaoDeMap,
    高德卫星: gaoDeSatelliteMap,
    天地图: routeMap,
    幻影黑: blackLayer,
    远山黛: grayLayer
  };

  // 控制自己添加的覆盖物的显示隐藏
  const overlayLayers = {
    // 城市: cityMarkers,
    // 人: peopleMarkers
  };

  // 中心点位置
  const coordinate = GCJ02TOWGS84(110, 19);

  baseMap = L.map('gisMap', {
    center: L.latLng(coordinate[0], coordinate[1]), // Leaflet必须纬度(lat)在前经度(lng)在后！
    zoom: 9,
    minZoom: 5,
    maxZoom: 18,
    layers: [defaultMap, markers], // 控制默认显示图层
    attributionControl: false, // 控制版权信息控件
    zoomControl: false, // 缩放控件
    fullscreenControl: true, // 全屏控件
    fullscreenControlOptions: {
      position: 'topleft'
    }
  });

  // 自定义缩放控件
  const zoomControl = L.control.zoom({
    position: 'topleft',
    zoomInTitle: '放大',
    zoomOutTitle: '缩小'
  });
  baseMap.addControl(zoomControl);

  // 扩展control 增加地图切换
  layerControl = L.control.layers(baseLayers, overlayLayers).addTo(baseMap);

  // 加载地图控件
  initControls();
  bindEvent();
  iniPrint();
  initSearch();
  createMarker();
  drawTrafficPoints();

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
@import url('./css/leaflet-search.css');
@import url('./css/Control.FullScreen');

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
    background-color: rgba(255, 255, 255, .8);
    border-radius: 4px;
  }
}
</style>
