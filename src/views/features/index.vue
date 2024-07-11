<template>
  <div ref="container" class="h-[500px] overflow-y-scroll">
    <div v-for="i in list" :key="i" class="item">{{ i }}</div>
    <div ref="scrollEnd" class="more">more</div>
  </div>
</template>

<script lang='ts' setup>
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { onMounted, ref } from 'vue';

const list = ref([1, 2, 3, 4, 5]);

const scrollEnd = ref(null);

const loadMoreData = () => {
  setTimeout(() => {
    const newData = Array.from(list.value, (i) => i + 1);
    list.value.push(...newData);
  }, 1000);
};

onMounted(() => {
  const { unObserverElement } = useIntersectionObserver(scrollEnd.value, {}, (entriies) => {
    entriies.forEach(entry => {
      if (entry.isIntersecting) {
        loadMoreData();
      }
    });
  });
});

</script>

<style lang="scss" scoped>
.item {
  margin: 5px 0;
  padding: 4px 10px;
  background-color: antiquewhite;
  border-radius: 4px;
}

.more {
  padding: 4px 10px;
  background-color: rgb(24, 123, 210);
  border-radius: 4px;
}
</style>
