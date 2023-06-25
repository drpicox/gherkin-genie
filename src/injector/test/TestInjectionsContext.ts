import { InjectionContext } from "../InjectionContext";
import { StepDefinitionsContext } from "../steps/StepDefinitionsContext";

export class TestInjectionsContext implements InjectionContext {
  #delegate: InjectionContext;

  constructor(stepDefinitionsContext: StepDefinitionsContext) {
    this.#delegate = stepDefinitionsContext;
  }

  get<T>(InjectionClass: new () => T): T {
    return this.#delegate.get(InjectionClass);
  }
}
