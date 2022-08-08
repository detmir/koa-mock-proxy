import Koa from "koa";
import {
  addAvailableScenarios,
  controlMiddleware,
  mockProxyMiddleware,
} from "../../src";

const server = new Koa();

// this middleware enables UI at the path /mockproxy/
server.use(controlMiddleware());

server.use(
  mockProxyMiddleware({
    mocksDirectory: "./mocks",
    mode: "replay",
  })
);

// Adding available scenarios is necessary for use them
addAvailableScenarios(["redirect", "error"]);

server.listen(9003);
