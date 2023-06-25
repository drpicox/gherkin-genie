import path from "path";
import { PickleTable } from "@cucumber/messages";
import { compileFeature } from "./compileFeature";
import { configuration } from "../configuration";
import { StepsRunner } from "../runner/StepsRunner";
import {
  StepDefinitionsContext,
  currentInjectionContext,
  ErrorInjectionsContext,
} from "../injector";
import { StepDefinitionsClasses } from "../StepDefinitions";
import { ExtendedPickle } from "./ExtendedPickle";

/**
 * Create the tests for a given Feature.
 *
 * @param  feature to create tests for
 * @param  stepDefinitionClasses an array of all the steps constructors classes
 * @returns nothing
 */
export function createFeatureTests(
  feature: string,
  stepDefinitionClasses: StepDefinitionsClasses[] = []
) {
  const pickles = compileFeature(feature);
  const stepDefinitionsContext = new StepDefinitionsContext();
  currentInjectionContext.setCurrent(stepDefinitionsContext);
  stepDefinitionsContext.getAll(stepDefinitionClasses);
  currentInjectionContext.resetCurrent();

  verifySteps(stepDefinitionsContext, pickles);

  const stepsRunner = new StepsRunner(stepDefinitionsContext);

  pickles.forEach((pickle) => {
    configuration.getTestFn()(pickle.fullName, async () => {
      await stepsRunner.run(pickle);
    });
  });
}

function verifySteps(
  stepDefinitionsContext: StepDefinitionsContext,
  pickles: ExtendedPickle[]
) {
  const validNames = new Set(stepDefinitionsContext.getMatchNames());
  const isTs = computeIsTs();

  let missingSteps: string[] = [];
  pickles.forEach((pickle) => {
    pickle.steps.forEach((step) => {
      const { matchName, keyword } = step;
      if (validNames.has(matchName)) return;

      const expectedMethodName = `${keyword.toLowerCase().trim()}${matchName}`;

      let number = 1;
      let string = 1;
      const args = step.arguments.map((arg: any) => {
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
      "class WishedSteps {",
      missingSteps.join("\n\n"),
      "}",
    ].join("\n")
  );
}

function deduceTableType(table: PickleTable) {
  const fields = table.rows[0].cells.map((c: any) => c.value);
  const types = fields.map((f: any) => `${f}: string`);
  return `{ ${types.join(", ")} }`;
}

function computeIsTs() {
  const error = new Error();

  const errorStackArray = error.stack.split("\n");
  const entries = errorStackArray
    .map((stackLine) => stackLine.match(/\((.*):\d+:\d+\)/)?.[1])
    .filter(Boolean)
    .map((filePath) => ({
      path: path.dirname(filePath),
      type: filePath.split(".").pop(),
    }));

  const discardPath = entries[0].path;
  while (entries[0].path === discardPath) entries.shift();

  return !!entries.find((entry) => entry.type === "ts" || entry.type === "tsx");
}
