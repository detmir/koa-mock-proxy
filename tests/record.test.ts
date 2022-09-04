/**
 * @jest-environment node
 */
import fs from "fs";
import request from "supertest";
import { getErrorBodyText, getJsonMock } from "./testserver";
import { startTestMockServer } from "./utils/startTestMockServer";
import {
  compareRecordedMockWithSnapshot,
  recordDirectory,
} from "./utils/compareRecordedMockWithSnapshot";

const {
  promises: { readFile, rm },
  existsSync,
} = fs;

let proxy: Awaited<ReturnType<typeof startTestMockServer>> | null = null;

describe("Tests in record mode", () => {
  beforeAll(async () => {
    // cleanup before running tests
    if (existsSync(recordDirectory)) {
      await rm(recordDirectory, { recursive: true });
    }

    proxy = await startTestMockServer({
      mode: "record",
      mocksDirectory: recordDirectory,
    });
  });

  afterAll(async () => {
    jest.useRealTimers();
    await proxy.stop();
  });

  it("Should record JSON correctly", async () => {
    await request(proxy.server).get("/").expect(200, getJsonMock());

    await compareRecordedMockWithSnapshot("GET___root__.json");
  });

  it("Should record plain text correctly", async () => {
    const image = await readFile(`${__dirname}/testserver/testImg.gif`);

    await request(proxy.server).get("/image").expect(200, image);

    await compareRecordedMockWithSnapshot("GET_image.json");
  });

  it("Should record errors correctly", async () => {
    await request(proxy.server).get("/500").expect(500, getErrorBodyText());

    await compareRecordedMockWithSnapshot("GET_500.json");
  });

  it("Should record deeply nested routes correctly", async () => {
    await request(proxy.server).get("/deep/level/nested/").expect(200);
    // todo: wait for fs to write file. how to deal?
    await new Promise((resolve) => setTimeout(resolve, 100));
    // todo: how to distinct /nested/ and /nested?

    await compareRecordedMockWithSnapshot("deep/level/nested/GET_nested.json");
  });

  describe("Check overwriting files", () => {
    it("Should not overwrite files by default", async () => {
      await request(proxy.server)
        .get("/dynamicResponse")
        .expect(200, "defaultValue");
      await request(proxy.server)
        .put("/dynamicResponse")
        .send("overwrittenValue")
        .expect(200);

      const realContent = JSON.parse(
        await readFile(`${recordDirectory}GET_dynamicResponse.json`, "utf-8")
      );

      expect(realContent.body).toBe("defaultValue");
    });
  });
});

describe("Tests for filter headers", () => {
  beforeAll(async () => {
    // cleanup before running tests
    if (existsSync(recordDirectory)) {
      await rm(recordDirectory, { recursive: true });
    }

    proxy = await startTestMockServer({
      mode: "record",
      mocksDirectory: recordDirectory,
      recordOptions: {
        filterHeaders: (headers) => {
          const nextHeaders = {};

          Object.entries(headers).forEach(([key, value]) => {
            if (key === "x-custom-header") {
              nextHeaders[key] = value;
            }
          });

          return nextHeaders;
        },
      },
    });
  });

  afterAll(async () => {
    jest.useRealTimers();
    await proxy.stop();
  });

  it("Should record only filtered headers", async () => {
    await request(proxy.server).get("/customHeaders").expect(204);

    await compareRecordedMockWithSnapshot("GET_customHeaders.json");
  });
});
