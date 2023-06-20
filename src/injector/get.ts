import { StepDefinitionsContext } from "./StepDefinitionsContext";
import { currentInjectionContext } from "./currentInjectionContext";

export function get<T>(stepDefinitionsClass: new () => T): T {
  return currentInjectionContext.get(stepDefinitionsClass);
}
