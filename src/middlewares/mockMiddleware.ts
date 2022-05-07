import fs from "fs";

import {MockFileContents, MockProxyOptions} from "../types";
import { Context } from "koa";
import { isTextContentType } from "../utils/isTextContentType";
import { FileLocator } from "../utils/FileLocator";

const readMock = async (ctx, options: MockProxyOptions): Promise<MockFileContents>  => {
  const fileLocator = new FileLocator(options, ctx);

    const file = await fs.promises.readFile(fileLocator.getMockPath(), {
      encoding: "utf-8",
    });

    return JSON.parse(file);
}

const putMockToCtx = (ctx, fileContents: any) => {
  ctx.status = fileContents.code;

  Object.entries(fileContents.headers).forEach(([headerName, headerValue]) => {
    ctx.set(headerName, headerValue);
  });

  if (fileContents.bodyEncoding === "base64") {
    ctx.body = Buffer.from(fileContents.body, "base64");
  } else {
    ctx.body = fileContents.body;
  }
}

const replyWithMock = async (ctx, options: MockProxyOptions) => {
  let fileContents;

  try {
    fileContents = await readMock(ctx, options);
  } catch (e) {
    return;
  }

  putMockToCtx(ctx, fileContents);
};

const encodeBody = (ctx: Context, body: Buffer): Pick<MockFileContents, 'body' | 'bodyEncoding'> => {
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

export const isCanOverwriteMock = (options: MockProxyOptions, fileContents: any) => {
  if (fileContents?.hasOwnProperty('overwrite')) {
    return fileContents.overwrite;
  }

  return options.recordOptions.overwrite ?? false;
};

const writeMock = async (
  ctx: Context,
  options: MockProxyOptions,
  content: Buffer
) => {
  const fileLocator = new FileLocator(options, ctx);

  const fileContents: MockFileContents = {
    code: ctx.status,
    // записываем просто для информации, чтобы мы могли ориентироваться с какого запроса пришел был записан мок
    requestUrl: ctx.url,
    headers: ctx.response.headers,
    ...encodeBody(ctx, content),
  };

  try {
    let existingMockFileContent = await readMock(ctx, options);
    const canWrite = isCanOverwriteMock(options, existingMockFileContent);

    if (!canWrite) {
      return;
    }
  } catch (e) {}

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

    return replyWithMock(ctx, options);
  };
