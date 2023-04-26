<template>
  <p>页面2</p>
  <Switch :component="component" :parent="parent" a="哈哈哈哈">
    <el-button type="default" @click="handClick">切换卡片</el-button>
  </Switch>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import Switch from '../switch/index.vue';

// 卡片切换
const component = ref<'Card1' | 'Card2'>('Card1');

const parent = ref('腹肌') 

const handClick = () => {

  component.value = component.value === 'Card2' ? 'Card1' : 'Card2';
}
</script>