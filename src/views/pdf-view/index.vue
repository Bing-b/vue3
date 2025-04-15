<template>
  <el-card shadow="never" class="h-full">
    <template #header>
      <p>PDF预览</p>
    </template>
    <div v-loading="loading" class="h-[calc(100vh-61px)]" element-loading-text="加载中...">
      <div class="flex h-9 items-center justify-between">
        <div v-if="showAllPages" class="ml-1.25 text-xl font-medium">
          共{{ pageParams.total }}页
        </div>
        <div v-else>
          <el-pagination
            v-model:current-page="pageParams.currentPage"
            background
            layout="prev, slot, next"
            :page-size="1"
            :total="pageParams.total">
            {{ pageParams.currentPage }} / {{ pageParams.total }}
          </el-pagination>
        </div>
        <div class="flex-bc w-[170px]">
          <el-checkbox v-model="showAllPages" @change="showAllPagesChange">
            显示所有页面
          </el-checkbox>
        </div>
      </div>
      <el-scrollbar>
        <vue-pdf-embed
          ref="pdfRef"
          class="container h-full w-full overflow-auto"
          :page="pageParams.currentPage"
          :source="source"
          @rendered="handleDocumentRender" />
      </el-scrollbar>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { ref } from 'vue';
import VuePdfEmbed from 'vue-pdf-embed';
// // essential styles
// import 'vue-pdf-embed/dist/style/index.css';

// // optional styles
// import 'vue-pdf-embed/dist/style/annotationLayer.css';
// import 'vue-pdf-embed/dist/style/textLayer.css';

const loading = ref<boolean>(true);

const pdfRef = ref<any>();

// 分页参数
const pageParams = reactive({
  currentPage: 1,
  total: 0,
});

// 显示全部(不分页)
const showAllPages = ref(false);

const source = './public/leaflet技术调研.pdf';

const handleDocumentRender = () => {
  loading.value = false;
  pageParams.total = pdfRef.value.doc.numPages;
};

const showAllPagesChange = () => {
  pageParams.currentPage = showAllPages.value ? 0 : 1;
};
</script>

<style scoped></style>
