<template>
  <div>
    <el-button @click="conut = 2">增加2</el-button>
  </div>
</template>

<script lang='ts' setup>
import { computed, ref, watchEffect } from 'vue';

const conut = ref(0);

const num = computed(() => conut.value % 2 === 0);

watchEffect(() => console.log(num.value));

</script>

<style scoped></style>
