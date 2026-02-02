<template>
  <div class="demo-card ace-lab-container">
    <div class="demo-info">
      <h4 class="title">代码实验基地</h4>
      <p class="desc">全功能高性能代码编辑器，支持多种编程语言高亮与实时预览</p>
    </div>

    <div class="demo-content">
      <div class="editor-layout h-full flex flex-col">
        <!-- Toolbar -->
        <header class="editor-toolbar px-6 py-4 border-b border-slate-100 bg-white flex items-center justify-between">
          <div class="flex items-center gap-6">
            <div class="config-item">
              <span class="label">语言</span>
              <el-select v-model="settings.mode" size="small" class="w-50">
                <el-option label="JavaScript" value="javascript" />
                <el-option label="TypeScript" value="typescript" />
                <el-option label="HTML" value="html" />
                <el-option label="CSS" value="css" />
                <el-option label="JSON" value="json" />
              </el-select>
            </div>
            
            <div class="config-item">
              <span class="label">主题</span>
              <el-select v-model="settings.theme" size="small" class="w-50">
                <el-option label="Monokai" value="monokai" />
                <el-option label="Chrome" value="chrome" />
                <el-option label="Github" value="github" />
                <el-option label="Tomorrow Night" value="tomorrow_night" />
              </el-select>
            </div>

            <div class="config-item">
              <span class="label">字号</span>
              <el-input-number v-model="settings.fontSize" :min="12" :max="24" size="small" controls-position="right" class="w-24" />
            </div>
          </div>

          <div class="flex items-center gap-2">
            <el-button :icon="RefreshRight" circle size="small" @click="resetCode" title="重置代码" />
            <el-button type="primary" :icon="Download" round size="small" @click="downloadCode">导出</el-button>
          </div>
        </header>

        <!-- Editor Area -->
        <main class="editor-area flex-1 relative overflow-hidden">
          <AceEditor 
            v-model:value="code" 
            :mode="settings.mode"
            :theme="settings.theme"
            :font-size="settings.fontSize"
            class="h-full" 
          />
        </main>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import AceEditor from './editor/index.vue';
import { RefreshRight, Download } from '@element-plus/icons-vue';

const code = ref(`// 欢迎来到代码实验基地
function greet(name) {
  console.log("Hello, " + name + "!");
}

greet("Flyme Admin");
`);

const settings = reactive({
  mode: 'javascript',
  theme: 'monokai',
  fontSize: 14,
});

const resetCode = () => {
  code.value = '';
};

const downloadCode = () => {
  const blob = new Blob([code.value], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `snippet.${settings.mode === 'javascript' ? 'js' : settings.mode}`;
  a.click();
  URL.revokeObjectURL(url);
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
      color: #64748b;
    }
  }

  .demo-content {
    flex: 1;
    min-height: 0;
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid #e2e8f0;
    background: #f8fafc;

    .editor-toolbar {
      .config-item {
        display: flex;
        align-items: center;
        gap: 8px;
        
        .label {
          font-size: 12px;
          width: 60px;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
        }
      }
    }
  }
}
</style>
