import { ref, watch, nextTick, Ref } from 'vue';
import Sortable from 'sortablejs';
import { nanoid } from 'nanoid';

export const useSortTable = (tableDataRef: any) => {
  const tableRef = ref();

  // 创建Sortable实例并确保排序不丢失
  const initSortable = () => {
    debugger;
    if (!tableDataRef || !tableRef.value) return;
    const el = tableRef.value.$el.querySelector('.el-table__body-wrapper tbody');

    const sortable = Sortable.create(el, {
      animation: 100,
      handle: '.el-table__row',
      onEnd(evt) {
        // 直接操作响应式数据
        const { oldIndex, newIndex } = evt;
        const data = [...tableDataRef.value];
        const movedItem = data.splice(oldIndex!, 1)[0];
        data.splice(newIndex!, 0, movedItem);
        // 生成新ID并更新数组
        tableDataRef.value = data.map((item) => ({ ...item, id: nanoid(8) }));
      },
    });

    return sortable;
  };

  // 初始化排序
  let sortableInstance: any;

  // 监听数据变化，重新初始化Sortable
  watch(
    () => tableDataRef.value,
    async () => {
      if (sortableInstance) {
        sortableInstance.destroy();
      }

      // 等待 DOM 更新完成后再初始化Sortable
      await nextTick();
      sortableInstance = initSortable();
    },
    { deep: true }
  );

  return {
    tableRef,
  };
};
