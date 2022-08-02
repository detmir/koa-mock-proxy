import { MockProxyOptions } from "../../types";
import { getCombinedOptions } from "../getCombinedOptions";
import { FileLocator } from "../FileLocator";
import { Context } from "koa";
import { setActiveScenarios } from "../scenarioStorage";

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

  describe("Check isFileMatched", () => {
    const ctx: Context = {
      method: "GET",
      path: "/test/request",
      query: {
        a: "b",
        c: "d",
      } as any,
    } as Context;

    const options: MockProxyOptions = getCombinedOptions(ctx, {
      mocksDirectory: __dirname,
      targetUrl: "http://11",
    });
    const fileLocator = new FileLocator(options, ctx);

    it("Match file without query params", () => {
      expect(fileLocator.isFileMatched("GET_request.json")).toBe(true);
    });

    it("Another file doesn't match", () => {
      expect(fileLocator.isFileMatched("GET_request2.json")).toBe(false);
    });

    it("Match file with same query params", () => {
      expect(fileLocator.isFileMatched("GET_request.a=b.json")).toBe(true);
      expect(fileLocator.isFileMatched("GET_request.c=d.a=b.json")).toBe(true);
    });

    it("Match file with scenario", () => {
      setActiveScenarios("a");

      expect(fileLocator.isFileMatched("GET_request.a.json")).toBe(true);
    });

    it("Doesn't match file with different query params", () => {
      expect(fileLocator.isFileMatched("GET_request.a=c.json")).toBe(false);
      expect(fileLocator.isFileMatched("GET_request.x=b.json")).toBe(false);
    });
  });
});
