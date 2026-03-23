<script setup lang="ts">
import { ref, computed } from 'vue';

// 棋盘大小
const BOARD_SIZE = 15;

// 棋盘状态: 0-空, 1-黑子, 2-白子
const board = ref<number[][]>(Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0)));

// 当前玩家: 1-黑子, 2-白子
const currentPlayer = ref(1);

// 获胜者: 0-无, 1-黑子, 2-白子
const winner = ref(0);

// 游戏记录 (用于悔棋)
const history = ref<{ r: number; c: number; p: number }[]>([]);

// 重置游戏
const resetGame = () => {
  board.value = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));
  currentPlayer.value = 1;
  winner.value = 0;
  history.value = [];
};

// 悔棋
const undo = () => {
  if (history.value.length === 0 || winner.value !== 0) return;
  const last = history.value.pop()!;
  board.value[last.r][last.c] = 0;
  currentPlayer.value = last.p;
};

// 检查落子是否获胜
const checkWin = (row: number, col: number, player: number) => {
  const directions = [
    [0, 1], // 水平
    [1, 0], // 垂直
    [1, 1], // 主对角线
    [1, -1], // 副对角线
  ];

  for (const [dr, dc] of directions) {
    let count = 1;

    // 向前检查
    for (let i = 1; i < 5; i++) {
      const r = row + dr * i;
      const c = col + dc * i;
      if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board.value[r][c] === player) {
        count++;
      } else {
        break;
      }
    }

    // 向后检查
    for (let i = 1; i < 5; i++) {
      const r = row - dr * i;
      const c = col - dc * i;
      if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board.value[r][c] === player) {
        count++;
      } else {
        break;
      }
    }

    if (count >= 5) return true;
  }
  return false;
};

// 下棋
const dropPiece = (r: number, c: number) => {
  if (board.value[r][c] !== 0 || winner.value !== 0) return;

  const p = currentPlayer.value;
  board.value[r][c] = p;
  history.value.push({ r, c, p });

  if (checkWin(r, c, p)) {
    winner.value = p;
  } else {
    currentPlayer.value = p === 1 ? 2 : 1;
  }
};
</script>

<template>
  <div
    class="gomoku-container flex h-full w-full items-center justify-center bg-[#f0f2f5] p-8 dark:bg-black">
    <div
      class="glass-card flex flex-col items-center gap-8 rounded-[32px] bg-white/70 p-10 shadow-2xl backdrop-blur-xl dark:bg-zinc-900/50">
      <!-- 头部信息 -->
      <div class="flex w-full items-center justify-between">
        <div class="flex flex-col gap-1">
          <h1
            class="text-3xl font-black tracking-tighter text-zinc-800 uppercase italic dark:text-zinc-100"
            >Gomoku Core</h1
          >
          <p class="font-mono text-[10px] tracking-widest text-zinc-400 uppercase"
            >Neural Strategy Engine v1.0</p
          >
        </div>

        <div class="flex items-center gap-4">
          <div
            :class="[
              'status-badge flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all duration-500',
              winner === 0
                ? currentPlayer === 1
                  ? 'bg-zinc-800 text-white'
                  : 'border border-zinc-200 bg-zinc-100 text-zinc-800'
                : 'animate-bounce bg-emerald-500 text-white',
            ]">
            <span
              v-if="winner === 0"
              class="h-2 w-2 animate-pulse rounded-full"
              :class="currentPlayer === 1 ? 'bg-zinc-100' : 'bg-zinc-800'"></span>
            {{
              winner === 0
                ? currentPlayer === 1
                  ? 'BLACK TURN'
                  : 'WHITE TURN'
                : winner === 1
                  ? 'BLACK WINS'
                  : 'WHITE WINS'
            }}
          </div>
          <button
            @click="resetGame"
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 transition-all hover:bg-zinc-200 hover:text-zinc-800 active:scale-95 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round">
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
          </button>
        </div>
      </div>

      <!-- 棋盘 -->
      <div
        class="board-wrapper relative rounded-sm border-[6px] border-[#8b4513] bg-[#dcb35c] p-1 shadow-inner">
        <div
          class="grid-layer pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay"
          style="
            background-image: radial-gradient(#000 1px, transparent 1px);
            background-size: 40px 40px;
          "></div>

        <div
          class="relative grid"
          :style="{
            gridTemplateColumns: `repeat(${BOARD_SIZE}, 40px)`,
            gridTemplateRows: `repeat(${BOARD_SIZE}, 40px)`,
          }">
          <template v-for="(row, r) in board" :key="r">
            <div
              v-for="(cell, c) in row"
              :key="c"
              @click="dropPiece(r, c)"
              class="relative flex cursor-pointer items-center justify-center border-[0.5px] border-black/10 transition-colors hover:bg-black/5">
              <!-- 棋子渲染 -->
              <transition name="piece">
                <div v-if="cell === 1" class="piece black"></div>
                <div v-else-if="cell === 2" class="piece white"></div>
              </transition>

              <!-- 十字准星 (仅悬停且空位时) -->
              <div
                v-if="cell === 0 && winner === 0"
                class="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100">
                <div class="absolute h-full w-px bg-black/10"></div>
                <div class="absolute h-px w-full bg-black/10"></div>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- 底部控制 -->
      <div class="mt-4 flex w-full items-center justify-between">
        <button
          @click="undo"
          :disabled="history.length === 0 || winner !== 0"
          class="flex items-center gap-2 text-xs font-bold tracking-widest text-zinc-400 uppercase transition-colors hover:text-zinc-600 disabled:cursor-not-allowed disabled:opacity-30">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5">
            <polyline points="9 11 12 14 22 4"></polyline>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
          </svg>
          Undo Last Session
        </button>
        <p class="text-[9px] font-medium text-zinc-300 uppercase dark:text-zinc-600"
          >Experimental Strategy Module // Latency: 4ms</p
        >
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.gomoku-container {
  font-family: 'Outfit', sans-serif;
}

.glass-card {
  box-shadow: 0 40px 80px -20px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.board-wrapper {
  cursor: crosshair;
}

.piece {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  z-index: 10;

  &.black {
    background: radial-gradient(circle at 30% 30%, #444, #000);
  }

  &.white {
    background: radial-gradient(circle at 30% 30%, #fff, #ccc);
    border: 1px solid #ddd;
  }
}

.piece-enter-active {
  animation: piece-drop 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards;
}

@keyframes piece-drop {
  0% {
    transform: scale(3);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.status-badge {
  box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.1);
}
</style>
