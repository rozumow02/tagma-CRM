import type { IFormPointDebt } from "@/types";
import request from "@/utils/request";
import type { Method } from "axios";

export const pointByIdGeneralApi = (id: number) => {
  return request({
    url: `points/${id}/general`,
    method: "GET",
  });
};

export const pointsDebtCreateApi = (params: IFormPointDebt) => {
  return request({
    url: "points/debts/create",
    params,
  });
};
