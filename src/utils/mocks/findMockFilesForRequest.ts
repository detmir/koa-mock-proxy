import { MockFileLocator } from "./MockFileLocator";
import { log } from "../log";
import path from "path";
import fs from "fs";

const getFilenameWeight = (filename: string) => {
  // remove first part and extension
  const conditionalFragments = filename.split(".").slice(0, -1);

  let weight = 0;

  // js should have more priority than json
  if (filename.endsWith("js")) {
    weight += 1;
  }

  return (
    conditionalFragments
      // filter by query parameters adds 10 to weight
      // filter by scenario adds 100 to weight
      .reduce<number>(
        (acc, fragment) => acc + (fragment.includes("=") ? 10 : 100),
        weight
      )
  );
};
export const findMockFilesForRequest = async (ctx, options) => {
  const fileLocator = new MockFileLocator(options, ctx);

  log("debug", `Mock filename: ${fileLocator.getMockPath()}`, ctx);

  const directory = path.resolve(fileLocator.getMockDirectory());

  const files = await fs.promises.readdir(directory, { withFileTypes: true });

  const filesWithWeights = files
    .filter((file) => {
      if (!file.isFile()) {
        return false;
      }

      return fileLocator.isFileMatched(file.name);
    })
    .map((file) => ({
      filename: file.name,
      // find the most specific filename
      weight: getFilenameWeight(file.name),
    }));

  if (!filesWithWeights.length) {
    return null;
  }

  filesWithWeights.sort(
    ({ weight: weight1 }, { weight: weight2 }) => weight2 - weight1
  );

  log(
    "debug",
    `Appropriate files found for request: ${JSON.stringify(filesWithWeights)}`,
    ctx
  );

  return filesWithWeights.map(({ filename }) => `${directory}/${filename}`);
};
