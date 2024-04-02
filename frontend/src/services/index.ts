// services/index.ts

import axios, { AxiosRequestConfig } from "axios";
import { itemNames } from "../configs/local-storage";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 300000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem(itemNames.accessToken) || "";
    if (accessToken) {
      config.headers["x-access-token"] = accessToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface ErrorBody {
  error_code: string;
  message: string;
}

export interface SuccessBody {
  status?: number;
  statusText?: string;
  headers?: any;
  config?: any;
  request?: any;
}

export const createRequest = <TReq, TResp = any>(
  getConfig: (request: TReq) => AxiosRequestConfig
) => {
  const createFn = (request: TReq) =>
    axiosInstance.request<TResp, TResp>(getConfig(request));
  return Object.assign(createFn, { TResp: {} as TResp, TReq: {} as TReq });
};
