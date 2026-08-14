import type { IQuery } from ".";

export interface ISales {
  id: number;
  name: string;
  taste: string;
  product_type_id: number;
  product_type: string;
  volume: number;
  count: number;
}

export interface ISalesQuery {
  cityId?: number;
  districtId?: number;
  tradePointId?: number;
  startDay?: number;
  startYear?: number;
  startMonth?: number;
  endDay?: number;
  endMonth?: number;
  endYear?: number;
  agentId?: number | null;
  volume?: number | null;
  brandId?: string | null;
  taste?: string | null;
  productTypeId?: number | null;
}
