import { StepDefinitionsContext } from "./StepDefinitionsContext";

export function get<T>(stepDefinitionsClass: new () => T): T {
  const contextGet = StepDefinitionsContext.get;

  if (!contextGet)
    throw new Error(
      "You can only wish for getting other StepDefinitions instances inside a StepDefinitionsClass constructor while creating feature tests"
    );

  return contextGet(stepDefinitionsClass);
}
