import { getCombinedOptions } from "../src/getCombinedOptions";
import { Context } from "koa";

describe("Read config from env", () => {
  describe("Read KOA_MOCK_PROXY_MODE", () => {
    it("Mode taken from env", () => {
      process.env.KOA_MOCK_PROXY_MODE = "record";
      expect(
        getCombinedOptions({} as Context, {
          targetUrl: "test",
        })
      ).toHaveProperty("mode", "record");
    });

    it("Mode from env can be overwritten", () => {
      process.env.KOA_MOCK_PROXY_MODE = "record";
      expect(
        getCombinedOptions({} as Context, {
          targetUrl: "test",
          mode: "replay",
        })
      ).toHaveProperty("mode", "replay");
    });
  });

  describe("Read KOA_MOCK_PROXY_TARGET_URL", () => {
    it("Target url taken from env", () => {
      process.env.KOA_MOCK_PROXY_TARGET_URL = "http://test";
      expect(getCombinedOptions({} as Context, {})).toHaveProperty(
        "targetUrl",
        "http://test"
      );
    });

    it("Target url from env can be overwritten", () => {
      process.env.KOA_MOCK_PROXY_TARGET_URL = "http://test";
      expect(
        getCombinedOptions({} as Context, {
          targetUrl: "http://overwriten",
        })
      ).toHaveProperty("targetUrl", "http://overwriten");
    });
  });

  describe("Read KOA_MOCK_PROXY_DIRECTORY", () => {
    it("Mocks directory taken from env", () => {
      process.env.KOA_MOCK_PROXY_DIRECTORY = "test";
      expect(getCombinedOptions({} as Context, {})).toHaveProperty(
        "mocksDirectory",
        "test"
      );
    });

    it("Mocks directory can be overwritten", () => {
      process.env.KOA_MOCK_PROXY_DIRECTORY = "test";
      expect(
        getCombinedOptions({} as Context, {
          mocksDirectory: "overwriten",
        })
      ).toHaveProperty("mocksDirectory", "overwriten");
    });
  });
});
