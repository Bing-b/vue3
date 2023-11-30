<template>
  <div class="embedded-webpage">
    <button @click="handleClick">切换</button>
    <iframe ref="myiframe" id="iframeBox" src="" sandbox="allow-same-origin allow-scripts" seamless></iframe>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const myiframe = ref<HTMLIFrameElement>();
const router = useRouter();
const handleClick = () => {
  router.push({
    name: 'iframe',
    query: {
      des: 'http://10.13.4.119:18888/graph-platform/login?username=admin&password=000000&page=/map&id=1718916213521825793&isPanorama=1'
    }
  });
};

onMounted(() => {
  const url = window.location;
  const { port } = window.location;
  console.log(url, port);

  // onLoad();
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
