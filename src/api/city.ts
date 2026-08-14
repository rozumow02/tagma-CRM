import request from "@/utils/request";
import type { IQuery } from "@/types";

export const citiesGetApi = (params: IQuery) => {
  return request({
    url: "cities",
    method: "GET",
    params,
  });
};

export const cityPostApi = (data: object) => {
  return request({
    url: "cities",
    method: "POST",
    data,
  });
};

export const cityPutApi = (data: object, id: number) => {
  return request({
    url: `cities/${id}`,
    method: "PUT",
    data,
  });
};

export const cityDeleteApi = (id: number) => {
  return request({
    url: `cities/${id}`,
    method: "DELETE",
  });
};

export const cityLockApi = (id: number) => {
  return request({
    url: `cities/${id}/lock`,
    method: "GET",
  });
};

export const citiesGetByIdApi = (id: number) => {
  return request({
    url: `cities/${id}`,
    method: "GET",
  });
};
