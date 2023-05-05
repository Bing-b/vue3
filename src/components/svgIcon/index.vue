<!-- https://github.com/anncwb/vite-plugin-svg-icons/blob/main/README.zh_CN.md -->
<template>
  <svg aria-hidden="true" class="icon" :class="className" :style="{
    width: svgSize + 'px',
    height: svgSize + 'px',
    color: color,
  }">
    <use :xlink:href="svgName" />
  </svg>
</template>

<script lang="ts">
// 矢量图标，上传的svg图标需要去除本身颜色，不然设置color无法修改图标颜色
import { computed, defineComponent } from 'vue';

export default defineComponent({
  name: 'svgIcon',
  props: {
    name: {
      type: String
    },
    size: {
      type: [Number, String]
    },
    color: {
      type: String
    },
    // 提供给组件修改图标颜色的方式
    className: {
      type: String
    }
  },
  setup(props) {
    const svgName = computed(() => `#icon-${props.name}`);
    const svgSize = computed(() => Number(props.size));
    return {
      svgName,
      svgSize
    };
  }
});
</script>

<style lang='scss' scoped>
.icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  // vertical-align: -0.15em;
  vertical-align: middle;
  fill: currentColor;
  overflow: hidden;
}
</style>
