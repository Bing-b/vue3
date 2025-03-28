<template>
  <div class="aceEditor" ref="aceEditor"></div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import useGlobalConfig from '@/store/modules/global';
import * as ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-javascript'; // 语言模式
import 'ace-builds/src-noconflict/theme-monokai'; // 主题
import 'ace-builds/src-noconflict/ext-language_tools'; // 语法提示
import 'ace-builds/src-noconflict/snippets/javascript'; // 语法段提示模块
import './mode-mylang';
import { computed } from 'vue';

const globalConfigStore = useGlobalConfig();

// 编辑器内容
const $value = defineModel('value', { default: '' });

const editorTheme = computed(() =>
  globalConfigStore.appDark
    ? {
        gutter: '#303135',
        activeLine: '#fafafa',
        background: '#212226',
        keyWord: '#e77a29',
        word: '#fff',
      }
    : {
        gutter: '#eff2f8',
        activeLine: '#333',
        background: '#F7F8FB',
        keyWord: '#1b5fdf',
        word: '#333',
      },
);

let editor: any = null;

const aceEditor = ref<HTMLElement | string>('');

// 编辑器默认配置项
const options = {
  theme: 'ace/theme/theme-monokai',
  mode: 'ace/mode/javascript',
  //mode: 'ace/mode/mylang',
  tabSize: 1,
  maxLines: 25,
  minLines: 25,
  showPrintMargin: false,
  fontSize: 14,
  printMarginColumn: 20,
  useWorker: false,
  showLineNumbers: true, // 显示行号
  showGutter: true, // 显示行号区域
  highlightActiveLine: false,
  highlightSelectedWord: false, // 高亮选中文本
  readOnly: false, // 控制编辑器是否只读
  enableSnippets: true, // 启用代码段
  enableLiveAutocompletion: true, // 启用实时自动完成
  enableBasicAutocompletion: true, // 启用基本自动完成
};

// 初始化编辑器
const initEditor = () => {
  if (editor) editor.destroy();
  // 初始化
  editor = ace.edit(aceEditor.value, options);
  // 切换自动换行
  editor.getSession().setUseWrapMode(true);

  // 支持双向绑定
  editor.setValue($value.value ? $value.value : '');
};

watch(
  () => $value.value,
  (newProps) => {
    // 解决光标移动问题
    const position = editor.getCursorPosition();
    editor.getSession().setValue(newProps);
    editor.clearSelection();
    editor.moveCursorToPosition(position);
  },
);

onMounted(() => {
  initEditor();
});

onBeforeUnmount(() => {
  editor.destroy();
});
</script>
<style>
.aceEditor {
  width: 100%;
  height: 100%;
  background-color: v-bind('editorTheme.background') !important;
  * {
    font-family: 'SmileySans' !important;
  }
}

:deep(.ace-tm .ace_gutter) {
  background: v-bind('editorTheme.gutter') !important;
}
:deep(.ace-tm .ace_gutter-active-line) {
  background: v-bind('editorTheme.gutter') !important;
  color: v-bind('editorTheme.activeLine');
}

:deep(.ace_text-layer) {
  width: 100% !important;
}

/* 自定义语言，匹配不同类型关键词高亮颜色 */
:deep(.ace-tm .ace_keyword) {
  color: v-bind('editorTheme.keyWord') !important;
  font-weight: bold !important;
}

:deep(.ace-tm .ace_line) {
  color: v-bind('editorTheme.word') !important;
}

.ace_mylang {
  color: aquamarine;
}

.ace_keyword {
  color: blue !important;
}

:deep(.ace_text-layer) {
  width: 100% !important;
}
</style>
