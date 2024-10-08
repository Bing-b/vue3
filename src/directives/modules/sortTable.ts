import { nanoid } from 'nanoid';
import Sortable from 'sortablejs';

/**
 * 可拖拽表格指令
 * 使用方式，el-table 标签上添加  v-sort-table="tableData" ,tableData: 表格数据
 * 注意： el-table 要指定 row-key='id'   id 字段为指令内部生成
 * 插件：https://sortablejs.com/
 */

export default {
  name: 'sortTable',
  mounted(el: HTMLElement, binding: { value: Array<any> }) {
    const data = binding.value.map((i) => ({ id: nanoid(8), ...i })); // 处理表格原始数据生成id key
    const targetEl = el.querySelector('.el-table__body-wrapper tbody') as HTMLElement;
    if (targetEl) {
      Sortable.create(targetEl, {
        onEnd(evt) {
          const { oldIndex, newIndex } = evt;
          const movedItem = data.splice(oldIndex as number, 1)[0];
          data.splice(newIndex as number, 0, movedItem);
        },
      });
    }
  },
};
