import request from "@/utils/request";
import type { IQuery } from "@/types";

export const driversGetApi = (params: IQuery) => {
  return request({
    url: "drivers",
    method: "GET",
    params,
  });
};

export const driversPostApi = (data: object) => {
  return request({
    url: "drivers",
    method: "POST",
    data,
  });
};

export const driversPutApi = (data: object, id: number) => {
  return request({
    url: `drivers/${id}`,
    method: "PUT",
    data,
  });
};

export const driversDeleteApi = (id: number) => {
  return request({
    url: `drivers/${id}`,
    method: "DELETE",
  });
};

export const driversLockApi = (id: number) => {
  return request({
    url: `drivers/${id}/lock`,
    method: "GET",
  });
};

export const driversGetByIdApi = (id: number) => {
  return request({
    url: `drivers/${id}`,
    method: "GET",
  });
};
