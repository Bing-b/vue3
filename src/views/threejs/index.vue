<template>
  <div class="p-5 h-full overflow-y-scroll">
    <div ref="webglRef" id="webgl" style="margin-top: 10px; margin-left: 10px"></div>

    <el-button @click="render">旋转动画</el-button>
    <el-button @click="fullSecreen">全屏</el-button>
    <el-button @click="creatMoreBox" type="primary">阵列立方体</el-button>
    <div id="moreBox"></div>
  </div>
</template>

<script lang="ts" setup>
import * as THREE from 'three';
// 引入轨道控制器扩展库OrbitControls.js
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { onBeforeUnmount, ref } from 'vue';

import { onMounted } from 'vue';

let resizeObserver: any;

const webglRef = ref();

// 创建场景
const scene = new THREE.Scene();

// 创建长方体
const geometry = new THREE.BoxGeometry(100, 60, 20);

// 材料
const material = new THREE.MeshLambertMaterial({
  color: 0xff0000, // 添加红色的零
  transparent: true, //开启透明
  opacity: 0.5, //设置透明度
});

// 构建网格模型
const mesh = new THREE.Mesh(geometry, material);
mesh.position.set(100, 60, 20);
scene.add(mesh);

// 实例化一个透视投影相机
const width = 800;
const height = 500;
const camera = new THREE.PerspectiveCamera(30, width / height, 1, 3000);

// 相机位置
camera.position.set(400, 200, 400);
camera.lookAt(mesh.position);

// 创建渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);

const asesHelper = new THREE.AxesHelper(150); // 坐标系

scene.add(asesHelper);

// 动画
const render = () => {
  renderer.render(scene, camera);
  mesh.rotateX(0.01);
  requestAnimationFrame(render);
};

// 全屏
const fullSecreen = () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(w, h);
};

// 阵列立方体
const creatMoreBox = () => {
  // 创建场景
  const scene = new THREE.Scene();
  const geometry = new THREE.BoxGeometry(50, 50, 50);
  const material = new THREE.MeshLambertMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.5,
  });
  for (let i = 0; i < 5; i++) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(i * 100, 0, 0);
    scene.add(mesh);
  }
  // 创建渲染器
  const renderer = new THREE.WebGLRenderer();
  const camera = new THREE.PerspectiveCamera(30, width / height, 1, 3000);

  // 相机位置
  camera.position.set(400, 200, 400);
  camera.lookAt(mesh.position);
  renderer.setSize(1000, 500);
  const asesHelper = new THREE.AxesHelper(150); // 坐标系

  scene.add(asesHelper);
  document.getElementById('moreBox')?.appendChild(renderer.domElement);
  const pointLight = new THREE.PointLight(0xffffff, 1.0);

  pointLight.intensity = 4.0; //光照强度

  pointLight.decay = 0.0; //设置光源不随距离衰减

  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambient);

  // 设置相机控件轨道控制器OrbitControls
  const controls = new OrbitControls(camera, renderer.domElement);
  // 如果OrbitControls改变了相机参数，重新调用渲染器渲染三维场景
  controls.addEventListener('change', function () {
    renderer.render(scene, camera); //执行渲染操作
  }); //监听鼠标、键盘事件

  // 执行渲染
  renderer.render(scene, camera);
};

const listenerResize = () => {
  resizeObserver = new ResizeObserver(() => {
    // 重置渲染器输出画布canvas尺寸
    renderer.setSize(window.innerWidth, window.innerHeight);
    // 全屏情况下：设置观察范围长宽比aspect为窗口宽高比
    camera.aspect = window.innerWidth / window.innerHeight;
    // 渲染器执行render方法的时候会读取相机对象的投影矩阵属性projectionMatrix
    // 但是不会每渲染一帧，就通过相机的属性计算投影矩阵(节约计算资源)
    // 如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
    camera.updateProjectionMatrix();
  });
  resizeObserver.observe(webglRef.value);
};

onMounted(() => {
  document.getElementById('webgl')?.appendChild(renderer.domElement);

  const pointLight = new THREE.PointLight(0xffffff, 1.0);

  pointLight.intensity = 4.0; //光照强度

  pointLight.decay = 0.0; //设置光源不随距离衰减

  //点光源位置
  pointLight.position.set(100, 100, 150); //点光源放在x轴上

  scene.add(pointLight); //点光源添加到场景中

  // 设置相机控件轨道控制器OrbitControls
  const controls = new OrbitControls(camera, renderer.domElement);
  // 如果OrbitControls改变了相机参数，重新调用渲染器渲染三维场景
  controls.addEventListener('change', function () {
    renderer.render(scene, camera); //执行渲染操作
  }); //监听鼠标、键盘事件

  // 光源辅助观察  PointLightHelper 点光源辅助观察
  // const pointLightHelper = new THREE.PointLightHelper(pointLight, 4);

  // scene.add(pointLightHelper);

  // 环境光

  // const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  // scene.add(ambient);

  // 平行光
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(100, 100, 100);
  directionalLight.target = mesh;
  scene.add(directionalLight);

  // DirectionalLightHelper：可视化平行光
  const dirLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5, 0xff0000);
  scene.add(dirLightHelper);

  // 执行渲染
  renderer.render(scene, camera);
});

onBeforeUnmount(() => {
  resizeObserver.unobserve(webglRef.value);
});
</script>

<style scoped></style>
