<template>
  <div class="box flex h-full">
    <div
      id="targetBox"
      class="relative min-w-[260px] max-w-[400px] h-full px-2 py-2 dark:bg-bg_color"
      v-move>
      <div class="px-4 py-2 mb-2 bg-slate-600 rounded">
        <p class="text-white">文件目录</p>
      </div>
      <el-input
        v-model="keywords"
        placeholder="请输入"
        suffix-icon="search"
        @change="search"></el-input>

      <el-tree
        ref="xTree"
        class="h-[calc(100%-80px)]"
        v-model="expandedKeys"
        :data="treeData"
        :props="defaultProps"
        :expand-on-click-node="false"
        node-key="id"
        draggable
        @node-click="handleNodeClick">
        <template #default="{ node, data }">
          <span class="mr-1">
            <svgIcon name="word" v-if="!data.children" />
            <svgIcon name="folderOpen" v-else-if="node.expanded" />
            <svgIcon name="folderClose" v-else />
          </span>
          <span class="custom-tree-node w-full items-center flex justify-between">
            <!-- label 文本与输入框动态切换 -->
            <span v-if="!data.showInput">{{ node.label }}</span>
            <el-popover
              trigger="focus"
              v-else
              :visible="showPopover"
              placement="bottom"
              title="提示"
              :width="180"
              content="必须提供文件或文件名。">
              <template #reference>
                <el-input
                  size="small"
                  v-model="data.label"
                  @focus="focus(data, $event)"
                  @input="(val) => input(val)"
                  @change="handleChange(node, data)"
                  @blur="blur(node, data)"
                  @keydown.enter="blur(node, data)"
                  v-focus>
                </el-input>
              </template>
            </el-popover>

            <!-- 下拉操作菜单 -->
            <el-dropdown trigger="click" class="el-drop">
              <span class="el-dropdown-link">
                <el-icon class="el-icon--right">
                  <More />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-if="data.children"
                    @click.stop="handleOperation(OPERATION.CREATE_FOLDER, node, data)">
                    新增文件夹
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="data.children"
                    @click.stop="handleOperation(OPERATION.CREATE_FILE, node, data)">
                    新增文件
                  </el-dropdown-item>
                  <el-dropdown-item @click.stop="handleOperation(OPERATION.EDIT, node, data)">
                    编辑
                  </el-dropdown-item>
                  <el-dropdown-item @click.stop="handleOperation(OPERATION.DELETE, node, data)">
                    删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </span>
        </template>
      </el-tree>
      <div
        class="drag w-1 h-7 bg-slate-400 absolute right-[-2px] top-[50%] translate-y-[-50%] cursor-col-resize">
      </div>
    </div>
    <div class="flex-1"> </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, ref, watch } from 'vue';
import { ElMessage, ElMessageBox, ElTree } from 'element-plus';
import type Node from 'element-plus/es/components/tree/src/model/node';
import { Tree } from '../interface/index';
import { OPERATION } from '../enum';

// 自定义指定拖拽监听改变宽度
const vMove = {
  mounted: (el: HTMLElement) => {
    el.onmousedown = function (e: MouseEvent) {
      const init = e.clientX;
      const parent = document.getElementById('targetBox');
      const initWidth = parent!.offsetWidth;
      document.onmousemove = function (e: MouseEvent) {
        const end = e.clientX;
        const newWidth = end - init + initWidth;
        parent!.style.width = newWidth + 'px';
      };
      document.onmouseup = function () {
        document.onmousemove = document.onmouseup = null;
      };
    };
  },
};

const xTree = ref<InstanceType<typeof ElTree>>();

// 新增节点初始id
let id = 5;

// 显示输入框提示
const showPopover = ref(false);

// 当前下拉菜单操作 type
const operationType = ref<OPERATION>(OPERATION.CREATE_FILE);

// 当前编辑节点原始 label 数据
const historyLabel = ref<string>('');

// 注册获取 el-input 输入框焦点指令
const vFocus = {
  mounted: (el: any) => {
    const timer = setTimeout(() => {
      nextTick(() => {
        el.querySelector('.el-input__inner').focus();
        clearTimeout(timer);
      });
    }, 500);
  },
};

const keywords = ref('');

const defaultProps = {
  children: 'children',
  label: 'label',
};

const handleNodeClick = (data: Tree) => {
  // console.log(data);
};

const treeData = ref<Tree[]>([
  {
    id: 0,
    label: '栏目1',
    showInput: false,
    children: [
      {
        id: 1,
        label: '栏目1-1',
        showInput: false,
        children: [
          {
            id: 5,
            label: '栏目1-2',
            showInput: false,
          },
        ],
      },
    ],
  },
  {
    id: 2,
    label: '栏目2',
    showInput: false,
    children: [
      {
        id: 3,
        label: '栏目2-1',
        showInput: false,
      },
      {
        id: 4,
        label: '栏目2-2',
        showInput: false,
      },
    ],
  },
  {
    id: 6,
    label: '栏目3',
    showInput: false,
    children: [
      {
        id: 7,
        label: '栏目3-1',
        showInput: false,
      },
      {
        id: 8,
        label: '栏目3-2',
        showInput: false,
      },
    ],
  },
]);

// 节点输入框获取到焦点
const focus = (data: Tree, $event: FocusEvent) => {
  console.log('获取焦点');
  // $event.currentTarget.select(); // 选择文本
};

// 节点输入框失去焦点
const blur = (node: Node, data: Tree) => {
  console.log('失去焦点');
  data.showInput = false;
  if (
    (operationType.value === OPERATION.CREATE_FILE ||
      operationType.value === OPERATION.CREATE_FOLDER) &&
    !data.label
  ) {
    const parent = node.parent;
    const children: Tree[] = parent.data.children || parent.data;
    const index = children.findIndex((d) => d.id === data.id);
    children.splice(index, 1);
  }
};

// 监听节点输入框输入
const input = (val: string) => {
  if (!val) showPopover.value = true;
  else showPopover.value = false;
};

// 输入框值改变时，树节点输入框失焦或 enter 时触发更新树数据
const handleChange = (node: Node, data: Tree) => {
  showPopover.value = false;
  const targetNode = traverseTree(treeData.value, data);
  console.log('s' + targetNode);
  if (targetNode) {
    if (operationType.value !== OPERATION.DELETE && data.label) {
      targetNode.label = data.label;
    } else {
      targetNode.label = historyLabel.value;
    }
    data.showInput = false;
  }
};

// 递归遍历树目录数据找出目标节点
const traverseTree = (data: Tree[], targetNode: Tree): Tree | undefined => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    if (node.id === targetNode.id) return node;
    if (node.children && node.children.length > 0) {
      const result = traverseTree(node.children, targetNode);
      if (result) return result;
    }
  }
};

// 树节点下拉菜单操作：新增文件夹、新增文件、编辑、删除
const handleOperation = (type: OPERATION, node: Node, data: any) => {
  operationType.value = type;
  if (type === OPERATION.CREATE_FOLDER || type === OPERATION.CREATE_FILE) {
    addTreeNode(type, node, data);
  } else if (type === OPERATION.EDIT) {
    historyLabel.value = data.label;
    data.showInput = true;
  } else {
    deleteTreeNode(node, data);
  }
};

// 目录新增文件夹/文件
const addTreeNode = (type: OPERATION, node: Node, data: Tree) => {
  const newNode: Tree = {
    id: id++,
    label: '',
    showInput: true,
  };
  if (type === OPERATION.CREATE_FOLDER) {
    newNode.children = [];
  }
  if (!data.children) {
    data.children = [];
  }
  node.expand();
  data.children.push(newNode);
};

// 目录删除文件夹/文件
const deleteTreeNode = (node: Node, data: Tree) => {
  ElMessageBox.confirm('确定要删除该文件夹/文件?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      ElMessage({
        type: 'success',
        message: '删除成功',
      });
      const parent = node.parent;
      const children: Tree[] = parent.data.children || parent.data;
      const index = children.findIndex((d) => d.id === data.id);
      children.splice(index, 1);
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消',
      });
    });
};

// 搜索
const search = () => {
  treeData.value.forEach((node) => {
    expandNode(node);
    console.log(node);
  });
};

// 展开节点
const expandNode = (node: Tree) => {
  const treeNode = xTree.value?.getNode(node.id);
  if (node.label.includes(keywords.value)) {
    treeNode?.expand();
    if (node.children) {
      node.children.forEach((cnode) => {
        expandNode(cnode);
      });
    }
  } else {
    if (node.children) {
      node.children.forEach((cnode) => {
        expandNode(cnode);
      });
    } else {
      collapseNode(node);
    }
  }
};

// 收拢节点
const collapseNode = (node: Tree) => {
  node.expanded = false;
  const treeNode = xTree.value?.getNode(node.id);
  treeNode?.collapse();
  if (node.children) {
    node.children.forEach((childNode) => {
      collapseNode(childNode);
    });
  }
};

const expandedKeys = ref([]);

watch(
  () => expandedKeys.value,
  () => {
    console.log(expandedKeys.value);
  }
);
</script>

<style scoped lang="scss">
@import url(@/assets/font/iconfont/iconfont.css);

.el-drop {
  margin-right: 6px;
  opacity: 0;
}

.custom-tree-node:hover {
  .el-drop {
    opacity: 1;
  }
}

// :deep .el-tree-node__expand-icon.expanded {
//   transform: rotate(90deg);
// }

// :deep .el-icon-arrow-down:before {
//   content: "\e73c"; // 这里可替换成自己需要的图标字体
// }

// :deep .el-icon-arrow-right:before {
//   content: "\e64e"; // 这里可替换成自己需要的图标字体
// }

// :deep .el-tree-node__expand-icon {
//   background-color: aqua;
// }

:deep(.el-tree .el-tree-node__expand-icon svg) {
  //原有的箭头 去掉
  display: none !important;
  height: 0;
  width: 0;
}

:deep(.el-tree-node__expand-icon) {
  //引入的图标（图片）size大小 => 树节点前的预留空间大小
  font-size: 16px;
}

//图标是否旋转，如果是箭头类型的，可以设置旋转90度。如果是两张图片，则设为0
:deep(.el-tree .el-tree-node__expand-icon.expanded) {
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
}

:deep(.el-tree .el-tree-node__expand-icon:before) {
  // 未展开的节点
  background: url('@/assets/icons/right_arrow.svg');
  content: '';
  display: block;
  width: 16px;
  height: 16px;
  background-size: contain;
  transition: all 0.3s;
}

// :deep .el-tree .el-tree-node__expand-icon.expanded:before {
//   //展开的节点
//   background: url("@/assets/icons/down_arrow.svg");
//   content: '';
//   display: block;
//   width: 18px;
//   height: 18px;
//   margin-top: 4px;
//   background-size: contain;
//   transition: all .3s;
// }

:deep(.el-tree .is-leaf.el-tree-node__expand-icon::before) {
  //叶子节点（不显示图标）
  display: block;
  background: none !important;
  content: '';
  width: 18px;
  height: 18px;
}
</style>
