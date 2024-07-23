<template>
  <div class="flex h-full overflow-hidden">
    <div class="main flex overflow-hidden">
      <div class="item">
        <xButton class="ml-3 mt-3 px-5 mb-3">确认</xButton>
      </div>
      <div class="item">
        <xButton class="ml-3 mt-3 px-5 mb-3" bgColor="#56a1ff">确认</xButton>
      </div>
      <div class="item">
        <xButton class="ml-3 mt-3 px-5 mb-3" bgColor="#87898e" type="default">确认</xButton>
      </div>
      <div class="item">
        <xButton class="ml-3 mt-3 px-5 mb-3" bgColor="rgba(255,255,255,.1)" type="gray"
          >取消</xButton
        >
      </div>
      <div class="item">
        <switchBtn />
      </div>
      <div class="item">
        <Loading />
      </div>
      <div class="item">
        <SvgIconPlus iconName="boat" size="48" color="#0e49aa" />
      </div>
      <div class="item">
        <SvgIconPlus iconName="bood" size="48" color="#0e49aa" />
      </div>
      <div class="item">
        <SvgIconPlus iconName="css" size="48" />
      </div>
      <div class="item">
        <SvgIconPlus iconName="car1" size="48" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Loading from '../loading/index.vue';
</script>

<style lang="scss" scoped>
.item {
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 200px;
  border: 1px dashed #c7c6c6;
  border-radius: 4px;
}
</style>
