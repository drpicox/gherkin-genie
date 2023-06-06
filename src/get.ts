import { StepDefinitionsContext } from "./utils/StepDefinitionsContext";

export function get<T>(stepDefinitionsClass: new () => T): T {
  const contextGet = StepDefinitionsContext.get;

  if (!contextGet)
    throw new Error(
      "You can only use get() inside a StepDefinitionsClass constructor while creating feature tests"
    );

  return contextGet(stepDefinitionsClass);
}
