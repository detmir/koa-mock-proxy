import Router from "@koa/router";
import {apiRouter} from "./api";
import {log} from "../utils/log";
import path from "path";
import serve from 'koa-static';
import mount from 'koa-mount';

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

  router.use(apiRouter.routes());

  router.use(
    mount(combinedOptions.path, serve(path.resolve('src/client/dist/'), {
        maxage: 0,
        defer: false
      })
    ),
  );

  router.use(ctx => {
    ctx.status = 404;
    ctx.body = 'Koa mock proxy route not found!';
  });

  return router.routes();
}
