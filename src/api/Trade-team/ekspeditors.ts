import request from "@/utils/request";
import type { IQuery } from "@/types";

export const ekspeditorsGetApi = (params: IQuery) => {
  return request({
    url: "ekspeditors",
    method: "GET",
    params,
  });
};

export const ekspeditorsPostApi = (data: object) => {
  return request({
    url: "ekspeditors",
    method: "POST",
    data,
  });
};

export const ekspeditorsPutApi = (data: object, id: number) => {
  return request({
    url: `ekspeditors/${id}`,
    method: "PUT",
    data,
  });
};

export const ekspeditorsDeleteApi = (id: number) => {
  return request({
    url: `ekspeditors/${id}`,
    method: "DELETE",
  });
};

export const ekspeditorsLockApi = (id: number) => {
  return request({
    url: `ekspeditors/${id}/lock`,
    method: "GET",
  });
};

export const ekspeditorsGetByIdApi = (id: number) => {
  return request({
    url: `ekspeditors/${id}`,
    method: "GET",
  });
};
