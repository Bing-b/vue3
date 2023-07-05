<template>
  <div style="width: 100%; height: 100vh; border:1px solid #ccc;">
    <dragBox style="width: 100%; height: 100%;">
      <dragItem style="width: 20%;">item1</dragItem>
      <dragItem :showResize="false">item2</dragItem>
    </dragBox>
  </div>
</template>

<script lang="ts" setup>

</script>
