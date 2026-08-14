import request from "@/utils/request";
import type { IQuery } from "@/types";

export const merchandisersGetApi = (params: IQuery) => {
  return request({
    url: "merchandisers",
    method: "GET",
    params,
  });
};

export const merchandisersPostApi = (data: object) => {
  return request({
    url: "merchandisers",
    method: "POST",
    data,
  });
};

export const merchandisersPutApi = (data: object, id: number) => {
  return request({
    url: `merchandisers/${id}`,
    method: "PUT",
    data,
  });
};

export const merchandisersDeleteApi = (id: number) => {
  return request({
    url: `merchandisers/${id}`,
    method: "DELETE",
  });
};

export const merchandisersLockApi = (id: number) => {
  return request({
    url: `merchandisers/${id}/lock`,
    method: "GET",
  });
};

export const merchandisersGetByIdApi = (id: number) => {
  return request({
    url: `merchandisers/${id}`,
    method: "GET",
  });
};
