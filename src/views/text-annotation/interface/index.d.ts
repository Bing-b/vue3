
/**
 * 定义编辑文本标注时所需数据类型
 */
export interface annototarData {
  startIndex: number, // 类型标注开始位置
  endIndex: number, // 类型标注结束位置
  selectedId: number, // 选中的类型id
  sourceId: number, // 构建关系的起点label id
  targetId: number, // 构建关系的终点label id
}