import Application from "koa";
import { Context } from "koa";

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

export const createTestServer = () => {
  const app = new Application();

  app.use(router.middleware());

  return startApplication(app);
};
