import fs from "fs";

import { MockProxyOptions } from "../types";
import { Context } from "koa";
import { isTextContentType } from "../utils/isTextContentType";
import { FileLocator } from "../utils/FileLocator";

const readMock = async (ctx, options: MockProxyOptions) => {
  const fileLocator = new FileLocator(options, ctx);

  let fileContents;

  try {
    const file = await fs.promises.readFile(fileLocator.getMockPath(), {
      encoding: "utf-8",
    });
    fileContents = JSON.parse(file);
  } catch (e) {
    // if mock not found we simply go to the next middleware
    return;
  }

  ctx.status = fileContents.code;

  Object.entries(fileContents.headers).forEach(([headerName, headerValue]) => {
    ctx.set(headerName, headerValue);
  });

  if (fileContents.bodyEncoding === "base64") {
    ctx.body = Buffer.from(fileContents.body, "base64");
  } else {
    ctx.body = fileContents.body;
  }
};

const encodeBody = (ctx: Context, body: Buffer) => {
  const contentType = ctx.response.get("content-type") ?? "";

  if (contentType.startsWith("application/json")) {
    return {
      bodyEncoding: "json",
      body: JSON.parse(body.toString("utf-8")),
    };
  }

  if (isTextContentType(contentType)) {
    // todo: deal with another encodings
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

const writeMock = async (
  ctx: Context,
  options: MockProxyOptions,
  content: Buffer
) => {
  const fileLocator = new FileLocator(options, ctx);

  const fileContents = {
    code: ctx.status,
    // записываем просто для информации, чтобы мы могли ориентироваться с какого запроса пришел был записан мок
    requestUrl: ctx.url,
    headers: ctx.response.headers,
    ...encodeBody(ctx, content),
  };

  try {
    await fs.promises.mkdir(fileLocator.getMockDirectory(), {
      recursive: true,
    });
  } catch (e) {
    console.error(e);
  }

  await fs.promises.writeFile(
    fileLocator.getMockPath(),
    JSON.stringify(fileContents, null, 4)
  );
};

export const mockMiddleware =
  (options: MockProxyOptions) => async (ctx, next) => {
    if (options.mode === "record") {
      // Подписываюсь на наше событие окончания получения данных и записываю их
      ctx.res.on("data", (content) => writeMock(ctx, options, content));
      return next();
    }

    return readMock(ctx, options);
  };
