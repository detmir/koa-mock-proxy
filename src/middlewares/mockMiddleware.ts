import fs from "fs";
import path from "path";

import { MockFileContents, MockProxyOptions } from "../types";
import { Context } from "koa";
import compose from "koa-compose";
import { MockFileLocator } from "../utils/MockFileLocator";
import { log } from "../utils/log";
import { getActiveScenarios } from "../utils/scenarioStorage";
import { encodeJsonMock } from "../utils/encodeJsonMock";
import {
  getHttpRequestFromCtx,
  getHttpResponseFromCtx,
} from "../utils/koaAdapters";

const fileReaders = {
  json: async (path, ctx) => {
    const file = await fs.promises.readFile(path, {
      encoding: "utf-8",
    });

    const fileContents = JSON.parse(file);

    ctx.status = fileContents.code;

    Object.entries(fileContents.headers).forEach(
      ([headerName, headerValue]) => {
        ctx.set(headerName, headerValue);
      }
    );

    if (fileContents.bodyEncoding === "base64") {
      ctx.body = Buffer.from(fileContents.body, "base64");
    } else {
      ctx.body = fileContents.body;
    }
  },
  js: async (path, ctx, next) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const js = require(path);

    try {
      await js(ctx, next);
    } catch (error) {
      log("debug", `Caught JS error in mock ${path}`);

      ctx.status = 400;
      ctx.body = {
        message: error.message ?? "Unknown error",
      };
    }
  },
};

const getFilenameWeight = (filename: string) => {
  // remove first part and extension
  const conditionalFragments = filename.split(".").slice(0, -1);

  let weight = 0;

  // js should have more priority than json
  if (filename.endsWith("js")) {
    weight += 1;
  }

  return (
    conditionalFragments
      // filter by query parameters adds 10 to weight
      // filter by scenario adds 100 to weight
      .reduce<number>(
        (acc, fragment) => acc + (fragment.includes("=") ? 10 : 100),
        weight
      )
  );
};

const findFilesForRead = async (ctx, options) => {
  const fileLocator = new MockFileLocator(options, ctx);

  log("debug", `Mock filename: ${fileLocator.getMockPath()}`, ctx);

  const directory = path.resolve(fileLocator.getMockDirectory());

  const files = await fs.promises.readdir(directory, { withFileTypes: true });

  const filesWithWeights = files
    .filter((file) => {
      if (!file.isFile()) {
        return false;
      }

      return fileLocator.isFileMatched(file.name);
    })
    .map((file) => ({
      filename: file.name,
      // find the most specific filename
      weight: getFilenameWeight(file.name),
    }));

  if (!filesWithWeights.length) {
    return null;
  }

  filesWithWeights.sort(
    ({ weight: weight1 }, { weight: weight2 }) => weight2 - weight1
  );

  log(
    "debug",
    `Appropriate files found for request: ${JSON.stringify(filesWithWeights)}`,
    ctx
  );

  return filesWithWeights.map(({ filename }) => `${directory}/${filename}`);
};

const readDirectoryIndexFile =
  (options: MockProxyOptions) => async (ctx, next) => {
    const fileLocator = new MockFileLocator(options, ctx);

    const directory = path.resolve(fileLocator.getMockDirectory());

    const indexFile = `${directory}/index.js`;

    try {
      await fs.promises.access(indexFile, fs.constants.R_OK);
    } catch {
      log(
        "debug",
        `index file for ${fileLocator.getMockDirectory()} doesn't exists`
      );

      return next();
    }

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const js = require(indexFile);

    return js(ctx, next);
  };

const matchedFileMiddleware = (matchedFile) => async (ctx, next) => {
  const extension = matchedFile.split(".").at(-1);

  // eslint-disable-next-line no-prototype-builtins
  if (!fileReaders.hasOwnProperty(extension)) {
    throw new Error(`Unsupported extension ${extension}!`);
  }

  return await fileReaders[extension](matchedFile, ctx, next);
};

const putMockToCtx = (options: MockProxyOptions) =>
  compose([
    readDirectoryIndexFile(options),
    async (ctx, next): Promise<MockFileContents | void> => {
      const matchedFiles = await findFilesForRead(ctx, options);

      const matchedFileMiddlewares = matchedFiles.map((matchedFile) =>
        matchedFileMiddleware(matchedFile)
      );

      const composedMiddleware = compose([
        ...matchedFileMiddlewares,
        () => {
          throw new Error("Can not find mock file!");
        },
      ]);

      return composedMiddleware(ctx, next);
    },
  ]);

const replyWithMock = (options: MockProxyOptions) => async (ctx, next) => {
  try {
    ctx.state.activeScenarios = getActiveScenarios();

    await putMockToCtx(options)(ctx, next);
    ctx.state.responseSource = "mock";
  } catch (e) {
    log("info", `[Read mock] Mock read error: ${ctx.url} ${e.message}`, ctx);
    return;
  }
  log("info", `[Read mock] Mock read successfully: ${ctx.url}`, ctx);
};

export const isCanOverwriteMock = (options: MockProxyOptions) => {
  return options.recordOptions.overwrite ?? false;
};

const writeMock = async (
  ctx: Context,
  options: MockProxyOptions,
  content: Buffer
) => {
  const fileLocator = new MockFileLocator(options, ctx);

  try {
    const files = await findFilesForRead(ctx, options);

    if (!files || !files.length) {
      throw new Error("Mock not found");
    }

    const canWrite = isCanOverwriteMock(options);

    if (!canWrite) {
      return;
    }
    // eslint-disable-next-line no-empty
  } catch (e) {}

  try {
    log("info", `[Write mock] ${ctx.url}`, ctx);

    await fs.promises.mkdir(fileLocator.getMockDirectory(), {
      recursive: true,
    });
  } catch (e) {
    log(
      "error",
      `Error occurred while creating mock directory: ${e.message}`,
      ctx
    );
  }

  const fileContents = encodeJsonMock(getHttpRequestFromCtx(ctx), {
    ...getHttpResponseFromCtx(ctx),
    body: content,
  });

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

    return replyWithMock(options)(ctx, next);
  };
