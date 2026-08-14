export type IRoutes = {
  id: number;
  code: string;
  trade_point_id: number;
  trade_agent_id: number;
  day_id: number;
  status: boolean;
  city: string;
  trade_point: string;
  trade_agent: string;
  day: string;
  location: string;
  orientir: string;
};

export type IRoutesForm = {
  day_id: number;
  status: boolean;
  trade_agent_id: number;
  trade_point_id: number;
  ekspeditor_id: number;
};

export type IRoutePoints = {
  city: string;
  code: string;
  id: number;
  location: string;
  name: string;
  trade_agent: string;
  trade_agent_id: number;
};
