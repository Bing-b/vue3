<template>
  <div class="w-[200px] h-[200px] bg-black flex items-center justify-center">
    <div class="loader">
      <div class="load-inner load-one"></div>
      <div class="load-inner load-two"></div>
      <div class="load-inner load-three"></div>
      <span class="text">Loading...</span>
    </div>
  </div>
</template>

<script lang='ts' setup>
</script>

<style scoped>
.loader {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  margin: 130px 0;
  perspective: 780px;
}

.text {
  position: absolute;
  bottom: -20px;
  font-size: 20px;
  color: #cecece;
  z-index: 10;
}

.load-inner {
  position: absolute;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border-radius: 50%;
}

.load-inner.load-one {
  left: 0%;
  top: 0%;
  border-bottom: 3px solid #e1501b;
  animation: rotate1 1.15s linear infinite;
}

.load-inner.load-two {
  right: 0%;
  top: 0%;
  border-right: 3px solid #c92626;
  animation: rotate2 1.15s 0.1s linear infinite;
}

.load-inner.load-three {
  right: 0%;
  bottom: 0%;
  border-top: 3px solid #ccc912;
  animation: rotate3 1.15s 0.15s linear infinite;
}

@keyframes rotate1 {
  0% {
    transform: rotateX(45deg) rotateY(-45deg) rotateZ(0deg);
  }

  100% {
    transform: rotateX(45deg) rotateY(-45deg) rotateZ(360deg);
  }
}

@keyframes rotate2 {
  0% {
    transform: rotateX(45deg) rotateY(45deg) rotateZ(0deg);
  }

  100% {
    transform: rotateX(45deg) rotateY(45deg) rotateZ(360deg);
  }
}

@keyframes rotate3 {
  0% {
    transform: rotateX(-60deg) rotateY(0deg) rotateZ(0deg);
  }

  100% {
    transform: rotateX(-60deg) rotateY(0deg) rotateZ(360deg);
  }
}
</style>
