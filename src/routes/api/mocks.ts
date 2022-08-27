import Router from "@koa/router";
import { jsonParser } from "../../middlewares/jsonParser";
import { getLogs, getRequestDetails } from "../../middlewares/logMiddleware";
import { MockFileLocator } from "../../utils/MockFileLocator";

export const mocksRouter = new Router();

const writeMockByLogId = async (logId: string) => {
  const requestDetails = getRequestDetails(logId);
  const log = getLogs({ id: logId })[0];

  if (!log || requestDetails) {
    throw new Error("Log not found (probably, it has been already erased)");
  }

  const fileLocator = new MockFileLocator();

  // TODO: create context from this
  // Create filelocator to get file
  // Write content
};

mocksRouter.post("/mocks", jsonParser(), async (ctx) => {
  const { logIds } = ctx.request.body as { logIds?: string[] };

  if (!Array.isArray(logIds)) {
    ctx.status = 400;
    return;
  }

  logIds.forEach(writeMockByLogId);

  // TODO: record mocks

  ctx.body = {};
});
