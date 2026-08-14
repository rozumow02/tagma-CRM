export interface IOrders {
  id: number;
  trade_point_id: number;
  trade_agent_id: number;
  trade_point: string;
  location: string;
  city: string;
  district: string;
  created_at: string;
  trade_agent: string;
  sum: number;
  paid: number;
  not_paid: number;
  is_closed: IORDERSTATUSTYPE;
  status: boolean;
  orientir: string;
  trade_category: string;
}

export interface ISelectedOrder {
  count: number;
  id: number;
  name: string;
  price: number;
  status: boolean;
  taste: string;
  volume: number;
  coefficient: number;
  discount_price: number | string;
  end: string;
  is_procent: boolean | string;
  start: string;
}

export interface IOrderByPayments {
  trade_agent: string;
  created_at: string;
  currency: number;
  payment_type: string;
  id: number;
  order_id: number;
  payment_type_id: number;
}

export type IORDERSTATUSTYPE = -1 | 0 | 1;
export type IORDERSTATUS = {
  id: IORDERSTATUSTYPE;
  name: string;
  color: string;
};
