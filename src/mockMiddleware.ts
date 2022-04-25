import fs from "fs";

import { MockProxyOptions } from "./types";
import { Context } from "koa";

// заменяет имена файлов моков на безопасные
// todo: is it really safe?
const encodeFilename = (filename) => filename.replace(/[:"<>?|\\]/g, "_");

const getMockDirectory = (ctx, options: MockProxyOptions) => {
  const urlPath = ctx.path.split(/\/+/).slice(0, -1);

  return `${options.recordDirectory}${urlPath.map(encodeFilename).join("/")}`;
};

const getMockFilename = (ctx, getFilename = (filename) => filename) => {
  const urlPath = ctx.path.split("/").filter(Boolean);
  const requestMethod = ctx.method;

  const filename = getFilename({
    basename: `${requestMethod}_${encodeFilename(
      urlPath[urlPath.length - 1] ?? "__root__"
    )}`,
    extension: "json",
    ctx,
  });

  return `${filename.basename}.${filename.extension}`;
};

const readMock = async (ctx, options: MockProxyOptions) => {
  let fileContents;

  try {
    const filePath = `${getMockDirectory(ctx, options)}/${getMockFilename(
      ctx,
      options.getMockFilename
    )}`;

    const file = await fs.promises.readFile(filePath, {
      encoding: "utf-8",
    });
    fileContents = JSON.parse(file);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("Error while reading mock", e);

    ctx.status = 404;
    ctx.body = "Mock not found!";
    return;
  }

  ctx.status = fileContents.code;

  Object.entries(fileContents.headers).forEach(([headerName, headerValue]) => {
    ctx.set(headerName, headerValue);
  });

  ctx.body = fileContents.body;
};

const encodeBody = (ctx: Context, body: unknown) => {
  // todo: deal with binary data
  // console.log(body);

  if (ctx.response.get("content-type")?.startsWith("application/json")) {
    return JSON.parse(body as string);
  }

  return body;
};

const writeMock = async (
  ctx: Context,
  options: MockProxyOptions,
  content: unknown
) => {
  const fileContents = {
    code: ctx.status,
    // записываем просто для информации, чтобы мы могли ориентироваться с какого запроса пришел был записан мок
    requestUrl: ctx.url,
    headers: ctx.response.headers,
    body: encodeBody(ctx, content),
  };

  const directory = getMockDirectory(ctx, options);

  try {
    await fs.promises.mkdir(directory, { recursive: true });
  } catch (e) {
    console.error(e);
  }

  await fs.promises.writeFile(
    `${directory}/${getMockFilename(ctx, options.getMockFilename)}`,
    JSON.stringify(fileContents, null, 4)
  );
};

export const mockMiddleware =
  (options: MockProxyOptions) => async (ctx, next) => {
    if (options.mode === "record") {
      // Подписываюсь на наше событие окончания получения данных и записываю их
      ctx.res.on("data", (content) => writeMock(ctx, options, content));
      return next();
    }

    return readMock(ctx, options);
  };
