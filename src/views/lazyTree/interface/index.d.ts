/**
 * 树形结构数据
 */
export interface Tree {
  id: number  
  label: string
  leaf: boolean
  children?: Tree[]
  showInput?: boolean
}

