export interface Category {
  _id: string;
  name: string;
  parent?: Category | null;
  count?:number;
  children?: Category[];
  expanded?: boolean;  // for expand/collapse
  selected?: boolean;
}