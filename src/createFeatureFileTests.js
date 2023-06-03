const { readFileSync } = require("fs");
const path = require("path");
const { createFeatureTests } = require("./createFeatureTests");

/**
 * Create the tests for a given Feature file.
 *
 * @param {string} featurePath file path of the feature to create tests for
 * @param {Array<import("./StepDefinitions").StepDefinitionsClasses>} stepDefinitionClasses an array of all the steps constructors classes
 * @returns {void} nothing
 */
exports.createFeatureFileTests = function createFeatureFileTests(
  featurePath,
  stepDefinitionClasses = []
) {
  if (featurePath.startsWith("./") || featurePath.startsWith("../")) {
    featurePath = getAbsolutePath(featurePath);
  }

  const feature = readFileSync(featurePath, "utf8");
  createFeatureTests(feature, stepDefinitionClasses);
};

function getAbsolutePath(relativePath) {
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
