import { getErrorBodyText, getJsonMock } from "./testserver";

const request = require("supertest");
const {
  promises: { readFile },
} = require("fs");
import { createTestMockServer } from "./utils/createTestMockServer";

let proxy: Awaited<ReturnType<typeof createTestMockServer>> | null = null;

beforeAll(async () => {
  proxy = await createTestMockServer({
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
