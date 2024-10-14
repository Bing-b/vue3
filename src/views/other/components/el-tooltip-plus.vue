<template>
  <div>
    <p>1、可动态判断文本是否超出父容器宽度来控制显示tooltip</p>
    <p>2、支持传递 文本超出行数 参数控制显示...</p>
    <br />
    <div class="w-[400px]">
      <textEllipsis lineClamp="2" placement="bottom">
        恐龙体型巨大，各种形态各异，有短小的小型恐龙，也有高达20米以上的大型恐龙。恐龙的主要特征是：四肢直立，行走方式为双足行走；颈部和尾部通常较长；拥有强有力的下颌和锋利的牙齿，适应多样的食性；身体覆盖着角质质地的鳞片或者羽毛；有些恐龙还拥有壮观的骨刺，用于防御或吓唬敌人。
      </textEllipsis>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'el-tooltip-plus',
});
</script>

<style scoped></style>
