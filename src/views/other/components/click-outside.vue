<template>
  <div class="demo-card">
    <div class="demo-info">
      <h4 class="title">点击区域外监测 (Click Outside)</h4>
      <p class="desc">展示三种不同方式实现点击外部区域关闭容器的功能</p>
    </div>

    <div class="demo-grid">
      <!-- Method 1 -->
      <div class="method-case">
        <h5 class="method-name">VueUse (onClickOutside)</h5>
        <div class="canvas">
          <xButton @click.stop="visible = true" type="primary">显示容器</xButton>
          <transition name="pop">
            <div v-show="visible" ref="target" class="target-box vuse">
              <span>VueUse 监测中</span>
            </div>
          </transition>
        </div>
      </div>

      <!-- Method 2 -->
      <div class="method-case">
        <h5 class="method-name">Element Plus v-click-outside</h5>
        <div class="canvas">
          <xButton @click.stop="visible2 = true" type="success">显示容器</xButton>
          <transition name="pop">
            <div
              v-show="visible2"
              v-click-outside="onClickOutside2"
              class="target-box element"
            >
              <span>EP 指令 监测中</span>
            </div>
          </transition>
        </div>
      </div>

      <!-- Method 3 -->
      <div class="method-case">
        <h5 class="method-name">原生 JS (contains)</h5>
        <div class="canvas">
          <xButton @click.stop="visible3 = true" type="warning">显示容器</xButton>
          <transition name="pop">
            <div v-show="visible3" id="target-native" class="target-box native">
              <span>原生 JS 监测中</span>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { ClickOutside as vClickOutside } from 'element-plus';

const visible = ref(false);

const visible2 = ref(false);

const visible3 = ref(false);

const target = ref(null);

const target2 = ref(null);

const target3 = ref(null);

onClickOutside(target, (event) => (visible.value = false));

const onClickOutside2 = () => {
  visible2.value = false;
};

// 原生
const onClickOutside3 = (e: MouseEvent) => {
  const ele = document.getElementById('target-native');
  if (ele && !ele.contains(e.target as Node)) {
    visible3.value = false;
  }
};

onMounted(() => {
  document.addEventListener('mousedown', onClickOutside3);
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onClickOutside3);
});
</script>

<style lang="scss" scoped>
.demo-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
  border: 1px solid #f1f5f9;

  .demo-info {
    margin-bottom: 32px;
    .title {
      font-size: 18px;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 4px;
    }
    .desc {
      font-size: 14px;
      color: #94a3b8;
    }
  }

  .demo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 32px;

    .method-case {
      .method-name {
        font-size: 14px;
        font-weight: 600;
        color: #475569;
        margin-bottom: 16px;
        padding-left: 8px;
        border-left: 3px solid #409eff;
      }

      .canvas {
        position: relative;
        height: 240px;
        background: #f8fafc;
        border-radius: 12px;
        border: 1px solid #e2e8f0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}

.target-box {
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  bottom: 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 10;
  backdrop-filter: blur(4px);

  &.vuse {
    background: rgba(64, 158, 255, 0.9);
    color: white;
    border: 1px solid #409eff;
  }
  &.element {
    background: rgba(103, 194, 58, 0.9);
    color: white;
    border: 1px solid #67c23a;
  }
  &.native {
    background: rgba(230, 162, 60, 0.9);
    color: white;
    border: 1px solid #e6a23c;
  }
}

/* Pop transition */
.pop-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.pop-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.pop-enter-from {
  opacity: 0;
  transform: scale(0.5);
}
.pop-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
