import fs from "fs";
import { log } from "../log";
import { MockFileContents, MockProxyOptions } from "../../types";
import { MockFileLocator } from "./MockFileLocator";
import path from "path";
import compose from "koa-compose";
import { findMockFilesForRequest } from "./findMockFilesForRequest";
import { getActiveScenarios } from "../scenarioStorage";

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

    ctx.activeScenarios = getActiveScenarios();

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
      const matchedFiles = await findMockFilesForRequest(ctx, options);

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

export const replyWithMock =
  (options: MockProxyOptions) => async (ctx, next) => {
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
