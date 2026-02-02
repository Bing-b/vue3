<template>
  <div class="el-upload-wrapper p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h5 class="text-base font-black text-slate-800 tracking-tight">拖拽排序上传</h5>
        <p class="text-xs font-bold text-slate-400 mt-1">支持拖拽排序、大图预览及多图并发上传</p>
      </div>
      <el-tag effect="light" round size="small" type="info">最多 3 张</el-tag>
    </div>

    <el-upload
      class="premium-upload"
      v-model:file-list="fileList"
      drag
      multiple
      list-type="picture-card"
      accept="image/*"
      action="https://run.mocky.io/v3/3aa761d7-b0b3-4a03-96b3-6168d4f7467b"
      :limit="3"
      :on-exceed="onExceed"
      :before-upload="onBefore">
      
      <div class="upload-trigger-content">
        <el-icon class="text-3xl text-slate-300 mb-2"><Plus /></el-icon>
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">点击或拖拽</p>
      </div>

      <template #file="{ file }">
        <div class="upload-item-inner group" @mouseenter="imgDrop(String(file.uid))">
          <div v-if="file.status === 'uploading'" class="uploading-overlay">
            <el-progress 
              type="circle" 
              :percentage="file.percentage" 
              :width="60" 
              :stroke-width="4"
              color="#6366f1"
            />
          </div>
          
          <template v-else>
            <img :src="file.url" class="item-img" />
            
            <div class="item-actions">
              <span class="action-btn" @click="handlePictureCardPreview(file)">
                <el-icon><View /></el-icon>
              </span>
              <span class="action-btn delete" @click="handleRemove(file)">
                <el-icon><Delete /></el-icon>
              </span>
            </div>

            <!-- Sort Handle -->
            <div class="sort-handle">
              <el-icon><Rank /></el-icon>
            </div>
          </template>
        </div>
      </template>
    </el-upload>
    
    <el-image-viewer
      v-if="dialogVisible"
      :initial-index="curOpenImgIndex"
      :url-list="urlList"
      @close="dialogVisible = false"
      @switch="(index) => (curOpenImgIndex = index)" />
  </div>
</template>

<script lang="ts" setup>
import Sortable from 'sortablejs';
import { ElMessage, UploadFile } from 'element-plus';
import { computed, ref, nextTick } from 'vue';
import { Plus, View, Delete, Rank } from '@element-plus/icons-vue';

const fileList = ref<any[]>([]);
const curOpenImgIndex = ref(0);
const dialogVisible = ref(false);

const urlList = computed(() => fileList.value.map(f => f.url));

const onBefore = (file: File) => {
  if (!file.type.startsWith('image/')) {
    ElMessage.error('只能上传图片文件');
    return false;
  }
  if (file.size / 1024 / 1024 > 2) {
    ElMessage.error('单个文件不能超过 2MB');
    return false;
  }
};

const onExceed = () => {
  ElMessage.warning('最多只能上传 3 张图片');
};

const imgDrop = (uid: string) => {
  nextTick(() => {
    const wrapper = document.querySelector('.el-upload-list--picture-card') as HTMLElement;
    if (!wrapper) return;
    
    if (wrapper.getAttribute('data-sortable')) return;
    wrapper.setAttribute('data-sortable', 'true');

    Sortable.create(wrapper, {
      animation: 300,
      handle: '.sort-handle',
      onEnd: ({ newIndex, oldIndex }: any) => {
        const target = fileList.value[oldIndex!];
        fileList.value.splice(oldIndex!, 1);
        fileList.value.splice(newIndex!, 0, target);
      },
    });
  });
};

const handlePictureCardPreview = (file: UploadFile) => {
  curOpenImgIndex.value = fileList.value.findIndex(f => f.uid === file.uid);
  dialogVisible.value = true;
};

const handleRemove = (file: UploadFile) => {
  const index = fileList.value.findIndex(f => f.uid === file.uid);
  if (index > -1) fileList.value.splice(index, 1);
};
</script>

<style lang="scss" scoped>
.el-upload-wrapper {
  .premium-upload {
    :deep(.el-upload--picture-card) {
      background-color: white;
      border: 2px dashed #e2e8f0;
      border-radius: 16px;
      transition: all 0.3s;
      
      &:hover {
        border-color: #6366f1;
        background-color: #6366f105;
      }
    }

    :deep(.el-upload-list--picture-card) {
      .el-upload-list__item {
        border-radius: 16px;
        overflow: hidden;
        border: none;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      }
    }
  }

  .upload-item-inner {
    width: 100%;
    height: 100%;
    position: relative;
    
    .item-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .uploading-overlay {
      position: absolute;
      inset: 0;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .item-actions {
      position: absolute;
      inset: 0;
      background: rgba(15, 23, 42, 0.7);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      opacity: 0;
      transition: opacity 0.3s;
      
      .action-btn {
        color: white;
        font-size: 20px;
        cursor: pointer;
        transition: transform 0.2s;
        
        &:hover {
          transform: scale(1.2);
          &.delete { color: #f87171; }
        }
      }
    }

    &:hover .item-actions {
      opacity: 1;
    }

    .sort-handle {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 28px;
      height: 28px;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #64748b;
      cursor: grab;
      z-index: 10;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      
      &:active { cursor: grabbing; }
    }
  }
}
</style>
