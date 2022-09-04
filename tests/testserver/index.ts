import Application, { Context } from "koa";
import bodyParser from "koa-bodyparser";

import KoaRouter from "@koa/router";
import { createReadStream } from "fs";
import { startApplication } from "../utils/startApplication";

export const getJsonMock = () => ({
  testArr: [2, "3"],
});

export const getPlainTextMock = () => "plain text";

export const getErrorBodyText = () => "Serious error";

const router = new KoaRouter();

router.get("/", (ctx: Context) => {
  ctx.body = getJsonMock();
});

router.get("/notMockedResponse", (ctx: Context) => {
  ctx.body = getJsonMock();
});

router.get("/plainText", (ctx: Context) => {
  ctx.type = "text/plain; charset=utf-8";
  ctx.body = getPlainTextMock();
});

router.get("/image", (ctx: Context) => {
  ctx.type = "image/gif";
  const stream = createReadStream(`${__dirname}/testImg.gif`);
  ctx.body = stream;
});

router.get("/deep/level/nested/", (ctx: Context) => {
  ctx.type = "text/plain; charset=utf-8";
  ctx.body = getPlainTextMock();
});

router.get("/500", (ctx: Context) => {
  ctx.status = 500;
  ctx.body = getErrorBodyText();
});

let dynamicResponse = "defaultValue";

router.get("/dynamicResponse", (ctx: Context) => {
  ctx.type = "text/plain; charset=utf-8";
  ctx.body = dynamicResponse;
});

router.put("/dynamicResponse", bodyParser(), (ctx: Context) => {
  // @ts-ignore
  dynamicResponse = ctx.request.body;
  ctx.type = "text/plain; charset=utf-8";
  ctx.body = dynamicResponse;
});

router.get("/customHeaders", (ctx: Context) => {
  ctx.response.set("x-custom-header", "1111");
  ctx.response.set("x-custom-header2", "2222");
  ctx.body = null;
});

export const createTestServer = () => {
  const app = new Application();

  app.use(router.middleware());

  return startApplication(app);
};
