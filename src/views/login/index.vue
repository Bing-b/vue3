<template>
  <div class="flex h-full w-full">
    <div class="flex w-2/3 flex-col p-5">
      <div class="flex items-center gap-3">
        <img class="w-[30px]" :src="$getImg('logo/logo.png')" />
        <h2
          class="font-Maoken origin-left text-[20px] font-bold text-nowrap text-[#512f1c] transition-all duration-300 ease-in-out dark:text-white">
          花猫乐园
        </h2>
      </div>
    </div>
    <div class="flex-1 px-30 py-[200px]">
      <div class="flex flex-col gap-5">
        <div class="flex flex-col gap-1">
          <h1 class="text-[28px] font-bold">欢迎回来</h1>
          <p class="text-xs text-[#767676]">请输入您的账户信息以登录乐园</p>
        </div>

        <el-input v-model.trim="loginFrom.name" placeholder="请输入用户名" maxlength="20" />

        <el-input
          v-model.trim="loginFrom.password"
          type="password"
          placeholder="请输入密码"
          maxlength="8"
          show-password />

        <el-button @click="handleLogin" type="primary">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus';
import { reactive } from 'vue';
import useUserStore from '@/store/modules/user';
import { useRouter } from 'vue-router';

const router = useRouter();

const loginFrom = reactive({
  name: '',
  password: '',
});

const handleLogin = () => {
  if (loginFrom.name !== 'wang' || loginFrom.password !== '666') {
    ElMessage.warning('账户或密码错误');
  } else {
    const useStore = useUserStore();
    useStore.name = loginFrom.name;
    useStore.token = `${loginFrom.name}-${new Date()}`;
    router.push({ name: 'dashboard' });
  }
};
</script>

<style scoped></style>
