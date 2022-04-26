import { startTestMockServer } from "./utils/startTestMockServer";
import { getJsonMock } from "./testserver";
const request = require("supertest");

let proxy: Awaited<ReturnType<typeof startTestMockServer>> | null = null;

describe("Tests in replay or proxy mode", () => {
  beforeAll(async () => {
    proxy = await startTestMockServer({
      mode: "replayOrProxy",
      mocksDirectory: __dirname + "/fixtures/",
    });
  });

  afterAll(async () => {
    await proxy.stop();
  });

  it("Should take responses from mocks if exists", async () => {
    await request(proxy.server).get("/").expect(200, getJsonMock());
  });

  it("Should proxy responses if mock not exists", async () => {
    await request(proxy.server)
      .get("/notMockedResponse")
      .expect(200, getJsonMock());
  });
});
