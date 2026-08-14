import request from "@/utils/request";
import type { IQuery } from "@/types";

export const categoriesGetApi = (params: IQuery) => {
  return request({
    url: "categories",
    method: "GET",
    params,
  });
};

export const categoriesPostApi = (data: object) => {
  return request({
    url: "categories",
    method: "POST",
    data,
  });
};

export const categoriesPutApi = (data: object, id: number) => {
  return request({
    url: `categories/${id}`,
    method: "PUT",
    data,
  });
};

export const categoriesDeleteApi = (id: number) => {
  return request({
    url: `categories/${id}`,
    method: "DELETE",
  });
};

export const categoriesLockApi = (id: number) => {
  return request({
    url: `categories/${id}/lock`,
    method: "GET",
  });
};

export const categoriesGetByIdApi = (id: number) => {
  return request({
    url: `categories/${id}`,
    method: "GET",
  });
};
