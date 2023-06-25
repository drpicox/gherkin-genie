import { InjectionContext } from "../InjectionContext";
import { SingleInjectionsContext } from "../shared/SingleInjectionsContext";
import { StepDefinitionsContext } from "../steps/StepDefinitionsContext";

export class TestInjectionsContext implements InjectionContext {
  #steps: StepDefinitionsContext;
  #tests: SingleInjectionsContext = new SingleInjectionsContext();

  constructor(stepDefinitionsContext: StepDefinitionsContext) {
    this.#steps = stepDefinitionsContext;
  }

  has<T>(InjectionClass: new () => T): boolean {
    return this.#steps.has(InjectionClass) || this.#tests.has(InjectionClass);
  }

  get<T>(InjectionClass: new () => T): T {
    if (this.#steps.has(InjectionClass)) {
      return this.#steps.get(InjectionClass);
    }

    return this.#tests.get(InjectionClass);
  }
}
