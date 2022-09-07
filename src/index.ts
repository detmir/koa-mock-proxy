import { mockProxyMiddleware } from "./middlewares/mockProxyMiddleware";

const majorVersion = Number(process.version.match(/^v(\d+)/)[1]);

if (majorVersion < 16) {
  throw new Error("Unsupported node version! Node version must be >=16");
}

export { mockProxyConfigMiddleware } from "./middlewares/mockProxyConfigMiddleware";
export { scenariosMiddleware } from "./middlewares/scenariosMiddleware";

export { controlMiddleware } from "./routes";

export { MockProxyUserOptions } from "./types";

export { addAvailableScenarios } from "./utils/scenarioStorage";
export { setActiveScenarios } from "./utils/scenarioStorage";
export { getScenariosData } from "./utils/scenarioStorage";
export { setScenariosData } from "./utils/scenarioStorage";

export { mockProxyMiddleware };
export default mockProxyMiddleware;
