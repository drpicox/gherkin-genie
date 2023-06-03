const { createFeatureTests } = require("./src/createFeatureTests");
const { createFeatureFileTests } = require("./src/createFeatureFileTests");
const { configuration } = require("./src/configuration");
const { get } = require("./src/get");

/** @typedef {import("./src/StepDefinitions").StepMethod} StepMethod */
/** @typedef {import("./src/StepDefinitions").StepDefinitions} StepDefinitions */
/** @typedef {import("./src/StepDefinitions").StepDefinitionsClass} StepDefinitionsClass */
/** @typedef {import("./src/StepDefinitions").StepDefinitionsClasses} StepDefinitionsClasses */

module.exports = {
  createFeatureTests,
  createFeatureFileTests,
  get,
  configuration,
};
