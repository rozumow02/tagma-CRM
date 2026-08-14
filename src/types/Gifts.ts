export interface IGifts {
  id: number;
  name_ru: string;
  name_tm: string;
  gift_type_id: number;
  trade_point_id: number;
  trade_point: string;
  trade_agent: string;
  location: string;
  gift_type: string;
  updated_at: string;
}

export interface IGiftsForm {
  gift_type_id: number;
  name_ru: string;
  name_tm: string;
  // trade_point_id: number | null;
}
