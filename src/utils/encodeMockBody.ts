import { MockFileContents } from "../types";
import { isTextContentType } from "./isTextContentType";

export const encodeMockBody = (
  contentType: string,
  body: Buffer
): Pick<MockFileContents, "body" | "bodyEncoding"> => {
  if (contentType.startsWith("application/json")) {
    return {
      bodyEncoding: "json",
      body: JSON.parse(body.toString("utf-8")),
    };
  }

  if (isTextContentType(contentType)) {
    return {
      bodyEncoding: "utf-8",
      body: body.toString("utf-8"),
    };
  }

  return {
    bodyEncoding: "base64",
    body: body.toString("base64"),
  };
};
