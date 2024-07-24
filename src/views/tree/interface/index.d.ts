/**
 * 树形结构数据
 */
export interface Tree {
  id: number;
  label: string;
  children?: Tree[];
  showInput?: boolean;
  expanded?: boolean;
}
