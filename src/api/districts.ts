import request from "@/utils/request";
import type { Method } from "axios";

export const districtsApi = (
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
