export interface Tree {
  id: number;
  label: string;
  children?: Tree[];
  showInput?: boolean;
  expanded?: boolean;
}
