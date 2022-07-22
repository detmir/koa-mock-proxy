import {
  createProxyMiddleware,
  responseInterceptor,
} from "http-proxy-middleware";
import { MockProxyOptions } from "../types";
import { Context, Next } from "koa";
import {log} from "../utils/log";

export const proxyMiddleware =
  (options: MockProxyOptions) => (ctx: Context, next: Next) => {
    const proxyMiddleware = createProxyMiddleware({
      target: options.targetUrl,
      pathRewrite: options.pathRewrite,
      changeOrigin: true,
      logLevel: "warn",

      /*
      Включаю режим перехвата ответа прокси, что б извлечь, декомпрессировать, если сжато и передать в боди
      https://github.com/chimurai/http-proxy-middleware/blob/master/src/handlers/response-interceptor.ts#L18
      */
      selfHandleResponse: true,
      onProxyRes: responseInterceptor(async (responseBuffer) => {
        log('info', `[Proxy] ${ctx.url}`);

        let buffer = responseBuffer;

        if (options.convertProxyResponse) {
          buffer = options.convertProxyResponse(responseBuffer, ctx);
        }

        // генерирую событие данных, на которое может быть подписан наш автомок
        ctx.res.emit("data", buffer);

        return buffer;
      }),
    });

    return new Promise((resolve, reject) => {
      // @ts-ignore
      proxyMiddleware(ctx.req, ctx.res, (err) => {
        if (err) {
          // @ts-ignore
          reject(next(err));
          return;
        }
        resolve(next());
      });
      /*
      Говорю, что все ок, после того, как появилось событие finish
      */
      ctx.res.on("finish", () => {
        // @ts-ignore
        resolve();
      });
    });
  };
