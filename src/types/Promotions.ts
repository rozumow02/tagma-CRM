export interface IPromotions {
  id: number;
  name_tm: string;
  name_ru: string;
  start: string;
  end: string;
  list: number[];
  created_at: string;
  count: number;
  status: boolean;
}

export interface IPromotionsForm {
  count: number;
  end: string;
  list: number[];
  name_ru: string;
  name_tm: string;
  start: string;
}
