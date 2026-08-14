export * from "./City";
export * from "./Channels";
export * from "./Categories";
export * from "./Products";
export * from "./Trade-team";
export * from "./Points";
export * from "./routes";
export * from "./Logs";
export * from "./discount";
export * from "./Gifts";
export * from "./districts";
export * from "./Orders";
export * from "./Notes";
export * from "./Users";
export * from "./Manual";
export * from "./Filters";
export * from "./Diler";
export * from "./Sales";
export * from "./Promotions";
export * from "./Plan";
export * from "./Furniture";
export * from "./Merchandiser";
export * from "./Promo";

export interface IQuery {
  pageNumber: number;
  pageSize: number;
  pageCount: number;
  total?: number;
  [key: string]: any;
}

export interface ISelectAll {
  name: string;
  id: number;
}

export interface FilterOption {
  type: "select" | "input" | "date";
  model: string;
  options?: { id: number | boolean | string; name: string }[] | string[];
  placeholder?: string;
  width?: string | number;
  disabled?: boolean;
  clearable?: boolean;
}

export interface IFormOption {
  type: "select" | "input" | "number" | "date" | "password" | "editor";
  model: string;
  options?: { id: number | string; name: string }[];
  placeholder?: string;
  width?: string | number;
  label?: string;
  filterable?: boolean;
  suffixText?: string;
  min?: number;
  max?: number;
  valid?: boolean;
  multiple?: boolean;
}

export interface IElColumnTable {
  prop: string;
  label: string;
  width?: string | number;
  minWidth?: string | number;
  fixed?: boolean | string;
  sortable?: boolean | string;
  resizable?: boolean;
  formatter?: (row: Record<string, any>, column: any, cellValue: any) => any;
  showOverflowTooltip?: boolean;
  align?: "left" | "center" | "right";
  headerAlign?: "left" | "center" | "right";
  type?: "default" | "selection" | "index" | "expand";
}
