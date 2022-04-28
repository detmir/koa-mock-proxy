import { Context } from "koa";
import { MockProxyUserOptions } from "../types";

export const mockProxyConfigMiddleware = (options: MockProxyUserOptions) => {
  return async (ctx: Context, next) => {
    if (!ctx.mockProxyConfig) {
      ctx.mockProxyConfig = options;
    } else {
      ctx.mockProxyConfig = {
        ...mockProxyConfigMiddleware,
        ...options,
      };
    }

    return next();
  };
};
