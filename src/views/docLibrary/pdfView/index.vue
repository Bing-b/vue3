<template>
  <div class="pdf-viewer-wrapper h-full flex flex-col bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
    <!-- Toolbar -->
    <header class="viewer-toolbar flex items-center justify-between px-6 py-3 border-b border-slate-50 bg-slate-50/50 backdrop-blur-md">
      <div class="doc-info flex items-center gap-3">
        <div class="pdf-icon p-2 rounded-lg bg-red-50 text-red-500">
          <el-icon><Document /></el-icon>
        </div>
        <span class="text-sm font-bold text-slate-700 truncate max-w-[200px]">{{ docLabel }}</span>
      </div>

      <div class="viewer-controls flex items-center gap-6">
        <div v-if="pageParams.total > 0" class="pagination-box">
          <el-pagination
            v-if="!showAllPages"
            v-model:current-page="pageParams.currentPage"
            layout="prev, slot, next"
            :total="pageParams.total"
            :page-size="1"
            class="custom-pager"
          >
            <span class="page-indicator">{{ pageParams.currentPage }} / {{ pageParams.total }}</span>
          </el-pagination>
          <span v-else class="text-xs font-bold text-slate-400">共 {{ pageParams.total }} 页</span>
        </div>

        <el-divider direction="vertical" class="!h-4" />

        <el-checkbox v-model="showAllPages" @change="showAllPagesChange" class="show-all-toggle">
          全部显示
        </el-checkbox>
      </div>
    </header>

    <!-- Content -->
    <main class="viewer-content flex-1 overflow-hidden relative">
      <el-scrollbar>
        <div v-loading="loading" element-loading-text="正在渲染文档..." class="pdf-render-container p-8 min-h-full">
          <vue-pdf-embed
            ref="pdfRef"
            :page="pageParams.currentPage || undefined"
            :source="source"
            class="pdf-canvas-shadow"
            @rendered="handleDocumentRender" />
        </div>
      </el-scrollbar>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { reactive, watch, ref } from 'vue';
import VuePdfEmbed from 'vue-pdf-embed';
import { Document } from '@element-plus/icons-vue';

const { docLabel } = defineProps<{ docLabel: string }>();
const loading = ref(true);
const pdfRef = ref<any>();
const showAllPages = ref(false);
const source = ref('');

const pageParams = reactive({
  currentPage: 1,
  total: 0,
});

const handleDocumentRender = () => {
  loading.value = false;
  pageParams.total = pdfRef.value?.doc?.numPages || 0;
};

const showAllPagesChange = () => {
  pageParams.currentPage = showAllPages.value ? 0 : 1;
};

watch(
  () => docLabel,
  (newVal) => {
    if (!newVal) return;
    source.value = `./public/${newVal}`;
    loading.value = true;
    pageParams.currentPage = 1;
    showAllPages.value = false;
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.pdf-viewer-wrapper {
  .viewer-toolbar {
    .page-indicator {
      font-size: 13px;
      font-weight: 700;
      color: #64748b;
      margin: 0 12px;
    }

    .custom-pager {
      :deep(.btn-prev), :deep(.btn-next) {
        background: white !important;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        &:disabled {
          background: #f8fafc !important;
        }
      }
    }

    .show-all-toggle {
      :deep(.el-checkbox__label) {
        font-size: 12px;
        font-weight: 600;
        color: #64748b;
      }
    }
  }

  .pdf-render-container {
    background: #f1f5f9;
  }

  .pdf-canvas-shadow {
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    background: white;
    margin: 0 auto;
    max-width: 900px;
  }
}
</style>
