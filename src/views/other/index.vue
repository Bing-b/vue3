<template>
  <div class="container flex">
    <!-- hook -->
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>鼠标位置hook</span>
        </div>
      </template>
      <div>
        <p>X:{{ x }}</p>
        <p>Y: {{ y }}</p>
      </div>
    </el-card>

    <!-- pdf -->
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>pdf文档预览</span>
          <el-button type="primary" @click="dialogTableVisible = !dialogTableVisible">显示PDF</el-button>
        </div>
      </template>
      <div>
        <p>文件链接添加#scrollbars=0&toolbar=0&statusbar=0可去除预览工具栏</p>
      </div>
    </el-card>

    <el-dialog v-model="dialogTableVisible" title="文档预览">
      <div class="pdf-container">
        <!-- <embed
          src="https://sci-hub.se/downloads/2021-05-16/49/belkhiria2021.pdf#navpanes=0&view=FitH#scrollbars=0&toolbar=0&statusbar=0"
          type="application/pdf" /> -->
        <iframe style="width: 100%; min-height: 600px"
          src="http://view.officeapps.live.com/op/view.aspx?src=newteach.pbworks.com%2Ff%2Fele%2Bnewsletter.docx"
          width="100%" height="100%" frameborder="1" />

      </div>
    </el-dialog>

    <!-- 文本超出省略 -->
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>文本超出省略</span>
        </div>
      </template>
      <div>
        <p>1、可动态判断文本是否超出父容器宽度来控制显示tooltip</p>
        <p>2、支持传递 文本超出行数 参数控制显示...</p>
        <br />
        <textEllipsis lineClamp="2" placement="bottom">
          恐龙体型巨大，各种形态各异，有短小的小型恐龙，也有高达20米以上的大型恐龙。恐龙的主要特征是：四肢直立，行走方式为双足行走；颈部和尾部通常较长；拥有强有力的下颌和锋利的牙齿，适应多样的食性；身体覆盖着角质质地的鳞片或者羽毛；有些恐龙还拥有壮观的骨刺，用于防御或吓唬敌人。
        </textEllipsis>
      </div>
    </el-card>
    <!-- <img id="ii" /> -->

    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>大菠萝（pinia）</span>
          <el-button type="primary" @click="addCount">计数++</el-button>
          <el-button type="primary" @click="userStore.clear()">清除pinia</el-button>
        </div>
      </template>
      <div>
        <el-input v-model="userStore.name" placeholder="请输入名称" clearable></el-input>
        <p class="mt-2">名称：{{ userStore.name }}</p>
        <p>计数：{{ userStore.counter }}</p>
      </div>
    </el-card>

    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>鼠标横向滚动</span>
        </div>
      </template>
      <div>
        <div class="tab-list" id="nav">
          <div class="flex items-center justify-center flex-none  tab-item w-[100px] h-[50px]" v-for="i in 10" :key="i">
            <div class="w-[80px] h-full bg-slate-400">
              {{ i }}
            </div>
          </div>
        </div>
      </div>
    </el-card>

  </div>
</template>
<script lang="ts" setup>
import useMousePositon from '@/hooks/useMousePosition';
import { onMounted, ref } from 'vue';
import imgUrl from '@/assets/images/logo/logo_square.png';
import useUserStore from '@/store/modules/user';

const { x, y } = useMousePositon();

const dialogTableVisible = ref(false);

const userStore = useUserStore();

const addCount = () => {
  userStore.counter++;
};

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
  nav!.scrollLeft += step;
};

const scrollInit = () => {
  // 获取要绑定事件的元素
  const nav = document.getElementById('nav');
  if (nav) {
    nav.addEventListener('mousewheel', handler, false);
  }
};

onMounted(() => {
  const img = document.getElementById('ii') as HTMLImageElement | null;
  if (img) {
    img.src = imgUrl;
  }
  scrollInit();
});

</script>

<style lang="scss">
.container {
  gap: 20px;
  flex-wrap: wrap;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  flex: 33.3%;
}

.pdf-container {
  width: 100%;
  height: 600px;

  embed {

    width: 100%;
    height: 100%;
  }
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
