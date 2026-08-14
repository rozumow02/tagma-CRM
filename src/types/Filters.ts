export interface IFilters {
  product_id: number;
  product_type_id: number;
  name: string;
  taste: string;
  product_type: string;
  volume: number;
  status: boolean;
}

export interface IFilterMain {
  product_id: number;
  name: string;
  taste: string;
  product_type_id: number;
  product_type: string;
  volume: number;
  distribution: number;
  wystawlaymost: number;
  rasprodano: number;
  have: number;
  trade_point_count: number;
}

export interface IQueryFilterMain {
  cityId?: number | null;
  [key: string]: any;
  districtId?: number | null;
  tradePointId?: number | null;
  agentId?: number | null;
  volume?: number | null;
  brand?: string | null;
  taste?: string | null;
}
