import type { IFurniturePointCount } from "./Furniture";

export type IProductTypesForm = {
  name_ru: string;
  name_tm: string;
  status: boolean;
  volume: number;
  count: number;
};

export type IProductTypes = {
  code: string;
  id: number;
  volume: number;
  count: number;
  name: string;
  status: boolean;
};

export type IProduct = {
  id: number;
  code: string;
  name_ru: string;
  name_tm: string;
  taste_ru: string;
  taste_tm: string;
  price: number;
  status: boolean;
  product_type_id: boolean;
  product_type: null | string;

  block_price: number;
  brand_id: number;
  d_price: number;
  name: string;
  updated_at: string;
  volume: number;
  furniture_list: IFurniturePointCount[];
};

export type IProductForm = {
  brand_id: number;
  price1: number;
  price2: number;
  product_type_id: number;
  status: boolean;
  taste_ru: string;
  taste_tm: string;

  d_price1: number;
  d_price2: number;
};

export interface IAllProduct {
  code: string;
  Id: number;
  name: string;
  product_type_name: string;
  taste: string;
  volume: number;
  group_id: number;
  counts?: { [key: string]: number };
}
