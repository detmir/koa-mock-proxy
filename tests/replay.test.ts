const request = require("supertest");
import { getErrorBodyText, getJsonMock, getPlainTextMock } from "./testserver";
import Koa from "koa";
import { mockProxy } from "../src/mockProxy";
import { startApplication } from "./utils/startApplication";
import { readFile } from "fs/promises";

let proxy: Awaited<ReturnType<typeof startApplication>> | null = null;

describe("Tests in replay mode", () => {
  beforeAll(async () => {
    const app = new Koa();

    app.use(
      mockProxy({
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
