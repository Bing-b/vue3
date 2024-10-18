<template>
  <div class="p-5 overflow-auto h-full">
    <div class="g-svg">
      <svg height="100%" width="100%">
        xmlns="http://www.w3.org/2000/svg">
        <polyline
          points="240 10 140 10 140 90 0 90 240 -90"
          stroke="#ddd"
          fill="transparent"
          stroke-width="2" />
        <polyline
          class="g-dashed-line"
          points="240 10 140 10 140 90 0 90 240 -90"
          fill="transparent"
          stroke-width="2" />
      </svg>

      <svg width="500" height="500">
        <rect width="200" height="100" rx="10" ry="20"></rect>
        <circle cx="50" cy="200" r="50"></circle>
        <line x1="50" y1="200" x2="400" y2="300" stroke="red"></line>
        <polyline points="200 300, 400 500, 100 330" stroke="#000" fill="none"></polyline>
        <polygon points="450 200, 250 100, 230 230"></polygon>
      </svg>

      <svg>
        <path d="M 10 10 L 50 40 L 100 10 Z" stroke="blue" fill="none"></path>
      </svg>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
@keyframes move {
  0% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: -320;
  }
}

.g-svg {
  width: 240px;
  height: 100px;
  .g-dashed-line {
    stroke: #fc0;
    stroke-dashoffset: 0;
    stroke-dasharray: 40 320;
    animation: move 2.4s linear;
    filter: drop-shadow(1);
  }
}

.rect {
  width: 200px;
  height: 100px;

  stroke: #673ab7;
  stroke-width: 2;
  fill: transparent;
}
.rect1 {
  stroke-dasharray: 10 20;
  stroke-dashoffset: 40px;
}
.rect2 {
  stroke-dasharray: 20 20;
}
</style>
