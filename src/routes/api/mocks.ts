import Router from "@koa/router";
import { jsonParser } from "../../middlewares/jsonParser";

export const mocksRouter = new Router();

mocksRouter.post("/mocks", jsonParser(), async (ctx) => {
  const { logIds } = ctx.request.body as { logIds?: string[] };

  if (!Array.isArray(logIds)) {
    ctx.status = 400;
    return;
  }

  // TODO: record mocks

  ctx.body = {};
});
