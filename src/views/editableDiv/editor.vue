<template>
  <div
    ref="inputBoxRef"
    contenteditable="true"
    id="editor-box"
    placeholder="请插入"
    class="dark:!border-dark-border"
    @beforeInput="onBeforeInput"
    @keydown="handleKeydown"
    @compositionstart="onCompositionStart"
    @compositionend="onCompositionEnd"
    @paste.prevent></div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const emit = defineEmits(['updateMatchList']);

const $matchList = defineModel<{ matchLabel: string; id?: string | number }[]>('matchList', {
  default: [],
});

const inputBoxRef = ref<HTMLElement | null>(null);

// 组合输入（处理中文输入法键入）
const isComposing = ref(false);

const onCompositionStart = () => {
  isComposing.value = true;
};

// 处理组合输入结束
const onCompositionEnd = () => {
  isComposing.value = false;
  if (!inputBoxRef.value) return;
  clearValue();
  $matchList.value.forEach((i) => insertMatch(i.matchLabel));
};

// 禁止直接输入文本
const onBeforeInput = (e: InputEvent) => {
  e.preventDefault();
};

// 处理键盘事件 阻止手动换行
const handleKeydown = (e: KeyboardEvent) => {
  e.preventDefault();
};

// 插入零宽空格
const createZwsp = () => document.createTextNode('\u200B');

const insertMatch = (character: string) => {
  const inputBox = inputBoxRef.value;
  if (!inputBox) return;

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  let range = selection.getRangeAt(0);

  // 确保 range 在输入框内
  if (!inputBox.contains(range.commonAncestorContainer)) {
    inputBox.focus();
    range = document.createRange();
    range.selectNodeContents(inputBox);
    range.collapse(false); // 移动到末尾
  }

  // 删除选区内容（如果有选中）
  range.deleteContents();

  // 前置 ZWSP 确保前面有光标位
  const zwspBefore = createZwsp();
  // 后置 ZWSP 确保后面有光标位
  const zwspAfter = createZwsp();

  // 创建标签 DOM
  const matchDiv = document.createElement('span');
  matchDiv.className = 'matchItem';
  matchDiv.contentEditable = 'false'; // 禁止光标进入内部
  matchDiv.dataset.character = character; // 自定属性存储匹配项label
  matchDiv.innerHTML = `${character}<span class="remove-btn">×</span>`;

  // 绑定删除事件
  matchDiv.querySelector('.remove-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    const matchItemText = matchDiv.dataset.character;

    // 对应删除匹配项列表数据
    const index = $matchList.value.findIndex((i) => i.matchLabel === matchItemText);
    if (index !== -1) $matchList.value.splice(index, 1);
    emit('updateMatchList');
  });

  //  插入 DOM
  const frag = document.createDocumentFragment();
  frag.appendChild(zwspBefore);
  frag.appendChild(matchDiv);
  frag.appendChild(zwspAfter);

  range.insertNode(frag);

  //  修正光标位置：移动到后置 ZWSP 后面
  range.setStartAfter(zwspAfter);
  range.setEndAfter(zwspAfter);

  selection.removeAllRanges();
  selection.addRange(range);

  inputBox.scrollTop = inputBox.scrollHeight;
};

// 清空
const clearValue = () => {
  if (inputBoxRef.value) inputBoxRef.value.innerHTML = '';
};

// 暴露方法
defineExpose({
  insertMatch,
  clearValue,
});
</script>

<style lang="scss" scoped>
#editor-box {
  display: block;
  padding: 8px 10px;
  min-height: 100px;
  max-height: 160px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-break: break-all;
  line-height: 2; /* 增加行高，防止标签垂直重叠太挤 */
  font-size: 14px;

  border: 1px solid #e0e5eb;
  border-radius: 4px;
  color: #333;
  caret-color: #000;

  &:focus {
    outline: none;
  }

  &:empty::before {
    content: attr(placeholder);
    color: #aaa;
    pointer-events: none;
    display: block; /* 确保 placeholder 占位 */
  }
}
</style>

<style lang="scss">
.matchItem {
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
  margin: 0 4px 4px;
  padding: 2px 8px;
  background-color: #f0f7ff;
  border: 1px solid #cce0ff;
  border-radius: 4px;
  color: #337ecc;
  font-size: 12px;
  user-select: none; /*禁止光标进入*/
  -webkit-user-select: none;

  .remove-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-left: 6px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    cursor: pointer;
    color: #fff;
    background-color: #aaccff;
    font-size: 12px;
    line-height: 1;

    &:hover {
      background-color: #ff6b6b;
    }
  }
}
</style>
