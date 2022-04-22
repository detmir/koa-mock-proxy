import Koa from "koa";
const request = require("supertest");
import { mockProxy } from "../src/mockProxy";
import { createTestServer } from "./testserver";
import { startApplication } from "./utils/startApplication";

const createProxyServer = async () => {
  const { address: targetServer, stop: stopTestServer } =
    await createTestServer();

  const app = new Koa();

  app.use(
    mockProxy({
      proxyUrl: targetServer,
    })
  );

  const {
    server,
    address,
    stop: stopProxyServer,
  } = await startApplication(app);

  return {
    server,
    address,
    stop: async () => {
      await Promise.all([stopProxyServer(), stopTestServer()]);
    },
  };
};

it("Should proxy normal JSON responses", async () => {
  const { server, stop } = await createProxyServer();

  await request(server)
    .get("/")
    .expect(200, {
      testArr: [2, "3"],
    });

  await stop();
});
