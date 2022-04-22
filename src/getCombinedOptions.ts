import { MockProxyOptions, MockProxyUserOptions } from "./types";
import { Context } from "koa";

export const getCombinedOptions = (
  ctx: Context,
  middlewareOptions: MockProxyUserOptions
): MockProxyOptions => {
  // todo: extract options from context and env variables

  if (!middlewareOptions.targetUrl) {
    throw new Error("Target url is required!");
  }

  return {
    mode: middlewareOptions.mode || "record",
    targetUrl: middlewareOptions.targetUrl || "",
  };
};
