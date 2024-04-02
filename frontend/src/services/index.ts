import axios, { AxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 300000,
});

export interface ErrorBody {
  error_code: string;
  message: string;
}

export const createRequest = <TReq, TResp = any>(
  getConfig: (request: TReq) => AxiosRequestConfig
) => {
  const createFn = (request: TReq) =>
    axiosInstance.request<TResp, TResp>(getConfig(request));
  return Object.assign(createFn, { TResp: {} as TResp, TReq: {} as TReq });
};
