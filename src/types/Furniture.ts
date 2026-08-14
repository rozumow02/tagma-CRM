export interface IFurniture {
  id: number;
  name_ru: string;
  name_tm: string;
  created_at: string;
}

export interface IFurnitureForm {
  name_ru: string;
  name_tm: string;
}

export interface IFurnitureByPoint {
  id: number;
  trade_point_id: number;
  furniture_id: number;
  name: string;
  count: number;
}

export interface IFurnitureByPointForm {
  trade_point_id: number;
  furniture_id: number | null;
  count: number | null;
  id?: number;
}

export interface IFurniturePointCount {
  name: string;
  count: number;
}
