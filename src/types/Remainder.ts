export interface IRemainder {
  ekspeditor_id: number;
  list: IRemainderItem[];
  name: string;
  product_type: string;
  product_type_id: number;
  taste: string;
  volume: number;
}

export interface IRemainderItem {
  count: number;
  ekspeditor_id: number;
  free: number;
}
