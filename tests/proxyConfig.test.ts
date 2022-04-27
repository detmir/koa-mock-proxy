import { createTestServer, getJsonMock } from "./testserver";
import Koa from "koa";
import { mockProxy } from "../src/mockProxy";
import { mockProxyConfig } from "../src/mockProxyConfig";
import { startApplication } from "./utils/startApplication";
import Router from "@koa/router";
import { Server } from "net";
import request from "supertest";
import { getFixturesDirectory } from "./utils/getFixturesDirectory";

let server: Server;
let stop: () => Promise<unknown>;

describe("Global proxy config tests", () => {
  beforeAll(async () => {
    const { address: targetServer, stop: stopTestServer } =
      await createTestServer();

    const app = new Koa();

    app.use(
      mockProxyConfig({
        targetUrl: targetServer,
        mode: "proxy",
      })
    );

    const testRouter = new Router();
    testRouter.get("/notMockedResponse", mockProxy());
    testRouter.get(
      "(.*)",
      mockProxy({
        targetUrl: "fakeUrl",
        mocksDirectory: getFixturesDirectory(),
        mode: "replay",
      })
    );

    app.use(testRouter.middleware());

    const { server: applicationServer, stop: stopApplication } =
      await startApplication(app);

    server = applicationServer;
    stop = () => Promise.allSettled([stopTestServer, stopApplication]);
  });

  afterAll(() => stop());

  it("Should proxy with global configuration", async () => {
    await request(server).get("/notMockedResponse").expect(200, getJsonMock());
  });

  it("Config can overwrite mode", async () => {
    await request(server).get("/").expect(200);
  });
});
