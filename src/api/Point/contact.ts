import request from "@/utils/request";
import type { IQuery } from "@/types";

export const contactsGetApi = (params: object) => {
  return request({
    url: "contacts",
    method: "GET",
    params,
  });
};

export const contactsPostApi = (data: object) => {
  return request({
    url: "contacts",
    method: "POST",
    data,
  });
};

export const contactsPutApi = (data: object, id: number) => {
  return request({
    url: `contacts/${id}`,
    method: "PUT",
    data,
  });
};

export const contactsDeleteApi = (id: number) => {
  return request({
    url: `contacts/${id}`,
    method: "DELETE",
  });
};

export const contactsLockApi = (id: number) => {
  return request({
    url: `contacts/${id}/lock`,
    method: "GET",
  });
};

export const contactsGetByIdApi = (id: number) => {
  return request({
    url: `contacts/${id}`,
    method: "GET",
  });
};

export const getAllSelectApi = (path: string) => {
  return request({
    url: `contacts/${path}`,
    method: "GET",
  });
};
