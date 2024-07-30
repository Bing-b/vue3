<template>
  <div class="h-full">
    <h2 class="title w-full">文本标注</h2>
    <div class="p-5">
      <el-link href="https://github.com/synyi/poplar/blob/master/doc/zh.md" target="_blank"
        >Poplar-annotator</el-link
      >
      <div class="flex">
        <!-- 抽取文本输入框 -->
        <div class="editor w-1/2">
          <h4 class="my-1">文本输入</h4>
          <el-input
            v-model="textContent"
            type="textarea"
            resize="none"
            :rows="10"
            placeholder=""></el-input>
          <el-button class="mt-[10px]" type="primary" @click="extraction">抽取</el-button>
        </div>

        <!-- 文本标注容器 -->
        <div class="w-1/2 ml-5">
          <h4 class="my-1">文本标注</h4>
          <div class="mb-3 px-2 py-3 border border-[#dedede] rounded">
            <el-badge
              v-for="item in labelStore"
              :key="item.id"
              :value="item.num"
              class="item mr-4"
              type="warning">
              <el-tag :hit="true" :color="item.color">{{ item.text }}</el-tag>
            </el-badge>
          </div>
          <div id="example" class="border border-[#dedede] rounded h-[300px] overflow-hidden"></div>
          <div class="flex items-center mt-4">
            <el-button v-show="annotator" type="primary" @click="exprotJson">导出JSON</el-button>
            <el-button v-show="annotator" type="primary" @click="exportSVG">导出SVG</el-button></div
          >
        </div>
      </div>
    </div>

    <!-- label分类选择弹窗 -->
    <label-category-dialog
      v-model:visible="showLabelCategoriesDialog"
      :LabelCategorys="LabelCategorys"
      @updateLable="addLabel" />

    <!-- connection分类选择弹窗 -->
    <connection-category-dialog
      v-model:visible="showConnectionCategoriesDialog"
      :connectionCategories="connectionCategories"
      @updateConnection="addConnection" />
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, computed, reactive, ComputedRef } from 'vue';
import { Annotator, Action } from 'poplar-annotation';
import { LabelCategory } from 'poplar-annotation/dist/Store/LabelCategory';
import { ConnectionCategory } from 'poplar-annotation/dist/Store/ConnectionCategory';
import { ConfigInput } from 'poplar-annotation/dist/Config';
import { annototarData } from './interface/index';
import LabelCategoryDialog from './labelCategoryDialog/index.vue';
import ConnectionCategoryDialog from './connectionCategoryDialog/index.vue';

// 定义 label & connection 新增或修改的操作
enum CategorySelectModes {
  CREATE,
  UPDATE,
}

// 标注实例对象
// let annotator = reactive<Annotator | null>(null) as Annotator | null;
// const annotator: Annotator | null = reactive<Annotator | null>(null);
const annotator = ref<Annotator | null>(null);

// 标注文本内容
const textContent = ref<string>('');

// 标注创建或更新
const CategorySelectMode = ref<CategorySelectModes>(CategorySelectModes.CREATE);

// 显示label分类选择弹窗
const showLabelCategoriesDialog = ref<boolean>(false);

// 显示connection分类选择弹窗
const showConnectionCategoriesDialog = ref<boolean>(false);

// 定义编辑文本标注时所需数据类型
const state = reactive<annototarData>({
  startIndex: -1,
  endIndex: -1,
  selectedId: -1,
  sourceId: -1,
  targetId: -1,
});

// annotator默认配置项
const anConfig: ConfigInput = {
  topContextMargin: 0, // Line顶部渲染内容的margin
  connectionWidthCalcMethod: 'line', // 计算connection的碰撞箱时使用的方案
  unconnectedLineStyle: 'curve', // 点击label 显示连线 'curve(曲线)'，'straight(直线)'，'none'
  labelWidthCalcMethod: 'label',
};

// 构建生成标注图
const extraction = () => {
  const data = {
    content: textContent.value,
    labelCategories: [
      // 定义文本类型
      {
        id: 0,
        text: '地方',
        color: '#fae88e',
        borderColor: '#dfc33a',
      },
      {
        id: 1,
        text: '动物',
        color: '#cdec90',
        borderColor: '#98d918',
      },
      {
        id: 2,
        text: '动作',
        color: '#7da1ed',
        borderColor: '#265ac9',
      },
    ],
    labels: [
      // 定义抽取结果
      {
        id: 0,
        categoryId: 0, // 类型id
        startIndex: 0,
        endIndex: 2,
      },
      {
        id: 1,
        categoryId: 1,
        startIndex: 8,
        endIndex: 9,
      },
      {
        id: 2,
        categoryId: 2,
        startIndex: 23,
        endIndex: 24,
      },
    ],
    connectionCategories: [
      {
        id: 0,
        text: '关系1',
      },
      {
        id: 1,
        text: '关系2',
      },
    ],
    connections: [
      {
        id: 0,
        categoryId: 0,
        fromId: 0,
        toId: 1,
      },
      {
        id: 1,
        categoryId: 1,
        fromId: 1,
        toId: 2,
      },
    ],
  };
  const eleAnnotator = document.getElementById('example') as HTMLElement;
  if (annotator.value) annotator.value.remove();
  annotator.value = new Annotator(data, eleAnnotator, anConfig);

  // 抽取内容选取了一段文本后
  annotator.value.on('textSelected', (startIndex: number, endIndex: number) => {
    state.startIndex = startIndex;
    state.endIndex = endIndex;
    showLabelCategoriesDialog.value = true;
    CategorySelectMode.value = CategorySelectModes.CREATE;
  });

  // 右键删除lable
  annotator.value.on('labelRightClicked', (labelId) => {
    annotator.value!.applyAction(Action.Label.Delete(labelId));
  });

  // 双击更新label类型
  annotator.value.on('labelDoubleClicked', (labelId) => {
    CategorySelectMode.value = CategorySelectModes.UPDATE;
    state.selectedId = labelId;
    showLabelCategoriesDialog.value = true;
  });

  // 先后点击两个label后进行关系构建
  annotator.value.on('twoLabelsClicked', (sourceId, targetId) => {
    if (sourceId !== targetId) {
      state.sourceId = sourceId;
      state.targetId = targetId;
      CategorySelectMode.value = CategorySelectModes.CREATE;
      showConnectionCategoriesDialog.value = true;
    }
  });

  // 双击关系类型文字后更新关系类型
  annotator.value.on('connectionDoubleClicked', (connectionId: number) => {
    state.selectedId = connectionId;
    CategorySelectMode.value = CategorySelectModes.UPDATE;
    showConnectionCategoriesDialog.value = true;
  });

  // 右击关系类型文字删除
  annotator.value.on('connectionRightClicked', (connectionId: number) => {
    annotator.value!.applyAction(Action.Connection.Delete(connectionId));
  });
};

// 添加或修改lable
const addLabel = (categoryId: number) => {
  if (CategorySelectMode.value === CategorySelectModes.CREATE) {
    annotator.value!.applyAction(Action.Label.Create(categoryId, state.startIndex, state.endIndex));
  } else {
    annotator.value!.applyAction(Action.Label.Update(state.selectedId, categoryId));
  }
  showLabelCategoriesDialog.value = false;
};

// 添加或修改connection
const addConnection = (connectionId: number) => {
  if (CategorySelectMode.value === CategorySelectModes.CREATE) {
    annotator.value!.applyAction(
      Action.Connection.Create(connectionId, state.sourceId, state.targetId)
    );
  } else {
    annotator.value!.applyAction(Action.Connection.Update(state.selectedId, connectionId));
  }
  showConnectionCategoriesDialog.value = false;
};

// 导出标注数据JSON
const exprotJson = () => {
  const eleLink = document.createElement('a');
  eleLink.download = 'data.json';
  eleLink.style.display = 'none';
  const blob = new Blob([JSON.stringify(annotator.value!.store.json, null, 4)]);
  eleLink.href = URL.createObjectURL(blob);
  document.body.appendChild(eleLink);
  eleLink.click();
  document.body.removeChild(eleLink);
};

// 导出SVG
const exportSVG = () => {
  const eleLink = document.createElement('a');
  eleLink.download = 'data.svg';
  eleLink.style.display = 'none';
  const blob = new Blob([annotator.value!.export()]);
  eleLink.href = URL.createObjectURL(blob);
  document.body.appendChild(eleLink);
  eleLink.click();
  document.body.removeChild(eleLink);
};

// 动态计算当前实例已存在label类型数据
const LabelCategorys: ComputedRef<LabelCategory.Entity[]> = computed(() => {
  if (annotator.value === null) {
    return [];
  }
  const result = [];
  for (const [_, category] of annotator.value!.store.labelCategoryRepo) {
    result.push(category);
  }
  return result;
});

// 动态计算当前实例已存在connection类型数据
const connectionCategories: ComputedRef<ConnectionCategory.Entity[]> = computed(() => {
  if (annotator.value === null) {
    return [];
  }
  const result = [];
  for (const [_, category] of annotator.value.store.connectionCategoryRepo) {
    result.push(category);
  }
  return result;
});

// 动态统计当前示例各类lable数量
const labelStore: ComputedRef<
  { id: number; text: string; color: string; borderColor: string; num: number }[]
> = computed(() => {
  if (annotator.value === null) {
    return [];
  }
  const result = [];
  const labelCategories: {
    id: number;
    text: string;
    color: string;
    borderColor: string;
    num?: number;
  }[] = [];
  for (const [_, category] of annotator.value!.store.labelCategoryRepo) {
    labelCategories.push(category);
  }
  for (const [_, category] of annotator.value.store.labelRepo) {
    result.push(category.json);
  }

  // const labelCount = result.reduce((temp: any, item) => {
  //   if (!temp[item.categoryId]) {
  //     temp[item.categoryId] = 1;
  //   } else {
  //     temp[item.categoryId]++;
  //   }
  //   return temp;
  // }, {});

  // labelCategories.forEach(item => {
  //   const key = item.id;
  //   if (key in labelCount) {
  //     item.num = labelCount[key];
  //   }
  // });

  // 代码简化
  const labelCount = result.reduce(
    (acc: any, item) => (acc.set(item.categoryId, (acc.get(item.categoryId) || 0) + 1), acc),
    new Map()
  );
  labelCategories.forEach((item) => {
    const key = item.id;
    if (labelCount.has(key)) {
      item.num = labelCount.get(key);
    }
  });

  return labelCategories;
});

onMounted(() => {
  textContent.value =
    '北冥有鱼，其名为鲲。 鲲之大，不知其几千里也；化而为鸟，其名为鹏。鹏之背，不知其几千里也；怒而飞，其翼若垂天之云。是鸟也，海运则将徙于南冥。南冥者，天池也。《齐谐》者，志怪者也。《谐》之言曰：“鹏之徙于南冥也，水击三千里，抟扶摇而上者九万里，去以六月息者也。”野马也，尘埃也，生物之以息相吹也。天之苍苍，其正色邪？其远而无所至极邪？其视下也，亦若是则已矣。';
});
</script>
<style lang="scss" scoped>
:deep(.el-tag) {
  color: #333;
  border: none;
}

#example {
  padding: 20px 10px;
  overflow: auto;

  :deep(svg) {
    width: 100%;
    font-size: 15px;

    .poplar-annotation-label {
      font-size: 14px;
    }

    // 修改连线样式
    .poplar-annotation-connection-line {
      stroke: #fb9776;
      transform: translateY(3px);

      //stroke-width: 2px;
      &:hover {
        stroke: red;
      }
    }

    // 修改连线类型文字样式
    .poplar-annotation-connection {
      font-size: 14px;
      transform: translateY(-3px);
    }

    // 修改连线箭头样式
    #marker-arrow {
      path {
        fill: #fb9776;
        stroke: #fb9776;
      }
    }

    // 修改标注文本内容样式
    tspan {
      fill: #464646;
    }
  }
}
</style>
