<template>
  <div class="">
    <div class="head flex items-center px-5 py-4 bg-white shadow-md">
      <div class="w-[100px] h-[100px] rounded-full overflow-hidden border border-[#dedede]" data-intro="这是第一步"
        data-step="1">
        <img class="w-full object-cover" src="@/assets/images/logo_square.png" alt="">
      </div>
      <div class=" ml-5" data-intro="这是第二步" data-step="2">
        <h4>早上好admin!</h4>
        <p>今日晴，20℃ - 32℃！</p>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ComponentInternalInstance, getCurrentInstance, onMounted } from 'vue';
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

onMounted(() => {
  setTimeout(() => {
    proxy!.$intro()
      .setOption('nextLabel', ' 下一步 ')
      .setOption('prevLabel', ' 上一步 ')
      .setOption('doneLabel', ' 完成 ')
      .start();
  }, 500);
});
</script>
<style lang="scss" scoped></style>
