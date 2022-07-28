import Router from "@koa/router";
import {jsonParser} from "../middlewares/jsonParser";
import {getActiveScenarios, getAvailableScenarios, setActiveScenarios} from "../utils/scenarioStorage";
import {getLogs} from "../middlewares/logMiddleware";

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
  ctx.body = {
    logs: getLogs(),
  };
});
