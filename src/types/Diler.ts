import type { IAllProduct, IQuery } from ".";

export interface IDilerForm {
  address_ru: string;
  address_tm: string;
  city_id: number;
  company: string;
  email: string;
  name_ru: string;
  name_tm: string;
  phone_number: string;
}

export interface IDiler {
  id: number;
  name_ru: string;
  name_tm: string;
  address_ru: string;
  address_tm: string;
  company: string;
  phone_number: string;
  email: string;
  account: number;
  debt: number;
  created_at: string;
  city_id: number;
  city: string;
  total?: number;
  updated_at: number | string;
}

export interface IDilerOrders {
  id: number;
  created_at: string;
  dealer_id: number;
  dealer: string;
  status: boolean;
  is_closed: boolean;
  sum: number;
}

export interface IDilerOrderQuery extends IQuery {
  dealerId?: number;
  startDay?: number;
  startMonth?: number;
  startYear?: number;
  endDay?: number;
  endMonth?: number;
  endYear?: number;
}

export interface IFilteredProducts extends IAllProduct {
  id: number;
  count: number;
}

export interface IByDilerOrders {
  id: number;
  name: string;
  taste: string;
  volume: number;
  count: number;
  price: number;
  discount_price: number;
  is_procent: boolean;
  start: string;
  end: string;
  status: boolean;
  coefficient: number;
}

export interface IDilerInfoProductsQuery {
  dealerId?: number;
  startDay?: number;
  startMonth?: number;
  startYear?: number;
  endDay?: number;
  endMonth?: number;
  endYear?: number;
  status?: boolean;
}
