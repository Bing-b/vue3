<template>
  <div class="embedded-webpage">
    <iframe
      ref="myiframe"
      id="iframeBox"
      src="https://chroniclehq.com/"
      sandbox="allow-same-origin allow-scripts"
      seamless></iframe>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

const myiframe = ref<HTMLIFrameElement>();

onMounted(() => {
  const url = window.location;
  const { port } = window.location;
  console.log(url, port);

  onLoad();
});

const onLoad = () => {
  const iframeDocument = myiframe.value?.contentWindow?.document;
  console.log(iframeDocument);
  if (iframeDocument) {
    const linkTag = iframeDocument.createElement('link');
    linkTag.href = 'src/views/iframe/index.css';
    linkTag.setAttribute('rel', 'stylesheet');
    linkTag.setAttribute('type', 'text/css');

    const iframeHead = iframeDocument.getElementsByTagName('head')[0];
    iframeHead.appendChild(linkTag);
  }
};
</script>

<style lang="scss" scoped>
.embedded-webpage {
  height: 100%;
  width: 100%;

  iframe {
    border: none;
    /* 去掉 iframe 边框 */
    display: block;
    height: 100%;
    width: 100%;
  }
}
</style>
