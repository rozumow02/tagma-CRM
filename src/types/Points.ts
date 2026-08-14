export type IPoints = {
  city: string;
  visible?: boolean;
  city_id: number;
  code: string;
  id: number;
  location: string;
  name: string;
  orientir: string;
  status: boolean;
  tradCategory: string;
  tradeCategoryId: number;
  trade_agent: string;
  trade_agent_id: number;
  trade_channel: string;
  trade_channel_id: number;
  district: string;

  day: string;
  day_id: number;
  district_id: number;
  ekspeditor: string;
  ekspeditor_id: number;
  trade_category: string;
  trade_category_id: number;
  updated_at: string;
  debt: number;
};

export type IPointsForm = {
  city_id: number;
  location_ru: string;
  location_tm: string;
  name_ru: string;
  name_tm: string;
  orientir_ru: string;
  orientir_tm: string;
  status: boolean;
  trade_agent_id: number;
  trade_channel_id: number;
  images: File[] | null;
  district_id: number;
  ekspeditor_id: number | null;
  day_id: number | null;
};

export type IContacts = {
  name: string;
  number: string;
  kind_id: number;
  post_id: number;
  kind: string;
  post: string;
  uprs: string[];
};

export type IContactsForm = {
  kind_id: number;
  name_ru: string;
  name_tm: string;
  number: string;
  post_id: number;
  trade_point_id: number;
  uprs_ids: number[] | string[];
};

export type IPointByIDGeneral = {
  id: number;
  code: string;
  city: string;
  location: string;
  orientir: string;
  name: string;
  trade_channel: string;
  trade_category: string;
  trade_agent: string;
  oborot: number;
  dolg: number;
  images: { id: number; path: string }[] | null;
  city_id: number;
  day: string;
  day_id: number;
  district: string;
  district_id: number;
  ekspeditor: string;
  ekspeditor_id: number;
  debt: number;
  transfer: number;
  terminal: number;
  cash: number;
  weekExtraDays: number[];
};

export interface IPointByProducts {
  id: number;
  name: string;
  product_type: string;
  taste: string;
  volume: number;
  count: number;
  product_type_id: number;
}

export interface IFormPointByOrders {
  tradePointId: number;
  startDay?: number;
  startMonth?: number;
  startYear?: number;
  endDay?: number;
  endMonth?: number;
  endYear?: number;
}

export interface IDebtForm {
  price1: number; // Bu pulun bitin bolegi (manat)
  price2: number; // Bu pulun galyndy bolegi (tenne)
}

export interface IFormPointDebt extends IDebtForm {
  id: number;
  paymentTypeId: number | null;
}
