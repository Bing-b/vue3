<template>
  <div class="demo-card">
    <div class="demo-info">
      <h4 class="title">横向滚动容器</h4>
      <p class="desc">支持鼠标滚轮在容器内实现水平滚动的交互体验</p>
    </div>

    <div class="demo-content">
      <div class="scroll-container-outer">
        <div class="tab-list" id="nav">
          <div v-for="i in 15" :key="i" class="tab-item">
            <div class="item-content">
              <span class="num">#{{ i }}</span>
              <span class="label">模块 {{ i }}</span>
            </div>
          </div>
        </div>
        <div class="scroll-hint">
          <el-icon><Mouse /></el-icon>
          <span>尝试在上方区域滚动鼠标滚轮</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { Mouse } from '@element-plus/icons-vue';

const handler = (event: any) => {
  // 获取要绑定事件的元素
  const nav = document.getElementById('nav');
  // 获取滚动方向
  const detail = event.wheelDelta || event.detail;
  // 定义滚动方向，其实也可以在赋值的时候写
  const moveForwardStep = 1;
  const moveBackStep = -1;
  // 定义滚动距离
  let step = 0;
  // 判断滚动方向,这里的100可以改，代表滚动幅度，也就是说滚动幅度是自定义的
  if (detail < 0) {
    step = moveForwardStep * 100;
  } else {
    step = moveBackStep * 100;
  }
  // 对需要滚动的元素进行滚动操作
  nav!.scrollLeft += step;
};

const scrollInit = () => {
  // 获取要绑定事件的元素
  const nav = document.getElementById('nav');
  if (nav) {
    nav.addEventListener('mousewheel', handler, false);
  }
};

onMounted(() => scrollInit());
</script>

<style lang="scss" scoped>
.demo-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
  border: 1px solid #f1f5f9;
  max-width: 900px;

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
    .scroll-container-outer {
      background: #f8fafc;
      padding: 40px 24px;
      border-radius: 16px;
      border: 1px solid #e2e8f0;

      .tab-list {
        display: flex;
        gap: 16px;
        overflow-x: auto;
        padding: 10px 4px;
        scroll-behavior: smooth;

        &::-webkit-scrollbar {
          height: 0;
        }

        .tab-item {
          flex: none;
          width: 140px;
          height: 80px;
          background: white;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;

          .item-content {
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 4px;

            .num {
              font-size: 11px;
              color: #94a3b8;
              font-weight: 700;
            }

            .label {
              font-size: 14px;
              font-weight: 600;
              color: #475569;
            }
          }

          &:hover {
            transform: translateY(-4px);
            border-color: #409eff;
            box-shadow: 0 10px 15px -3px rgba(64, 158, 255, 0.15);

            .label {
              color: #409eff;
            }
          }
        }
      }

      .scroll-hint {
        margin-top: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        color: #94a3b8;
        font-size: 12px;

        .el-icon {
          font-size: 16px;
        }
      }
    }
  }
}
</style>
