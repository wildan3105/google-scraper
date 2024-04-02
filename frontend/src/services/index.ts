import axios, { AxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000", // Set your backend base URL
  timeout: 300000, // 5 minutes timeout
});

export const createRequest = <TReq, TResp = any>(
  getConfig: (request: TReq) => AxiosRequestConfig
) => {
  const createFn = (request: TReq) =>
    axiosInstance.request<TResp, TResp>(getConfig(request));
  return Object.assign(createFn, { TResp: {} as TResp, TReq: {} as TReq });
};
