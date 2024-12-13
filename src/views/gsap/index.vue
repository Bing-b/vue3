<template>
  <div class="bg-black h-full p-5 overflow-y-scroll text-white">
    <div class="flex">
      <el-button @click="annimation1" type="primary">基础动画</el-button>
    </div>
    <div @click="flyaway" class="section">
      <div class="box green"></div>
      <div class="box purple"></div>
      <div class="box orange"></div>
      <div class="box blue"></div>
    </div>

    <div class="flex">
      <el-button @click="annimation2" type="primary">时间线</el-button>
    </div>

    <div class="section">
      <div class="box green b1"></div>
      <div class="box purple b2"></div>
      <div class="box orange b3"></div>
    </div>

    <div class="flex">
      <el-button @click="annimation3" type="primary">时间线带循环</el-button>
    </div>

    <div class="section">
      <div class="box yellow b4"></div>
      <div class="box blue b5"></div>
      <div class="box orange b6"></div>
    </div>

    <div class="flex gap-5">
      时间线控制动画
      <el-button @click="timeLine.play" type="primary">播放</el-button>
      <el-button @click="timeLine.pause" type="primary">暂停</el-button>
      <el-button @click="timeLine.reverse" type="primary">反向变化</el-button>
      <el-button @click="timeLine.kill" type="primary">销毁</el-button>
    </div>

    <div class="section">
      <img class="flair" src="../../assets/images/flair-25.png" alt="" />
    </div>

    <p>插件</p>

    <div class="scroll-box h-[300px] w-[500px] overflow-y-scroll border border-[#dedede]">
      <div class="h-[600px] flex justify-center items-center">
        <div class="box orange b7"></div>
      </div>
    </div>

    <div class="flex mt-5">
      <el-button @click="annimation6" type="primary">关键帧</el-button>
    </div>
    <div class="section">
      <svg-icon name="plain" class="b8" size="50" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { onMounted, ref } from 'vue';

gsap.registerPlugin(ScrollTrigger);

let timeLine = ref<any>({});

const flyaway = () => {
  gsap.to('.box', {
    duration: 0.5,
    opacity: 0,
    y: -100,
    stagger: 0.1,
    ease: 'back.in',
  });
};

const annimation1 = () => {
  // 清除原有动画
  // gsap.killTweensOf('.box');
  gsap.set('.box', {
    rotation: 0,
    opacity: 0,
    y: 0,
  });
  gsap.to('.box', {
    duration: 1,
    rotation: 360,
    opacity: 1,
    delay: 0.5,
    stagger: 0.2,
    ease: 'sine.out',
    force3D: true,
  });
};

const annimation2 = () => {
  const tl = gsap.timeline(); // 创建一个时间线
  tl.to('.b1', { rotation: 360, x: 100, duration: 2 });
  //tl.to('.b2', { scale: 0.5, x: 100, duration: 1 });

  /* 第3个参数Position Parameter 设置延迟 1代表1s后执行，
  "<" 和前一个添加的动画同时开始运动
  +=1 等前面所有动画结束1s后执行
  */
  tl.to('.b2', { scale: 0.5, x: 100, duration: 1 }, '<');
  // repeat  重复的次数 -1 无效循环  yoyo 会让每次动画重复的时候往回变化
  tl.to('.b3', { yPercent: -100, duration: 1, repeat: -1, yoyo: true }, '+=1');
};

const annimation3 = () => {
  // defaults 默认属性 to from fromto 都会继承
  const tl = gsap.timeline({ repeat: -1, repeatDelay: 1, yoyo: true, defaults: { duration: 1 } });
  tl.to('.b4', { rotation: 90 });
  tl.to('.b5', { rotation: 180 });
  tl.to('.b6', { rotation: 360 });
};

const annimation4 = () => {
  const tween = gsap.to('.flair', { duration: 1, x: 200 });

  // tween.play();

  //  暂停
  // tween.pause();

  //  恢复（继续）
  //  tween.resume();

  //  反向变化
  // tween.reverse();

  // // 直接切换到整个动画变化时长的0.5秒的时间点的状态
  // tween.seek(0.5);

  // // 直接切换到整个变化过程的1/4的节点的状态
  // tween.progress(0.25);

  // // 让运动减速到0.5倍
  // tween.timeScale(0.5);

  // // 让变化加速到原来的2倍
  // tween.timeScale(2);

  // // 直接销毁tween实例，让垃圾回收机制可以处理该实例所占用的内存
  // tween.kill();

  return {
    play: () => tween.play(),
    pause: () => tween.pause(),
    resume: () => tween.resume(),
    reverse: () => tween.reverse(),
    kill: () => tween.kill(),
  };
};

const annimation5 = () => {
  gsap.to('.b7', {
    rotation: 900,
    duration: 1,
    scrollTrigger: {
      trigger: '.b7',
      scroller: '.scroll-box',
      scrub: 1,
      markers: true,
    },
  });
};

const annimation6 = () => {
  const tl = gsap.timeline();
  tl.to('.b8', {
    keyframes: {
      x: [0, 100, 100, 200, 200, 500],
      y: [0, 0, 100, 100, 0, 0],
    },
    duration: 2,
  });
};

onMounted(() => {
  timeLine.value = annimation4();
  annimation5();
});
</script>

<style lang="scss" scoped>
.section {
  display: flex;
  align-items: center;
  gap: 200px;
  height: 200px;
}

.box {
  cursor: pointer;
  width: 80px;
  height: 80px;
  border-radius: 8px;
}

.green {
  background-color: chartreuse;
}
.purple {
  background-color: blueviolet;
}
.orange {
  background-color: #d02e29;
}
.blue {
  background-color: rgb(13, 125, 204);
}

.yellow {
  background-color: rgb(212, 222, 76);
}
</style>
