<template>
  <div class="min-h-full w-full overflow-y-auto bg-slate-50 p-8 transition-colors duration-300 dark:bg-[#111317]">
    <!-- Header -->
    <div class="mb-10">
      <h1 class="text-3xl font-black tracking-tight text-slate-900 dark:text-white">GSAP Motion Canvas</h1>
      <p class="mt-2 text-slate-500 dark:text-slate-400">Advanced animation sequences and scroll triggers powered by GreenSock.</p>
    </div>

    <div class="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
      <!-- Card 1: Basic Stagger -->
      <div class="group overflow-hidden rounded-3xl border border-white bg-white/50 p-6 shadow-sm transition-all hover:shadow-xl dark:border-white/5 dark:bg-white/5 backdrop-blur-sm">
        <div class="mb-6 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10">
              <el-icon><VideoPlay /></el-icon>
            </div>
            <h3 class="font-bold text-slate-800 dark:text-slate-200">Basic Stagger</h3>
          </div>
          <el-button @click="annimation1" type="primary" size="small" round plain>Trigger</el-button>
        </div>
        
        <div @click="flyaway" class="flex h-32 items-center justify-center gap-4 cursor-pointer overflow-hidden rounded-2xl bg-slate-100/50 dark:bg-black/20">
          <div class="box-modern g-green"></div>
          <div class="box-modern g-purple"></div>
          <div class="box-modern g-orange"></div>
          <div class="box-modern g-blue"></div>
        </div>
        <p class="mt-4 text-[11px] text-slate-400 uppercase tracking-widest font-mono">click containers to 'flyaway'</p>
      </div>

      <!-- Card 2: Timeline Control -->
      <div class="group overflow-hidden rounded-3xl border border-white bg-white/50 p-6 shadow-sm transition-all hover:shadow-xl dark:border-white/5 dark:bg-white/5 backdrop-blur-sm">
        <div class="mb-6 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-500 dark:bg-blue-500/10">
              <el-icon><Connection /></el-icon>
            </div>
            <h3 class="font-bold text-slate-800 dark:text-slate-200">Timeline Seq</h3>
          </div>
          <div class="flex gap-2">
            <el-button @click="annimation2" type="primary" size="small" round plain>Play</el-button>
            <el-button @click="annimation3" type="warning" size="small" round plain>Loop</el-button>
          </div>
        </div>

        <div class="flex h-32 items-center justify-center gap-6 rounded-2xl bg-slate-100/50 dark:bg-black/20">
          <div class="box-modern g-green b1"></div>
          <div class="box-modern g-purple b2"></div>
          <div class="box-modern g-orange b3"></div>
        </div>
      </div>

      <!-- Card 3: Interactive Controls -->
      <div class="group overflow-hidden rounded-3xl border border-white bg-white/50 p-6 shadow-sm transition-all hover:shadow-xl dark:border-white/5 dark:bg-white/5 backdrop-blur-sm">
        <div class="mb-6 flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-500 dark:bg-purple-500/10">
            <el-icon><RefreshLeft /></el-icon>
          </div>
          <h3 class="font-bold text-slate-800 dark:text-slate-200">Live Control</h3>
        </div>

        <div class="flex flex-col gap-6">
          <div class="flex h-24 items-center justify-center rounded-2xl bg-slate-100/50 dark:bg-black/20">
            <img class="flair h-12 w-auto" src="../../assets/images/logo/logo.png" alt="" />
          </div>
          <div class="flex flex-wrap gap-2 justify-center">
            <el-button @click="timeLine.play" size="small" circle icon="VideoPlay"></el-button>
            <el-button @click="timeLine.pause" size="small" circle icon="VideoPause"></el-button>
            <el-button @click="timeLine.reverse" size="small" circle icon="RefreshLeft"></el-button>
          </div>
        </div>
      </div>

      <!-- Card 4: Scroll Trigger -->
      <div class="group overflow-hidden rounded-3xl border border-white bg-white/50 p-6 shadow-sm transition-all hover:shadow-xl dark:border-white/5 dark:bg-white/5 backdrop-blur-sm lg:col-span-2">
         <div class="mb-6 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-500/10">
              <el-icon><Search /></el-icon>
            </div>
            <h3 class="font-bold text-slate-800 dark:text-slate-200">Scroll Sensing</h3>
          </div>
        </div>
        
        <div class="scroll-box h-48 w-full overflow-y-scroll rounded-2xl border border-slate-200 bg-slate-100/30 dark:border-white/10 dark:bg-black/10">
          <div class="flex h-[400px] flex-col items-center justify-center gap-10">
            <p class="text-[10px] uppercase text-slate-400 font-bold">Scroll Down</p>
            <div class="box-modern g-orange b7 scale-150"></div>
          </div>
        </div>
      </div>

      <!-- Card 5: Keyframes & Path -->
      <div class="group overflow-hidden rounded-3xl border border-white bg-white/50 p-6 shadow-sm transition-all hover:shadow-xl dark:border-white/5 dark:bg-white/5 backdrop-blur-sm">
        <div class="mb-6 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 text-pink-500 dark:bg-pink-500/10">
              <svg-icon name="plain" size="18" />
            </div>
            <h3 class="font-bold text-slate-800 dark:text-slate-200">Complex Path</h3>
          </div>
          <el-button @click="annimation6" type="danger" size="small" round plain>Execute</el-button>
        </div>

        <div class="relative h-32 rounded-2xl bg-slate-100/50 dark:bg-black/20 overflow-hidden">
          <div class="absolute left-4 top-4">
             <svg-icon name="plain" class="b8 text-pink-500" size="40" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { onMounted, ref } from 'vue';
import { VideoPlay, VideoPause, RefreshLeft, Connection, Search } from '@element-plus/icons-vue';

gsap.registerPlugin(ScrollTrigger);

let timeLine = ref<any>({});

const flyaway = () => {
  gsap.to('.box-modern', {
    duration: 0.6,
    opacity: 0,
    y: -50,
    scale: 0.5,
    stagger: 0.1,
    ease: 'power3.in',
  });
  
  // Auto reset after 2s
  gsap.to('.box-modern', {
    duration: 0,
    opacity: 1,
    y: 0,
    scale: 1,
    delay: 2
  });
};

const annimation1 = () => {
  gsap.from('.box-modern', {
    duration: 1.2,
    rotation: 720,
    opacity: 0,
    scale: 0,
    y: 50,
    stagger: {
      each: 0.1,
      from: 'center'
    },
    ease: 'elastic.out(1, 0.5)',
  });
};

const annimation2 = () => {
  const tl = gsap.timeline();
  tl.from('.b1', { rotation: -180, x: -50, opacity: 0, duration: 0.8, ease: 'back.out' })
    .from('.b2', { scale: 0, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
    .from('.b3', { y: 50, opacity: 0, rotation: 180, duration: 0.8, ease: 'back.out' }, '-=0.3');
};

const annimation3 = () => {
  const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5, yoyo: true });
  tl.to('.b1, .b2, .b3', { 
    rotation: 360, 
    borderRadius: '50%', 
    scale: 0.8, 
    stagger: 0.2,
    duration: 1,
    ease: 'power1.inOut' 
  });
};

const annimation4 = () => {
  const tween = gsap.to('.flair', { 
    duration: 2, 
    x: 100, 
    rotation: 360, 
    paused: true,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true
  });

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
    rotation: 720,
    scale: 1.2,
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    scrollTrigger: {
      trigger: '.b7',
      scroller: '.scroll-box',
      scrub: 1.5,
      start: 'top 80%',
      end: 'bottom 20%',
    },
  });
};

const annimation6 = () => {
  const tl = gsap.timeline();
  tl.to('.b8', {
    keyframes: {
      x: [0, 80, 80, 150, 150, 0],
      y: [0, 0, 60, 60, 0, 0],
      rotation: [0, 90, 180, 270, 360, 0]
    },
    duration: 2.5,
    ease: 'power2.inOut'
  });
};

onMounted(() => {
  timeLine.value = annimation4();
  annimation5();
});
</script>

<script lang="ts">
export default {
  name: 'GsapDemo'
}
</script>

<style lang="scss" scoped>
.box-modern {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-4px) scale(1.1);
  }
}

.g-green { background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%); }
.g-purple { background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%); }
.g-orange { background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); }
.g-blue { background: linear-gradient(135deg, #2575fc 0%, #6a11cb 100%); }

/* Hide scrollbar for Chrome, Safari and Opera */
.scroll-box::-webkit-scrollbar {
  width: 4px;
}
.scroll-box::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.1);
  border-radius: 10px;
}
.dark .scroll-box::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.1);
}
</style>
