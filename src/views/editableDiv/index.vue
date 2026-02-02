<template>
  <div class="demo-card tag-studio-container">
    <div class="demo-info">
      <h4 class="title">智能标签编辑工坊</h4>
      <p class="desc">基于 contenteditable 的富文本标签编辑器，支持自定义实体插入与动态同步</p>
    </div>

    <div class="demo-content">
      <div class="studio-layout p-8 h-full flex flex-col gap-8">
        <!-- Input Controls -->
        <section class="controls-area flex flex-wrap items-center gap-6 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div class="control-group">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">快捷实体</span>
            <div class="flex flex-wrap gap-2">
              <el-button 
                v-for="item in btns" 
                :key="item" 
                size="small" 
                round
                class="hover:!border-indigo-400 hover:!text-indigo-600 transition-all"
                @click="handleClick(item)"
              >
                {{ item }}
              </el-button>
            </div>
          </div>

          <el-divider direction="vertical" class="!h-12 hidden md:block" />

          <div class="control-group flex-1 min-width-[240px]">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">自定义插入</span>
            <div class="flex gap-2">
              <el-input 
                v-model.trim="inputValue" 
                placeholder="键入内容后回车..." 
                class="premium-input"
                @keyup.enter="handleClick(inputValue)"
              >
                <template #prefix>
                  <el-icon><PriceTag /></el-icon>
                </template>
              </el-input>
              <el-button type="primary" :icon="Plus" @click="handleClick(inputValue)" round>插入</el-button>
            </div>
          </div>
        </section>

        <!-- Editor Area -->
        <section class="editor-area flex-1 flex flex-col min-h-0">
          <div class="area-header flex items-center justify-between mb-4">
            <h5 class="text-sm font-bold text-slate-700 flex items-center gap-2">
              <el-icon><Memo /></el-icon> 实时编辑区域
            </h5>
            <div class="flex gap-2">
              <el-tag v-if="matchList.length" effect="plain" round size="small" type="info">已检测到 {{ matchList.length }} 个实体</el-tag>
            </div>
          </div>
          
          <div class="editor-viewport flex-1 bg-white rounded-2xl border border-slate-200 shadow-inner overflow-hidden flex flex-col">
            <header class="viewport-toolbar px-4 py-2 border-b border-slate-50 bg-slate-50/30 flex justify-end">
               <el-button :icon="Delete" circle size="small" type="danger" plain @click="clearAll" />
            </header>
            <main class="flex-1 overflow-auto p-6">
              <editor ref="editorRef" v-model:matchList="matchList" @updateMatchList="updateMatchList" />
            </main>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Editor from './editor.vue';
import { PriceTag, Plus, Memo, Delete } from '@element-plus/icons-vue';

const btns = ['香蕉', '西瓜', '葡萄', '荔枝', '橘子'];
const matchList = ref<{ matchLabel: string }[]>([]);
const editorRef = ref();
const inputValue = ref('');

const handleClick = (str: string) => {
  if (!str) return;
  matchList.value.push({
    matchLabel: str,
  });
  editorRef.value.insertMatch(str);
  inputValue.value = '';
};

const updateMatchList = () => {
  editorRef.value.clearValue();
  matchList.value.forEach((i) => {
    editorRef.value.insertMatch(i.matchLabel);
  });
};

const clearAll = () => {
  editorRef.value.clearValue();
  matchList.value = [];
};
</script>

<style lang="scss" scoped>
.demo-card {
  background: white;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.03);
  border: 1px solid #f1f5f9;
  height: calc(100vh - 280px);
  display: flex;
  flex-direction: column;

  .demo-info {
    margin-bottom: 24px;
    flex: none;
    .title {
      font-size: 22px;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: -0.5px;
      margin-bottom: 6px;
    }
    .desc {
      font-size: 14px;
      color: #71717a;
    }
  }

  .demo-content {
    flex: 1;
    min-height: 0;
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid #e2e8f0;
    background: #fbfcfe;

    .premium-input {
      :deep(.el-input__wrapper) {
        border-radius: 12px;
        background: #f8fafc;
        box-shadow: none !important;
        border: 1px solid #e2e8f0;
        &:hover, &.is-focus {
          border-color: #6366f1;
          background: white;
        }
      }
    }
  }
}
</style>

<style scoped></style>
