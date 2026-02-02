<template>
  <div class="demo-card">
    <div class="demo-info">
      <el-alert
        title="Blob (Binary Large Object)"
        type="info"
        :closable="false"
        show-icon
      >
        <p class="description">
          Blob 是浏览器提供的一种不可变、类文件的原始数据容器。它可以存储任意类型的二进制或文本数据，例如图片、音频、PDF、甚至一段纯文本。与 File 对象相比，Blob 更底层。
        </p>
      </el-alert>
    </div>

    <div class="demo-action">
      <div class="action-header">
        <h4 class="action-title">数据下载测试</h4>
        <p class="action-desc">点击按钮模拟生成并下载一个 Markdown 文件</p>
      </div>
      <el-button @click="handleDownloadMd" type="primary" :icon="Download" large>
        下载 Markdown 文件
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Download } from '@element-plus/icons-vue';

const handleDownloadMd = () => {
  const md = '# hhh, 这是Bolb';
  const blob = new Blob([md], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'hello.md';
  a.click();
  // 清理 DOM 元素
  document.body.removeChild(a);

  // 释放内存
  URL.revokeObjectURL(url);
};
</script>

<style lang="scss" scoped>
.demo-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
  border: 1px solid #f1f5f9;
  max-width: 800px;

  .demo-info {
    margin-bottom: 32px;

    .description {
      margin-top: 8px;
      line-height: 1.6;
      color: #64748b;
    }
  }

  .demo-action {
    padding: 24px;
    background: #f8fafc;
    border-radius: 12px;
    border: 1px dashed #e2e8f0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;

    .action-header {
      text-align: center;

      .action-title {
        font-size: 16px;
        font-weight: 700;
        color: #1e293b;
        margin-bottom: 4px;
      }

      .action-desc {
        font-size: 13px;
        color: #94a3b8;
      }
    }
  }
}
</style>
