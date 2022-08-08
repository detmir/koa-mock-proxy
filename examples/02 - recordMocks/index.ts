import Koa from "koa";
import { controlMiddleware, mockProxyMiddleware } from "../../src";

const server = new Koa();

// this middleware will enable UI at the path /mockproxy/
server.use(controlMiddleware());

server.use(
  mockProxyMiddleware({
    targetUrl: "https://github.com/",
    mocksDirectory: "./mocks",
    mode: "record",
    recordOptions: {
      overwrite: true,
    },
  })
);

server.listen(9001);
