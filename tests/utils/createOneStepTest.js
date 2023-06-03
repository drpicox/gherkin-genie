const { createFeatureTests } = require("../../index");

function createOneStepTest(step, stepsConstructors) {
  createFeatureTests(
    ["Feature: Example", "  Scenario: First", `    ${step}`].join("\n"),
    stepsConstructors
  );
}
exports.createOneStepTest = createOneStepTest;
