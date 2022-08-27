import { MockProxyOptions } from "../types";
import { Context } from "koa";
import { getActiveScenarios } from "./scenarioStorage";

// заменяет имена файлов моков на безопасные
// todo: is it really safe?
const encodeFilename = (filename) => filename.replace(/[:"<>?|\\.]/g, "_");

const ROOT_FILENAME = "__root__";

interface MockFileRequest {
  path: string;
  method: string;
  query: NodeJS.Dict<string | string[]>;
}

/**
 * Get mock path/filename from request data and options
 */
export class MockFileLocator {
  private readonly options: MockProxyOptions;
  private readonly request: MockFileRequest;

  constructor(options: MockProxyOptions, ctx: MockFileRequest) {
    this.options = options;
    this.request = ctx;
  }

  /**
   * Returns filename without extension, query parameters and scenarios (first path of filename before "." (dot sign))
   */
  private getMockCommonPart = () => {
    const urlPath = this.request.path.split("/").filter(Boolean);
    const requestMethod = this.request.method;

    const file = {
      basename: `${requestMethod}_${encodeFilename(
        urlPath[urlPath.length - 1] ?? ROOT_FILENAME
      )}`,
      postfix:
        this.options.recordOptions.getFilenamePostfix?.(
          this.request as Context
        ) ?? null,
    };

    return `${file.basename}${file.postfix ? `_${file.postfix}` : ""}`;
  };

  getMockFilename = () => {
    return `${this.getMockCommonPart()}.json`;
  };

  /**
   * Check is file can be associated with the request
   * @param filename Filename (without path)
   */
  public isFileMatched = (filename: string) => {
    const fileParts = filename.split(".");
    const allowedExtensions = ["json", "js"];

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

    return scenariosOrQueryParams.every((scenarioOrQueryParam) => {
      if (scenarioOrQueryParam.includes("=")) {
        const [paramName, paramsValue] = scenarioOrQueryParam.split("=");

        return (
          Object.prototype.hasOwnProperty.call(this.request.query, paramName) &&
          this.request.query[paramName] === paramsValue
        );
      }

      return getActiveScenarios().includes(scenarioOrQueryParam);
    });
  };

  public getMockDirectory() {
    const urlPath = this.request.path.split(/\/+/).slice(0, -1);

    const directoryPath = urlPath.map(encodeFilename).join("/");

    if (typeof this.options.mocksDirectory === "function") {
      return this.options.mocksDirectory(directoryPath);
    }

    return `${this.options.mocksDirectory}${directoryPath}`;
  }

  public getMockPath() {
    return [this.getMockDirectory(), this.getMockFilename()].join("/");
  }
}
