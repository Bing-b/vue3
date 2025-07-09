<template>
  <div class="menu-box dark:border-r-base-border shadow-md dark:border-r">
    <el-menu router :default-active="defaultActive" :collapse="menuCollsapse" :unique-opened="true">
      <template v-for="menu in menuList" :key="menu.path">
        <!-- 有子菜单 -->
        <el-sub-menu
          @click="handleClickMenu(menu)"
          v-if="menu.children && menu.children.length > 0"
          :index="menu.path"
          :class="{ choseMenu: menu.choose }">
          <template #title>
            <svgIcon :name="menu.meta?.icon" size="20" />
            <span class="ml-1">{{ menu.meta?.title }}</span>
          </template>

          <!-- 子级菜单渲染 -->
          <template v-for="child in menu.children" :key="child.path">
            <el-sub-menu v-if="child.children && child.children.length > 0" :index="child.path">
              <template #title>
                <span>{{ child.meta?.title }}</span>
              </template>
              <el-menu-item v-for="sub in child.children" :key="sub.path" :index="sub.path">
                {{ sub.meta?.title }}
              </el-menu-item>
            </el-sub-menu>

            <el-menu-item v-else :index="child.path">
              {{ child.meta?.title }}
            </el-menu-item>
          </template>
        </el-sub-menu>

        <!-- 无子菜单 -->
        <el-menu-item
          v-else
          :index="menu.path"
          :class="{ choseMenu: menu.choose }"
          @click="handleClickMenu(menu)">
          <svgIcon :name="menu.meta?.icon" size="20" />
          <span class="ml-1">{{ menu.meta?.title }}</span>
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
  console.log(menuList.value);
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
    defaultActive.value = menu.children[0].path;
    router.push(defaultActive.value);
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

// 路由更新时
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
  padding-top: 15px;
  height: calc(100vh - 60px);

  svg {
    flex: none;
  }

  :deep(.el-menu) {
    height: 100%;
    border-right: 0;

    .choseMenu {
      .el-sub-menu__title {
        color: #5f85e4 !important;
        background-color: var(--base-menu-background);
      }
    }

    .el-menu-item.is-active.choseMenu {
      color: #5f85e4 !important;
      background-color: var(--base-menu-background);
    }

    .el-menu-item.is-active {
      color: #5f85e4 !important;
    }

    .el-menu-item {
      height: 50px;
      line-height: 50px;
    }

    .el-sub-menu__title {
      height: 50px;
      line-height: 50px;
    }
  }
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 160px;
  height: calc(100vh - 60px);
}
</style>
