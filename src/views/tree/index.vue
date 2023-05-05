<template>
  <div class="w-[200px]">
    <div class=" px-4 py-2 mb-2 bg-slate-600 rounded">
      <p class=" text-white">文件目录</p>
    </div>
    <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick">

      <template #default="{ node, data }">
        <span class="mr-1">
          <svgIcon name="word" v-if="!data.children" />
          <svgIcon name="folderOpen" v-else-if="node.expanded" />
          <svgIcon name="folderClose" v-else />
        </span>
        <span class="custom-tree-node w-full items-center flex justify-between">

          <span v-show="!data.showInput">{{ node.label }}</span>
          <el-input size="small" ref="inputVal" v-if="data.showInput" :value="data.label" @focus="focus($event)"
            @input="a => inp(a, data)" @blur="loseFocus(node, data, $event)" v-focus>
          </el-input>
          <el-dropdown :hide-on-click="false" trigger="click" class="el-drop" @click.stop>
            <span class="el-dropdown-link">
              <el-icon class="el-icon--right">
                <More />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleOperation(OPERATION.CREATE_FOLDER, data)">
                  新增文件夹
                </el-dropdown-item>
                <el-dropdown-item>
                  新增文件
                </el-dropdown-item>
                <el-dropdown-item @click="handleOperation(OPERATION.EDIT, data)">
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
interface Tree {
  label: string
  children?: Tree[]
}

enum OPERATION {
  CREATE_FOLDER,
  CREATE_FILE,
  DELETE,
  EDIT
}

const defaultProps = {
  children: 'children',
  label: 'label'
};

const handleNodeClick = (data: Tree) => {
  console.log(data);
};

const data: Tree[] = [
  {
    label: '栏目1',
    children: [
      {
        label: '栏目1-1'
      }
    ]
  },
  {
    label: '栏目2',
    children: [
      {
        label: '栏目2-1'
      },
      {
        label: '栏目2-2'
      }
    ]
  }
];

const focus = ($event: MouseEvent) => {
  $event.currentTarget.select();
};

const loseFocus = (node, data, $event) => {
  data.showInput = !data.showInput;
};

const handleOperation = (type: OPERATION, data: any) => {
  if (type === OPERATION.CREATE_FOLDER) {
    console.log('ss');
  } else if (type === OPERATION.EDIT) {
    data.showInput = true;
  }
};
</script>

<style scoped lang="scss">
@import url(@/assets/font/iconfont/iconfont.css);

.el-drop {
  margin-right: 6px;
  display: none;
}

.custom-tree-node:hover {
  .el-drop {
    display: block;
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
