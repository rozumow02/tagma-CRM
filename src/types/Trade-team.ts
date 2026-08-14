import type { IDebtForm } from "./Points";

export type IDriversForm = {
  name_ru: string;
  name_tm: string;
  number: string;
  status: boolean;
};

export type IDrivers = {
  name_ru: string;
  name_tm: string;
  number: number;
  status: boolean;
  id: number;
  code: string | number;
  trade_agent: string;
  updated_at?: string;
};

export type IEkspeditors = {
  id: number;
  name_ru: string;
  name_tm: string;
  number: string;
  status: boolean;
  code: string | number;
  trade_agent: string;
  updated_at?: string;
};

export type IEkspeditorsForm = {
  name_ru: string;
  name_tm: string;
  number: string;
  status: boolean;
};

export type IAgents = {
  driver: string;
  driver_id: number;
  ekspeditor: string;
  ekspeditor_id: number;
  id: number;
  name_ru: string;
  name_tm: string;
  number: string;
  status: boolean;
};

export type IAgentsForm = {
  driver_ids: number[];
  ekspeditor_ids: number[];
  merchandiser_ids: number[];
  name_ru: string;
  name_tm: string;
  number: string;
  status: boolean;
};

export interface IAgentDebtList {
  name: string;
  city: string;
  district: string;
  currency: number;
  status: boolean;
  not_paid: number;
  paid: number;
  sum: number;
}

export interface IAgentDebt {
  list: IAgentDebtList[];
  name: string;
  number: number;
  sum: number;
  cash: number;
  self: number;
  terminal: number;
  transfer: number;
}

export interface IRemainderToEkspeditor {
  name: string;
  product_type: string;
  taste: string;
  volume: number;
  count: number;
  id: number;
  product_type_id: number;
}

export interface IAgentPayments {
  id: number;
  order_id: number;
  currency: number | string;
  payment_type_id: number;
  created_at: string;
  payment_type: string;
  trade_agent: string;
}

export interface IFormAgentDebt extends IDebtForm {
  agentId: number;
}
