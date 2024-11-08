<template>
  <div class="p-5">
    <div id="webgl" style="margin-top: 10px; margin-left: 10px"></div>
  </div>
</template>

<script lang="ts" setup>
import * as THREE from 'three';
// 引入轨道控制器扩展库OrbitControls.js
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { onMounted } from 'vue';

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

onMounted(() => {
  document.getElementById('webgl')?.appendChild(renderer.domElement);

  const pointLight = new THREE.PointLight(0xffffff, 1.0);

  pointLight.intensity = 4.0; //光照强度

  pointLight.decay = 0.0; //设置光源不随距离衰减

  //点光源位置
  pointLight.position.set(100, 60, 50); //点光源放在x轴上

  scene.add(pointLight); //点光源添加到场景中

  // 设置相机控件轨道控制器OrbitControls
  const controls = new OrbitControls(camera, renderer.domElement);
  // 如果OrbitControls改变了相机参数，重新调用渲染器渲染三维场景
  controls.addEventListener('change', function () {
    renderer.render(scene, camera); //执行渲染操作
  }); //监听鼠标、键盘事件

  const pointLightHelper = new THREE.PointLightHelper(pointLight, 10);

  scene.add(pointLightHelper);

  // 执行渲染
  renderer.render(scene, camera);
});
</script>

<style scoped></style>
