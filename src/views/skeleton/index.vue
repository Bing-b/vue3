<template>
  <div>
    <div class="flex justify-end">
      <el-button type="primary" @click="reload" class="mt-2">重载</el-button>
    </div>
    <el-divider />
    <div class="flex flex-wrap gap-3">
      <el-skeleton animated :loading="loading" v-for="(i, index) in 4" :key="index">
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
          <div class="flex w-[32%] items-start border border-[#dedede] px-2 py-3 box-border">
            <img class="w-[150px]" :src="$getImg('logo/logo_square.png')" />
            <div class="flex flex-col ml-4  text-[#767676]">
              恐龙（Dinosaur）是生活在地球上的一类史前动物，它们生存于三叠纪至白垩纪之间的地球历史时期，约2.3亿年至6千5百万年前。恐龙最初出现于三叠纪中期，而在白垩纪末期，恐龙大规模死亡，使得它们完全消失。恐龙的化石遗骸被广泛发现在全球各地的沉积岩层中，显示出这些巨型动物曾经支配过地球生态系统。

            </div>
          </div>
        </template>
      </el-skeleton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

const loading = ref(true);

const reload = () => {
  loading.value = true;
  setTimeout((txt) => {
    loading.value = false;
    console.log(txt);
  }, 2000, 'hello');
};

onMounted(() => {
  loading.value = false;
});
</script>
<style lang="scss"></style>
