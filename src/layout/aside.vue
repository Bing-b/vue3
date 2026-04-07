<template>
  <div
    class="menu-box apple-glass relative z-20 !border-none select-none"
    :data-collapse="menuCollsapse">
    <el-menu router :default-active="defaultActive" :collapse="menuCollsapse" :unique-opened="true">
      <template v-for="menu in menuList" :key="menu.path">
        <!-- 有子菜单 -->
        <el-sub-menu
          @click="handleClickMenu(menu)"
          v-if="menu.children && menu.children.length > 0"
          :index="menu.path"
          :class="{ choseMenu: menu.choose }">
          <template #title>
            <div class="flex w-full items-center gap-3">
              <svgIcon :name="menu.meta?.icon" size="18" class="opacity-70" />
              <span class="text-xs font-medium">{{ menu.meta?.title }}</span>
            </div>
          </template>

          <!-- 子级菜单渲染 -->
          <template v-for="child in menu.children" :key="child.path">
            <el-sub-menu v-if="child.children && child.children.length > 0" :index="child.path">
              <template #title>
                <span class="text-xs">{{ child.meta?.title }}</span>
              </template>
              <el-menu-item v-for="sub in child.children" :key="sub.path" :index="sub.path">
                <span class="text-[11px]">{{ sub.meta?.title }}</span>
              </el-menu-item>
            </el-sub-menu>

            <el-menu-item v-else :index="child.path">
              <span class="ml-4 text-[11px]">{{ child.meta?.title }}</span>
            </el-menu-item>
          </template>
        </el-sub-menu>

        <!-- 无子菜单 -->
        <el-menu-item
          v-else
          :index="menu.path"
          :class="{ choseMenu: menu.choose }"
          @click="handleClickMenu(menu)">
          <div class="flex w-full items-center gap-3">
            <svgIcon :name="menu.meta?.icon" size="18" class="opacity-70" />
            <span class="text-xs font-medium">{{ menu.meta?.title }}</span>
          </div>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { mainRoutes } from '@/router/route';
import { onMounted } from 'vue';
import { nextTick } from 'vue';
import { onBeforeRouteUpdate, RouteRecordRaw, useRoute, useRouter } from 'vue-router';

type Menu = RouteRecordRaw & { choose: boolean };

const route = useRoute();
const router = useRouter();

// 菜单收展
const menuCollsapse = defineModel('menuCollsapse', { default: false });

// 默认目录
const defaultActive = ref('/');

const menuList = ref<Menu[]>([]);

const filterRoutes = () => {
  let templateRoutes = [] as any;
  templateRoutes = mainRoutes.filter((item) => item.name === 'index');
  menuList.value = [...templateRoutes[0].children];
};

/** 处理点击菜单 */
const handleClickMenu = (menu: Menu) => {
  menuList.value.forEach((i) => {
    i.choose = false;
  });

  if (!menu.children) return;

  menu.choose = true;
  const isCurrentPath = menu.children?.find((i) => i.path === defaultActive.value);
  if (!isCurrentPath) {
    const firstChildPath = menu.children[0].path;
    defaultActive.value = firstChildPath;
    if (route.path !== firstChildPath) {
      router.push(firstChildPath);
    }
  }
};

/** 设置当前路由高亮 */
const setCurrentRouterHighlight = (menu: Menu) => {
  const { path, meta } = menu;
  if (meta?.isHide) {
    defaultActive.value = meta.parentPath as string;
  } else {
    defaultActive.value = path;
  }

  nextTick(() => {
    menuList.value.forEach((m: Menu) => {
      if (m.children) {
        const isChild = m.children.find((i) => i.path === path);
        m.choose = !!isChild;
      }
      if (m.path === path) m.choose = true;
    });
  });
};

onBeforeRouteUpdate((to) => {
  setCurrentRouterHighlight(to as any);
});

onMounted(() => {
  filterRoutes();
  setCurrentRouterHighlight(route as any);
});
</script>

<style lang="scss" scoped>
.menu-box {
  height: 100%;
  width: 180px;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 10px;
  svg {
    flex: none;
  }
  &[data-collapse='true'] {
    width: 64px;
  }

  :deep(.el-menu) {
    background: transparent !important;
    border-right: none;
    height: 100%;

    .el-menu-item,
    .el-sub-menu__title {
      height: 36px !important;
      line-height: 36px !important;
      margin: 4px 0;
      border-radius: 8px;
      color: #1d1d1f !important;
      transition: all 0.2s ease;

      &:hover {
        background-color: rgba(0, 0, 0, 0.05) !important;
      }

      i {
        color: inherit !important;
      }
    }

    .el-menu-item.is-active {
      background-color: #007aff !important;
      color: #fff !important;
      box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);

      .opacity-70 {
        opacity: 1 !important;
      }
    }

    .dark & {
      .el-menu-item,
      .el-sub-menu__title {
        color: #f5f5f7 !important;
        &:hover {
          background-color: rgba(255, 255, 255, 0.1) !important;
        }
      }
      .el-menu-item.is-active {
        background-color: #0a84ff !important;
      }
    }
  }

  :deep(.el-menu.el-menu--collapse) {
    .el-menu-item span,
    .el-sub-menu__title span {
      display: none !important;
    }
  }
}
</style>
