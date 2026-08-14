import request from "@/utils/request";
import type { IQuery } from "@/types";

export const pointsGetApi = (params: IQuery) => {
  return request({
    url: "points",
    method: "GET",
    params,
  });
};

export const pointsPostApi = (data: object) => {
  return request({
    url: "points",
    method: "POST",
    data,
  });
};

export const pointsPutApi = (data: object, id: number) => {
  return request({
    url: `points/${id}`,
    method: "PUT",
    data,
  });
};

export const pointsDeleteApi = (id: number) => {
  return request({
    url: `points/${id}`,
    method: "DELETE",
  });
};

export const pointsLockApi = (id: number) => {
  return request({
    url: `points/${id}/lock`,
    method: "GET",
  });
};

export const pointsGetByIdApi = (id: number) => {
  return request({
    url: `points/${id}`,
    method: "GET",
  });
};

export const getAllSelectApi = (path: string) => {
  return request({
    url: `points/${path}`,
    method: "GET",
  });
};

export const getPointByImageApi = (id: number) => {
  return request({
    url: `points/images/${id}`,
    method: "GET",
  });
};

export const postPointByImageApi = (data: FormData) => {
  return request({
    url: "points/resave",
    method: "POST",
    data,
  });
};
export const deletePointByImageApi = (id: number) => {
  return request({
    url: `points/images/${id}`,
    method: "DELETE",
  });
};

export const putChangeAgentPointsApi = (
  data: object,
  agentId: number,
  ekspeditorId: number,
  dayId: number,
) => {
  return request({
    url: `points/change_agent`,
    method: "PUT",
    params: {
      id: agentId,
      ekspeditor_id: ekspeditorId,
      day_id: dayId,
    },
    data,
  });
};
