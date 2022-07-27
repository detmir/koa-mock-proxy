import fs from "fs";

import {MockFileContents, MockProxyOptions} from "../types";
import { Context } from "koa";
import { isTextContentType } from "../utils/isTextContentType";
import { FileLocator } from "../utils/FileLocator";
import {log} from "../utils/log";

const fileReaders = {
  json: async (path, ctx) => {
    const file = await fs.promises.readFile(path, {
      encoding: "utf-8",
    });

    const fileContents = JSON.parse(file);

    ctx.status = fileContents.code;

    Object.entries(fileContents.headers).forEach(([headerName, headerValue]) => {
      ctx.set(headerName, headerValue);
    });

    if (fileContents.bodyEncoding === "base64") {
      ctx.body = Buffer.from(fileContents.body, "base64");
    } else {
      ctx.body = fileContents.body;
    }
  },
  js: async (path, ctx) => {
    const js = require(path);

    return js(ctx);
  }
};

const findFileForRead =  async (ctx, options) => {
  const fileLocator = new FileLocator(options, ctx);

  log('debug', `Mock filename: ${fileLocator.getMockPath()}`);

  const directory = fileLocator.getMockDirectory();

  const files = await fs.promises.readdir(directory, { withFileTypes: true });

  const file = files.find(file => {
    if (!file.isFile()) {
      return false;
    }

    return fileLocator.isFileMatched(file.name);
  });

  return file ? `${directory}/${file.name}` : null;
}

const putMockToCtx = async (ctx, options: MockProxyOptions): Promise<MockFileContents>  => {
  const matchedFile = await findFileForRead(ctx, options)

  if (matchedFile) {
    const extension = matchedFile.split('.').at(-1);

    if (!fileReaders.hasOwnProperty(extension)) {
      throw new Error(`Unsupported extension ${extension}!`)
    }

    return await fileReaders[extension](matchedFile, ctx);
  } else {
    throw new Error('Can not find mock file!')
  }
}

const replyWithMock = async (ctx, options: MockProxyOptions) => {
  try {
    await putMockToCtx(ctx, options);
  } catch (e) {
    log('info', `[Read mock] Read error: ${ctx.url} ${e.message}`);
    return;
  }
  log('info', `[Read mock] Read successfully: ${ctx.url}`);
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

export const isCanOverwriteMock = (options: MockProxyOptions) => {
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
    let fileName = await findFileForRead(ctx, options);

    if (!fileName) {
      throw new Error('Mock not found');
    }

    const canWrite = isCanOverwriteMock(options);

    if (!canWrite) {
      return;
    }
  } catch (e) {}

  try {
    log('info', `[Write mock] ${ctx.url}`);

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
