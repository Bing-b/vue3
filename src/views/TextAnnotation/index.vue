<template>
  <div class="flex ">
    <div class="editor w-1/2">
      <el-input v-model="textContent" type="textarea" autosize="none" rows="10" placeholder=""></el-input>
    </div>
    <div class="w-1/2">
      <div id="example"></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Annotator } from 'poplar-annotation';
import { ref } from 'vue';


// 定义标注实例
const annotatorInstance = null;

// 标注文本内容
const textContent = ref<string>();

const data = {
  "content": "测试文本1234 asdf 1234\\n\\n1234 asdf 测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试",
  "labelCategories": [
    {
      "id": 0,
      "text": "Label0",
      "color": "#eac0a2",
      "borderColor": "#8c7361"
    },
    {
      "id": 1,
      "text": "标签1",
      "color": "#eac0a2",
      "borderColor": "#8cff61"
    }
  ],
  "labels": [
    {
      "id": 0,
      "categoryId": 0,
      "startIndex": 0,
      "endIndex": 2
    },
    {
      "id": 1,
      "categoryId": 0,
      "startIndex": 10,
      "endIndex": 13
    }
  ],
  "connectionCategories": [
    {
      "id": 0,
      "text": "connection0"
    }
  ],
  "connections": [
    {
      "id": 0,
      "categoryId": 0,
      "fromId": 0,
      "toId": 1
    }
  ]
}



</script>
<style lang="scss" scoped>
#example>svg {
  width: 500px;
}
</style>
