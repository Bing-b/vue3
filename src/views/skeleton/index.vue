<template>
  <div class="w-1/2">
    <el-skeleton animated :loading="loading">
      <template #template>
        <div class="flex">
          <el-skeleton-item variant="image" style="width: 200px; height: 180px" />
          <div class="flex-1 p-[14px]">
            <el-skeleton-item variant="p" style="width: 50%" />
            <el-skeleton-item variant="p" style="width: 80%" />
            <div class="flex  items-center  justify-between">
              <el-skeleton-item variant="text" style="margin-right: 16px" />
              <el-skeleton-item variant="text" style="width: 30%" />
            </div>
          </div>
        </div>
      </template>
      <template #default>
        <div class="flex">
          <img class="w-[200px]" :src="$getImg('logo/logo_square.png')" />
          <p class="ml-4 indent-8 text-[#767676]">
            恐龙（Dinosaur）是生活在地球上的一类史前动物，它们生存于三叠纪至白垩纪之间的地球历史时期，约2.3亿年至6千5百万年前。恐龙最初出现于三叠纪中期，而在白垩纪末期，恐龙大规模死亡，使得它们完全消失。恐龙的化石遗骸被广泛发现在全球各地的沉积岩层中，显示出这些巨型动物曾经支配过地球生态系统。
          </p>
        </div>
      </template>
    </el-skeleton>

    <el-button @click="reload" class="mt-2">重载</el-button>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

const loading = ref(true);

const reload = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 2000);
};

onMounted(() => {
  loading.value = false;
});
</script>
