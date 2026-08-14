import request from "@/utils/request";
import type { IQuery } from "@/types";

export const productListGetApi = (params: IQuery) => {
  return request({
    url: "products",
    method: "GET",
    params,
  });
};

export const productListPostApi = (data: object) => {
  return request({
    url: "products",
    method: "POST",
    data,
  });
};

export const productListPutApi = (data: object, id: number) => {
  return request({
    url: `products/${id}`,
    method: "PUT",
    data,
  });
};

export const productListDeleteApi = (id: number) => {
  return request({
    url: `products/${id}`,
    method: "DELETE",
  });
};

export const productListLockApi = (id: number) => {
  return request({
    url: `products/${id}/lock`,
    method: "GET",
  });
};

export const productListGetByIdApi = (id: number) => {
  return request({
    url: `products/${id}`,
    method: "GET",
  });
};

export const productTypesAllApi = () => {
  return request({
    url: "products/types/all",
  });
};
