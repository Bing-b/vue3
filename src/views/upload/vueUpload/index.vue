<template>
  <div class="vue-upload-wrapper">
    <!-- Action Bar -->
    <div class="action-bar flex items-center justify-between mb-6 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
      <div class="flex items-center gap-4">
        <VueUpload
          ref="upload"
          v-model="files"
          :post-action="postUrl"
          :multiple="true"
          @input-file="inputFile"
          @input-filter="inputFilter"
        >
          <el-button type="primary" :icon="Plus" round>选择文件</el-button>
        </VueUpload>
        <span class="text-xs font-bold text-slate-400" v-if="files.length">已选 {{ files.length }} 个文件</span>
      </div>

      <el-button 
        type="success" 
        :icon="Upload" 
        :disabled="!files.length || uploading" 
        @click.prevent="uploadFiles"
        round
      >
        开始上传
      </el-button>
    </div>

    <!-- File List -->
    <div class="file-grid grid grid-cols-1 md:grid-cols-2 gap-4">
      <transition-group name="list">
        <div v-for="file in files" :key="file.id" class="file-item-card group">
          <div class="flex items-center gap-4 p-4">
            <div class="file-preview flex-none w-16 h-16 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center">
              <img v-if="file.blob" :src="file.blob" class="w-full h-full object-cover" />
              <el-icon v-else class="text-2xl text-slate-300"><Document /></el-icon>
            </div>

            <div class="file-info flex-1 min-width-0">
              <div class="flex items-center justify-between mb-1">
                <h5 class="text-sm font-bold text-slate-700 truncate pr-4">{{ file.name }}</h5>
                <el-icon v-if="file.success" class="text-emerald-500 font-bold"><CircleCheckFilled /></el-icon>
                <el-icon v-if="file.error" class="text-red-500 font-bold"><CircleCloseFilled /></el-icon>
              </div>
              <p class="text-[11px] font-bold text-slate-400">{{ formatSize(file.size) }}</p>
              
              <!-- Progress -->
              <div v-if="file.active || file.progress !== '0.00'" class="mt-2">
                <el-progress :percentage="parseFloat(file.progress)" :stroke-width="4" :show-text="false" />
              </div>
            </div>

            <div class="file-actions opacity-0 group-hover:opacity-100 transition-opacity">
              <el-button 
                type="danger" 
                :icon="Delete" 
                circle 
                size="small" 
                @click="removeFile(file)" 
              />
            </div>
          </div>
        </div>
      </transition-group>
    </div>

    <!-- Empty State -->
    <div v-if="!files.length" class="empty-upload p-12 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center bg-slate-50/50">
      <el-icon class="text-5xl text-slate-200 mb-4"><UploadFilled /></el-icon>
      <p class="text-sm font-bold text-slate-400">暂无待上传文件</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import VueUpload from 'vue-upload-component';
import { 
  Plus, 
  Upload, 
  Delete, 
  Document, 
  CircleCheckFilled, 
  CircleCloseFilled,
  UploadFilled
} from '@element-plus/icons-vue';

const postUrl = 'http://127.0.0.1:3000/oss/upload';

// 上传文件列表
const files = ref<any[]>([]);

// 上传文件实例
const upload = ref();

const uploading = ref(false);

const formatSize = (size: number) => {
  if (size === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(size) / Math.log(k));
  return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const inputFile = (newFile: any, oldFile: any) => {
  if (newFile && oldFile && !newFile.active && oldFile.active) {
    if (newFile.xhr && newFile.xhr.status === 200) {
      console.log('Upload success');
    }
  }
};

const inputFilter = (newFile: any, oldFile: any, prevent: any) => {
  if (newFile && !oldFile) {
    if (!/\.(jpeg|jpe|jpg|gif|png|webp|svg|zip|pdf|docx)$/i.test(newFile.name)) {
      alert('文件格式不支持');
      return prevent();
    }
  }

  if (newFile && (!oldFile || newFile.file !== oldFile.file)) {
    newFile.blob = '';
    const URL = window.URL || window.webkitURL;
    if (URL && URL.createObjectURL && newFile.file) {
      newFile.blob = URL.createObjectURL(newFile.file);
    }
  }
};

const uploadFiles = () => {
  if (upload.value) {
    upload.value.active = true;
  }
};

const removeFile = (file: any) => {
  if (upload.value) {
    upload.value.remove(file);
  }
};
</script>

<style lang="scss" scoped>
.file-item-card {
  background: white;
  border: 1px solid #f1f5f9;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    border-color: #6366f1;
    box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.1);
    transform: translateY(-2px);
  }
}

.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
