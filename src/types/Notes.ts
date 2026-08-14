export interface INotes {
  create_at: string;
  description: string;
  id: number;
}

export interface INotesPoint {
  city: string;
  created_at: string;
  description: string;
  id: number;
  location: string;
  trade_point: string;
  trade_point_code: string;
  trade_point_id: number;
  city_id: number;
  district_id: number;
  disctrict_id: number;
  disctrict: string;
}

export interface IFormNotesPoint {
  description: string;
  trade_point_id: number;
  cityId: number;
  districtId: number;
}
