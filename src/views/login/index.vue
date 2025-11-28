<template>
  <div class="flex h-full w-full">
    <div class="relative flex w-2/3 flex-col p-5">
      <div class="flex items-center gap-3 rounded-4xl px-4 py-3 backdrop-blur-md">
        <img class="w-[30px]" :src="$getImg('logo/logo.png')" />
        <h2
          class="font-Maoken origin-left text-[20px] font-bold text-nowrap text-[#e87d3f] transition-all duration-300 ease-in-out dark:text-white">
          花猫乐园
        </h2>
      </div>

      <img class="absolute inset-0 -z-1 h-full w-full object-cover" :src="$getImg(`bg1.jpg`)" />
    </div>
    <div class="relative flex-1 px-30 py-[200px]">
      <div class="flex flex-col gap-5">
        <div class="mb-5 flex flex-col gap-1">
          <div class="relative flex items-center gap-5">
            <h1 class="flex flex-none items-center font-sans text-[28px] font-bold">欢迎回来 </h1>
            <LottieCat :height="160" class="absolute -left-10"
          /></div>

          <p class="text-xs text-[#767676]">请输入您的账户信息</p>
        </div>

        <!-- 账户 -->
        <el-input
          class="!h-[40px]"
          v-model.trim="loginFrom.name"
          placeholder="请输入用户名:wang"
          maxlength="20" />

        <!-- 密码 -->
        <el-input
          class="!h-[40px]"
          v-model.trim="loginFrom.password"
          type="password"
          placeholder="请输入密码"
          maxlength="8"
          show-password />

        <!-- 验证滑块 -->
        <slide-verify ref="verifyRef" @success="isVerified = true" />

        <el-button class="!h-[40px]" @click="handleLogin" type="primary">登录</el-button>
      </div>

      <p class="absolute bottom-3 left-1/2 -translate-x-1/2 text-center text-xs text-[#767676]">
        Copyright © 2025 Catpark</p
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus';
import { reactive, ref } from 'vue';
import useUserStore from '@/store/modules/user';
import { useRouter } from 'vue-router';
import LottieCat from '@/views/lottie-web/cat.vue';
import SlideVerify from './slideverify.vue';

const router = useRouter();

const loginFrom = reactive({
  name: '',
  password: '',
});

const verifyRef = ref<InstanceType<typeof SlideVerify> | null>(null);

const isVerified = ref(false);

const resetVerify = () => {
  verifyRef.value?.reset();
  isVerified.value = false;
};

// 处理登录
const handleLogin = () => {
  if (loginFrom.name !== 'wang' || loginFrom.password !== '666') {
    ElMessage.warning('账户或密码错误');
    resetVerify();
  } else if (!isVerified.value) {
    ElMessage.warning('请拖动验证滑块');
  } else {
    const useStore = useUserStore();
    useStore.name = loginFrom.name;
    useStore.token = `${loginFrom.name}-${new Date()}`;
    router.push({ name: 'dashboard' });
  }
};
</script>

<style scoped></style>
