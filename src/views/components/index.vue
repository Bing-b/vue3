<template>
  <div class="functional-components-container h-full">
    <!-- 背景装饰 -->
    <div class="bg-decoration"></div>

    <div class="main-layout flex h-full">
      <!-- 左侧功能导航 -->
      <aside class="sidebar-wrapper">
        <div class="sidebar-header">
          <div class="logo-icon">
            <el-icon><Menu /></el-icon>
          </div>
          <h3 class="sidebar-title">功能实验基地</h3>
        </div>

        <nav class="menu-list">
          <div
            v-for="item in menuItems"
            :key="item.component"
            class="menu-item"
            :class="{ active: activeComponent === item.component }"
            @click="activeComponent = item.component"
          >
            <el-icon class="item-icon">
              <component :is="item.icon" />
            </el-icon>
            <span class="item-name">{{ item.name }}</span>
          </div>
        </nav>
      </aside>

      <!-- 右侧内容区域 -->
      <main class="content-wrapper flex-1">
        <header class="content-header">
          <h2 class="current-title">{{ currentMenuName }}</h2>
          <p class="current-desc">高性能、可复用的核心业务组件展示与测试</p>
        </header>

        <div class="component-view">
          <transition name="fade-slide" mode="out-in">
            <KeepAlive>
              <component :is="componentsMap[activeComponent]" />
            </KeepAlive>
          </transition>
        </div>
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  defineAsyncComponent,
  shallowRef,
} from 'vue';
import {
  Menu,
  Folder,
  Upload,
  Edit,
  Tickets,
  Postcard,
} from '@element-plus/icons-vue';

// 异步加载组件
const DocLibrary = defineAsyncComponent(() => import('../docLibrary/index.vue'));
const FileUpload = defineAsyncComponent(() => import('../upload/index.vue'));
const AceEditor = defineAsyncComponent(() => import('../ace-editor/index.vue'));
const TextAnnotation = defineAsyncComponent(() => import('../text-annotation/index.vue'));
const EditableDiv = defineAsyncComponent(() => import('../editableDiv/index.vue'));

const componentsMap: Record<string, any> = {
  doc: DocLibrary,
  upload: FileUpload,
  ace: AceEditor,
  annotation: TextAnnotation,
  editable: EditableDiv,
};

const menuItems = [
  { name: '文档解析库', component: 'doc', icon: Folder },
  { name: '高级文件上传', component: 'upload', icon: Upload },
  { name: 'ACE 编辑器', component: 'ace', icon: Edit },
  { name: 'NLP 文本标注', component: 'annotation', icon: Tickets },
  { name: '智能标签编辑', component: 'editable', icon: Postcard },
];

const activeComponent = shallowRef('doc');

const currentMenuName = computed(() => {
  return menuItems.find((i) => i.component === activeComponent.value)?.name || '';
});
</script>

<style lang="scss" scoped>
.functional-components-container {
  position: relative;
  background-color: #f8fafc;
  overflow: hidden;

  .bg-decoration {
    position: absolute;
    top: -5%;
    right: -5%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%);
    pointer-events: none;
  }
}

.main-layout {
  position: relative;
  z-index: 1;
}

.sidebar-wrapper {
  width: 260px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  padding: 32px 16px;

  .sidebar-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 40px;
    padding: 0 8px;

    .logo-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 20px;
      box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
    }

    .sidebar-title {
      font-size: 18px;
      font-weight: 800;
      color: #1e293b;
      letter-spacing: -0.5px;
    }
  }

  .menu-list {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .menu-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 18px;
      border-radius: 14px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      color: #64748b;
      font-weight: 600;

      .item-icon {
        font-size: 18px;
        transition: transform 0.3s ease;
      }

      &:hover {
        background: rgba(99, 102, 241, 0.04);
        color: #6366f1;

        .item-icon {
          transform: scale(1.1);
        }
      }

      &.active {
        background: #6366f1;
        color: white;
        box-shadow: 0 8px 16px -4px rgba(99, 102, 241, 0.4);

        .item-icon {
          transform: scale(1.1);
        }
      }
    }
  }
}

.content-wrapper {
  padding: 40px 60px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  .content-header {
    margin-bottom: 40px;

    .current-title {
      font-size: 32px;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: -1px;
      margin-bottom: 8px;
    }

    .current-desc {
      color: #64748b;
      font-size: 15px;
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
  transform: translateX(30px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
