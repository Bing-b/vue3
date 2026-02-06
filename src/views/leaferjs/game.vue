<template>
  <div class="flex flex-col items-center justify-center gap-8 lg:flex-row lg:items-start transition-colors duration-300">
    <!-- Game View -->
    <div class="relative rounded-3xl border-8 border-slate-200 bg-black p-1 shadow-2xl dark:border-white/10">
      <div id="leafer-view" class="canvas-area overflow-hidden rounded-2xl"></div>
      
      <!-- Overlay for Game Over -->
      <div v-if="isGameOver" class="absolute inset-x-2 inset-y-2 z-10 flex flex-col items-center justify-center rounded-2xl bg-black/80 backdrop-blur-sm">
        <h2 class="mb-4 text-4xl font-black text-white italic tracking-widest">GAME OVER</h2>
        <el-button type="primary" size="large" round class="px-8 scale-110" @click="startGame">RESTART</el-button>
      </div>

      <!-- Overlay for Pause -->
      <div v-if="!isGameOver && isPaused" class="absolute inset-x-2 inset-y-2 z-10 flex flex-col items-center justify-center rounded-2xl bg-black/40 backdrop-blur-sm">
        <h2 class="mb-4 text-3xl font-black text-white tracking-widest">PAUSED</h2>
        <el-button type="primary" circle size="large" icon="VideoPlay" @click="togglePause"></el-button>
      </div>
    </div>

    <!-- Info Panel -->
    <div class="flex w-64 flex-col gap-6">
      <div class="rounded-3xl border border-white bg-white/80 p-6 shadow-sm dark:border-white/5 dark:bg-white/5 backdrop-blur-md">
        <h3 class="mb-4 text-xs font-black uppercase tracking-widest text-slate-400">Score Control</h3>
        
        <div class="flex flex-col gap-4">
          <div class="flex flex-col">
            <span class="text-[10px] font-bold text-slate-400">CURRENT SCORE</span>
            <span class="text-4xl font-black text-slate-800 dark:text-white tabular-nums">{{ score }}</span>
          </div>

          <div class="flex items-center gap-2">
            <div class="h-2 w-2 rounded-full" :class="isGameOver ? 'bg-red-500' : isPaused ? 'bg-yellow-500' : 'bg-emerald-500'"></div>
            <span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
              {{ isGameOver ? 'Stopped' : isPaused ? 'Paused' : 'Playing' }}
            </span>
          </div>

          <el-button v-if="!isGameOver" @click="togglePause" :type="isPaused ? 'success' : 'warning'" size="small" round plain block>
            {{ isPaused ? 'Resume' : 'Pause' }}
          </el-button>
        </div>
      </div>

      <div class="rounded-3xl border border-white bg-white/80 p-6 shadow-sm dark:border-white/5 dark:bg-white/5 backdrop-blur-md">
        <h3 class="mb-4 text-xs font-black uppercase tracking-widest text-slate-400">How to Play</h3>
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col">
            <kbd class="mb-1 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-800 dark:bg-white/10 dark:text-white font-bold">↑</kbd>
            <span class="text-[10px] font-medium text-slate-500">ROTATE</span>
          </div>
          <div class="flex flex-col">
            <kbd class="mb-1 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-800 dark:bg-white/10 dark:text-white font-bold">↓</kbd>
            <span class="text-[10px] font-medium text-slate-500">SPEED</span>
          </div>
          <div class="flex flex-col">
            <kbd class="mb-1 inline-flex h-8 w-16 items-center justify-center rounded-lg bg-slate-100 text-slate-800 dark:bg-white/10 dark:text-white font-bold">← →</kbd>
            <span class="text-[10px] font-medium text-slate-500">MOVE</span>
          </div>
          <div class="flex flex-col">
            <kbd class="mb-1 inline-flex h-8 w-16 items-center justify-center rounded-lg bg-slate-100 text-slate-800 dark:bg-white/10 dark:text-white font-bold">SP</kbd>
            <span class="text-[10px] font-medium text-slate-500">PAUSE</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { Leafer, Rect, Group } from 'leafer-ui';
import { VideoPlay } from '@element-plus/icons-vue';

// --- 配置常量 ---
const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;
const TICK_RATE = 500;

const SHAPES = [
  [[1, 1, 1, 1]],
  [[1, 1], [1, 1]],
  [[0, 1, 0], [1, 1, 1]],
  [[1, 0, 0], [1, 1, 1]],
  [[0, 0, 1], [1, 1, 1]],
  [[0, 1, 1], [1, 1, 0]],
  [[1, 1, 0], [0, 1, 1]],
];

const COLORS = [null, '#00d2ff', '#f5af19', '#9d50bb', '#ff4b1f', '#2575fc', '#84fab0', '#ff0000'];

// --- 状态变量 ---
const score = ref(0);
const isGameOver = ref(true);
const isPaused = ref(false);

let leaferApp = null;
let gameLayer = null;
let boardData = [];
let activePiece = null;
let gameInterval = null;

// --- 初始化 ---
const initLeafer = () => {
  leaferApp = new Leafer({
    view: 'leafer-view',
    width: COLS * BLOCK_SIZE,
    height: ROWS * BLOCK_SIZE,
    fill: '#000',
  });

  gameLayer = new Group();
  leaferApp.add(gameLayer);

  drawGrid();
};

const drawGrid = () => {
  const gridGroup = new Group({ opacity: 0.1 });
  for (let i = 0; i <= COLS; i++) {
    gridGroup.add(new Rect({ x: i * BLOCK_SIZE, y: 0, width: 1, height: ROWS * BLOCK_SIZE, fill: '#fff' }));
  }
  for (let j = 0; j <= ROWS; j++) {
    gridGroup.add(new Rect({ x: 0, y: j * BLOCK_SIZE, width: COLS * BLOCK_SIZE, height: 1, fill: '#fff' }));
  }
  leaferApp.add(gridGroup);
};

// --- 游戏逻辑 ---
const initBoardData = () => {
  boardData = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
};

const spawnPiece = () => {
  const typeIdx = Math.floor(Math.random() * SHAPES.length);
  const shape = SHAPES[typeIdx];
  activePiece = {
    shape,
    colorIndex: typeIdx + 1,
    x: Math.floor(COLS / 2) - Math.floor(shape[0].length / 2),
    y: 0,
  };
  if (checkCollision(0, 0, activePiece.shape)) gameOver();
};

const checkCollision = (offsetX, offsetY, shape) => {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) {
        const newX = activePiece.x + c + offsetX;
        const newY = activePiece.y + r + offsetY;
        if (newX < 0 || newX >= COLS || newY >= ROWS) return true;
        if (newY >= 0 && boardData[newY][newX] !== 0) return true;
      }
    }
  }
  return false;
};

const rotateShape = (shape) => shape[0].map((_, index) => shape.map((row) => row[index]).reverse());

const lockPiece = () => {
  activePiece.shape.forEach((row, r) => {
    row.forEach((val, c) => {
      if (val) {
        const boardY = activePiece.y + r;
        const boardX = activePiece.x + c;
        if (boardY >= 0) boardData[boardY][boardX] = activePiece.colorIndex;
      }
    });
  });
  clearLines();
  spawnPiece();
  render();
};

const clearLines = () => {
  let linesCleared = 0;
  for (let r = ROWS - 1; r >= 0; r--) {
    if (boardData[r].every((cell) => cell !== 0)) {
      boardData.splice(r, 1);
      boardData.unshift(Array(COLS).fill(0));
      linesCleared++;
      r++;
    }
  }
  if (linesCleared > 0) score.value += linesCleared * 100;
};

const render = () => {
  if (!gameLayer) return;
  gameLayer.clear();

  // 绘制棋盘
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (boardData[r][c]) {
        gameLayer.add(new Rect({
          x: c * BLOCK_SIZE,
          y: r * BLOCK_SIZE,
          width: BLOCK_SIZE - 1,
          height: BLOCK_SIZE - 1,
          fill: COLORS[boardData[r][c]],
          cornerRadius: 4,
        }));
      }
    }
  }

  // 绘制当前方块
  if (activePiece) {
    activePiece.shape.forEach((row, r) => {
      row.forEach((val, c) => {
        if (val) {
          gameLayer.add(new Rect({
            x: (activePiece.x + c) * BLOCK_SIZE,
            y: (activePiece.y + r) * BLOCK_SIZE,
            width: BLOCK_SIZE - 1,
            height: BLOCK_SIZE - 1,
            fill: COLORS[activePiece.colorIndex],
            cornerRadius: 4,
            shadow: { x: 0, y: 0, blur: 10, color: COLORS[activePiece.colorIndex] },
          }));
        }
      });
    });
  }
};

const move = (dirX, dirY) => {
  if (isGameOver.value || isPaused.value) return;
  if (!checkCollision(dirX, dirY, activePiece.shape)) {
    activePiece.x += dirX;
    activePiece.y += dirY;
    render();
  } else if (dirY > 0) {
    lockPiece();
  }
};

const rotate = () => {
  if (isGameOver.value || isPaused.value) return;
  const rotated = rotateShape(activePiece.shape);
  if (!checkCollision(0, 0, rotated)) {
    activePiece.shape = rotated;
  } else if (!checkCollision(-1, 0, rotated)) {
    activePiece.x -= 1;
    activePiece.shape = rotated;
  } else if (!checkCollision(1, 0, rotated)) {
    activePiece.x += 1;
    activePiece.shape = rotated;
  }
  render();
};

const startGame = () => {
  initBoardData();
  score.value = 0;
  isGameOver.value = false;
  isPaused.value = false;
  spawnPiece();
  render();
  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(() => move(0, 1), TICK_RATE);
};

const togglePause = () => {
  if (isGameOver.value) return;
  isPaused.value = !isPaused.value;
  if (isPaused.value) clearInterval(gameInterval);
  else gameInterval = setInterval(() => move(0, 1), TICK_RATE);
};

const gameOver = () => {
  isGameOver.value = true;
  clearInterval(gameInterval);
};

const handleKeydown = (e) => {
  if (isGameOver.value) return;
  switch (e.code) {
    case 'ArrowLeft': move(-1, 0); break;
    case 'ArrowRight': move(1, 0); break;
    case 'ArrowDown': move(0, 1); break;
    case 'ArrowUp': rotate(); break;
    case 'Space': togglePause(); break;
  }
};

onMounted(() => {
  initLeafer();
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  if (leaferApp) leaferApp.destroy();
  if (gameInterval) clearInterval(gameInterval);
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.canvas-area {
  width: 300px;
  height: 600px;
  background-color: #000;
  box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.8);
}

kbd {
  box-shadow: 0 4px 0 rgba(0,0,0,0.1);
}
</style>
