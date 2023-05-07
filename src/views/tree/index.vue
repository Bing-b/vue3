<template>
  <div class="w-[200px]">
    <div class=" px-4 py-2 mb-2 bg-slate-600 rounded">
      <p class=" text-white">文件目录</p>
    </div>
    <el-tree
    :data="treeData"
    :props="defaultProps"
    :expand-on-click-node="false"
    node-key="id"
    @node-click="handleNodeClick"
    >
      <template #default="{ node, data }">
        <span class="mr-1">
          <svgIcon name="word" v-if="!data.children" />
          <svgIcon name="folderOpen" v-else-if="node.expanded" />
          <svgIcon name="folderClose" v-else />
        </span>
        <span class="custom-tree-node w-full items-center flex justify-between">

          <span v-if="!data.showInput">{{ node.label }}</span>
          <el-input size="small" v-else v-model="data.label" @focus="focus(data, $event)"
            @input="a => inp(a, data)" @change="handleChange(node, data)" @blur="blur(node, data, $event)" v-focus>
          </el-input>
          <el-dropdown  trigger="click" class="el-drop">
            <span class="el-dropdown-link">
              <el-icon class="el-icon--right">
                <More />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click.stop="handleOperation(OPERATION.CREATE_FOLDER, node, data)">
                  新增文件夹
                </el-dropdown-item>
                <el-dropdown-item>
                  新增文件
                </el-dropdown-item>
                <el-dropdown-item @click.stop="handleOperation(OPERATION.EDIT, node, data)">
                  编辑
                </el-dropdown-item>
                <el-dropdown-item>
                  删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </span>
      </template>
    </el-tree>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, ref } from 'vue';

interface Tree {
  id: number
  label: string
  children?: Tree[]
  showInput?: boolean
}

enum OPERATION {
  CREATE_FOLDER,
  CREATE_FILE,
  DELETE,
  EDIT
}

let id = 5;

const operationType = ref<OPERATION>();
const historyLabel = ref<string>('');

// 注册获取 el-input 输入框焦点指令
const vFocus = {
  mounted: (el:any) => {
    const timer = setTimeout(() => {
      nextTick(() => {
        el.querySelector('.el-input__inner').focus();
        clearTimeout(timer);
      });
    }, 600);
  }
};

const defaultProps = {
  children: 'children',
  label: 'label'
};

const handleNodeClick = (data: Tree, node) => {
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
        showInput: false
      }
    ]
  },
  {
    id: 2,
    label: '栏目2',
    showInput: false,
    children: [
      {
        id: 3,
        label: '栏目2-1',
        showInput: false
      },
      {
        id: 4,
        label: '栏目2-2',
        showInput: false
      }
    ]
  }
]);

const focus = (data:Tree, $event: FocusEvent) => {
  console.log('获取焦点');
  // editText.value = data.label;
  // $event.currentTarget.select(); // 选择文本
};

const blur = (node, data, $event:FocusEvent) => {
  console.log('失去焦点');
  data.showInput = false;
};

// 树节点下拉菜单操作：新增文件夹、新增文件、编辑、删除
const handleOperation = (type: OPERATION, node: any, data: any) => {
  operationType.value = type;
  if (type === OPERATION.CREATE_FOLDER) {
    addTreeNode(type, node, data);
  } else if (type === OPERATION.EDIT) {
    historyLabel.value = data.label;
    data.showInput = true;
  }
};

const inp = (val, d) => {
  console.log(val);
};

// 树节点输入框失焦或enter时触发更新树数据
const handleChange = (node, data:Tree) => {
  console.log(node);
  treeData.value.forEach((node) => {
    if (node.id === data.id) {
      if (operationType.value === OPERATION.EDIT && data.label) {
        node.label = data.label;
      } else {
        node.label = historyLabel.value;
      }
    }
    data.showInput = false;
  });
};

// 新增文件夹或文件
const addTreeNode = (type:OPERATION, node, data:Tree) => {
  const newNode:Tree = {
    id: id++,
    label: '',
    showInput: true
  };
  if (type === OPERATION.CREATE_FOLDER) {
    newNode.children = [];
    if (!data.children) {
      data.children = [];
    }
    node.expand();
    data.children.push(newNode);
  }
};
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

:deep .el-tree .el-tree-node__expand-icon svg {
  //原有的箭头 去掉
  display: none !important;
  height: 0;
  width: 0;
}

:deep .el-tree-node__expand-icon {
  //引入的图标（图片）size大小 => 树节点前的预留空间大小
  font-size: 16px;
}

//图标是否旋转，如果是箭头类型的，可以设置旋转90度。如果是两张图片，则设为0
:deep .el-tree .el-tree-node__expand-icon.expanded {
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
}

:deep .el-tree .el-tree-node__expand-icon:before {
  // 未展开的节点
  background: url("@/assets/icons/right_arrow.svg");
  content: '';
  display: block;
  width: 16px;
  height: 16px;
  background-size: contain;
  transition: all .3s;
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

:deep .el-tree .is-leaf.el-tree-node__expand-icon::before {
  //叶子节点（不显示图标）
  display: block;
  background: none !important;
  content: '';
  width: 18px;
  height: 18px;
}
</style>
