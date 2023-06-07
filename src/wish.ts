import { StepDefinitionsClasses } from "./StepDefinitions";
import { readFeatureSync } from "./features/readFeatureSync";
import { createFeatureTests } from "./features/createFeatureTests";
import { TestFn, configuration } from "./configuration";
import { get } from "./injector/get";

/**
 * Wishes for creating the tests for a given Feature file.
 *
 * @param featurePath file path of the feature to create tests for
 * @param stepDefinitionClasses an array of all the steps constructors classes
 */
export function wish(
  featurePath: string,
  stepDefinitionClasses?: Array<StepDefinitionsClasses>
): void;

/**
 * Wishes for the instance of a given StepDefinitions class.
 *
 * @param Class file path of the feature to create tests for
 * @returns the instance of the given StepDefinitions class
 */
export function wish<T>(Class: new () => T): T;

/**
 * Wish for a new configuration.
 *
 * @param configuration - The configuration object.
 * @param configuration.testFn -  wishes to test with this function
 */
export function wish(configuration: { testFn: TestFn }): void;

export function wish(
  Class: string | (new () => any) | { testFn: TestFn },
  stepDefinitionClasses?: Array<StepDefinitionsClasses>
) {
  if (typeof Class === "function") {
    return get(Class);
  }
  if (typeof Class === "string") {
    const feature = readFeatureSync(Class);

    return createFeatureTests(feature, stepDefinitionClasses);
  }
  if (typeof Class === "object") {
    return configuration.wish(Class);
  }
  throw new Error("🧞‍♂️ I did not understand your wish.");
}
