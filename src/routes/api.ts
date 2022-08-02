import Router from "@koa/router";
import {jsonParser} from "../middlewares/jsonParser";
import {getActiveScenarios, getAvailableScenarios, setActiveScenarios} from "../utils/scenarioStorage";
import {getLogs, getRequestDetails, LogFilters} from "../middlewares/logMiddleware";

export const apiRouter = new Router({
  prefix: '/api'
});

apiRouter.get('/scenarios',  ctx => {
  const activeScenarios = getActiveScenarios();

  ctx.body = {
    scenarios: getAvailableScenarios().map(scenario => ({
      id: scenario,
      active: activeScenarios.includes(scenario),
    })),
  };
});

apiRouter.put('/scenarios', jsonParser(), async ctx => {
  const nextScenarios = ctx.request.body as string[];

  if (!Array.isArray(nextScenarios)) {
    ctx.status = 400;
    return;
  }

  await setActiveScenarios(nextScenarios);

  ctx.body = { scenarios: getActiveScenarios() };
});

apiRouter.get('/logs',  ctx => {
  const { search } = ctx.query;

  ctx.body = {
    logs: getLogs({ search } as LogFilters),
  };
});

apiRouter.get('/logs/:requestId',  ctx => {
  const { requestId } = ctx.params;

  const requestDetails = getRequestDetails(requestId);

  if (requestDetails.request instanceof Buffer) {
    requestDetails.request = requestDetails.response.toString('base64url');
  }

  if (requestDetails.response instanceof Buffer) {
    requestDetails.response = requestDetails.response.toString('base64url');
  }

  ctx.body = requestDetails;
});
