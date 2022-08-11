import {
  getLogs,
  getRequestDetails,
  LogFilters,
} from "../../middlewares/logMiddleware";
import Router from "@koa/router";

export const logsRouter = new Router();

logsRouter.get("/logs", (ctx) => {
  const { search } = ctx.query;

  ctx.body = {
    logs: getLogs({ search } as LogFilters),
  };
});

logsRouter.get("/logs/:requestId", (ctx) => {
  const { requestId } = ctx.params;

  const requestDetails = getRequestDetails(requestId);

  if (!requestDetails) {
    ctx.status = 204;
    return;
  }

  if (requestDetails.request instanceof Buffer) {
    requestDetails.request = requestDetails.response.toString("base64url");
  }

  if (requestDetails.response instanceof Buffer) {
    requestDetails.response = requestDetails.response.toString("base64url");
  }

  ctx.body = requestDetails;
});
