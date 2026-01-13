<template>
  <div class="dd h-full overflow-y-scroll">
    <div class="body">
      <div class="box green"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { onMounted, ref } from 'vue';

gsap.registerPlugin(ScrollTrigger);

onMounted(() => {
  gsap.to('.green', {
    rotation: 900,
    duration: 1,
    scrollTrigger: {
      trigger: '.box',
      scroller: '.dd',
      scrub: 2,
      markers: true,
    },
  });
});
</script>

<style scoped>
.body {
  display: flex;
  align-items: center;
  justify-content: space-around;
  min-height: 200vh;
  margin: 0;
}

.box {
  display: block;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  width: 75px;
  height: 75px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: greenyellow;
  font-weight: 600;
}
</style>

<!-- let ctx: gsap.Context | null = null; // 用于存储 GSAP 上下文以便清理
let lenis: Lenis | null = null;



// const lenis = new Lenis();
// lenis.on("scroll", (e) => {});

// function raf(time) {
//   lenis.raf(time);
//   requestAnimationFrame(raf);
// }

// requestAnimationFrame(raf);

gsap.registerPlugin(ScrollTrigger); // 注册 ScrollTrigger 插件c

const text =
  "我来自有着“恐龙之乡”“南国灯城”美誉的四川自贡，是一名从事计算机软件开发的普通人。每天穿梭于代码与文档之间，在枯燥与重复中寻找灵光与秩序。工作时常令人焦躁不安，有时热血沸腾，也有时难免摆烂，但我依然保持对技术的好奇与钻研的习惯，哪怕这份执着在同事眼中有些“较真”。生活跌宕起伏，我学着坦然面对。热爱生活，也热爱烟火气，喜欢做饭，不太喜欢洗碗。始终记得一句让我坚持下来的话：“世上只有一种英雄主义，就是在认清生活真相之后依然热爱生活。”";

// Lenis 平滑滚动初始化
const initLenis = () => {
  lenis = new Lenis();
  function raf(time: number) {
    lenis?.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
};

// 初始化
const init = () => {
  ctx = gsap.context(() => {
    gsap.fromTo(
      ".scroll-up",
      {},
      {
        transform: "translateY(40px)",
        scrollTrigger: {
          trigger: ".scroll-up",
          start: "top 60%",
          end: "top top",
          scrub: 1,
          toggleActions: "play play reverse reverse",
        },
      }
    );

    gsap.fromTo(
      ".scroll-down",
      {},
      {
        transform: "translateY(-40px)",
        scrollTrigger: {
          trigger: ".scroll-down",
          start: "top 60%",
          end: "top top",
          scrub: 1,
          toggleActions: "play play reverse reverse",
        },
      }
    );
  });

  nextTick(() => {
    const splitTypes = document.querySelectorAll(".reveal-type");
    splitTypes.forEach((word) => {
      // SplitType 会破坏 DOM，所以在 Vue 中必须小心
      const text2 = new SplitType(word as HTMLElement, { types: "words" });

      // 初始状态
      gsap.set(text2.words, { opacity: 0.2 });

      gsap.to(text2.words, {
        scrollTrigger: {
          trigger: word,
          start: "top 80%", // 稍微提前一点触发
          end: "bottom 40%",
          scrub: 1, // 降低 scrub 值让跟随更灵敏，避免延迟导致的视觉空白
          markers: false,
          // !!! 关键修改：移除了 pin: true，这通常是导致下方元素消失的罪魁祸首
        },
        opacity: 1,
        stagger: 0.02, // 调整 stagger 使其更流畅
        duration: 1,
      });
    });
  });
};

onMounted(() => {
  initLenis();

  // 等待 DOM 完全渲染，特别是字体加载可能会影响高度
  nextTick(() => {
    // 稍微延迟一下确保 ClientOnly 内容已挂载
    setTimeout(() => {
      init();
    }, 100);
  });
});

onUnmounted(() => {
  ctx?.revert(); // 清理 GSAP 动画，防止内存泄漏和布局错乱
  lenis?.destroy();
}); -->
