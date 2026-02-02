<template>
  <div class="ace-wrapper h-full flex flex-col">
    <div class="editor-container flex-1" ref="aceEditor"></div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref, watch, nextTick } from 'vue';
import * as ace from 'ace-builds';
import 'ace-builds/src-noconflict/ext-language_tools';

// 导入常用语言
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-typescript';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/mode-json';

// 导入常用主题
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-chrome';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-tomorrow_night';

const props = withDefaults(defineProps<{
  value?: string;
  mode?: string;
  theme?: string;
  fontSize?: number;
}>(), {
  value: '',
  mode: 'javascript',
  theme: 'monokai',
  fontSize: 14,
});

const emit = defineEmits(['update:value']);

const aceEditor = ref<HTMLElement | null>(null);
let editor: ace.Ace.Editor | null = null;

const initEditor = () => {
  if (!aceEditor.value) return;
  
  editor = ace.edit(aceEditor.value, {
    mode: `ace/mode/${props.mode}`,
    theme: `ace/theme/${props.theme}`,
    fontSize: props.fontSize,
    tabSize: 2,
    showPrintMargin: false,
    useWorker: false,
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
    enableSnippets: true,
  });

  editor.setValue(props.value, 1);
  
  editor.on('change', () => {
    emit('update:value', editor?.getValue());
  });
};

watch(() => props.value, (newVal) => {
  if (editor && newVal !== editor.getValue()) {
    const pos = editor.getCursorPosition();
    editor.setValue(newVal, 1);
    editor.moveCursorToPosition(pos);
  }
});

watch(() => props.mode, (newMode) => {
  editor?.setOption('mode', `ace/mode/${newMode}`);
});

watch(() => props.theme, (newTheme) => {
  editor?.setOption('theme', `ace/theme/${newTheme}`);
});

watch(() => props.fontSize, (newSize) => {
  editor?.setOption('fontSize', newSize);
});

onMounted(() => {
  nextTick(() => initEditor());
});

onBeforeUnmount(() => {
  editor?.destroy();
  editor = null;
});
</script>

<style lang="scss" scoped>
.ace-wrapper {
  background: #1e1e1e;
  
  .editor-container {
    width: 100%;
    height: 100%;
    
    :deep(.ace_gutter) {
      background: transparent !important;
    }
  }
}
</style>
