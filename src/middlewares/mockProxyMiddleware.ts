import { Context, Next } from "koa";
import compose from "koa-compose";
import { MockProxyUserOptions } from "../types";
import { getCombinedOptions } from "../utils/getCombinedOptions";
import { proxyMiddleware } from "./proxyMiddleware";
import { mockMiddleware } from "./mockMiddleware";
import { logMiddleware } from "./logMiddleware";
import { log } from "../utils/log";

export const mockProxyMiddleware = (options: MockProxyUserOptions = {}) => {
  return compose([
    logMiddleware(options),
    async (ctx: Context, next: Next) => {
      const combinedOptions = getCombinedOptions(ctx, options);

      ctx.state.mockProxyMode = combinedOptions.mode;
      log("debug", `Request mode: ${combinedOptions.mode}`, ctx);

      const needMocks = [
        "record",
        "replayOrRecord",
        "replay",
        "replayOrProxy",
      ].includes(combinedOptions.mode);

      if (needMocks) {
        if (!combinedOptions.mocksDirectory) {
          throw new Error("Record directory is required!");
        }

        await mockMiddleware(combinedOptions)(ctx, next);
      }

      const isAlwaysProxyMode = ["record", "proxy"].includes(
        combinedOptions.mode
      );
      const isProxyWhenNoMocksMode = [
        "replayOrProxy",
        "replayOrRecord",
      ].includes(combinedOptions.mode);

      const needProxy =
        isAlwaysProxyMode ||
        (isProxyWhenNoMocksMode && ctx.state.responseSource !== "mock");

      if (needProxy) {
        await proxyMiddleware(combinedOptions)(ctx, next);
      }
    },
  ]);
};
