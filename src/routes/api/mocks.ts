import Router from "@koa/router";
import { jsonParser } from "../../middlewares/jsonParser";
import { getLogs, getRequestDetails } from "../../middlewares/logMiddleware";
import { MockFileLocator } from "../../utils/mocks/MockFileLocator";
import { encodeJsonMock } from "../../utils/mocks/encodeJsonMock";
import { HttpRequest, HttpResponse } from "../../types";
import fs from "fs";
import { Context } from "koa";
import { log } from "../../utils/log";
import { getCombinedOptions } from "../../utils/getCombinedOptions";

export const mocksRouter = new Router();

const writeMockByLogId = async (logId: string, ctx: Context) => {
  const requestDetails = getRequestDetails(logId);
  const logItem = getLogs({ id: logId })[0];

  if (!log || !requestDetails) {
    throw new Error("Log not found (probably, it has been already erased)");
  }

  const request: HttpRequest = {
    path: logItem.path,
    method: logItem.method,
    url: logItem.url,
    query: logItem.query,
    headers: requestDetails.requestHeaders,
  };

  const response: HttpResponse = {
    status: logItem.status,
    headers: requestDetails.responseHeaders,
    body: requestDetails.response,
  };

  const fileLocator = new MockFileLocator(logItem.options, request);

  try {
    log("info", `[Write mock] ${ctx.url}`, ctx);

    await fs.promises.mkdir(fileLocator.getMockDirectory(), {
      recursive: true,
    });
  } catch (e) {
    log(
      "error",
      `Error occurred while creating mock directory:  ${e.message}`,
      ctx
    );
  }

  await fs.promises.writeFile(
    fileLocator.getMockPath(),
    JSON.stringify(
      encodeJsonMock(
        request,
        response,
        getCombinedOptions(ctx, logItem.options)
      ),
      null,
      4
    )
  );
};

mocksRouter.post("/mocks", jsonParser(), async (ctx) => {
  const { logIds } = ctx.request.body as { logIds?: string[] };

  let successCount = 0;
  const errors = [];

  if (!Array.isArray(logIds)) {
    ctx.status = 400;
    return;
  }

  const results = await Promise.allSettled(
    logIds.map((logId) => writeMockByLogId(logId, ctx))
  );

  results.forEach((result) => {
    if (result.status === "rejected") {
      errors.push(result.reason?.message ?? result.reason?.toString());
      return;
    }

    successCount++;
  });

  ctx.body = {
    successCount,
    errors,
  };
});
