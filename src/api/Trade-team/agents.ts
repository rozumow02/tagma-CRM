import request from "@/utils/request";
import type { IQuery } from "@/types";

export const agentsGetApi = (params: IQuery) => {
  return request({
    url: "agents",
    method: "GET",
    params,
  });
};

export const agentsPostApi = (data: object) => {
  return request({
    url: "agents",
    method: "POST",
    data,
  });
};

export const agentsPutApi = (data: object, id: number) => {
  return request({
    url: `agents/${id}`,
    method: "PUT",
    data,
  });
};

export const agentsDeleteApi = (id: number) => {
  return request({
    url: `agents/${id}`,
    method: "DELETE",
  });
};

export const agentsLockApi = (id: number) => {
  return request({
    url: `agents/${id}/lock`,
    method: "GET",
  });
};

export const agentsGetByIdApi = (id: number) => {
  return request({
    url: `agents/${id}`,
    method: "GET",
  });
};

export const getAllSelectApi = (path: string) => {
  return request({
    url: `agents/${path}`,
    method: "GET",
  });
};
