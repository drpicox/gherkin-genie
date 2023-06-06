import { StepDefinitions } from "../StepDefinitions";

export class StepMethodContext {
  #matchName: string;

  #methodName: string;

  #stepDefinitions: StepDefinitions;

  constructor(
    matchName: string,
    methodName: string,
    stepDefinitions: StepDefinitions
  ) {
    this.#matchName = matchName;
    this.#methodName = methodName;
    this.#stepDefinitions = stepDefinitions;
  }

  async run(...args: any[]) {
    return this.#stepDefinitions[this.#methodName](...args);
  }

  getMatchName() {
    return this.#matchName;
  }

  /**
   * Throws an error because the step method is already defined.
   */
  throwConflictError(existing: StepMethodContext) {
    const matchName = this.#matchName;

    const aClassName = existing.#stepDefinitions.constructor.name;
    const aMethodName = existing.#methodName;

    const bClassName = this.#stepDefinitions.constructor.name;
    const bMethodName = this.#methodName;

    throw new Error(
      [
        `Duplicate step definition: "*${matchName}"`,
        `The methods is defined by both:`,
        `  - ${aClassName}.${aMethodName}()`,
        `  - ${bClassName}.${bMethodName}()`,
      ].join("\n")
    );
  }
}
