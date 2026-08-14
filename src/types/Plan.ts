export interface IPlan {
  product_id: number;
  list: { [key: string | number]: number };
}

export interface IPlanForm {
  count: number;
  product_id: number;
  trade_agent_id: number;
}

export interface IPlanMain {
  product_id: number;
  product: string;
  plan: number;
  forecast: number;
  forecast_vs_plan: number;
  group_id: number;
  name: string;
  product_type: string;
  volume: number;
  data: {
    day: number;
    count: number;
  }[];
}
