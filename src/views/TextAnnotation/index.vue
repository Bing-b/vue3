<template>
  <div class="flex">
    <!-- 抽取文本输入框 -->
    <div class="editor w-1/2">
      <h4 class=" my-1">文本输入</h4>
      <el-input v-model="textContent" type="textarea" resize="none" :rows="10" placeholder=""></el-input>
      <el-button class="mt-[10px]" type="primary" @click="extraction">抽取</el-button>
    </div>

    <!-- 文本标注容器 -->
    <div class="w-1/2  ml-5">
      <h4 class=" my-1">标注</h4>
      <div id="example" class="border border-[#dedede] rounded h-[calc(100%-30px)]"></div>
    </div>

    <!-- label分类选择弹窗 -->
    <label-category-dialog v-model:visible="showLabelCategoriesDialog" :LabelCategorys="LabelCategorys"
      @updateLable="addLabel" />

  </div>
</template>
<script lang="ts" setup>
import { Annotator, Action } from 'poplar-annotation';
import { LabelCategory } from "poplar-annotation/dist/Store/LabelCategory";
import { ConfigInput } from 'poplar-annotation/dist/Config';
import { onMounted, ref, nextTick, computed, reactive } from 'vue';
import { annototarData } from './interface/index'
import LabelCategoryDialog from './labelCategoryDialog/index.vue';

// 定义label新增或修改枚举
enum CategorySelectModes {
  CREATE,
  UPDATE
}


// 定义标注实例
// let annotator = reactive<Annotator | null>(null) as Annotator | null;
let annotator = ref<Annotator | null>(null);

// 标注文本内容
const textContent = ref<string>('');

// 标注创建或更新
const CategorySelectMode = ref<CategorySelectModes>(CategorySelectModes.CREATE);

// 是否显示label分类选择弹窗
const showLabelCategoriesDialog = ref<boolean>(false);

// 定义编辑文本标注时所需数据类型
const state = reactive<annototarData>({
  startIndex: -1,
  endIndex: -1,
  selectedId: -1
})

// annotator默认配置项
const anConfig: ConfigInput = {
  topContextMargin: 0, // Line顶部渲染内容的margin
  connectionWidthCalcMethod: 'line' // 计算connection的碰撞箱时使用的方案
}

// 构建生成标注图
const extraction = () => {
  const data = {
    content: textContent.value,
    labelCategories: [ // 定义文本类型
      {
        id: 0,
        text: "地方",
        color: "#eac0a2",
        borderColor: "#8c7361"
      },
      {
        id: 1,
        text: "动物",
        color: "#6be1ac",
        borderColor: "#2acd84"
      },
      {
        id: 2,
        text: "动作",
        color: "#7da1ed",
        borderColor: "#265ac9"
      }
    ],
    labels: [ // 定义抽取结果
      {
        id: 0,
        categoryId: 0, // 类型id
        startIndex: 0,
        endIndex: 2
      },
      {
        id: 1,
        categoryId: 1,
        startIndex: 8,
        endIndex: 9
      },
      {
        id: 2,
        categoryId: 2,
        startIndex: 22,
        endIndex: 23
      }
    ],
    connectionCategories: [
      {
        id: 0,
        text: "关系"
      },
      {
        id: 1,
        text: "行为"
      },
    ],
    connections: [
      {
        id: 0,
        categoryId: 0,
        fromId: 0,
        toId: 1
      },
      {
        id: 1,
        categoryId: 1,
        fromId: 1,
        toId: 2
      },
    ]
  };
  const eleAnnotator = document.getElementById('example') as HTMLElement;
  if (annotator.value) annotator.value.remove();
  annotator.value = new Annotator(data, eleAnnotator, anConfig);

  annotator.value.on('textSelected', (startIndex: number, endIndex: number) => {
    state.startIndex = startIndex;
    state.endIndex = endIndex;
    showLabelCategoriesDialog.value = true;
    CategorySelectMode.value = CategorySelectModes.CREATE;
  });

  annotator.value.on("labelRightClicked", (labelId, event: MouseEvent) => {
    debugger
    if (event.ctrlKey) {
      CategorySelectMode.value = CategorySelectModes.UPDATE;
      state.selectedId = labelId;
      showLabelCategoriesDialog.value = true;
    } else {
      annotator.value!.applyAction(Action.Label.Delete(labelId));
    }
    // this.updateJSON();
  });
}

// 添加或修改lable
const addLabel = (categoryId: number) => {
  if (CategorySelectMode.value === CategorySelectModes.CREATE) {
    annotator.value!.applyAction(Action.Label.Create(categoryId, state.startIndex, state.endIndex));
  } else {
    annotator.value!.applyAction(Action.Label.Update(this.selectedId, categoryId));
  }
  showLabelCategoriesDialog.value = false;
  console.log(categoryId)
}



// 动态计算当前实例已存在label类型数据
const LabelCategorys: LabelCategory.Entity = computed(() => {
  if (annotator.value === null) {
    return [];
  }
  const result = [];
  for (const [_, category] of annotator.value!.store.labelCategoryRepo) {
    result.push(category);
  }
  return result;
})



onMounted(() => {
  textContent.value = '北冥有鱼，其名为鲲。鲲之大，不知其几千里也；化而为鸟，其名为鹏。鹏之背，不知其几千里也；怒而飞，其翼若垂天之云。是鸟也，海运则将徙于南冥。南冥者，天池也。《齐谐》者，志怪者也。《谐》之言曰：“鹏之徙于南冥也，水击三千里，抟扶摇而上者九万里，去以六月息者也。”野马也，尘埃也，生物之以息相吹也。天之苍苍，其正色邪？其远而无所至极邪？其视下也，亦若是则已矣。'

})



</script>
<style lang="scss" >
#example>svg {
  width: 100%;
}

.c {
  color: #265ac9;
}
</style>
