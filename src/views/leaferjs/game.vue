<template>
  <div class="tetris-container">
    <div class="game-info">
      <h1>Leafer Tetris</h1>
      <div class="score-board">
        <p>得分: {{ score }}</p>
        <p>状态: {{ isGameOver ? '游戏结束' : isPaused ? '暂停' : '进行中' }}</p>
      </div>
      <div class="controls">
        <button @click="startGame" v-if="isGameOver">开始游戏</button>
        <button @click="togglePause" v-else>{{ isPaused ? '继续' : '暂停' }}</button>
      </div>
      <div class="tips">
        <p>↑: 旋转 | ↓: 加速</p>
        <p>← →: 移动 | Space: 暂停</p>
      </div>
    </div>
    <!-- Leafer 将挂载在这个 div 上 -->
    <div id="leafer-view" class="canvas-area"></div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { Leafer, Rect, Group } from 'leafer-ui'; // 1. 引入 Leafer

// --- 配置常量 ---
const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;
const TICK_RATE = 500;

// --- 方块形状定义 (保持不变) ---
const SHAPES = [
  [[1, 1, 1, 1]],
  [
    [1, 1],
    [1, 1],
  ],
  [
    [0, 1, 0],
    [1, 1, 1],
  ],
  [
    [1, 0, 0],
    [1, 1, 1],
  ],
  [
    [0, 0, 1],
    [1, 1, 1],
  ],
  [
    [0, 1, 1],
    [1, 1, 0],
  ],
  [
    [1, 1, 0],
    [0, 1, 1],
  ],
];

const COLORS = [null, '#00FFFF', '#FFFF00', '#800080', '#FFA500', '#0000FF', '#00FF00', '#FF0000'];

// --- 状态变量 ---
const score = ref(0);
const isGameOver = ref(true);
const isPaused = ref(false);

let leaferApp = null;
let gameLayer = null;
let boardData = [];
let activePiece = null;
let gameInterval = null;

// --- 初始化 (核心修改点) ---
const initLeafer = () => {
  // 2. 实例化 Leafer
  leaferApp = new Leafer({
    view: 'leafer-view',
    width: COLS * BLOCK_SIZE,
    height: ROWS * BLOCK_SIZE,
    fill: '#1a1a1a',
  });

  gameLayer = new Group();

  // 3. 直接添加到 leaferApp
  leaferApp.add(gameLayer);

  drawGrid();
};

const drawGrid = () => {
  const gridGroup = new Group({ opacity: 0.1 });
  for (let i = 0; i <= COLS; i++) {
    gridGroup.add(
      new Rect({ x: i * BLOCK_SIZE, y: 0, width: 1, height: ROWS * BLOCK_SIZE, fill: '#fff' }),
    );
  }
  for (let j = 0; j <= ROWS; j++) {
    gridGroup.add(
      new Rect({ x: 0, y: j * BLOCK_SIZE, width: COLS * BLOCK_SIZE, height: 1, fill: '#fff' }),
    );
  }
  // 4. 直接添加到 leaferApp
  leaferApp.add(gridGroup);
};

// --- 游戏逻辑 (保持不变) ---
const initBoardData = () => {
  boardData = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
};

const spawnPiece = () => {
  const typeIdx = Math.floor(Math.random() * SHAPES.length);
  const shape = SHAPES[typeIdx];
  activePiece = {
    shape: shape,
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

const rotateShape = (shape) => {
  return shape[0].map((_, index) => shape.map((row) => row[index]).reverse());
};

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
  gameLayer.clear(); // Leafer 的 Group 支持 clear()

  // 绘制棋盘
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (boardData[r][c]) {
        gameLayer.add(
          new Rect({
            x: c * BLOCK_SIZE,
            y: r * BLOCK_SIZE,
            width: BLOCK_SIZE - 1,
            height: BLOCK_SIZE - 1,
            fill: COLORS[boardData[r][c]],
            cornerRadius: 2,
          }),
        );
      }
    }
  }

  // 绘制当前方块
  if (activePiece) {
    activePiece.shape.forEach((row, r) => {
      row.forEach((val, c) => {
        if (val) {
          gameLayer.add(
            new Rect({
              x: (activePiece.x + c) * BLOCK_SIZE,
              y: (activePiece.y + r) * BLOCK_SIZE,
              width: BLOCK_SIZE - 1,
              height: BLOCK_SIZE - 1,
              fill: COLORS[activePiece.colorIndex],
              cornerRadius: 2,
              shadow: { x: 2, y: 2, blur: 4, color: 'rgba(0,0,0,0.3)' },
            }),
          );
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

// --- 控制与生命周期 ---
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
  alert(`游戏结束! 得分: ${score.value}`);
};

const handleKeydown = (e) => {
  if (isGameOver.value) return;
  switch (e.code) {
    case 'ArrowLeft':
      move(-1, 0);
      break;
    case 'ArrowRight':
      move(1, 0);
      break;
    case 'ArrowDown':
      move(0, 1);
      break;
    case 'ArrowUp':
      rotate();
      break;
    case 'Space':
      togglePause();
      break;
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
.tetris-container {
  display: flex;
  gap: 20px;
  justify-content: center;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  background-color: #2c3e50;
  min-height: 100vh;
  color: white;
}

.game-info {
  display: flex;
  flex-direction: column;
  width: 200px;
}

.canvas-area {
  width: 300px; /* 10 cols * 30px */
  height: 600px; /* 20 rows * 30px */
  border: 4px solid #444;
  background-color: #000;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}

button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 10px;
}

button:hover {
  background-color: #3aa876;
}

.score-board {
  background: rgba(255, 255, 255, 0.1);
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.tips {
  font-size: 12px;
  color: #aaa;
  margin-top: auto;
}
</style>
