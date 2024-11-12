<template>
  <div id="star" class="w-full"> </div>
</template>

<script lang="ts" setup>
import * as THREE from 'three';
// 引入轨道控制器扩展库OrbitControls.js
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { onMounted } from 'vue';

const init = () => {
  console.clear();
  // 创建场景
  let scene = new THREE.Scene();
  scene.background = new THREE.Color(0x160016);

  // 创建相机
  let camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 1, 1000);
  camera.position.set(0, 4, 21);

  // 创建渲染器
  let renderer = new THREE.WebGLRenderer();
  renderer.setSize(innerHeight, innerHeight);
  document.getElementById('star')?.appendChild(renderer.domElement);

  window.addEventListener('resize', (e) => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });

  // 创建控制器
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = true;
  let gu = {
    time: { value: 0 },
  };
  let sizes = [];
  let shift = [];

  let pushShift = () => {
    shift.push(
      Math.random() * Math.PI,
      Math.random() * Math.PI * 2,
      (Math.random() * 0.9 + 0.1) * Math.PI * 0.1,
      Math.random() * 0.9 + 0.1
    );
  };

  // 创建中心球
  let pts = new Array(20000).fill().map((p) => {
    sizes.push(Math.random() * 1.5 + 0.5);
    pushShift();
    return new THREE.Vector3().randomDirection().multiplyScalar(Math.random() * 0.5 + 9.5);
  });

  // 创建卫星球

  for (let i = 0; i < 100000; i++) {
    let r = 10,
      R = 40;
    let rand = Math.pow(Math.random(), 1.5);
    let radius = Math.sqrt(R * R * rand + (1 - rand) * r * r);
    // 使用new THREE.Vector3().setFromCylindricalCoords()生成一个点。
    pts.push(
      new THREE.Vector3().setFromCylindricalCoords(
        radius,
        Math.random() * 2 * Math.PI,
        (Math.random() - 0.5) * 2
      )
    );
    sizes.push(Math.random() * 1.5 + 0.5);
    pushShift();
  }
  // 生成一个点g，同时将点的大小和位置信息添加到sizes和shift数组中
  let g = new THREE.BufferGeometry().setFromPoints(pts);
  // 创建了一个缓冲几何体并设置sizes和shift属性
  // 注意这里的F要大写Float32BufferAttribute
  g.setAttribute('sizes', new THREE.Float32BufferAttribute(sizes, 1));
  g.setAttribute('shift', new THREE.Float32BufferAttribute(shift, 4));
  // 创建点材质
  let m = new THREE.PointsMaterial({
    // 表示点的大小
    size: 0.125,
    // 设置材质为透明
    transparent: true,
    // 表示禁用深度测试，使点可以叠加
    depthTest: false,
    // 使用假发混合模式
    blending: THREE.AdditiveBlending,
    // 在材质编译之前修改颜色器，在这里，它用来替换顶点着色器和片元着色器，添加uniform
    // 和attribute，以鸡自定义颜色和移动
    onBeforeCompile: (shader) => {
      shader.uniforms.time = gu.time;

      shader.vertexShader = `
    uniform float time;
    attribute float sizes;
    attribute vec4 shift;
    varying vec3 vColor;
    ${shader.vertexShader}
    `
        .replace(`gl_PointSize = size;`, `gl_PointSize = size * sizes;`)
        .replace(
          `#include <color_vertex>`,
          `#include <color_vertex>
       float d = length(abs(position)/vec3(40.,10.,40));
       d = clamp(d,0.,1.);
       vColor = mix(vec3(227.,155.,0.),vec3(100.,50.,255.),d)/255.;`
        )
        .replace(
          `#include <begin_vertex>`,
          `#include <begin_vertex>
       float t = time;
       float moveT = mod(shift.x + shift.z * t, PI2);
       float moveS = mod(shift.y + shift.z * t, PI2);
       transformed += vec3(cos(moveS) * sin(moveT), cos(moveT), sin(moveS) * sin(moveT)) * shift.w;`
        );

      shader.fragmentShader = `
    varying vec3 vColor;
    ${shader.fragmentShader}
  `
        .replace(
          `#include <clipping_planes_fragment>`,
          `#include <clipping_planes_fragment>
       float d = length(gl_PointCoord.xy - 0.5);`
        )
        .replace(
          `vec4 diffuseColor = vec4( diffuse, opacity );`,
          `vec4 diffuseColor = vec4( vColor, smoothstep(0.5, 0.1, d) );`
        );
    },
  });
  // 创建点云并将其添加到场景中，并设置渲染循环
  let p = new THREE.Points(g, m);
  // 旋转顺序为"ZYX"
  p.rotation.order = 'ZYX';
  // 旋转角度 0.2
  p.rotation.z = 0.2;
  // 把对象（p）添加到场景（scene）中
  scene.add(p);
  // 创建一个时钟对象clock
  let clock = new THREE.Clock();
  // 渲染循环，每次循环中会更新控制器，更新p的旋转角度，更新时间
  renderer.setAnimationLoop(() => {
    // 更新控制器
    controls.update();
    // 获取时钟对象（clock）的已经流逝的时间（t）并将他乘0.5
    // 先把时钟关了
    let t = clock.getElapsedTime() * 0.5;
    // 将gu.time.value 设置为t*Math.PI
    gu.time.value = t * Math.PI;
    // 将对象（p）的旋转角度y设置为t*0.05
    p.rotation.y = t * 0.05;
    // 渲染场景（scene）和相机（camera）
    renderer.render(scene, camera);
  });
};

onMounted(() => {
  init();
});
</script>

<style scoped></style>
