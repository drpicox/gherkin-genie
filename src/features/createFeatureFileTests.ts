import { readFileSync } from "fs";
import path from "path";
import { createFeatureTests } from "./createFeatureTests";

/**
 * Create the tests for a given Feature file.
 *
 * @param featurePath file path of the feature to create tests for
 * @param stepDefinitionClasses an array of all the steps constructors classes
 * @returns nothing
 */
export function createFeatureFileTests(
  featurePath: string,
  stepDefinitionClasses: Array<
    import("../runner/StepDefinitions").StepDefinitionsClasses
  > = []
) {
  featurePath = getAbsolutePath(featurePath);
  const feature = readFileSync(featurePath, "utf8");

  createFeatureTests(feature, stepDefinitionClasses);
}

function getAbsolutePath(relativePath: string) {
  const isAlreadyAbsolute =
    !relativePath.startsWith("./") && !relativePath.startsWith("../");
  if (isAlreadyAbsolute) return relativePath;

  // Get the stack trace
  const stackTrace = new Error().stack.split("\n");

  // The calling script should be the fourth element in the stack trace array
  // You might need to adjust the index depending on the specifics of your setup
  const callerScriptPath = stackTrace[3].match(/\((.*):\d+:\d+\)$/)[1];

  // Use path.dirname to get the directory of the calling script
  const callerScriptDir = path.dirname(callerScriptPath);

  // Use path.resolve to get an absolute path to the feature file
  const absoluteFeaturePath = path.resolve(callerScriptDir, relativePath);

  return absoluteFeaturePath;
}
