import { Context, Next } from "koa";
import compose from "koa-compose";
import { MockProxyUserOptions } from "../types";
import { getCombinedOptions } from "../utils/getCombinedOptions";
import { proxyMiddleware } from "./proxyMiddleware";
import { mockMiddleware } from "./mockMiddleware";
import {logMiddleware} from "./logMiddleware";

export const mockProxyMiddleware = (options: MockProxyUserOptions = {}) => {
  return compose([
    logMiddleware(),
    async (ctx: Context, next: Next) => {
      const combinedOptions = getCombinedOptions(ctx, options);

      const needMocks = ["record", "replay", "replayOrProxy"].includes(
        combinedOptions.mode
      );

      if (needMocks) {
        if (!combinedOptions.mocksDirectory) {
          throw new Error("Record directory is required!");
        }

        await mockMiddleware(combinedOptions)(ctx, next);
      }

      const needProxy = ["record", "replayOrProxy", "proxy"].includes(
        combinedOptions.mode
      );

      if (needProxy) {
        if (combinedOptions.mode === 'replayOrProxy' && ctx.response.headerSent) {
          return;
        }

        await proxyMiddleware(combinedOptions)(ctx, next);
      }
    }
  ]);
};
