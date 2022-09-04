import {
  HttpRequest,
  HttpResponse,
  MockFileContents,
  MockProxyOptions,
} from "../../types";
import { isTextContentType } from "../isTextContentType";

export const encodeMockBody = (
  contentType: string,
  body: string | Buffer
): Pick<MockFileContents, "body" | "bodyEncoding"> => {
  if (contentType.startsWith("application/json")) {
    return {
      bodyEncoding: "json",
      body: JSON.parse(
        typeof body === "string" ? body : body.toString("utf-8")
      ),
    };
  }

  if (isTextContentType(contentType)) {
    return {
      bodyEncoding: "utf-8",
      body: typeof body === "string" ? body : body.toString("utf-8"),
    };
  }

  return {
    bodyEncoding: "base64",
    body: typeof body === "string" ? body : body.toString("base64"),
  };
};

const headersToRemove = ["content-length", "connection"];

const defaultFilterHeaders = (headers: Record<string, string | string[]>) => {
  const nextHeaders = {};
  Object.entries(headers).forEach(([name, value]) => {
    if (!headersToRemove.includes(name.toLowerCase())) {
      nextHeaders[name] = value;
    }
  });

  return nextHeaders;
};

export const encodeJsonMock = (
  request: HttpRequest,
  response: HttpResponse,
  options: MockProxyOptions
): MockFileContents => {
  const filterHeaders =
    options.recordOptions?.filterHeaders || defaultFilterHeaders;

  return {
    code: response.status,
    // записываем просто для информации, чтобы мы могли ориентироваться с какого запроса пришел был записан мок
    requestUrl: request.url,
    headers: filterHeaders(response.headers),
    ...encodeMockBody(
      (response.headers["content-type"] as string) ?? "",
      response.body
    ),
  };
};
