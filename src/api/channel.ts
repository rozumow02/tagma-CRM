import request from "@/utils/request";
import type { IQuery } from "@/types";
import type { Method } from "axios";

export const channelsGetApi = (params: IQuery) => {
  return request({
    url: "channels",
    method: "GET",
    params,
  });
};

export const channelsPostApi = (data: object) => {
  return request({
    url: "channels",
    method: "POST",
    data,
  });
};

export const channelsPutApi = (data: object, id: number) => {
  return request({
    url: `channels/${id}`,
    method: "PUT",
    data,
  });
};

export const channelsDeleteApi = (id: number) => {
  return request({
    url: `channels/${id}`,
    method: "DELETE",
  });
};

export const channelsLockApi = (id: number) => {
  return request({
    url: `channels/${id}/lock`,
    method: "GET",
  });
};

export const channelsGetByIdApi = (id: number) => {
  return request({
    url: `channels/${id}`,
    method: "GET",
  });
};

export const channelsApi = (
  url: string,
  method?: Method,
  params?: object,
  data?: object,
) => {
  return request({
    url,
    method,
    data,
    params,
  });
};
