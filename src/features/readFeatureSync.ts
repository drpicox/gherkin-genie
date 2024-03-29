import { readFileSync } from "fs";
import path from "path";

export function readFeatureSync(featurePath: string) {
  const absolutePath = getAbsolutePath(featurePath);
  const feature = readFileSync(absolutePath, "utf8");
  return feature;
}

export function getAbsolutePath(relativePath: string) {
  const isAlreadyAbsolute =
    !relativePath.startsWith("./") && !relativePath.startsWith("../");
  if (isAlreadyAbsolute) return relativePath;

  // Get the stack trace
  const stackTrace = new Error().stack.split("\n");

  // The calling script should be the fourth element in the stack trace array
  // You might need to adjust the index depending on the specifics of your setup
  const callerScriptPath = (stackTrace[4].match(/^\s+at\s(.*):\d+:\d+$/) ||
    stackTrace[4].match(/\((.*):\d+:\d+\)$/))[1];

  // Use path.dirname to get the directory of the calling script
  const callerScriptDir = path.dirname(callerScriptPath);

  // Use path.resolve to get an absolute path to the feature file
  const absoluteFeaturePath = path.resolve(callerScriptDir, relativePath);

  return absoluteFeaturePath;
}
