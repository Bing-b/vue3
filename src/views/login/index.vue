<template>
  <div class="flex h-full w-full overflow-hidden bg-white dark:bg-slate-950">
    <!-- Left: Background Area (2/3) -->
    <div class="relative hidden w-2/3 lg:block">
      <img 
        class="h-full w-full object-cover transition-transform duration-1000 hover:scale-105" 
        :src="$getImg('bg1.jpg')" 
      />
      <!-- Logo Overlay on Background -->
      <div class="absolute left-10 top-10 flex items-center gap-3 rounded-full bg-slate-900/40 px-6 py-3 backdrop-blur-md">
        <img class="w-8" :src="$getImg('logo/logo.png')" />
        <h2 class="font-Maoken text-xl font-bold text-white">花猫乐园</h2>
      </div>
      
      <!-- Ambient Gradient to blend into the right panel slightly -->
      <div class="absolute inset-0 bg-gradient-to-r from-transparent to-white dark:to-slate-950"></div>
    </div>

    <!-- Right: Login Panel (1/3) -->
    <div class="relative flex flex-1 flex-col items-center justify-center px-10 xl:px-20">
      <div class="w-full max-w-[400px]">
        <!-- Header -->
        <div class="mb-12">
          <h1 class="animate-fade-in-down mb-2 text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            欢迎登录
          </h1>
          <p class="animate-fade-in-up text-sm font-medium text-slate-500 dark:text-slate-400">
            请输入您的账户信息继续
          </p>
        </div>

        <!-- Login Form -->
        <el-form 
          ref="formRef" 
          :model="loginForm" 
          :rules="rules" 
          label-position="top"
          class="modern-split-form"
        >
          <el-form-item prop="name" class="animate-slide-in-right" style="--delay: 0.1s">
            <template #label>
              <span class="text-xs font-bold uppercase tracking-widest text-slate-400">Username</span>
            </template>
            <el-input
              v-model.trim="loginForm.name"
              placeholder="admin"
              prefix-icon="User"
              class="premium-input-v3"
            />
          </el-form-item>

          <el-form-item prop="password" class="animate-slide-in-right" style="--delay: 0.2s">
            <template #label>
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold uppercase tracking-widest text-slate-400">Password</span>
              </div>
            </template>
            <el-input
              v-model.trim="loginForm.password"
              type="password"
              placeholder="••••••••"
              prefix-icon="Lock"
              show-password
              class="premium-input-v3"
            />
          </el-form-item>

          <!-- Verification View -->
          <div class="animate-slide-in-right mb-10 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-white/5 dark:bg-black/20" style="--delay: 0.3s">
            <slide-verify ref="verifyRef" @success="handleVerifySuccess" />
          </div>

          <div class="animate-slide-in-right" style="--delay: 0.4s">
            <el-button 
              class="login-btn-v3 w-full" 
              type="primary" 
              :loading="loading"
              @click="submitForm"
            >
              登录
            </el-button>
          </div>
        </el-form>

        <!-- Footer Info -->
        <div class="animate-fade-in mt-12 text-center" style="--delay: 0.6s">
          <p class="text-xs text-slate-400">
            没有账号？ <span class="cursor-pointer font-bold text-indigo-600 transition-colors hover:text-indigo-500" @click="handleRegister">联系管理员</span>
          </p>
          <p class="mt-8 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300 dark:text-slate-700">
            Copyright © 2026 Catpark
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import useUserStore from '@/store/modules/user';
import SlideVerify from './slideverify.vue';

const router = useRouter();
const formRef = ref();
const verifyRef = ref();

const loading = ref(false);
const isVerified = ref(false);

const loginForm = reactive({
  name: '',
  password: '',
});

const rules = {
  name: [{ required: true, message: '请输入您的用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入您的密码', trigger: 'blur' }],
};

const handleVerifySuccess = () => {
  isVerified.value = true;
  ElMessage.success('验证通过');
};

const resetVerify = () => {
  verifyRef.value?.reset();
  isVerified.value = false;
};

const submitForm = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate((valid: boolean) => {
    if (valid) {
      if (!isVerified.value) {
        ElMessage.warning('请完成验证滑块');
        return;
      }
      handleLogin();
    }
  });
};

const handleLogin = () => {
  loading.value = true;
  
  setTimeout(() => {
    if (loginForm.name !== 'admin' || loginForm.password !== '666') {
      ElMessage.error('用户名或密码错误');
      loading.value = false;
      resetVerify();
    } else {
      const userStore = useUserStore();
      userStore.name = loginForm.name;
      userStore.token = `CAT-${Math.random().toString(36).substr(2, 9)}`;
      
      ElMessage({
        message: '登录成功. 正在跳转...',
        type: 'success',
        duration: 1000,
        onClose: () => {
          router.push({ name: 'dashboard' });
        }
      });
    }
  }, 600);
};

const handleRegister = () => {
  ElMessage.warning('哦，没有管理员！！');
};
</script>

<style lang="scss" scoped>
// --- Custom Animations ---
@keyframes slideInRight {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-slide-in-right { animation: slideInRight 0.5s ease-out forwards; opacity: 0; animation-delay: var(--delay); }
.animate-fade-in-down { animation: fadeInDown 0.6s ease-out forwards; }
.animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
.animate-fade-in { animation: fadeIn 0.8s ease-out forwards; opacity: 0; animation-delay: var(--delay); }

// --- V3 UI Styles ---
.modern-split-form {
  :deep(.premium-input-v3) {
    .el-input__wrapper {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      box-shadow: none !important;
      border-radius: 12px;
      height: 52px;
      transition: all 0.2s ease;
      
      .dark & {
        background: rgba(255, 255, 255, 0.03);
        border-color: rgba(255, 255, 255, 0.1);
      }
      
      &:hover { border-color: #cbd5e1; .dark & { border-color: rgba(255, 255, 255, 0.2); } }
      &.is-focus { 
        background: white;
        border-color: var(--el-color-primary);
        box-shadow: 0 0 0 4px rgba(var(--el-color-primary-rgb), 0.1) !important;
        .dark & { background: rgba(0, 0, 0, 0.2); }
      }
    }
    
    .el-input__inner {
      font-weight: 500;
      color: #1e293b;
      .dark & { color: white; }
    }
    
    .el-input__prefix-icon { font-size: 18px; color: #64748b; }
  }
}

.login-btn-v3 {
  height: 56px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 16px;
  background: #0f172a;
  border: none;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.2s;
  
  .dark & {
    background: white;
    color: black;
  }
  
  &:hover {
    transform: translateY(-1px);
    background: #1e293b;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    .dark & { background: #f1f5f9; }
  }
  
  &:active { transform: translateY(0); }
}

:deep(.el-form-item) { margin-bottom: 24px; }
:deep(.el-form-item__label) { padding-bottom: 8px; line-height: 1; }
:deep(.el-form-item__error) { font-weight: 600; font-size: 11px; margin-top: 4px; }
</style>
