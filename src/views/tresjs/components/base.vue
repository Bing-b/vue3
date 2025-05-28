<template>
  <!-- 场景 -->
  <TresCanvas clear-color="#82DBC5">
    <!-- 透视相机 -->
    <TresPerspectiveCamera :position="[3, 3, 3]" :fov="45" :look-at="[0, 0, 0]" />
    <TresMesh>
      <TresTorusGeometry :args="[1, 0.5, 16, 32]" />
      <TresMeshBasicMaterial color="orange" />
      <TresAmbientLight :intensity="1" />
    </TresMesh>
  </TresCanvas>
</template>

<script lang="ts" setup>
import { TresCanvas } from '@tresjs/core';
import { extend } from '@tresjs/core';
// import { OrbitControls } from 'three/addons/controls/OrbitControls';

// extend({ OrbitControls });
</script>
