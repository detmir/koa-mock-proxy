import { MockProxyOptions } from "../../types";
import { Context } from "koa";
import { MockFileLocator } from "./MockFileLocator";
import { findMockFilesForRequest } from "./findMockFilesForRequest";
import { log } from "../log";
import fs from "fs";
import { encodeJsonMock } from "./encodeJsonMock";
import { getHttpRequestFromCtx, getHttpResponseFromCtx } from "../koaAdapters";

export const isCanOverwriteMock = (options: MockProxyOptions) => {
  return options.recordOptions.overwrite ?? false;
};

export const writeMock = async (
  ctx: Context,
  options: MockProxyOptions,
  content: Buffer
) => {
  const fileLocator = new MockFileLocator(options, ctx);

  try {
    const files = await findMockFilesForRequest(ctx, options);

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
