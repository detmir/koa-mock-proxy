import { MockProxyOptions } from "../types";
import { Context } from "koa";

// заменяет имена файлов моков на безопасные
// todo: is it really safe?
const encodeFilename = (filename) => filename.replace(/[:"<>?|\\.]/g, "_");

const ROOT_FILENAME = "__root__";

export class FileLocator {
  private readonly options: MockProxyOptions;
  private readonly ctx: Context;

  constructor(options: MockProxyOptions, ctx: Context) {
    this.options = options;
    this.ctx = ctx;
  }

  getMockFilename = () => {
    const urlPath = this.ctx.path.split("/").filter(Boolean);
    const requestMethod = this.ctx.method;

    const file = {
      basename: `${requestMethod}_${encodeFilename(
        urlPath[urlPath.length - 1] ?? ROOT_FILENAME
      )}`,
      extension: "json",
      postfix:
        this.options.recordOptions.getFilenamePostfix?.(this.ctx) ?? null,
    };

    return `${file.basename}${file.postfix ? `_${file.postfix}` : ""}.${
      file.extension
    }`;
  };

  public getMockDirectory() {
    const urlPath = this.ctx.path.split(/\/+/).slice(0, -1);

    const directoryPath = urlPath
      .map(encodeFilename)
      .join("/");

    if (typeof this.options.mocksDirectory === 'function') {
      return this.options.mocksDirectory(directoryPath);
    }

    return `${this.options.mocksDirectory}${directoryPath}`;
  }

  public getMockPath() {
    return [this.getMockDirectory(), this.getMockFilename()].join("/");
  }
}
