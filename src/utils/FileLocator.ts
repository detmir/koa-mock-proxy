import { MockProxyOptions } from "../types";
import { Context } from "koa";
import { getActiveScenarios } from "./scenarioStorage";


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

  getMockCommonPart = () => {
    const urlPath = this.ctx.path.split("/").filter(Boolean);
    const requestMethod = this.ctx.method;

    const file = {
      basename: `${requestMethod}_${encodeFilename(
        urlPath[urlPath.length - 1] ?? ROOT_FILENAME
      )}`,
      postfix:
        this.options.recordOptions.getFilenamePostfix?.(this.ctx) ?? null,
    };

    return `${file.basename}${file.postfix ? `_${file.postfix}` : ""}`;
  }

  getMockFilename = () => {
    return `${this.getMockCommonPart()}.json`;
  };

  public isFileMatched = (filename: string) => {
    const fileParts = filename.split('.');
    const allowedExtensions = ['json', 'js'];

    const commonFilenamePart = this.getMockCommonPart();

    if (fileParts.length < 2) {
      return false;
    }

    if (fileParts[0] !== commonFilenamePart) {
      return false;
    }

    if (!allowedExtensions.includes(fileParts[fileParts.length - 1])) {
      return false;
    }

    const scenariosOrQueryParams = fileParts.slice(1, -1);

    return scenariosOrQueryParams.every(scenarioOrQueryParam => {
      if (scenarioOrQueryParam.includes('=')) {
        const [paramName, paramsValue] = scenarioOrQueryParam.split('=');

        return Object.prototype.hasOwnProperty.call(this.ctx.query, paramName) && this.ctx.query[paramName] === paramsValue;
      }

      return getActiveScenarios().includes(scenarioOrQueryParam);
    })
  }

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
