import { Middleware } from "koa";
import compose from "koa-compose";
import {
  addAvailableScenario,
  getActiveScenarios,
} from "../utils/scenarioStorage";

type ScenarioName = string;
type ScenariosMap = Record<ScenarioName, Middleware>;

/**
 * Apply middleware only when given scenario is active
 * @param scenariosMap
 */
export const scenariosMiddleware = (scenariosMap: ScenariosMap) => {
  Object.keys(scenariosMap).forEach((scenarioName) =>
    addAvailableScenario(scenarioName)
  );

  return async (ctx, next) => {
    const activeMiddlewares = getActiveScenarios()
      .map((scenarioName) =>
        scenariosMap.hasOwnProperty(scenarioName)
          ? scenariosMap[scenarioName]
          : null
      )
      .filter(Boolean);

    const composedMiddleware = compose(activeMiddlewares);

    return composedMiddleware(ctx, next);
  };
};
