import request from "supertest";
import Koa from "koa";
import { readFile } from "fs/promises";
import { getErrorBodyText, getJsonMock, getPlainTextMock } from "./testserver";
import {
  controlMiddleware,
  mockProxyMiddleware,
  setActiveScenarios,
} from "../src";
import { startApplication } from "./utils/startApplication";

let proxy: Awaited<ReturnType<typeof startApplication>> | null = null;

describe("Tests in replay mode", () => {
  beforeAll(async () => {
    const app = new Koa();

    app.use(controlMiddleware());
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

  it("JS file with exception should have 400 error", async () => {
    await request(proxy.server)
      .get("/jsFileCatch")
      .expect(400, { message: "Test error" });
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
    const image = await readFile(`${__dirname}/testserver/testImg.gif`);

    await request(proxy.server).get("/image").expect(200, image);
  });

  it("Should replay deeply nested routes correctly", async () => {
    await request(proxy.server)
      .get("/deep/level/nested/")
      .expect(200, getPlainTextMock());
  });

  it("Should replay from index file", async () => {
    await request(proxy.server)
      .get("/indexfile/indexcontent")
      .expect(200, "indexcontent");
  });

  it("Should go through index file if next is called", async () => {
    await request(proxy.server).get("/indexfile/next").expect(200, "next");
  });

  it("Should replay errors correctly", async () => {
    await request(proxy.server).get("/500").expect(500, getErrorBodyText());
  });

  it("If not found should 404", async () => {
    await request(proxy.server)
      .get("/notExistingRoute")
      .expect(404, "Not Found");
  });

  it("If JS file calls next(), go to the next mock", async () => {
    await request(proxy.server).get("/next/next").expect(200, "next");
  });

  it("If JS file don't call next(), don't go to the next mock", async () => {
    await request(proxy.server)
      .get("/next/next?noNext=1")
      .expect(200, "noNext");
  });

  it("JS file can modify response after next", async () => {
    await request(proxy.server)
      .get("/next/next?after=1")
      .expect(200, "afterNext");
  });

  it("Should delete logs", async () => {
    await request(proxy.server).get("/").expect(200, getJsonMock());

    const notEmptyLogsResponse = await request(proxy.server).get(
      "/mockproxy/api/logs"
    );
    expect(notEmptyLogsResponse.body.logs.length).toBeGreaterThan(0);

    // delete logs
    await request(proxy.server).delete("/mockproxy/api/logs");

    const emptyLogsResponse = await request(proxy.server).get(
      "/mockproxy/api/logs"
    );

    expect(emptyLogsResponse.body.logs.length).toBe(0);
  });
});
