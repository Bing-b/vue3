<template>
  <div class="tetris-root" ref="root">
    <div class="game-area" ref="gameArea"></div>

    <div class="info">
      <div>Score: {{ score }}</div>
      <div>Level: {{ level }}</div>
      <div>Lines: {{ lines }}</div>

      <div class="controls">
        <button @click="start">Start</button>
        <button @click="pause">Pause</button>
        <button @click="resetGame">Reset</button>
      </div>

      <div class="next">
        <h4>Next</h4>
        <div ref="nextArea" style="width: 96px; height: 96px"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
// 从 leafer-ui 导入（官网示例即用这个包）
import { Leafer, Rect, Group } from 'leafer-ui';

/* ====== CONFIG ====== */
const COLS = 10;
const ROWS = 20;
const CELL = 24;

const gameArea = ref(null);
const nextArea = ref(null);
const score = ref(0);
const level = ref(1);
const lines = ref(0);

let leafer = null;
let nextLeafer = null;
let gridGroup = null;
let pieceGroup = null;
let nextGroup = null;

let board = [];
let current = null;
let next = null;
let rafId = null;
let last = performance.now();
let dropInterval = 800;
let running = false;

const shapes = [
  [[1, 1, 1, 1]], // I
  [
    [1, 1],
    [1, 1],
  ], // O
  [
    [0, 1, 0],
    [1, 1, 1],
  ], // T
  [
    [0, 1, 1],
    [1, 1, 0],
  ], // S
  [
    [1, 1, 0],
    [0, 1, 1],
  ], // Z
  [
    [1, 0, 0],
    [1, 1, 1],
  ], // J
  [
    [0, 0, 1],
    [1, 1, 1],
  ], // L
];
const colors = ['#00d2ff', '#ffd300', '#a345ff', '#00ff88', '#ff6b6b', '#3b82f6', '#f97316'];

/* ====== game logic helpers ====== */
function makeEmptyBoard() {
  board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

function randPiece() {
  const i = Math.floor(Math.random() * shapes.length);
  return {
    shape: shapes[i].map((r) => r.slice()),
    color: colors[i],
    x: Math.floor((COLS - shapes[i][0].length) / 2),
    y: 0,
  };
}

function rotate(matrix) {
  const H = matrix.length;
  const W = matrix[0].length;
  const res = Array.from({ length: W }, () => Array(H).fill(0));
  for (let r = 0; r < H; r++) for (let c = 0; c < W; c++) res[c][H - 1 - r] = matrix[r][c];
  return res;
}

function canMove(piece, dx = 0, dy = 0, shape = null) {
  const s = shape || piece.shape;
  for (let r = 0; r < s.length; r++) {
    for (let c = 0; c < s[0].length; c++) {
      if (!s[r][c]) continue;
      const x = piece.x + c + dx;
      const y = piece.y + r + dy;
      if (x < 0 || x >= COLS || y >= ROWS) return false;
      if (y >= 0 && board[y][x]) return false;
    }
  }
  return true;
}

function mergePiece() {
  const s = current.shape;
  for (let r = 0; r < s.length; r++) {
    for (let c = 0; c < s[0].length; c++) {
      if (!s[r][c]) continue;
      const x = current.x + c;
      const y = current.y + r;
      if (y >= 0) board[y][x] = current.color;
    }
  }
}

function clearLines() {
  let cleared = 0;
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r].every((v) => v)) {
      board.splice(r, 1);
      board.unshift(Array(COLS).fill(0));
      cleared++;
      r++;
    }
  }
  if (cleared) {
    lines.value += cleared;
    score.value += cleared * 100 * level.value;
    level.value = Math.floor(lines.value / 10) + 1;
    dropInterval = Math.max(100, 800 - (level.value - 1) * 60);
  }
}

function spawn() {
  current = next || randPiece();
  next = randPiece();
  if (!canMove(current, 0, 0)) {
    running = false;
  }
}

/* ====== visuals (使用 Leafer 的 Rect) ====== */
function updateGridVisual() {
  gridGroup.removeAll();
  // draw background grid + existing blocks
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const val = board[r][c];
      const bg = new Rect({
        x: c * CELL,
        y: r * CELL,
        width: CELL - 1,
        height: CELL - 1,
        fill: val ? val : '#00000000',
        stroke: '#00000022',
      });
      gridGroup.add(bg);
      if (val) {
        const b = new Rect({
          x: c * CELL,
          y: r * CELL,
          width: CELL - 1,
          height: CELL - 1,
          fill: val,
        });
        gridGroup.add(b);
      }
    }
  }
}

function updateCurrentVisual() {
  pieceGroup.removeAll();
  if (!current) return;
  const s = current.shape;
  for (let r = 0; r < s.length; r++) {
    for (let c = 0; c < s[0].length; c++) {
      if (!s[r][c]) continue;
      const rect = new Rect({
        x: (current.x + c) * CELL,
        y: (current.y + r) * CELL,
        width: CELL - 1,
        height: CELL - 1,
        fill: current.color,
      });
      pieceGroup.add(rect);
    }
  }
}

function updateNextVisual() {
  nextGroup.removeAll();
  if (!next) return;
  const s = next.shape;
  const offsetX = 8;
  const offsetY = 8;
  for (let r = 0; r < s.length; r++) {
    for (let c = 0; c < s[0].length; c++) {
      if (!s[r][c]) continue;
      const rect = new Rect({
        x: offsetX + c * CELL,
        y: offsetY + r * CELL,
        width: CELL - 1,
        height: CELL - 1,
        fill: next.color,
      });
      nextGroup.add(rect);
    }
  }
}

/* ====== game loop & controls ====== */
function gameTick(time) {
  if (!running) return;
  const delta = time - last;
  if (delta >= dropInterval) {
    last = time;
    if (canMove(current, 0, 1)) current.y++;
    else {
      mergePiece();
      clearLines();
      spawn();
    }
    updateGridVisual();
    updateCurrentVisual();
    updateNextVisual();
  }
  rafId = requestAnimationFrame(gameTick);
}

function start() {
  if (running) return;
  running = true;
  last = performance.now();
  rafId = requestAnimationFrame(gameTick);
}
function pause() {
  running = false;
  if (rafId) cancelAnimationFrame(rafId);
}
function resetGame() {
  pause();
  score.value = 0;
  lines.value = 0;
  level.value = 1;
  dropInterval = 800;
  makeEmptyBoard();
  spawn();
  updateGridVisual();
  updateCurrentVisual();
  updateNextVisual();
}
function hardDrop() {
  while (canMove(current, 0, 1)) current.y++;
  mergePiece();
  clearLines();
  spawn();
}

/* ====== keyboard ====== */
function onKey(e) {
  if (!running) return;
  if (e.code === 'ArrowLeft') {
    if (canMove(current, -1, 0)) current.x--;
  } else if (e.code === 'ArrowRight') {
    if (canMove(current, 1, 0)) current.x++;
  } else if (e.code === 'ArrowDown') {
    if (canMove(current, 0, 1)) current.y++;
  } else if (e.code === 'Space') {
    e.preventDefault();
    hardDrop();
  } else if (e.code === 'ArrowUp') {
    const r = rotate(current.shape);
    if (canMove(current, 0, 0, r)) current.shape = r;
  }
  updateGridVisual();
  updateCurrentVisual();
  updateNextVisual();
}

/* ====== init ====== */
function initLeafer() {
  leafer = new Leafer({ view: gameArea.value, width: COLS * CELL, height: ROWS * CELL });
  gridGroup = new Group({ x: 0, y: 0 });
  pieceGroup = new Group({ x: 0, y: 0 });
  leafer.add(gridGroup);
  leafer.add(pieceGroup);

  nextLeafer = new Leafer({ view: nextArea.value, width: 96, height: 96 });
  nextGroup = new Group({ x: 0, y: 0 });
  nextLeafer.add(nextGroup);

  window.addEventListener('keydown', onKey);
}

onMounted(() => {
  makeEmptyBoard();
  initLeafer();
  spawn();
  updateGridVisual();
  updateCurrentVisual();
  updateNextVisual();
});

onBeforeUnmount(() => {
  pause();
  window.removeEventListener('keydown', onKey);
  if (leafer) leafer.destroy && leafer.destroy();
  if (nextLeafer) nextLeafer.destroy && nextLeafer.destroy();
});
</script>

<style scoped>
.tetris-root {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}
.game-area {
  width: calc(24px * 10);
  height: calc(24px * 20);
  border: 1px solid #ddd;
}
.info {
  font-family: monospace;
}
.controls {
  margin-top: 8px;
}
.next {
  margin-top: 12px;
}
</style>
