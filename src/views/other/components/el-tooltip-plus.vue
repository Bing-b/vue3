<template>
  <div class="demo-card">
    <div class="demo-info">
      <el-alert title="智能文本省略 (Tooltip 增强)" type="success" :closable="false">
        <template #default>
          <ul class="feature-list">
            <li>自动判断文本是否超出容器宽度，仅在溢出时显示 Tooltip</li>
            <li>支持多行省略 (`lineClamp`) 参数配置</li>
            <li>智能位置计算与自适应显示</li>
          </ul>
        </template>
      </el-alert>
    </div>

    <div class="demo-content">
      <div class="case-item">
        <h4 class="case-title">多行省略示例 (2行)</h4>
        <div class="ellipsis-wrapper">
          <textEllipsis lineClamp="2" placement="bottom">
            恐龙体型巨大，各种形态各异，有短小的小型恐龙，也有高达20米以上的大型恐龙。恐龙的主要特征是：四肢直立，行走方式为双足行走；颈部和尾部通常较长；拥有强有力的下颌和锋利的牙齿，适应多样的食性；身体覆盖着角质质地的鳞片或者羽毛；有些恐龙还拥有壮观的骨刺，用于防御或吓唬敌人。
          </textEllipsis>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'el-tooltip-plus',
});
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

    .feature-list {
      margin: 8px 0 0 16px;
      padding: 0;
      li {
        font-size: 13px;
        line-height: 1.8;
        color: #475569;
      }
    }
  }

  .demo-content {
    .case-item {
      .case-title {
        font-size: 15px;
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 12px;
      }

      .ellipsis-wrapper {
        width: 100%;
        max-width: 500px;
        padding: 20px;
        background: #f8fafc;
        border-radius: 12px;
        border: 1px solid #e2e8f0;
      }
    }
  }
}
</style>
