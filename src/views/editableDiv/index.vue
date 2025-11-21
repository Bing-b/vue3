<template>
  <div class="h-full">
    <h2 class="title">contenteditable div 应用</h2>

    <div class="w-1/2 p-5">
      <div class="mb-5 flex flex-nowrap items-center gap-4">
        <div>
          <el-button @click="handleClick(i)" v-for="(i, index) in btns" :key="index">{{
            i
          }}</el-button>
        </div>
        <el-input v-model.trim="inputValue" class="!w-[180px]" placeholder="请输入插入文本" />
        <el-button @click="handleClick(inputValue)" type="primary">插入</el-button>
      </div>

      <editor ref="editorRef" v-model:matchList="matchList" @updateMatchList="updateMatchList" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Editor from './editor.vue';

const btns = ['香蕉', '西瓜', '葡萄', '荔枝', '橘子'];

const matchList = ref<{ matchLabel: string }[]>([]);

const editorRef = ref();

const inputValue = ref('');

const handleClick = (str: string) => {
  matchList.value.push({
    matchLabel: str,
  });
  editorRef.value.insertMatch(str);
};

const updateMatchList = () => {
  editorRef.value.clearValue();
  matchList.value.forEach((i) => {
    editorRef.value.insertMatch(i.matchLabel);
  });
};
</script>

<style scoped></style>
