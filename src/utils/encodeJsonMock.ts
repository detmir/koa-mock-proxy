import { HttpRequest, HttpResponse, MockFileContents } from "../types";
import { isTextContentType } from "./isTextContentType";

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
export const encodeJsonMock = (
  request: HttpRequest,
  response: HttpResponse
): MockFileContents => ({
  code: response.status,
  // записываем просто для информации, чтобы мы могли ориентироваться с какого запроса пришел был записан мок
  requestUrl: request.url,
  headers: response.headers,
  ...encodeMockBody(
    (response.headers["content-type"] as string) ?? "",
    response.body
  ),
});
