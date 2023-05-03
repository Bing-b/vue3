<template>
  <div class="switch-box">
    <slot />
    <KeepAlive>
      <component :is="component" v-bind="$attrs" />
    </KeepAlive>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import Card1 from './card1/index.vue'
import Card2 from './card2/index.vue'

export default defineComponent({
  components: {
    Card1,
    Card2
  },
  props: {
    component: {
      type: String,
      default: () => ''
    }
  }
})
</script>
