<template>
  <div class="info-widget flex h-full w-full flex-col p-1">
    <!-- Header -->
    <div class="z-10 mb-2 flex items-center justify-between px-4 pt-4">
      <div class="flex items-center gap-2.5">
        <div
          class="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#5856d6]/10 text-[#5856d6]">
          <el-icon :size="18"><Compass /></el-icon>
        </div>
        <div>
          <span class="text-[8px] font-bold tracking-wider text-[#86868b] uppercase"
            >Neural Core</span
          >
          <h3 class="mt-0 text-[11px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]"
            >Computational Flux</h3
          >
        </div>
      </div>
      <div class="flex items-center gap-1.5 rounded-full bg-black/5 px-2.5 py-0.5 dark:bg-white/5">
        <span class="relative flex h-1.5 w-1.5">
          <span
            class="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
            :class="statusColorClass"></span>
          <span
            class="relative inline-flex h-1.5 w-1.5 rounded-full"
            :class="statusColorClass"></span>
        </span>
        <span class="font-mono text-[9px] font-bold text-[#86868b] uppercase">{{ uptime }}</span>
      </div>
    </div>

    <!-- Three.js Canvas Container -->
    <div
      ref="containerRef"
      class="relative mx-4 mb-4 w-[97%] flex-1 overflow-hidden rounded-[16px] bg-black/5 dark:bg-white/5">
      <!-- Overlay Stats -->
      <div class="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-3">
        <div class="flex items-start justify-between">
          <div class="flex flex-col">
            <span class="text-[8px] font-bold tracking-widest text-[#5856d6]/60 uppercase"
              >Load</span
            >
            <span class="text-xs font-bold text-[#1d1d1f] dark:text-[#f5f5f7]"
              >{{ cpuUsage }}%</span
            >
          </div>
          <div class="flex flex-col items-end">
            <span class="text-[8px] font-bold tracking-widest text-[#af52de]/60 uppercase"
              >Buffer</span
            >
            <span class="text-xs font-bold text-[#1d1d1f] dark:text-[#f5f5f7]"
              >{{ memoryUsage }}%</span
            >
          </div>
        </div>
        <div class="flex justify-center pb-1">
          <div class="flex gap-4">
            <div class="flex flex-col items-center">
              <span class="text-[7px] font-bold text-[#86868b] uppercase">Lat</span>
              <span class="text-[10px] font-bold text-[#34c759]">12ms</span>
            </div>
            <div class="flex flex-col items-center">
              <span class="text-[7px] font-bold text-[#86868b] uppercase">Agnt</span>
              <span class="text-[10px] font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">{{
                onlineUsers
              }}</span>
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
let scene: any;
let camera: any;
let renderer: any;
let core: any;
let particles: any;
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
    opacity: 0.4,
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
    opacity: 0.6,
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
watch(
  () => globalConfig.appDark,
  (isDark) => {
    if (core && core.material instanceof THREE.MeshBasicMaterial) {
      core.material.color.set(isDark ? 0x6366f1 : 0x4f46e5);
    }
    if (particles && particles.material instanceof THREE.PointsMaterial) {
      particles.material.color.set(isDark ? 0x818cf8 : 0x6366f1);
    }
  },
);

// 计算属性
const uptime = computed(() => `Active: 18d 4h`);

const statusColorClass = computed(() => {
  if (cpuUsage.value > 80 || memoryUsage.value > 80) return 'bg-red-500';
  if (cpuUsage.value > 60 || memoryUsage.value > 60) return 'bg-yellow-500';
  return 'bg-emerald-500';
});

// 模拟数据更新
const updateStats = () => {
  cpuUsage.value = Math.min(
    100,
    Math.max(10, Math.floor(cpuUsage.value + (Math.random() - 0.5) * 15)),
  );
  memoryUsage.value = Math.min(
    100,
    Math.max(20, Math.floor(memoryUsage.value + (Math.random() - 0.5) * 5)),
  );
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
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease;
}
</style>
