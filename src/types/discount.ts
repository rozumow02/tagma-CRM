import type { IAllProduct, ISelectAll } from "@/types";
export interface IDiscounts {
  id: number;
  name_ru: string;
  name_tm: string;
  start: string;
  end: string;
  status: boolean;
  discount_type_id: number;
  updated_at: string;
  discount_type: string;
  first: childProduct[] | null;
  is_direct: boolean;
  is_procent: boolean;
  second: childProduct[] | null;
  channel_types: ISelectAll[];

  is_increase: boolean;
  trade_agents: ISelectAll[];
  trade_points: ISelectAll[];
  sort_order: number;
  is_group: boolean;
}

interface childProduct {
  product_id: number;
  count: number;
  coefficient: number;
  coin?: number;
}

export interface ISelectedProducts extends IAllProduct {
  product_id: number;
  count: number;
  coefficient: number;
  coin: number;
}

export interface IDiscountsForm {
  end: string;
  name_ru: string;
  name_tm: string;
  start: string;
  status: boolean;
  first: childProduct[] | null;
  is_direct: boolean;
  is_procent: boolean;
  second: childProduct[] | null;
  channel_type_ids: number[];

  is_increase: boolean;
  trade_agents: number | number[] | null;
  trade_point_ids: number[];
  sort_order: number;
  is_group: boolean;
}

export interface IDiscountFormEdit {
  id: number;
  name_ru: string;
  name_tm: string;
  start: string;
  end: string;
  trade_agents: number | number[] | null;
  trade_point_ids: number[];
  channel_type_ids: number[];
  sort_order: number;
  is_group: boolean;
}
