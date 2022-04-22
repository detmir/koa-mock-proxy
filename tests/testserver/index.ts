import Application  from "koa";
import {Context} from 'koa';

import KoaRouter from "@koa/router";
import { createReadStream } from 'fs';
import {startApplication} from "../utils/startApplication";

const router = new KoaRouter();

router.get('/', (ctx: Context) => {
  ctx.body = {
    testArr: [2, '3'],
  };
});

router.get('/plainText', (ctx: Context) => {
  ctx.type = 'text/plain; charset=utf-8';
  ctx.body = 'plain text';
});

router.get('/image', (ctx: Context) => {
  ctx.type = 'image/gif';
  const stream = createReadStream(`${__dirname}/testImg.gif`);
  ctx.body = stream;
});

router.get('/500', (ctx: Context) => {
  ctx.status = 500;
  ctx.body = 'not found';
});

export const createTestServer = () => {
  const app = new Application();

  app.use(router.middleware());

  return startApplication(app);
}