<template>
  <div class="aceEditor" ref="aceEditor"></div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import * as ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-javascript'; // 语言模式
import 'ace-builds/src-noconflict/theme-monokai'; // 主题
import 'ace-builds/src-noconflict/ext-language_tools'; // 语法提示
import 'ace-builds/src-noconflict/snippets/javascript'; // 语法段提示模块

// 自定义语言
import 'ace-builds/src-noconflict/mode-mylang'; // 此模块需对应目录创建
// import '../assets/ace/mylang.js';

const props = withDefaults(defineProps<{
  value: string,
}>(), {
});

const emits = defineEmits(['update:value']);

let editor: any = null;
const aceEditor = ref<string | Element>('');

// 编辑器默认配置项
const options = {
  theme: 'ace/theme/monokai',
  // mode: 'ace/mode/javascript',
  mode: 'ace/mode/mylang',
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
  enableBasicAutocompletion: true // 启用基本自动完成
};

// 初始化编辑器
const initEditor = () => {
  if (editor) editor.destroy();

  // 初始化
  editor = ace.edit(aceEditor.value, options);

  // 切换自动换行
  editor.getSession().setUseWrapMode(true);

  // 支持双向绑定
  editor.setValue(props.value ? props.value : '');
  editor.on('change', () => {
    emits('update:value', editor.getValue());
  });
};

watch(
  () => props.value,
  (newProps) => {
    // 解决光标移动问题
    const position = editor.getCursorPosition();
    editor.getSession().setValue(newProps);
    editor.clearSelection();
    editor.moveCursorToPosition(position);
  }
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
  width: 500px;
  height: 500px;
}

/* 自定义语言，匹配不同类型关键词高亮颜色 */
.ace_constant {
  color: #FF00FF;
  font-weight: bold;
}
</style>
