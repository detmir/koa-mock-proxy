import { Context } from "koa";

export const log = (type: "info" | "debug", message: string, ctx?: Context) => {
  if (process.env.DEBUG_PROXY && process.env.DEBUG_PROXY !== "false") {
    console.log(message);
  }

  if (ctx) {
    if (!ctx.state.logMessages) {
      ctx.state.logMessages = [];
    }

    ctx.state.logMessages.push(message);
  }
};
