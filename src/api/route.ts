import request from "@/utils/request";
import type { IQuery } from "@/types";

export const routesGetApi = (params: IQuery) => {
  return request({
    url: "routes",
    method: "GET",
    params,
  });
};

export const routesPostApi = (data: object) => {
  return request({
    url: "routes",
    method: "POST",
    data,
  });
};

export const routesPutApi = (data: object, id: number) => {
  return request({
    url: `routes/${id}`,
    method: "PUT",
    data,
  });
};

export const routesDeleteApi = (id: number) => {
  return request({
    url: `routes/${id}`,
    method: "DELETE",
  });
};

export const routesLockApi = (id: number) => {
  return request({
    url: `routes/${id}/lock`,
    method: "GET",
  });
};

export const routesGetByIdApi = (id: number) => {
  return request({
    url: `routes/${id}`,
    method: "GET",
  });
};

export const getAllSelectApi = (path: string) => {
  return request({
    url: `${path}`,
    method: "GET",
  });
};
