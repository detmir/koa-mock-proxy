import Router from "@koa/router";
import { scenariosRouter } from "./scenarios";
import { mocksRouter } from "./mocks";
import { logsRouter } from "./logs";

export const apiRouter = new Router({
  prefix: "/api",
});

apiRouter.use(scenariosRouter.routes());
apiRouter.use(mocksRouter.routes());
apiRouter.use(logsRouter.routes());
