<template>
  <div class="info-container group relative flex h-full w-full flex-col overflow-hidden rounded-[24px] bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-[#1c1e23] border border-transparent dark:border-white/10">
    <!-- Header -->
    <div class="z-10 mb-5 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-500 dark:bg-indigo-900/20 dark:text-indigo-400">
           <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        </div>
        <div>
          <h3 class="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Neural Core</h3>
          <p class="text-[10px] text-gray-400">Live Computational Flux</p>
        </div>
      </div>
      <div class="flex items-center gap-2 rounded-full bg-gray-50 px-2.5 py-1 dark:bg-gray-800">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" :class="statusColorClass"></span>
          <span class="relative inline-flex h-2 w-2 rounded-full" :class="statusColorClass"></span>
        </span>
        <span class="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase font-mono">{{ uptime }}</span>
      </div>
    </div>

    <!-- Three.js Canvas Container -->
    <div ref="containerRef" class="relative flex-1 w-full overflow-hidden rounded-xl bg-gray-50/30 dark:bg-black/20">
       <!-- Overlay Stats -->
       <div class="absolute inset-0 z-10 pointer-events-none p-4 flex flex-col justify-between">
          <div class="flex justify-between items-start">
             <div class="flex flex-col">
                <span class="text-[8px] font-bold text-indigo-500/60 uppercase">Load_Index</span>
                <span class="text-xs font-black text-gray-700 dark:text-gray-300">{{ cpuUsage }}%</span>
             </div>
             <div class="flex flex-col items-end">
                <span class="text-[8px] font-bold text-purple-500/60 uppercase">Buffer_State</span>
                <span class="text-xs font-black text-gray-700 dark:text-gray-300">{{ memoryUsage }}%</span>
             </div>
          </div>
          <div class="flex justify-center">
             <div class="flex gap-4">
                <div class="flex flex-col items-center">
                   <span class="text-[7px] text-gray-400 uppercase">Latency</span>
                   <span class="text-[10px] font-bold text-emerald-500">12ms</span>
                </div>
                <div class="flex flex-col items-center">
                   <span class="text-[7px] text-gray-400 uppercase">Agents</span>
                   <span class="text-[10px] font-bold text-gray-600 dark:text-gray-400">{{ onlineUsers }}</span>
                </div>
             </div>
          </div>
       </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted, watch } from 'vue';
import * as THREE from 'three';
import useGlobalConfig from '@/store/modules/global';

// 响应式数据
const cpuUsage = ref(45);
const memoryUsage = ref(62);
const onlineUsers = ref(128);
const timer = ref<NodeJS.Timeout>();
const containerRef = ref<HTMLElement>();

const globalConfig = useGlobalConfig();

// Three.js 变量
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let core: THREE.Mesh;
let particles: THREE.Points;
let animationId: number;

const initThree = () => {
  if (!containerRef.value) return;

  const width = containerRef.value.clientWidth;
  const height = containerRef.value.clientHeight;

  // Scene
  scene = new THREE.Scene();

  // Camera
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.z = 5;

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  containerRef.value.appendChild(renderer.domElement);

  // Core Geometry (Icosahedron)
  const geometry = new THREE.IcosahedronGeometry(2, 2);
  const material = new THREE.MeshBasicMaterial({
    color: globalConfig.appDark ? 0x6366f1 : 0x4f46e5,
    wireframe: true,
    transparent: true,
    opacity: 0.4
  });
  core = new THREE.Mesh(geometry, material);
  scene.add(core);

  // Particles
  const pointsGeometry = new THREE.BufferGeometry();
  const count = 500;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
  }
  pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const pointsMaterial = new THREE.PointsMaterial({
    size: 0.05,
    color: globalConfig.appDark ? 0x818cf8 : 0x6366f1,
    transparent: true,
    opacity: 0.6
  });
  particles = new THREE.Points(pointsGeometry, pointsMaterial);
  scene.add(particles);

  const animate = () => {
    animationId = requestAnimationFrame(animate);

    // Speed dependent on CPU usage
    const speed = 0.005 + (cpuUsage.value / 100) * 0.05;
    core.rotation.y += speed;
    core.rotation.x += speed * 0.5;

    particles.rotation.y -= speed * 0.2;
    
    // Pulse scale based on memory usage
    const pulse = 1 + Math.sin(Date.now() * 0.002) * (memoryUsage.value / 500);
    core.scale.set(pulse, pulse, pulse);

    renderer.render(scene, camera);
  };

  animate();
};

const handleResize = () => {
  if (!containerRef.value || !camera || !renderer) return;
  const width = containerRef.value.clientWidth;
  const height = containerRef.value.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
};

// 监听暗黑模式切换
watch(() => globalConfig.appDark, (isDark) => {
  if (core && core.material instanceof THREE.MeshBasicMaterial) {
    core.material.color.set(isDark ? 0x6366f1 : 0x4f46e5);
  }
  if (particles && particles.material instanceof THREE.PointsMaterial) {
    particles.material.color.set(isDark ? 0x818cf8 : 0x6366f1);
  }
});

// 计算属性
const uptime = computed(() => `Active: 18d 4h`);

const statusColorClass = computed(() => {
  if (cpuUsage.value > 80 || memoryUsage.value > 80) return 'bg-red-500';
  if (cpuUsage.value > 60 || memoryUsage.value > 60) return 'bg-yellow-500';
  return 'bg-emerald-500';
});

// 模拟数据更新
const updateStats = () => {
  cpuUsage.value = Math.min(100, Math.max(10, Math.floor(cpuUsage.value + (Math.random() - 0.5) * 15)));
  memoryUsage.value = Math.min(100, Math.max(20, Math.floor(memoryUsage.value + (Math.random() - 0.5) * 5)));
  onlineUsers.value = Math.max(50, onlineUsers.value + Math.floor((Math.random() - 0.5) * 3));
};

onMounted(() => {
  initThree();
  timer.value = setInterval(updateStats, 2000);
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  clearInterval(timer.value);
  cancelAnimationFrame(animationId);
  window.removeEventListener('resize', handleResize);
  if (renderer) {
    renderer.dispose();
    renderer.forceContextLoss();
  }
});
</script>

<style scoped lang="scss">
.info-container {
  /* Simple transition for bg and border */
  transition: background-color 0.3s ease, border-color 0.3s ease;
}
</style>
