<template>
  <div class="flex h-full overflow-hidden">
    <div class="aside">
      <p class="bg-[#666] px-5 py-2 rounded-sm text-white">组件</p>
      <ul>
        <li>按钮</li>
      </ul>
    </div>
    <div class="main flex-1 overflow-hidden ">
      <xButton class=" px-5">确认</xButton>
      <switchBtn />
    </div>
  </div>
</template>

<script lang='ts' setup>

</script>

<style lang="scss" scoped>
.aside {
  margin-right: 20px;
  width: 200px;
  background-color: rgb(224, 230, 241);
  height: 100%;
  border-radius: 4px;

  ul {
    li {
      padding: 8px 20px;
      font-size: 14px;
      color: #666;
    }
  }
}
</style>
