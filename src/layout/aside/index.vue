<template>
  <div class="menu-box">
    <el-menu router :default-active="defaultActive" class="el-menu-vertical-demo" :collapse="isCollapse"
      @open="handleOpen" unique-opened @close="handleClose">
      <template v-for="menu in menuLists" :key="menu.path">
        <el-sub-menu :index="menu.path" :key="menu.path" v-if="menu.children && menu.children.length > 0"
          :class="{ 'choseMenu': menu.choose }" @click="openFirst(menu)">
          <template #title>
            <svgIcon :name="menu.meta.icon" size="20" />
            <span class="ml-1">{{ menu.meta.title }}</span>
          </template>

          <!-- 子菜单 -->
          <template v-for="val in menu.children">
            <el-sub-menu :index="val.path" :key="val.path" v-if="val.children && val.children.length > 0">
              <template #title>
                <span>{{ val.meta.title }}</span>
              </template>
              <sub-item :chil="val.children" />
            </el-sub-menu>
            <el-menu-item :index="val.path" :key="val.name" v-else>
              <template #title>
                <span>{{ val.meta.title }}</span>
              </template>
            </el-menu-item>
          </template>
        </el-sub-menu>
        <el-menu-item :index="menu.path" :key="menu.name" v-else @click="clickSingle">
          <svgIcon :name="menu.meta.icon" size="20" />
          <template #title>
            <span class="ml-1">{{ menu.meta.title }}</span>
          </template>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>
<script lang="ts" setup>
import { computed, getCurrentInstance, nextTick, onBeforeMount, onUnmounted, ref } from 'vue';
import { onBeforeRouteUpdate, RouteRecordRaw, useRoute, useRouter } from 'vue-router';

const props = withDefaults(defineProps<{
  menuList: any[],
}>(), {
  menuList: () => []
});

// 菜单默认展开
const isCollapse = ref(false);

// 默认选中栏目
const defaultActive = ref(null);

const { proxy } = getCurrentInstance() as any;

// 菜单列表
const menuLists = computed(() => props.menuList);

const route = useRoute();
const router = useRouter();

// 监听header切换菜单
proxy.mittBus.on('onChangeAsideBar', (isExpansion: boolean) => {
  isCollapse.value = isExpansion;
});

// 设置当前路由高亮
const setCurrentRouterHighlight = (currentRoute: RouteRecordRaw) => {
  const { path, meta } = currentRoute;
  if (meta?.isHide) {
    defaultActive.value = meta.parentPath;
  } else {
    defaultActive.value = path;
  }

  // 设置当前有子元素的路由高亮
  nextTick(() => {
    props.menuList.forEach((menu: any) => {
      if (menu.children) {
        let isCurrentMenuArr = [];
        isCurrentMenuArr = menu.children.filter((child: any) => child.path === path);
        if (isCurrentMenuArr.length > 0) {
          menu.choose = true;
        }
      }
    });
  });
};

// 打开一级菜单时修改样式，并默认打开
const openFirst = (menu) => {
  menuLists.value.forEach((element: any) => {
    element!.choose = false;
  });
  // 控制样式
  menu.choose = true;
  // 判断当前高亮路径是否是当前点击的菜单中，不在此菜单中时打开自菜单中第一个菜单
  const hasCurrentMenuArr: string[] = menu.children.filter((child) => child.path === defaultActive.value);
  if (hasCurrentMenuArr.length === 0) {
    defaultActive.value = menu.children[0].path;
    router.push(defaultActive.value);
  }
};

// 点击没有自菜单的菜单时清楚样式
const clickSingle = () => {
  menuLists.value.forEach((element: any) => {
    element!.choose = false;
  });
};

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};

const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};

// 页面加载时
onBeforeMount(() => {
  setCurrentRouterHighlight(route);
});

// 路由更新时
onBeforeRouteUpdate((to) => {
  setCurrentRouterHighlight(to);
});

// 离开时销毁
onUnmounted(() => {
  proxy.mittBus.off('onChangeAsideBar');
});

</script>
<style lang="scss" scoped>
.menu-box {
  height: calc(100vh - 60px);

  svg {
    flex: none;
  }

  :deep .el-menu {
    height: 100%;

    .choseMenu {
      :deep(.el-sub-menu__title) {
        color: white !important;
        border-left: 8px solid theme("colors.primary") !important;
      }

      :deep(.el-menu-item.is-active) {
        color: white;
      }
    }
  }
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  height: calc(100vh - 60px);
}
</style>
