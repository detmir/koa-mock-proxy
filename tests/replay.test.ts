import request from "supertest";
import Koa from "koa";
import { readFile } from "fs/promises";
import { getErrorBodyText, getJsonMock, getPlainTextMock } from "./testserver";
import { mockProxyMiddleware, setActiveScenarios } from "../src";
import { startApplication } from "./utils/startApplication";

let proxy: Awaited<ReturnType<typeof startApplication>> | null = null;

describe("Tests in replay mode", () => {
  beforeAll(async () => {
    const app = new Koa();

    app.use(
      mockProxyMiddleware({
        mode: "replay",
        mocksDirectory: __dirname + "/fixtures/",
      })
    );
    proxy = await startApplication(app);
  });

  afterAll(async () => {
    await proxy.stop();
  });

  it("Should replay JSON correctly", async () => {
    await request(proxy.server).get("/").expect(200, getJsonMock());
  });

  it("Should replay JS files correctly", async () => {
    await request(proxy.server)
      .get("/jsFile?a=b")
      .expect(200, {
        query: {
          a: "b",
        },
      });
  });

  it("Should replay request with parameters if no requests in mock", async () => {
    await request(proxy.server).get("/?a=b").expect(200, getJsonMock());
  });

  it("Should replay request with parameters", async () => {
    await request(proxy.server).get("/params?a=b").expect(200, getJsonMock());
  });

  it("Should find the most specific mock with multiple query params", async () => {
    await request(proxy.server)
      .get("/params?a=b&c=d")
      .expect(200, { content: "a=b,c=d" });
  });

  it("Should find the most specific mock with multiple query params", async () => {
    await request(proxy.server)
      .get("/params?a=b&c=d")
      .expect(200, { content: "a=b,c=d" });
  });

  it("Should find the most specific mock with multiple query params and query", async () => {
    await setActiveScenarios("test");
    await request(proxy.server)
      .get("/params?a=b&c=d")
      .expect(200, { content: "test" });
    await setActiveScenarios([]);
  });

  it("Should not replay request with wrong parameters", async () => {
    await request(proxy.server).get("/params?b=c").expect(404);
    await request(proxy.server).get("/params?a=c").expect(404);
  });

  it("Should replay correctly", async () => {
    const image = await readFile(`${__dirname}/testServer/testImg.gif`);

    await request(proxy.server).get("/image").expect(200, image);
  });

  it("Should replay deeply nested routes correctly", async () => {
    await request(proxy.server)
      .get("/deep/level/nested/")
      .expect(200, getPlainTextMock());
  });

  it("Should replay errors correctly", async () => {
    await request(proxy.server).get("/500").expect(500, getErrorBodyText());
  });

  it("If not found should 404", async () => {
    await request(proxy.server)
      .get("/notExistingRoute")
      .expect(404, "Not Found");
  });
});
