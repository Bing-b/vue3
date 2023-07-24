<template>
  <div class="flex h-full overflow-hidden">

    <div class="main flex-1 overflow-hidden ">
      <xButton class="ml-3 mt-3 px-5 mb-3">确认</xButton>
      <switchBtn />

      <div class="tab-list" id="nav">
        <div class="flex items-center justify-center flex-none  tab-item w-[100px] h-[50px]" v-for="i in 10" :key="i">
          <div class="w-[80px] h-full bg-slate-400">
            {{ i }}
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script lang='ts' setup>
import { onMounted } from 'vue';

const handler = (event) => {
  // 获取要绑定事件的元素
  const nav = document.getElementById('nav');
  // 获取滚动方向
  const detail = event.wheelDelta || event.detail;
  // 定义滚动方向，其实也可以在赋值的时候写
  const moveForwardStep = 1;
  const moveBackStep = -1;
  // 定义滚动距离
  let step = 0;
  // 判断滚动方向,这里的100可以改，代表滚动幅度，也就是说滚动幅度是自定义的
  if (detail < 0) {
    step = moveForwardStep * 100;
  } else {
    step = moveBackStep * 100;
  }
  // 对需要滚动的元素进行滚动操作
  nav.scrollLeft += step;
};

const scrollInit = () => {
  // 获取要绑定事件的元素
  const nav = document.getElementById('nav');
  if (nav) {
    nav.addEventListener('mousewheel', handler, false);
  }
};

onMounted(() => {
  scrollInit();
});
</script>

<style lang="scss" scoped>
.aside {
  margin-right: 20px;
  width: 200px;
  background-color: rgb(224, 230, 241);
  height: 100%;
  border-radius: 4px;

  ul {
    li {
      padding: 8px 20px;
      font-size: 14px;
      color: #666;
    }
  }
}

.p {
  transition: .3s ease;
}

.tab-list {
  width: 400px;
  display: flex;
  align-items: center;
  overflow-x: auto;
  transition: all .36s ease; // 滑动动画
}

.tab-list::-webkit-scrollbar {
  height: 0; // 隐藏滚动条
}
</style>
