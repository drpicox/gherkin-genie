import { createFeatureTests } from "./createFeatureTests";
import { readFeatureSync } from "./readFeatureSync";

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
    import("../StepDefinitions").StepDefinitionsClasses
  > = []
) {
  const feature = readFeatureSync(featurePath);

  createFeatureTests(feature, stepDefinitionClasses);
}
