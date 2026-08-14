export interface IMerchandiser {
  id: number;
  code: string;
  trade_agent: string;
  name_ru: string;
  name_tm: string;
  number: string;
  status: boolean;
  updated_at: string;
}

export interface IMerchandiserForm {
  name_ru: string;
  name_tm: string;
  number: string;
  status: boolean;
}
