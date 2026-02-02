<template>
  <div class="demo-card upload-container">
    <div class="demo-info">
      <h4 class="title">高级文件上传</h4>
      <p class="desc">支持拖拽、多选、类型限制及实时进度展示的多种上传解决方案</p>
    </div>

    <div class="demo-content">
      <el-scrollbar>
        <div class="upload-showcase group-layout">
          <!-- Vue Upload Section -->
          <section class="upload-section">
            <div class="section-badge">
              <el-tag effect="plain" round size="small">Vue-Upload-Component</el-tag>
            </div>
            <VueUpload />
          </section>

          <el-divider border-style="dashed" />

          <!-- Element Plus Section -->
          <section class="upload-section">
            <div class="section-badge">
              <el-tag effect="plain" type="success" round size="small">Element Plus Upload</el-tag>
            </div>
            <ElUpload />
          </section>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script lang="ts" setup>
import VueUpload from './vueUpload/index.vue';
import ElUpload from './elUpload/index.vue';
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
    margin-bottom: 32px;
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
    background: #fafafa;
    border-radius: 20px;
    border: 1px solid #f1f5f9;

    .upload-showcase {
      padding: 32px;
    }

    .upload-section {
      margin-bottom: 24px;
      
      .section-badge {
        margin-bottom: 20px;
      }
    }
  }
}
</style>

<style scoped></style>
