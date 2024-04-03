import { createRequest, SuccessBody } from "./index";

export interface UploadCSVResponse extends SuccessBody {
  data: {
    result: string[];
  };
}
export const uploadCSV = createRequest<string[], UploadCSVResponse>((data) => ({
  method: "POST",
  url: "/api/csv/upload",
  headers: {
    "Content-Type": "text/csv",
  },
  data: data.join("\n"),
}));
