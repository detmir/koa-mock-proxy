import {
  getActiveScenarios,
  getAvailableScenarios,
  setActiveScenarios,
} from "../../utils/scenarioStorage";
import { jsonParser } from "../../middlewares/jsonParser";
import Router from "@koa/router";

export const scenariosRouter = new Router().prefix("/scenarios");

scenariosRouter.get("/", (ctx) => {
  const activeScenarios = getActiveScenarios();

  ctx.body = {
    scenarios: getAvailableScenarios().map((scenario) => ({
      id: scenario,
      active: activeScenarios.includes(scenario),
    })),
  };
});

scenariosRouter.put("/", jsonParser(), async (ctx) => {
  const nextScenarios = ctx.request.body as string[];

  if (!Array.isArray(nextScenarios)) {
    ctx.status = 400;
    return;
  }

  await setActiveScenarios(nextScenarios);

  ctx.body = { scenarios: getActiveScenarios() };
});
