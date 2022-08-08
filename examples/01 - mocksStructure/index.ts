import Koa from "koa";
import { controlMiddleware, mockProxyMiddleware } from "../../src";

const server = new Koa();

// this middleware will enable UI at the path /mockproxy/
server.use(controlMiddleware());

server.use(
  mockProxyMiddleware({
    mocksDirectory: "./mocks",
    mode: "replay",
  })
);

server.listen(9002);
