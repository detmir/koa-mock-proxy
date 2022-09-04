import fs from "fs";

const {
  promises: { readFile },
} = fs;
const fixturesDirectory = __dirname + "/../fixtures/";
export const recordDirectory =
  __dirname + "/../../node_modules/mock_proxy_cache/";

export const compareRecordedMockWithSnapshot = async (filename) => {
  const expectedContent = JSON.parse(
    await readFile(`${fixturesDirectory}${filename}`, "utf-8")
  );

  const realContent = JSON.parse(
    await readFile(`${recordDirectory}${filename}`, "utf-8")
  );

  expect(realContent).toMatchObject(expectedContent);
};
