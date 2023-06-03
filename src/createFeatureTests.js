exports.createFeatureTests = createFeatureTests;

const { compileFeature } = require("./utils/compileFeature");
const { configuration } = require("./configuration");
const { StepsRunner } = require("./utils/StepsRunner");
const { StepDefinitionsContext } = require("./utils/StepDefinitionsContext");

/**
 * Create the tests for a given Feature.
 *
 * @param {string} feature to create tests for
 * @param {Array<import("./StepDefinitions").StepDefinitionsClasses>} stepDefinitionClasses an array of all the steps constructors classes
 * @returns {void} nothing
 */
function createFeatureTests(feature, stepDefinitionClasses = []) {
  const pickles = compileFeature(feature);
  const stepDefinitionsContext = new StepDefinitionsContext(
    stepDefinitionClasses
  );

  verifySteps(stepDefinitionsContext, pickles);

  const stepsRunner = new StepsRunner(stepDefinitionsContext);

  pickles.forEach((pickle) => {
    configuration.getTestFn()(pickle.fullName, async () => {
      await stepsRunner.run(pickle);
    });
  });
}

/**
 *
 * @param {StepDefinitionsContext} stepDefinitionsContext
 * @param {import("./ExtendedPickle").ExtendedPickle[]} pickles
 */
function verifySteps(stepDefinitionsContext, pickles) {
  const validNames = new Set(stepDefinitionsContext.getMatchNames());
  const isTs = /at.*\.ts(x)?:\d/.test(new Error().stack);

  let missingSteps = [];
  pickles.forEach((pickle) => {
    pickle.steps.forEach((step) => {
      const { matchName, keyword } = step;
      if (validNames.has(matchName)) return;

      const expectedMethodName = `${keyword.toLowerCase().trim()}${matchName}`;

      let number = 1;
      let string = 1;
      const args = step.arguments.map((arg) => {
        if (typeof arg === "number")
          return `number${number++}${isTs ? ": number" : ""}`;
        if (typeof arg === "string")
          return `string${string++}${isTs ? ": string" : ""}`;
        return "any";
      });

      if (step.argument?.docString)
        args.push(`docString${isTs ? ": string" : ""}`);
      if (step.argument?.dataTable) {
        const tableType = deduceTableType(step.argument.dataTable);
        args.push(`table${isTs ? `: ${tableType}[]` : ""}`);
      }

      const body = '{\n    throw new Error("Unimplemented");\n  }';

      missingSteps.push(`  ${expectedMethodName}(${args.join(", ")}) ${body}`);
      validNames.add(matchName);
    });
  });

  if (!missingSteps.length) return;

  throw new Error(
    [
      "There are missing steps. Please implement them:",
      "",
      "class MissingSteps {",
      missingSteps.join("\n\n"),
      "}",
    ].join("\n")
  );
}

function deduceTableType(table) {
  const fields = table.rows[0].cells.map((c) => c.value);
  const types = fields.map((f) => `${f}: string`);
  return `{ ${types.join(", ")} }`;
}
