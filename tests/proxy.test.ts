import { getErrorBodyText, getJsonMock } from "./testserver";

import request from "supertest";
import { startTestMockServer } from "./utils/startTestMockServer";

import fs from "fs";

const {
  promises: { readFile },
} = fs;

let proxy: Awaited<ReturnType<typeof startTestMockServer>> | null = null;

describe("Tests in proxy mode", () => {
  beforeAll(async () => {
    proxy = await startTestMockServer({
      mode: "proxy",
    });
  });

  afterAll(async () => {
    await proxy.stop();
  });

  it("Should proxy normal JSON responses", async () => {
    await request(proxy.server).get("/").expect(200, getJsonMock());
  });

  it("Should proxy images", async () => {
    const image = await readFile(`${__dirname}/testServer/testImg.gif`);

    await request(proxy.server).get("/image").expect(200, image);
  });

  it("Should proxy errors", async () => {
    await request(proxy.server).get("/500").expect(500, getErrorBodyText());
  });
});
