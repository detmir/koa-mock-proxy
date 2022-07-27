import Router from "@koa/router";
import {apiRouter} from "./api";
import {log} from "../utils/log";
import fs from "fs";

interface ControlMiddlewareOptions {
  path?: string
}

const defaultOptions = {
  path: '/mockproxy'
}

export const controlMiddleware = (options: ControlMiddlewareOptions = {}) => {
  const combinedOptions = { ...options, ...defaultOptions };

  const router = new Router().prefix(combinedOptions.path);

  log('debug', `Registered control middleware for path ${combinedOptions.path}`);

  router.get('/', async ctx => {
    ctx.body = await fs.promises.readFile(`${__dirname}/../static/index.html`, {
      encoding: 'utf-8',
    });
  });

  router.use(apiRouter.routes());

  router.use(ctx => {
    ctx.status = 404;
    ctx.body = 'Koa mock proxy route not found!';
  })

  return router.routes();
}
