import request from "@/utils/request";

export const getLogsApi = (params: object) => {
  return request({
    url: "logs",
    params,
  });
};

export const getLogTypesApi = () => {
  return request({
    url: "logs/types",
  });
};
