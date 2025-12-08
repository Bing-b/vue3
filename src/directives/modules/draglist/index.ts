import { DirectiveBinding } from 'vue';
import { Flip } from './flip';

const DRAGGING_CLASS = 'vue-drag-list-directive__dragging';

const globalDragEvents = {
  count: 0,
  preventDefault(e) {
    e.preventDefault();
  },
  add() {
    if (this.count === 0) {
      window.addEventListener('dragenter', this.preventDefault, false);
      window.addEventListener('dragover', this.preventDefault, false);
      window.addEventListener('dragend', this.preventDefault, false);
    }
    this.count++;
  },
  remove() {
    this.count--;
    if (this.count === 0) {
      window.addEventListener('dragenter', this.preventDefault);
      window.addEventListener('dragover', this.preventDefault);
      window.addEventListener('dragend', this.preventDefault);
    }
  },
};

// 全局变量 跟踪当前正在拖拽的列表id
let currentDraggingListId: string | null = null;

interface ElType extends HTMLElement {
  currentDragNode: any;
  _isDragAllowed: boolean;
  _isDragging: boolean;
  _actualClickTarget: any;
  _dragListHandlers: Recordable;
}

const vDragList = {
  /**
   * 组件挂载时调研，促使化拖拽列表
   * @param el
   * @param binding  vue 指令的绑定值
   */
  mounted(el: ElType, binding: DirectiveBinding) {
    injectStyles();

    const { list, canDrag = true, dragItemClass = 'drag-item', dragHandleClass } = binding.value;

    if (canDrag) {
      setChildrenDraggable(el, true);
      clearDraggingClass(el);
      initDragList(el, list, dragItemClass, dragHandleClass);
    }
  },

  /**
   * 当数据更新时触发的回调函数
   *
   * @param el DOM 元素
   * @param binding Vue 指令绑定对象
   */
  async updated(el, binding) {
    // 拖拽过程中，不执行更新逻辑，否则快速连续拖拽会导致元素消失。
    // 现象本质：第一次拖拽结束后，数据还没更新，用户又开始了第二次拖拽。
    // 第二次拖拽开始之后，这时自定义指令的 updated 才被触发，卸载了旧事件并重新初始化，currentDragNode 被重置为 null。
    // 第二次拖拽结束时，触发的是新的事件处理器，但由于没有经过 start事件，currentDragNode 还是 null。
    // 此时去除拖拽样式（如透明度）时找不到正确的元素，没法去除dragging样式，所以表现为元素"被拖没了"。
    // 加 if (el._isDragging) return，可以避免拖拽中重新初始化，保证状态正确。
    if (el._isDragging) return;
    clearDraggingClass(el);

    // 检查数据是否发生变化
    const { list, canDrag, dragItemClass = 'drag-item', dragHandleClass } = binding.value;

    // 如果数据有变化
    if (!isEqual(binding.value, binding.oldValue)) {
      // 卸载拖拽列表
      unmountDragList(el);

      if (canDrag) {
        // 启用拖拽
        setChildrenDraggable(el, true);
        initDragList(el, list, dragItemClass, dragHandleClass);
      } else {
        // 禁用拖拽，确保显示禁止图标
        setChildrenDraggable(el, false);
        // 不重新添加全局事件监听器
      }
    }
  },

  /**
   * 卸载组件时调用的方法，用于移除拖拽列表的事件监听器
   *
   * @param el 需要卸载的DOM元素
   */
  unmounted(el) {
    unmountDragList(el);
  },
};

/** 注入CSS样式到页面 */
function injectStyles() {
  const DRAGGING_STYLES = `
  /* 被拖拽元素样式 */
  .${DRAGGING_CLASS} {
    opacity:0;
    background-color:transparent;
  }
  `;

  // 检查是否已经注入过样式
  if (document.getElementById('drag-list-styles')) return;
  const styleElement = document.createElement('style');
  styleElement.id = 'drag-list-styles';
  styleElement.textContent = DRAGGING_STYLES;
  document.head.appendChild(styleElement);
}

/**
 * 设置元素的子元素是否可以拖动
 * @param el  要设置的父元素
 * @param value 是否可拖动
 * @returns
 */
function setChildrenDraggable(el: HTMLElement, value: boolean) {
  if (!el || !el.children) return;

  Array.from(el.children).forEach((child: HTMLElement) => {
    if (child.hasAttribute('data-id')) {
      if (value) {
        child.setAttribute('draggable', 'true');
      } else {
        child.removeAttribute('draggable');
      }
    }
  });
}

/**
 * 清除元素正在拖拽class
 * @param el
 */
function clearDraggingClass(el: HTMLElement) {
  if (el.children) {
    Array.from(el.children).forEach((child: HTMLElement) => {
      if (child.classList && child.classList.contains(DRAGGING_CLASS)) {
        child.classList.remove(DRAGGING_CLASS);
      }
    });
  }
}

/**
 * 初始化拖拽列表功能
 * @param el 拖拽列表的根元素
 * @param data 列表项的数据
 * @param dragItemClass 可拖拽项的类名
 * @param dragHandleClass
 */
function initDragList(el: ElType, data: any[], dragItemClass: string, dragHandleClass: string) {
  el.currentDragNode = null;
  const list = el;
  list._isDragAllowed = false;

  let flip;
  // 生成唯一id标识此拖拽列表
  const listId = `drag-list-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  el.dataset.dragListId = listId; // 设置el 元素上 data-* ,自定属性值

  function handleDragStart(e: any) {
    const target = e.target!;

    if (!isCurrentListEvent(e, listId)) {
      return;
    }

    if (shouldPreventDragStart(el._isDragAllowed, dragHandleClass)) {
      e.preventDefault();
      return;
    }

    // 清除所有文本选区
    // 1. 防止拖拽过程中出现文字选区残留，造成视觉干扰
    // 2. 避免在拖拽操作时误触发文本复制/拖动行为
    // 3. 解决浏览器在拖拽元素和文本选区同时存在时的行为冲突
    // (测试案例：当拖拽开始时如果存在文本选区，会导致拖拽图标显示异常)
    clearSelection();

    // 在 el 元素上主动触发一个拖拽开始事件
    el.dispatchEvent(new CustomEvent('drag-mode-start', { detail: { isDragging: true } }));

    // 设置当前正在拖拽的列表id
    currentDraggingListId = listId;

    el._isDragging = true;

    // 创建 FLIP 动画
    flip = new Flip(el.children, 0.5, DRAGGING_CLASS);

    // 拖拽项
    const dragItem = target.closest(`.${dragItemClass}`);

    setTimeout(() => {
      // 当我们对一个元素快速完成多次拖拽时，会出现最后一次拖完之后，拖拽元素消失不见了的现象，这是快速连续拖拽导致的时序问题：当最后一次拖拽已结束(dragEnd已执行)，但其dragStart中的定时器延时回调仍在宏队列中时，执行回调的时候若不检查状态，会错误应用拖拽样式DRAGGING_CLASS导致元素视觉上"消失"，所以要应用拖拽样式前要判断当前拖拽流程是否还在进行
      if (el._isDragging) {
        dragItem.classList.add(DRAGGING_CLASS);
      }
    });

    e.dataTransfer.effectAllowed = 'move';
    el.currentDragNode = dragItem;
  }

  function handleDragEnter(e) {
    preventDefault(e);

    // 如果有拖拽正在进行，并且不是当前列表，则忽略
    if (currentDraggingListId && currentDraggingListId !== listId) return;

    const target = e.target.closest(`.${dragItemClass}`);

    if (!target || target === el.currentDragNode || target === el) return;
    const children = Array.from(el.children);
    const sourceIndex = children.indexOf(el.currentDragNode);
    const targetIndex = children.indexOf(target);

    if (sourceIndex < targetIndex) {
      list.insertBefore(el.currentDragNode, target.nextElementSibling);
    } else {
      list.insertBefore(el.currentDragNode, target);
    }

    flip.play();
  }

  function handleDragEnd(e) {
    preventDefault(e);

    if (el.currentDragNode) {
      el.currentDragNode.classList.remove(DRAGGING_CLASS);

      const updatedData = Array.from(el.children)
        .filter((child: HTMLDivElement) => !!child && !!child.dataset && !!child.dataset.id)
        .map((child: HTMLDivElement) => {
          return data.find((i) => String(i.id) === String(child.dataset.id));
        })
        .filter((item) => !!item);

      el.dispatchEvent(
        new CustomEvent('drag-mode-end', {
          detail: {
            updatedData,
            draggedItemData:
              updatedData.find((i) => i.id === el.currentDragNode.dataset.id) || null,
          },
        }),
      );
    }
    el._isDragging = false;
    el._actualClickTarget = null;
    el._isDragAllowed = false;
  }

  /** 处理鼠标按下 */
  function handleMouseDown(e) {
    if (!isCurrentListEvent(e, listId)) return;

    // 记录实际点击的元素
    el._actualClickTarget = e.target;

    // 判断是否配置了拖拽手柄模式
    if (isDragHandleMode(dragHandleClass) && !isInvalidDragTarget(e.target, el, dragItemClass)) {
      const isHandle = isDragHandle(e.target, dragHandleClass);
      console.log(`isHandle: ${isHandle}`);
      el._isDragAllowed = isHandle;
    }
  }

  function preventDefault(e) {
    e.preventDefault();
  }

  // 添加事件监听
  el.addEventListener('dragstart', handleDragStart);
  el.addEventListener('dragenter', handleDragEnter);
  el.addEventListener('dragend', handleDragEnd);
  el.addEventListener('dragover', preventDefault);
  el.addEventListener('drop', preventDefault);
  el.addEventListener('mousedown', handleMouseDown);

  // 使用全局事件系统添加全局事件
  globalDragEvents.add();

  // 保存事件处理函数引用以便卸载时移除
  el._dragListHandlers = {
    handleDragStart,
    handleDragEnter,
    handleDragEnd,
    preventDefault,
    handleMouseDown,
  };
}

/**
 * 移除拖拽列表的事件监听器
 *
 * @param el HTML元素，表示拖拽列表的容器
 */
function unmountDragList(el) {
  if (!el._dragListHandlers || el._isDragging) return; // 没有事件处理器就直接返回

  const { handleDragStart, handleDragEnter, handleDragEnd, preventDefault, handleMouseDown } =
    el._dragListHandlers;

  // 移除元素事件
  if (handleMouseDown) {
    el.removeEventListener('mousedown', handleMouseDown);
  }
  el.removeEventListener('dragstart', handleDragStart);
  el.removeEventListener('dragenter', handleDragEnter);
  el.removeEventListener('dragend', handleDragEnd);
  el.removeEventListener('dragover', preventDefault);
  el.removeEventListener('drop', preventDefault);

  // 使用全局事件系统移除全局事件
  globalDragEvents.remove();

  // 在卸载前清除所有拖拽样式
  clearDraggingClass(el);

  // 移除 draggable 属性
  setChildrenDraggable(el, false);
  el._isDragging = false;

  delete el._dragListHandlers;
  delete el._actualClickTarget;
  delete el._isDragAllowed;
}

/**
 * 判断当前事件是否属于指定列表的事件
 * @param e 事件对象
 * @param listId 指定列表的ID
 * @returns
 */
function isCurrentListEvent(e, listId: string): boolean {
  if (!e.target) return false;
  const eventList = e.target.closest('[data-drag-list-id]');
  if (!eventList) return false;
  return eventList.dataset.dragListId === listId;
}

/**
 * 判断是否为拖拽手柄模式
 *
 * @param dragHandleClass 拖拽手柄的类名
 * @returns 如果dragHandleClass不为undefined，则返回true，否则返回false
 */
function isDragHandleMode(dragHandleClass: string) {
  return dragHandleClass !== undefined;
}

function shouldPreventDragStart(isDragAllowed: boolean, dragHandleClass: string) {
  return isDragAllowed === false && isDragHandleMode(dragHandleClass);
}

/**
 * 清除当前dom文档中的文本选择区域
 */
function clearSelection() {
  const selection = window.getSelection && window.getSelection();
  if (selection && selection.removeAllRanges) {
    selection.removeAllRanges();
  }
}

/**
 * 判断给定的元素是否是拖拽句柄
 *
 * @param element 需要判断的元素
 * @param dragHandleClass 拖拽句柄的类名
 * @returns 如果元素是拖拽句柄，则返回 true；否则返回 false
 */
function isDragHandle(element, dragHandleClass) {
  return element.closest(`.${dragHandleClass}`) !== null;
}

/**
 * 防止点击子列表空白区域或非拖拽项时，父列表把子列表容器当成拖拽项
 *
 * 阻止条件：
 * 1. 点击容器本身 (e.target === el) - 点击空白区域
 * 2. 未找到拖拽项目 (!dragItem) - 点击不可拖拽的子元素
 *
 * 典型场景：
 * - 嵌套列表：点击子列表空白处时，防止父列表误把子容器当作拖拽项
 * - 混合内容：点击非拖拽元素时，防止触发意外的拖拽行为，点击子列表非拖拽项会冒泡杯外层列表的拖拽事件捕获到
 *
 * 只有明确点击到可拖拽项目时，才允许继续执行拖拽逻辑
 */
function isInvalidDragTarget(target, containerEl, dragItemClass) {
  const dragItem = target && target.closest(`.${dragItemClass}`);
  return target === containerEl || !dragItem;
}

/**
 * 判断两个值是否相等
 *
 * @param x 待比较的第一个值
 * @param y 待比较的第二个值
 * @returns 如果 x 和 y 相等，则返回 true；否则返回 false
 *
 * @template TType 泛型参数，表示 x 和 y 的类型
 */
const isEqual = <TType>(x: TType, y: TType): boolean => {
  if (Object.is(x, y)) return true;
  if (x instanceof Date && y instanceof Date) {
    return x.getTime() === y.getTime();
  }
  if (x instanceof RegExp && y instanceof RegExp) {
    return x.toString() === y.toString();
  }
  if (typeof x !== 'object' || x === null || typeof y !== 'object' || y === null) {
    return false;
  }
  const keysX = Reflect.ownKeys(x as unknown as object) as (keyof typeof x)[];
  const keysY = Reflect.ownKeys(y as unknown as object);
  if (keysX.length !== keysY.length) return false;
  for (let i = 0; i < keysX.length; i++) {
    if (!Reflect.has(y as unknown as object, keysX[i])) return false;
    if (!isEqual(x[keysX[i]], y[keysX[i]])) return false;
  }
  return true;
};

// 全局注册
export function registerDragList(app) {
  app.directive('drag-list', vDragList);
}

export default vDragList;
