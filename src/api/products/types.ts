import request from "@/utils/request";
import type { IQuery } from "@/types";

export const productTypesGetApi = (params: IQuery) => {
  return request({
    url: "products/types",
    method: "GET",
    params,
  });
};

export const productTypesPostApi = (data: object) => {
  return request({
    url: "products/types",
    method: "POST",
    data,
  });
};

export const productTypesPutApi = (data: object, id: number) => {
  return request({
    url: `products/types/${id}`,
    method: "PUT",
    data,
  });
};

export const productTypesDeleteApi = (id: number) => {
  return request({
    url: `products/types/${id}`,
    method: "DELETE",
  });
};

export const productTypesLockApi = (id: number) => {
  return request({
    url: `products/types/${id}/lock`,
    method: "GET",
  });
};

export const productTypesGetByIdApi = (id: number) => {
  return request({
    url: `products/types/${id}`,
    method: "GET",
  });
};

export const getAllSelectApi = (path: string) => {
  return request({
    url: `products/${path}`,
  });
};
