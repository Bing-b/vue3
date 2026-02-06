<template>
  <div class="relative h-full w-full overflow-hidden bg-slate-50 dark:bg-[#0b0e14]">
    <!-- Scene Container -->
    <div ref="containerRef" class="h-full w-full"></div>

    <!-- Floating Toolbar -->
    <div class="absolute left-6 top-6 z-10">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <h2 class="text-xl font-black tracking-tight text-slate-800 dark:text-white">ThreeJS Lab</h2>
          <p class="text-xs font-medium text-slate-500 dark:text-slate-400">Experimental 3D Workspace</p>
        </div>

        <div class="flex flex-col gap-2 rounded-2xl border border-white/40 bg-white/60 p-2 shadow-xl backdrop-blur-md dark:border-white/5 dark:bg-white/5">
          <div class="flex items-center gap-2 p-1">
            <el-button @click="toggleRotation" :type="isRotating ? 'primary' : 'info'" circle size="small">
              <el-icon><RefreshRight /></el-icon>
            </el-button>
            <span class="text-xs font-bold text-slate-600 dark:text-slate-300">Rotation</span>
          </div>
          
          <div class="h-px bg-slate-200 dark:bg-white/10"></div>
          
          <div class="flex flex-col gap-1">
            <el-button @click="creatMoreBox" type="primary" size="small" round plain>
              Array Cubes
            </el-button>
            <el-button @click="fullScreen" size="small" round plain>
              Enter Fullscreen
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats / Coordinates Display (Optional) -->
    <div class="absolute bottom-6 right-6 z-10 hidden sm:block">
      <div class="rounded-xl border border-white/20 bg-black/5 p-4 py-2 text-[10px] font-mono font-medium text-slate-500 backdrop-blur-sm dark:bg-white/5 dark:text-slate-400">
        RENDERER: WebGL 2.0 | SCENE: Active
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
import { RefreshRight } from '@element-plus/icons-vue';

// --- State ---
const containerRef = ref<HTMLElement | null>(null);
const isRotating = ref(false);
let animationId: number;
let resizeObserver: ResizeObserver;

// Three.js Objects
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let controls: OrbitControls;
let mesh: THREE.Mesh;
let gridHelper: THREE.GridHelper;
let axesHelper: THREE.AxesHelper;

// --- Initialization ---
const initScene = () => {
  if (!containerRef.value) return;

  const width = containerRef.value.clientWidth;
  const height = containerRef.value.clientHeight;

  // Scene
  scene = new THREE.Scene();
  const isDark = document.documentElement.classList.contains('dark');
  scene.background = new THREE.Color(isDark ? 0x0b0e14 : 0xf8fafc);

  // Camera
  camera = new THREE.PerspectiveCamera(45, width / height, 1, 5000);
  camera.position.set(400, 300, 400);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  containerRef.value.appendChild(renderer.domElement);

  // Helpers
  gridHelper = new THREE.GridHelper(1000, 20, isDark ? 0x333333 : 0xcccccc, isDark ? 0x222222 : 0xeeeeee);
  scene.add(gridHelper);
  
  axesHelper = new THREE.AxesHelper(200);
  scene.add(axesHelper);

  // Core Mesh
  const geometry = new THREE.BoxGeometry(100, 100, 100);
  const material = new THREE.MeshPhongMaterial({
    color: 0x409eff,
    transparent: true,
    opacity: 0.8,
    shininess: 100
  });
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.y = 50;
  scene.add(mesh);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directLight = new THREE.DirectionalLight(0xffffff, 1);
  directLight.position.set(200, 400, 200);
  scene.add(directLight);

  // Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  animate();
};

const animate = () => {
  animationId = requestAnimationFrame(animate);
  
  if (isRotating.value && mesh) {
    mesh.rotation.y += 0.01;
    mesh.rotation.x += 0.005;
  }
  
  controls.update();
  renderer.render(scene, camera);
};

// --- Actions ---
const toggleRotation = () => {
  isRotating.value = !isRotating.value;
};

const creatMoreBox = () => {
  // Clear previous group if exists or just add to scene
  const group = new THREE.Group();
  const geometry = new THREE.BoxGeometry(40, 40, 40);
  
  for (let i = -2; i <= 2; i++) {
    for (let j = -2; j <= 2; j++) {
      if (i === 0 && j === 0) continue; // Skip center
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color(`hsl(${Math.random() * 360}, 70%, 60%)`),
        transparent: true,
        opacity: 0.6
      });
      const m = new THREE.Mesh(geometry, material);
      m.position.set(i * 100, 20, j * 100);
      group.add(m);
    }
  }
  scene.add(group);
};

const fullScreen = () => {
  if (!document.fullscreenElement) {
    containerRef.value?.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};

// --- Lifecycle ---
onMounted(() => {
  initScene();

  // Watch for theme changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        const isDark = document.documentElement.classList.contains('dark');
        scene.background = new THREE.Color(isDark ? 0x0b0e14 : 0xf8fafc);
        if (gridHelper) {
          scene.remove(gridHelper);
          gridHelper = new THREE.GridHelper(1000, 20, isDark ? 0x333333 : 0xcccccc, isDark ? 0x222222 : 0xeeeeee);
          scene.add(gridHelper);
        }
      }
    });
  });
  observer.observe(document.documentElement, { attributes: true });

  // Handle Resize
  resizeObserver = new ResizeObserver(() => {
    if (containerRef.value && renderer && camera) {
      const w = containerRef.value.clientWidth;
      const h = containerRef.value.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
  });
  resizeObserver.observe(containerRef.value!);
});

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId);
  if (resizeObserver) resizeObserver.disconnect();
  if (renderer) {
    renderer.dispose();
    renderer.forceContextLoss();
  }
});
</script>

<style scoped>
:deep(.el-button--primary.is-plain) {
  --el-button-bg-color: transparent;
}
</style>
