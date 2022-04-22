import Koa from "koa";
const request = require("supertest");
const {
  promises: { readFile },
} = require("fs");
import { mockProxy } from "../src/mockProxy";
import { createTestServer } from "./testserver";
import { startApplication } from "./utils/startApplication";

const createProxyServer = async () => {
  const { address: targetServer, stop: stopTestServer } =
    await createTestServer();

  const app = new Koa();

  app.use(
    mockProxy({
      mode: "proxy",
      targetUrl: targetServer,
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

let proxy: Awaited<ReturnType<typeof createProxyServer>> | null = null;

beforeAll(async () => {
  proxy = await createProxyServer();
});

afterAll(async () => {
  await proxy.stop();
});

it("Should proxy normal JSON responses", async () => {
  await request(proxy.server)
    .get("/")
    .expect(200, {
      testArr: [2, "3"],
    });
});

it("Should proxy images", async () => {
  const image = await readFile(`${__dirname}/testServer/testImg.gif`);

  await request(proxy.server).get("/image").expect(200, image);
});

it("Should proxy errors", async () => {
  await request(proxy.server).get("/500").expect(500, "Serious error");
});
