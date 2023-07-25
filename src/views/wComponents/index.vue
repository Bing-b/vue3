<template>
  <div class="flex h-full overflow-hidden">
    <div class="main flex overflow-hidden ">
      <div class="item">
        <xButton class="ml-3 mt-3 px-5 mb-3">确认</xButton>
      </div>
      <div class="item">
        <switchBtn />
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>

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
