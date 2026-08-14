import request from "@/utils/request";

export const loginApi = (data: object) => {
  return request({
    url: "auth/sign-in",
    method: "POST",
    data,
  });
};
