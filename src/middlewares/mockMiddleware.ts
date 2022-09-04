import { MockProxyOptions } from "../types";
import { writeMock } from "../utils/mocks/writeMock";
import { replyWithMock } from "../utils/mocks/replyWithMock";

export const mockMiddleware =
  (options: MockProxyOptions) => async (ctx, next) => {
    if (["record", "replayOrRecord"].includes(options.mode)) {
      // Подписываюсь на наше событие окончания получения данных и записываю их
      ctx.res.on("data", (content) => writeMock(ctx, options, content));

      if (options.mode === "record") {
        return next();
      }
    }

    return replyWithMock(options)(ctx, next);
  };
