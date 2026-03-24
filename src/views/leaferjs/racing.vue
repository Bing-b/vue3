<template>
  <div
    class="racing-game-container flex flex-col items-center justify-center gap-6 lg:flex-row lg:items-start">
    <!-- Game View -->
    <div
      class="relative rounded-[2rem] border-8 border-slate-200 bg-[#333] p-1 shadow-2xl dark:border-white/10">
      <div id="racing-view" class="canvas-area overflow-hidden rounded-2xl"></div>

      <!-- Start/GameOver Overlay -->
      <div
        v-if="gameState !== 'playing'"
        class="absolute inset-x-2 inset-y-2 z-10 flex flex-col items-center justify-center rounded-2xl bg-black/60 backdrop-blur-md">
        <div v-if="gameState === 'ready'" class="text-center">
          <h2 class="mb-2 text-4xl font-black tracking-tighter text-white italic">LEAFER RACER</h2>
          <p class="mb-6 text-xs font-bold tracking-widest text-blue-400 uppercase"
            >High Octane Action</p
          >
          <el-button type="primary" size="large" round class="scale-110 px-10" @click="startGame"
            >START RACE</el-button
          >
        </div>

        <div v-if="gameState === 'gameOver'" class="text-center">
          <h2 class="mb-1 text-5xl font-black tracking-tighter text-red-500 italic">CRASHED!</h2>
          <p class="mb-6 text-lg font-bold text-white uppercase">Final Score: {{ score }}</p>
          <el-button type="danger" size="large" round class="scale-110 px-10" @click="startGame"
            >RETRY</el-button
          >
        </div>
      </div>

      <!-- Pause Overlay -->
      <div
        v-if="isPaused"
        class="absolute inset-x-2 inset-y-2 z-10 flex flex-col items-center justify-center rounded-2xl bg-black/30 backdrop-blur-sm">
        <h2 class="mb-4 text-3xl font-black tracking-widest text-white">PAUSED</h2>
        <el-button
          type="primary"
          circle
          size="large"
          @click="togglePause"
          icon="VideoPlay"></el-button>
      </div>
    </div>

    <!-- Panel -->
    <div class="flex w-64 flex-col gap-6">
      <div
        class="rounded-3xl border border-white bg-white/80 p-6 shadow-sm backdrop-blur-md dark:border-white/5 dark:bg-white/5">
        <h3 class="mb-4 text-xs font-black tracking-widest text-slate-400 uppercase">Race Stats</h3>
        <div class="flex flex-col gap-4">
          <div class="flex flex-col">
            <span class="text-[10px] font-bold text-slate-400">DISTANCE</span>
            <span class="text-4xl font-black text-blue-600 tabular-nums dark:text-blue-400"
              >{{ score }}m</span
            >
          </div>
          <div class="flex flex-col">
            <span class="text-[10px] font-bold text-slate-400">FUEL RESERVE</span>
            <el-progress
              :percentage="fuel"
              :show-text="false"
              stroke-width="8"
              :color="fuelColor"
              class="mt-1" />
          </div>
          <div class="mt-2 flex items-center gap-2">
            <div class="h-2 w-2 rounded-full" :class="statusColor"></div>
            <span class="text-xs font-bold text-slate-500 uppercase">{{
              gameState === 'playing' ? (isPaused ? 'Paused' : 'Racing') : 'Stopped'
            }}</span>
          </div>
          <el-button
            v-if="gameState === 'playing'"
            @click="togglePause"
            :type="isPaused ? 'success' : 'warning'"
            size="small"
            round
            plain
            block>
            {{ isPaused ? 'Resume' : 'Pause' }}
          </el-button>
        </div>
      </div>

      <div
        class="rounded-3xl border border-white bg-white/80 p-6 shadow-sm backdrop-blur-md dark:border-white/5 dark:bg-white/5">
        <h3 class="mb-4 text-xs font-black tracking-widest text-slate-400 uppercase"
          >How to Drive</h3
        >
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-3">
            <kbd
              class="flex h-7 w-12 items-center justify-center rounded-lg bg-slate-100 font-bold text-slate-800 dark:bg-white/10 dark:text-white"
              >← →</kbd
            >
            <span class="text-[10px] font-medium text-slate-500">STEER CAR</span>
          </div>
          <div class="flex items-center gap-3">
            <kbd
              class="flex h-7 w-12 items-center justify-center rounded-lg bg-slate-100 font-bold text-slate-800 dark:bg-white/10 dark:text-white"
              >SPACE</kbd
            >
            <span class="text-[10px] font-medium text-slate-500">PAUSE</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue';
import { Leafer, Rect, Group, PointerEvent } from 'leafer-ui';

// --- 常量 ---
const WIDTH = 360;
const HEIGHT = 600;
const CAR_WIDTH = 40;
const CAR_HEIGHT = 70;
const ROAD_SPEED = 8;
const ENEMY_SPAWN_RATE = 1000; // ms

// --- 状态 ---
const gameState = ref('ready'); // ready, playing, gameOver
const isPaused = ref(false);
const score = ref(0);
const fuel = ref(100);

let leafer = null;
let roadLayer = null;
let carLayer = null;
let uiLayer = null;

let player = null;
let enemies = [];
let dashedLines = [];

let animationFrame = null;
let lastSpawnTime = 0;
let keys = {};

const statusColor = computed(() => {
  if (gameState.value !== 'playing') return 'bg-slate-400';
  return isPaused.value ? 'bg-yellow-500' : 'bg-emerald-500';
});

const fuelColor = computed(() => {
  if (fuel.value > 60) return '#10b981';
  if (fuel.value > 30) return '#f59e0b';
  return '#ef4444';
});

// --- 初始化 ---
const initLeafer = () => {
  leafer = new Leafer({
    view: 'racing-view',
    width: WIDTH,
    height: HEIGHT,
    fill: '#222',
  });

  roadLayer = new Group();
  carLayer = new Group();
  uiLayer = new Group();

  leafer.add(roadLayer);
  leafer.add(carLayer);
  leafer.add(uiLayer);

  setupRoad();
};

const setupRoad = () => {
  // Road surface
  roadLayer.add(new Rect({ width: WIDTH - 80, height: HEIGHT, x: 40, fill: '#333' }));

  // Road borders
  roadLayer.add(new Rect({ width: 10, height: HEIGHT, x: 30, fill: '#ccc' }));
  roadLayer.add(new Rect({ width: 10, height: HEIGHT, x: WIDTH - 40, fill: '#ccc' }));

  // Grass
  roadLayer.add(new Rect({ width: 30, height: HEIGHT, x: 0, fill: '#1a5d1a' }));
  roadLayer.add(new Rect({ width: 30, height: HEIGHT, x: WIDTH - 30, fill: '#1a5d1a' }));

  // Dashed lines
  for (let i = -100; i < HEIGHT + 100; i += 100) {
    const line = new Rect({
      width: 6,
      height: 60,
      x: WIDTH / 2 - 3,
      y: i,
      fill: '#fff',
      opacity: 0.6,
    });
    dashedLines.push(line);
    roadLayer.add(line);
  }
};

const createCar = (x, y, color, isPlayer = false) => {
  const car = new Group({ x, y });

  // F1 dimensions are slightly different, but we'll stick to CAR_WIDTH/HEIGHT for collision
  const w = CAR_WIDTH;
  const h = CAR_HEIGHT;

  // 1. Wheels (Black)
  const wheelW = 10;
  const wheelH = 15;
  const wheelColor = '#111';
  // Front left
  car.add(
    new Rect({ x: -2, y: 10, width: wheelW, height: wheelH, fill: wheelColor, cornerRadius: 2 }),
  );
  // Front right
  car.add(
    new Rect({
      x: w - wheelW + 2,
      y: 10,
      width: wheelW,
      height: wheelH,
      fill: wheelColor,
      cornerRadius: 2,
    }),
  );
  // Rear left
  car.add(
    new Rect({
      x: -2,
      y: h - 25,
      width: wheelW,
      height: wheelH,
      fill: wheelColor,
      cornerRadius: 2,
    }),
  );
  // Rear right
  car.add(
    new Rect({
      x: w - wheelW + 2,
      y: h - 25,
      width: wheelW,
      height: wheelH,
      fill: wheelColor,
      cornerRadius: 2,
    }),
  );

  // 2. Front Wing
  car.add(new Rect({ x: 0, y: 0, width: w, height: 8, fill: color, cornerRadius: 1 }));

  // 3. Rear Wing
  car.add(new Rect({ x: 0, y: h - 10, width: w, height: 10, fill: color, cornerRadius: 1 }));

  // 4. Main Body (Narrower in the middle)
  // Nose
  car.add(
    new Rect({
      x: w / 2 - 6,
      y: 5,
      width: 12,
      height: 20,
      fill: color,
      cornerRadius: [0, 0, 4, 4],
    }),
  );
  // Center Chassis
  car.add(new Rect({ x: w / 2 - 12, y: 20, width: 24, height: 35, fill: color, cornerRadius: 4 }));

  // 5. Cockpit / Driver
  car.add(new Rect({ x: w / 2 - 7, y: 30, width: 14, height: 12, fill: '#222', cornerRadius: 6 })); // Cockpit
  car.add(
    new Rect({
      x: w / 2 - 4,
      y: 32,
      width: 8,
      height: 8,
      fill: isPlayer ? '#fff' : '#aaa',
      cornerRadius: 4,
    }),
  ); // Helmet

  // 6. Sidepods
  car.add(new Rect({ x: w / 2 - 18, y: 35, width: 6, height: 18, fill: color, cornerRadius: 2 }));
  car.add(new Rect({ x: w / 2 + 12, y: 35, width: 6, height: 18, fill: color, cornerRadius: 2 }));

  return car;
};

const startGame = () => {
  score.value = 0;
  fuel.value = 100;
  gameState.value = 'playing';
  isPaused.value = false;

  carLayer.clear();
  enemies = [];

  player = createCar(WIDTH / 2 - CAR_WIDTH / 2, HEIGHT - CAR_HEIGHT - 30, '#ef4444', true);
  carLayer.add(player);

  lastSpawnTime = Date.now();
  requestAnimationFrame(gameLoop);
};

const spawnEnemy = () => {
  const lanes = [60, 160, 260];
  const x = lanes[Math.floor(Math.random() * lanes.length)] - CAR_WIDTH / 2;
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
  const color = colors[Math.floor(Math.random() * colors.length)];

  const enemy = {
    car: createCar(x, -CAR_HEIGHT, color),
    speed: 3 + Math.random() * 4,
  };

  enemies.push(enemy);
  carLayer.add(enemy.car);
};

// --- 循环 ---
const gameLoop = () => {
  if (gameState.value !== 'playing' || isPaused.value) return;

  // Road Scrolling
  dashedLines.forEach((line) => {
    line.y += ROAD_SPEED;
    if (line.y > HEIGHT) line.y = -100;
  });

  // Player movement
  if (keys['ArrowLeft'] && player.x > 45) player.x -= 5;
  if (keys['ArrowRight'] && player.x < WIDTH - 45 - CAR_WIDTH) player.x += 5;

  // Enemies update
  const now = Date.now();
  if (now - lastSpawnTime > ENEMY_SPAWN_RATE) {
    spawnEnemy();
    lastSpawnTime = now;
  }

  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];
    enemy.car.y += enemy.speed;

    // Collision Check
    if (checkCollision(player, enemy.car)) {
      gameOver();
      return;
    }

    // Pass
    if (enemy.car.y > HEIGHT) {
      enemies.splice(i, 1);
      enemy.car.destroy();
      score.value += 10;
    }
  }

  // Fuel & Progress
  fuel.value -= 0.02;
  score.value += 1;
  if (fuel.value <= 0) gameOver();

  animationFrame = requestAnimationFrame(gameLoop);
};

const checkCollision = (a, b) => {
  return (
    a.x < b.x + CAR_WIDTH &&
    a.x + CAR_WIDTH > b.x &&
    a.y < b.y + CAR_HEIGHT &&
    a.y + CAR_HEIGHT > b.y
  );
};

const gameOver = () => {
  gameState.value = 'gameOver';
  cancelAnimationFrame(animationFrame);
};

const togglePause = () => {
  isPaused.value = !isPaused.value;
  if (!isPaused.value) requestAnimationFrame(gameLoop);
};

const handleKeydown = (e) => {
  keys[e.code] = true;
  if (e.code === 'Space') {
    e.preventDefault();
    togglePause();
  }
};

const handleKeyup = (e) => {
  keys[e.code] = false;
};

// --- 生命周期 ---
onMounted(() => {
  initLeafer();
  window.addEventListener('keydown', handleKeydown);
  window.addEventListener('keyup', handleKeyup);
});

onUnmounted(() => {
  cancelAnimationFrame(animationFrame);
  if (leafer) leafer.destroy();
  window.removeEventListener('keydown', handleKeydown);
  window.removeEventListener('keyup', handleKeyup);
});
</script>

<style scoped>
.canvas-area {
  width: 360px;
  height: 600px;
}
kbd {
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.1);
}
</style>
