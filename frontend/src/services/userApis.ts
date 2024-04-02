import { createRequest } from "./index";

interface UserRequest {
  email: string;
  password: string;
}

interface VerifyEmailRequest {
  code: string;
}

interface LoginResponse {
  data: userLoginResponse;
  status?: number;
  statusText?: string;
  headers?: any;
  config?: any;
  request?: any;
}

interface userLoginResponse {
  id: string;
  email: string;
  access_token: string;
}

export const createUser = createRequest<UserRequest, void>(
  ({ email, password }) => ({
    method: "POST",
    url: "/api/users",
    data: { email, password },
    headers: { "Content-Type": "application/json" },
  })
);

export const loginUser = createRequest<UserRequest, LoginResponse>(
  ({ email, password }) => ({
    method: "POST",
    url: "/api/users/auth/login",
    data: { email, password },
    headers: { "Content-Type": "application/json" },
  })
);

export const verifyUserEmail = createRequest<VerifyEmailRequest, void>(
  ({ code }) => ({
    method: "GET",
    url: `/api/users/verify?code=${code}`,
  })
);
