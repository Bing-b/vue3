<template>
  <div id="star" class="w-full"></div>
</template>

<script lang="ts" setup>
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { onMounted } from 'vue';

const init = () => {
  console.clear();
  // 创建场景
  let scene = new THREE.Scene();
  scene.background = new THREE.Color(0x160016);

  // 创建相机
  let camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(0, 4, 21);

  // 创建渲染器
  let renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight); // 修复：渲染器大小应该传入innerWidth和innerHeight
  document.getElementById('star')?.appendChild(renderer.domElement);

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
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

  const pushShift = () => {
    shift.push(
      Math.random() * Math.PI,
      Math.random() * Math.PI * 2,
      (Math.random() * 0.9 + 0.1) * Math.PI * 0.1,
      Math.random() * 0.9 + 0.1
    );
  };

  // 创建中心球
  let pts = new Array(20000)
    .map(() => {
      const point = new THREE.Vector3().randomDirection().multiplyScalar(Math.random() * 0.5 + 9.5);
      // 确保生成的点不是 undefined
      if (point) {
        sizes.push(Math.random() * 1.5 + 0.5);
        pushShift();
        return point;
      }
      return null; // 如果没有点，返回null
    })
    .filter((p) => p !== null); // 过滤掉 null 或 undefined 点

  // 创建卫星球
  for (let i = 0; i < 100000; i++) {
    let r = 10,
      R = 40;
    let rand = Math.pow(Math.random(), 1.5);
    let radius = Math.sqrt(R * R * rand + (1 - rand) * r * r);
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

  // 检查生成的pts是否有效
  console.log(pts); // 调试，查看pts内容

  // 生成一个点几何体
  let g = new THREE.BufferGeometry().setFromPoints(pts);

  // 创建点材质
  let m = new THREE.PointsMaterial({
    size: 0.125,
    transparent: true,
    depthTest: false,
    blending: THREE.AdditiveBlending,
    onBeforeCompile: (shader) => {
      shader.uniforms.time = gu.time;

      shader.vertexShader = `
      uniform float time;
      attribute float sizes;
      attribute vec4 shift;
      varying vec3 vColor;
      ${shader.vertexShader}
    `
        .replace('gl_PointSize = size;', 'gl_PointSize = size * sizes;')
        .replace(
          '#include <color_vertex>',
          `#include <color_vertex>
         float d = length(abs(position) / vec3(40., 10., 40.));
         d = clamp(d, 0., 1.);
         vColor = mix(vec3(227., 155., 0.), vec3(100., 50., 255.), d) / 255.;`
        )
        .replace(
          '#include <begin_vertex>',
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
          '#include <clipping_planes_fragment>',
          `#include <clipping_planes_fragment>
         float d = length(gl_PointCoord.xy - 0.5);`
        )
        .replace(
          'vec4 diffuseColor = vec4( diffuse, opacity );',
          'vec4 diffuseColor = vec4(vColor, smoothstep(0.5, 0.1, d));'
        );

      // 打印编译的 shader，帮助调试
      console.log('Vertex Shader:', shader.vertexShader);
      console.log('Fragment Shader:', shader.fragmentShader);
    },
  });

  // 创建点云并添加到场景中
  let p = new THREE.Points(g, m);
  p.rotation.order = 'ZYX';
  p.rotation.z = 0.2;
  scene.add(p);

  // 创建时钟对象
  let clock = new THREE.Clock();

  // 渲染循环
  renderer.setAnimationLoop(() => {
    controls.update();
    let t = clock.getElapsedTime() * 0.5;
    gu.time.value = t * Math.PI;
    p.rotation.y = t * 0.05;
    renderer.render(scene, camera);
  });
};

onMounted(() => {
  init();
});
</script>
