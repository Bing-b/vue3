<template>
  <div class="demo-card">
    <div class="demo-info">
      <h4 class="title">模拟进度条</h4>
      <p class="desc">模拟受真实任务控制的异步进度显示</p>
    </div>

    <div class="demo-content">
      <div class="progress-showcase">
        <div class="row">
          <span class="label">线性进度</span>
          <el-progress
            :percentage="percentage"
            :striped="true"
            :striped-flow="true"
            :stroke-width="12"
          />
        </div>
        <div class="row items-center justify-around flex-row mt-4">
          <div class="flex flex-col items-center gap-4">
            <span class="label">环形进度</span>
            <el-progress type="circle" :percentage="percentage" :width="120" />
          </div>
          <div class="flex flex-col items-center gap-4">
            <span class="label">仪表盘</span>
            <el-progress type="dashboard" :percentage="percentage" :width="120" />
          </div>
        </div>
      </div>

      <div class="divider"></div>

      <div class="control-panel">
        <el-button-group>
          <el-button type="primary" :icon="CaretRight" @click="start()" large>开始模拟</el-button>
          <el-button type="danger" :icon="Close" @click="end()" large>强制结束</el-button>
        </el-button-group>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CaretRight, Close } from '@element-plus/icons-vue';
import { useFakeProgress } from '@/hooks/useFakeProgress';

const fakeProgress = useFakeProgress();
const percentage = fakeProgress.percentage;
const { start, end } = fakeProgress;
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
    .title {
      font-size: 18px;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 4px;
    }
    .desc {
      font-size: 13px;
      color: #94a3b8;
    }
  }

  .demo-content {
    .progress-showcase {
      .row {
        display: flex;
        flex-direction: column;
        gap: 12px;

        .label {
          font-size: 14px;
          color: #64748b;
          font-weight: 500;
        }

        .el-progress--line {
          width: 100%;
        }
      }
    }

    .divider {
      height: 1px;
      background: #f1f5f9;
      margin: 32px 0;
    }

    .control-panel {
      display: flex;
      justify-content: center;
    }
  }
}
</style>
