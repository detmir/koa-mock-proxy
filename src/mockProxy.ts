import {Context} from "koa";

export const mockProxy = (options: any) => {
  return (ctx: Context, next) => {
    ctx.body = 200;
    // todo
  };
};