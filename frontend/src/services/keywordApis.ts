import { createRequest, SuccessBody } from "./index";

// TODO: extract this common interface out
export interface GetUserKeywordsResponse extends SuccessBody {
  data: getKeywordsResponse[];
}

export interface getKeywordsResponse {
  id: string;
  created_at: string;
  value: string;
}

export const fetchKeywords = createRequest<void, GetUserKeywordsResponse>(
  () => ({
    method: "GET",
    url: "/api/users/keywords",
  })
);
