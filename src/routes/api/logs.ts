import {
  deleteLogs,
  getLogs,
  getRequestDetails,
  LogFilters,
} from "../../middlewares/logMiddleware";
import Router from "@koa/router";
import { isTextContentType } from "../../utils/isTextContentType";

export const logsRouter = new Router();

logsRouter.get("/logs", (ctx) => {
  const { search } = ctx.query;

  ctx.body = {
    logs: getLogs({ search } as LogFilters),
  };
});

logsRouter.delete("/logs", () => {
  deleteLogs();
});

logsRouter.get("/logs/:requestId", (ctx) => {
  const { requestId } = ctx.params;

  const requestDetails = getRequestDetails(requestId);

  if (!requestDetails) {
    ctx.status = 204;
    return;
  }

  if (requestDetails.request instanceof Buffer) {
    const isText = isTextContentType(
      requestDetails.request["content-type"] as string
    );

    requestDetails.request = requestDetails.response.toString(
      isText ? "utf-8" : "base64url"
    );
  }

  if (requestDetails.response instanceof Buffer) {
    const isText = isTextContentType(
      requestDetails.responseHeaders["content-type"] as string
    );

    requestDetails.response = requestDetails.response.toString(
      isText ? "utf-8" : "base64url"
    );
  }

  ctx.body = requestDetails;
});
