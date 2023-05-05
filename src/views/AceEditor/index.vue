<template>
  <div>
    <AceEditor :value="value" />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import AceEditor from './ace/index.vue';

const value = ref('');
</script>
