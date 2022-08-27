/**
 * @jest-environment node
 */
import fs from "fs";
import request from "supertest";
import { getJsonMock } from "./testserver";
import { startTestMockServer } from "./utils/startTestMockServer";
import { controlMiddleware } from "../src";

const {
  promises: { readFile, rm },
  existsSync,
} = fs;

let proxy: Awaited<ReturnType<typeof startTestMockServer>> | null = null;

const fixturesDirectory = __dirname + "/fixtures/";
const recordDirectory = __dirname + "/../node_modules/mock_proxy_cache/";

const compareRecordedMockWithSnapshot = async (filename) => {
  const expectedContent = JSON.parse(
    await readFile(`${fixturesDirectory}${filename}`, "utf-8")
  );

  const realContent = JSON.parse(
    await readFile(`${recordDirectory}${filename}`, "utf-8")
  );

  expect(realContent).toMatchObject(expectedContent);
};

describe("Tests in record mode", () => {
  beforeAll(async () => {
    // cleanup before running tests
    if (existsSync(recordDirectory)) {
      await rm(recordDirectory, { recursive: true });
    }

    proxy = await startTestMockServer({
      mode: "proxy",
      mocksDirectory: recordDirectory,
    });

    proxy.app.use(controlMiddleware());
  });

  afterAll(async () => {
    jest.useRealTimers();
    await proxy.stop();
  });

  it("Should record response from log", async () => {
    // request to a mock server
    await request(proxy.server).get("/").expect(200, getJsonMock());

    // get logs
    const response = await request(proxy.server).get("/mockproxy/api/logs");

    // record first log
    await request(proxy.server)
      .post("/mockproxy/api/mocks")
      .send({
        logIds: [response.body.logs[0].id],
      });

    await compareRecordedMockWithSnapshot("GET___root__.json");
  });
});
