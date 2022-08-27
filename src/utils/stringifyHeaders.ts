import { OutgoingHttpHeaders } from "http";
import { HttpResponse } from "../types";

export const stringifyHeaders = (
  headers: OutgoingHttpHeaders
): HttpResponse["headers"] => {
  return Object.keys(headers).reduce((nextHeaders, headerName) => {
    nextHeaders[headerName] = Array.isArray(headers[headerName])
      ? (headers[headerName] as unknown[]).map((headerNamePart) =>
          String(headerNamePart)
        )
      : String(headers[headerName]);
    return nextHeaders;
  }, {});
};
