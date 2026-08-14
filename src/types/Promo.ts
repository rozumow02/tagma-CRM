import type { ISelectAll } from ".";

export interface IPromoSoldProduct {
  product_id: number;
  code: string;
  name: string;
  taste: string;
  product_type_id: number;
  product_type: string;
  volume: number;
  count: number;
  price: number;
  sale_price: number;
  promo: number;
}

export interface IPromoSoldQuery {
  product_type_id?: number | null;
  trade_agent_id?: number | null;
  trade_point_id?: number | null;
  start_date?: string;
  end_date?: string;
}

export interface IPromo {
  id: number;
  name_ru: string;
  name_tm: string;
  start: string;
  end: string;
  need_count: number;
  free_count: number;
  status: boolean;
  created_at: string;
  updated_at: string;
  channel_types: ISelectAll[];
  need_ids: number[];
  free_ids: number[];
}

export interface IPromoForm {
  channel_type_ids: number[];
  end: string;
  free_count: number;
  free_ids: number[];
  name_ru: string;
  name_tm: string;
  need_count: number;
  need_ids: number[];
  start: string;
}
