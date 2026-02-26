<template>
  <div class="other-view-container h-full">
    <!-- 背景装饰 -->
    <div class="bg-decoration"></div>

    <div class="main-layout flex h-full">
      <!-- 左侧目录 -->
      <aside class="sidebar-wrapper">
        <div class="sidebar-header">
          <div class="logo-icon">
            <el-icon><Menu /></el-icon>
          </div>
          <h3 class="sidebar-title">功能实验室</h3>
        </div>

        <nav class="menu-list">
          <div
            v-for="item in leftSideMenu"
            :key="item.name"
            class="menu-item"
            :class="{ active: activeComponent === item.component }"
            @click="handleChangeComponent(item)"
          >
            <el-icon class="item-icon">
              <component :is="item.icon" />
            </el-icon>
            <span class="item-name">{{ item.name }}</span>
          </div>
        </nav>
      </aside>

      <!-- 右侧模块切换 -->
      <main class="content-wrapper flex-1">
        <header class="content-header">
          <h2 class="current-title">{{ currentMenuName }}</h2>
          <p class="current-desc">组件测试与功能验证记录</p>
        </header>

        <div class="component-view">
          <router-view v-slot="{ Component }">
            <transition name="fade-slide" mode="out-in">
              <KeepAlive>
                <component :is="componentsMap[activeComponent]" v-bind="$attrs" />
              </KeepAlive>
            </transition>
          </router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  computed,
  defineAsyncComponent,
  shallowRef,
} from 'vue';
import {
  Menu,
  Mouse,
  View,
  ScaleToOriginal,
  Clock,
  ArrowRight,
  List,
  Sort,
  Basketball,
  Pointer,
} from '@element-plus/icons-vue';

const ElTooltipPlus = defineAsyncComponent(() => import('./components/el-tooltip-plus.vue'));
const ClickOutSide = defineAsyncComponent(() => import('./components/click-outside.vue'));
const UseResizeObserve = defineAsyncComponent(() => import('./components/use-resize-observer.vue'));
const PLimit = defineAsyncComponent(() => import('./components/p-limit.vue'));
const RowScroll = defineAsyncComponent(() => import('./components/row-scroll.vue'));
const Progress = defineAsyncComponent(() => import('./components/progress.vue'));
const InfinteVirtualList = defineAsyncComponent(
  () => import('./components/infinite-virtual-list.vue'),
);
const SortTable = defineAsyncComponent(() => import('./components/sortTable.vue'));
const Bolb = defineAsyncComponent(() => import('./components/blob.vue'));
const SSE = defineAsyncComponent(() => import('./components/sse.vue'));

const componentsMap: Recordable = {
  componentA: ElTooltipPlus,
  componentB: ClickOutSide,
  componentC: UseResizeObserve,
  componentD: PLimit,
  componentE: RowScroll,
  componentF: Progress,
  componentG: InfinteVirtualList,
  componentH: SortTable,
  componentI: Bolb,
  componentJ: SSE,
};

// 左侧菜单
const leftSideMenu = [
  {
    name: 'Tooltip 增强',
    component: 'componentA',
    icon: Pointer,
  },
  {
    name: '点击外部监听',
    component: 'componentB',
    icon: Mouse,
  },
  {
    name: '调整尺寸观察',
    component: 'componentC',
    icon: ScaleToOriginal,
  },
  {
    name: '并发请求限制',
    component: 'componentD',
    icon: Clock,
  },
  {
    name: '横向滚动列表',
    component: 'componentE',
    icon: ArrowRight,
  },
  {
    name: '智能进度条',
    component: 'componentF',
    icon: List,
  },
  {
    name: '虚拟长列表',
    component: 'componentG',
    icon: View,
  },
  {
    name: '可拖动表格',
    component: 'componentH',
    icon: Sort,
  },
  {
    name: 'Blob 数据处理',
    component: 'componentI',
    icon: Basketball,
  },
  {
    name: 'SSE 实时通信',
    component: 'componentJ',
    icon: Pointer,
  },
];

// 当前活动的组件
const activeComponent = shallowRef('componentA');

const currentMenuName = computed(() => {
  return leftSideMenu.find((i) => i.component === activeComponent.value)?.name || '';
});

// 切换组件
const handleChangeComponent = (item: any) => {
  activeComponent.value = item.component;
};
</script>

<style lang="scss" scoped>
.other-view-container {
  position: relative;
  background-color: #f8fafc;
  overflow: hidden;

  .bg-decoration {
    position: absolute;
    top: -10%;
    right: -10%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(64, 158, 255, 0.08) 0%, transparent 70%);
    z-index: 0;
    pointer-events: none;
  }
}

.main-layout {
  position: relative;
  z-index: 1;
}

.sidebar-wrapper {
  width: 280px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-right: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  padding: 24px 16px;

  .sidebar-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 32px;
    padding: 0 8px;

    .logo-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #409eff 0%, #3a8ee6 100%);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 20px;
      box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
    }

    .sidebar-title {
      font-size: 18px;
      font-weight: 700;
      color: #1e293b;
      letter-spacing: 0.5px;
    }
  }

  .menu-list {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .menu-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      color: #64748b;
      font-weight: 500;

      .item-icon {
        font-size: 18px;
        transition: transform 0.3s ease;
      }

      &:hover {
        background: rgba(64, 158, 255, 0.05);
        color: #409eff;

        .item-icon {
          transform: translateX(2px);
        }
      }

      &.active {
        background: #409eff;
        color: white;
        box-shadow: 0 4px 12px rgba(64, 158, 255, 0.25);

        .item-icon {
          transform: scale(1.1);
        }
      }
    }
  }
}

.content-wrapper {
  padding: 40px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  .content-header {
    margin-bottom: 32px;

    .current-title {
      font-size: 28px;
      font-weight: 800;
      color: #1e293b;
      margin-bottom: 8px;
    }

    .current-desc {
      color: #94a3b8;
      font-size: 14px;
    }
  }

  .component-view {
    flex: 1;
    min-height: 0;
  }
}

/* Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.98);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.98);
}
</style>
