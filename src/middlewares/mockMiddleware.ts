import fs from "fs";
import path from "path";

import { MockFileContents, MockProxyOptions } from "../types";
import { Context } from "koa";
import compose from "koa-compose";
import { FileLocator } from "../utils/FileLocator";
import { log } from "../utils/log";
import { encodeMockBody } from "../utils/encodeMockBody";
import {
  getActiveScenarios,
  getAvailableScenarios,
} from "../utils/scenarioStorage";

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
  js: async (path, ctx) => {
    const js = require(path);

    return js(ctx);
  },
};

const getFilenameWeight = (filename: string) => {
  // remove first part and extension
  const conditionalFragments = filename.split(".").slice(0, -1);

  return (
    conditionalFragments
      // filter by query parameters adds 10 to weight
      // filter by scenario adds 100 to weight
      .reduce<number>(
        (acc, fragment) => acc + (fragment.includes("=") ? 10 : 100),
        0
      )
  );
};

const findFileForRead = async (ctx, options) => {
  const fileLocator = new FileLocator(options, ctx);

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
      //find the most specific filename
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

  return `${directory}/${filesWithWeights[0].filename}` || null;
};

const readDirectoryIndexFile =
  (options: MockProxyOptions) => async (ctx, next) => {
    const fileLocator = new FileLocator(options, ctx);

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

    const js = require(indexFile);

    return js(ctx, next);
  };

const putMockToCtx = (options: MockProxyOptions) =>
  compose([
    readDirectoryIndexFile(options),
    async (ctx): Promise<MockFileContents> => {
      const matchedFile = await findFileForRead(ctx, options);

      if (matchedFile) {
        const extension = matchedFile.split(".").at(-1);

        if (!fileReaders.hasOwnProperty(extension)) {
          throw new Error(`Unsupported extension ${extension}!`);
        }

        return await fileReaders[extension](matchedFile, ctx);
      } else {
        throw new Error("Can not find mock file!");
      }
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
  const fileLocator = new FileLocator(options, ctx);

  const fileContents: MockFileContents = {
    code: ctx.status,
    // записываем просто для информации, чтобы мы могли ориентироваться с какого запроса пришел был записан мок
    requestUrl: ctx.url,
    headers: ctx.response.headers,
    ...encodeMockBody(ctx.response.get("content-type") ?? "", content),
  };

  try {
    let fileName = await findFileForRead(ctx, options);

    if (!fileName) {
      throw new Error("Mock not found");
    }

    const canWrite = isCanOverwriteMock(options);

    if (!canWrite) {
      return;
    }
  } catch (e) {}

  try {
    log("info", `[Write mock] ${ctx.url}`, ctx);

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

    return replyWithMock(options)(ctx, next);
  };
