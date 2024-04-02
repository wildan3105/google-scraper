import { createRequest } from "./index";

interface CreateUserRequest {
  email: string;
  password: string;
}

export const createUser = createRequest<CreateUserRequest, void>(
  ({ email, password }) => ({
    method: "GET",
    url: "/api/healthcheck/readiness",
    data: { email, password },
    headers: { "Content-Type": "application/json" },
  })
);
