import { createRequest, SuccessBody } from "./index";

export interface GetUserKeywordsResponse extends SuccessBody {
  data: getKeywordsResponse[];
}

export interface getKeywordsResponse {
  id: string;
  created_at: string;
  value: string;
}

export interface getSingleKeywordRequest {
  id: string;
}

export interface GetSingleKeywordResponse extends SuccessBody {
  data: keywordDetailsResponse;
}

export interface keywordDetailsResponse {
  id: string;
  keyword: string;
  num_of_links: number;
  num_of_adwords: number;
  search_result_information: string;
}

interface getHTMLContentResponse {
  data: any;
}

export const fetchKeywords = createRequest<void, GetUserKeywordsResponse>(
  () => ({
    method: "GET",
    url: "/api/users/keywords",
  })
);

export const getSingleKeyword = createRequest<
  getSingleKeywordRequest,
  GetSingleKeywordResponse
>(({ id }) => ({
  method: "GET",
  url: `/api/users/keywords/${id}`,
}));

export const getHTMLContent = createRequest<
  getSingleKeywordRequest,
  getHTMLContentResponse
>(({ id }) => ({
  method: "GET",
  url: `/api/users/keywords/${id}/convert`,
}));
