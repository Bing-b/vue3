import { ref, nextTick, watchEffect, onUnmounted, watch } from 'vue';
import Sortable from 'sortablejs';
import { nanoid } from 'nanoid';

type SortOptions = {
  type?: string; // 表格类型：'el-table' | 'custom-table' , 默认 'el-table'
  handle?: string; // 拖拽元素class , 默认 '.el-table__row'
};

/**
 * 可拖拽表格 支持 el-table 或 自定义表格, 默认el-table, https://sortablejs.github.io/Sortable/
 * el-table 需添加属性 row-key="id"
 * @param options
 * @returns
 */
export const useDragTable = (options?: SortOptions) => {
  // 可拖拽表格容器
  const dragWrapperRef = ref();

  // 拖拽数据key，用于动态拖拽数据更新后触发初始化
  const dragDataKey = ref('');

  // 拖拽数据
  const dragData = ref<any[]>([]);

  // Sortable实例
  let dragTableInstance: any;

  // 初始化
  const initSortable = () => {
    if (!dragData.value || !dragWrapperRef.value) return;
    ElMessage.warning('初始化');
    const el =
      options?.type && options.type === 'custom-table'
        ? dragWrapperRef.value
        : dragWrapperRef.value.$el.querySelector('.el-table__body-wrapper tbody');
    const handle = options?.handle ? options.handle : '.el-table__row';
    const sortable = Sortable.create(el, {
      animation: 100,
      handle,
      onEnd(evt) {
        const { oldIndex, newIndex } = evt;
        const movedItem = dragData.value.splice(oldIndex!, 1)[0];
        dragData.value.splice(newIndex!, 0, movedItem);
        dragData.value.forEach((item) => {
          if (!item.id) {
            item.id = nanoid(8);
          }
        });
      },
    });

    return sortable;
  };

  watchEffect(() => {
    if (dragDataKey.value && dragTableInstance) {
      dragTableInstance.destroy();
    }
    nextTick(() => {
      dragTableInstance = initSortable();
    });
  });

  onUnmounted(() => {
    if (dragTableInstance) {
      dragTableInstance.destroy();
    }
  });

  return {
    dragWrapperRef,
    dragDataKey,
    dragData,
  };
};
