import { MockProxyOptions } from "../../types";
import { getCombinedOptions } from "../getCombinedOptions";
import { FileLocator } from "../FileLocator";
import { Context } from "koa";

describe("FileLocator should", () => {
  it("generate filename without getFilenamePostfix", () => {
    const ctx: Context = {
      method: "GET",
      path: "/test/request",
    } as Context;

    const options: MockProxyOptions = getCombinedOptions(ctx, {
      mocksDirectory: __dirname,
      targetUrl: "http://11",
    });
    const fileLocator = new FileLocator(options, ctx);

    expect(fileLocator.getMockDirectory()).toBe(`${__dirname}/test`);
    expect(fileLocator.getMockFilename()).toBe("GET_request.json");
  });

  it("generate filename with getFilenamePostfix", () => {
    const ctx: Context = {
      method: "GET",
      path: "/test/request",
    } as Context;

    const options: MockProxyOptions = getCombinedOptions(ctx, {
      mocksDirectory: __dirname,
      targetUrl: "http://11",
      recordOptions: {
        getFilenamePostfix: (ctx) => ctx.method.toLowerCase(),
      },
    });
    const fileLocator = new FileLocator(options, ctx);

    expect(fileLocator.getMockDirectory()).toBe(`${__dirname}/test`);
    expect(fileLocator.getMockFilename()).toBe("GET_request_get.json");
  });
});
