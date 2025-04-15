<template>
  <div
    ref="inputBoxRef"
    contenteditable="true"
    id="editor-box"
    placeholder="请插入"
    class="dark:!border-dark-border"
    @beforeInput="onInput"
    @paste.prevent
    @compositionstart="onCompositionStart"
    @compositionend="onCompositionEnd"
    @keydown="handleKeydown"></div>
</template>

<script lang="ts" setup>
import { onUnmounted, ref } from 'vue';

const emit = defineEmits(['updateMatchList']);

const $matchList = defineModel<{ matchLabel: string }[]>('matchList', { default: [] });

const inputBoxRef = ref<HTMLElement | null>(null);

// 组合输入（处理中文输入法键入）
const isComposing = ref(false);

const timerId = ref<number | null>(null);

const onCompositionStart = () => {
  isComposing.value = true;
};

const onCompositionEnd = (e: CompositionEvent) => {
  isComposing.value = false;
  if (timerId.value !== null) {
    clearTimeout(timerId.value);
    timerId.value = null;
  }
  timerId.value = setTimeout(() => {
    if (inputBoxRef.value) {
      clearValue();
      $matchList.value.forEach((i) => {
        insertMatch(i.matchLabel);
      });
    }
    timerId.value = null;
  }, 0) as unknown as number;
};

// 阻止手动换行
const handleKeydown = (e: KeyboardEvent) => {
  e.preventDefault();
};

// 阻止输入事件
const onInput = (e: InputEvent) => {
  e.preventDefault();
};

// 清空内容
const clearValue = () => {
  inputBoxRef.value!.innerHTML = '';
};

// 插入匹配项
const insertMatch = (character: string) => {
  const inputBox = inputBoxRef.value;
  if (!inputBox) return;

  const selection = window.getSelection();
  if (selection?.rangeCount === 0) inputBox.focus();
  let range = selection?.getRangeAt(0);

  // 如果光标不在输入框内，设置光标到末尾
  if (!range || !inputBox.contains(range.startContainer)) {
    inputBox.focus();
    const tempRange = document.createRange();
    tempRange.selectNodeContents(inputBox);
    tempRange.collapse(false);
    range = tempRange;
  }

  // 创建匹配项元素
  const matchDiv = document.createElement('div');
  matchDiv.className = 'matchItem';
  matchDiv.contentEditable = 'false'; // 禁止进入内部
  matchDiv.innerHTML = `${character} <span>x</span>`;
  matchDiv.dataset.character = character; // 自定属性存储匹配项label

  // 绑定删除事件
  matchDiv.querySelector('span')?.addEventListener('click', (e) => {
    e.stopPropagation();
    const matchItemText = matchDiv.dataset.character;
    // 对应删除匹配项列表数据
    const index = $matchList.value.findIndex((i) => i.matchLabel === matchItemText);
    if (index !== -1) $matchList.value.splice(index, 1);
    emit('updateMatchList');
  });

  // 插入元素和光标位置调整
  range.deleteContents();

  // 头部插入一个零宽空格
  const beforeSpace = document.createTextNode('\u200B');
  range.insertNode(beforeSpace);
  range.setStartAfter(beforeSpace);
  range.setEndAfter(beforeSpace);

  // 插入当前 matchItem
  range.insertNode(matchDiv);
  range.setStartAfter(matchDiv);
  range.setEndAfter(matchDiv);

  // 尾部插入一个零宽空格
  const afterSpace = document.createTextNode('\u200B');
  range.insertNode(afterSpace);
  range.setStartAfter(afterSpace);
  range.setEndAfter(afterSpace);

  selection?.removeAllRanges();
  selection?.addRange(range);
};

onUnmounted(() => {
  if (timerId.value !== null) {
    clearTimeout(timerId.value);
  }
});

defineExpose({
  insertMatch,
  clearValue,
});
</script>

<style lang="scss" scoped>
#editor-box {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 3px;
  padding: 9px;
  min-height: 100px;
  max-height: 160px;
  overflow: auto;
  white-space: pre-wrap; /* 自动换行 */
  word-wrap: break-word;
  font-size: 20px; /* 控制光标高度 */
  border: 1px solid #e0e5eb;
  caret-color: #000;
  &::before {
    /* 添加前置占位符，解决编辑器最前端光标不显示问题 */
    content: ' ';
    display: inline-block;
    width: 0.2px;
    opacity: 0;
  }
}

#editor-box:empty::before {
  content: attr(placeholder);
  font-size: 14px;
  color: #ccc;
  line-height: 21px;
  padding-top: 0px;
}
</style>
<style lang="scss">
.matchItem {
  display: inline-flex;
  gap: 5px;
  align-items: center;
  padding: 2px 8px;
  background-color: #f5f5f5;
  border: 1px solid #e0e5eb;
  border-radius: 2px;
  font-size: 14px;
  user-select: none; /*禁止光标进入*/
  span {
    cursor: pointer;
    &:hover {
      color: #337ecc;
    }
  }
}
</style>
