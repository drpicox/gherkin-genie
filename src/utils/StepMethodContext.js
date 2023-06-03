class StepMethodContext {
  /** @type {string} */
  #matchName;

  /** @type {string} */
  #methodName;

  /** @type {import("../StepDefinitions").StepDefinitions} */
  #stepDefinitions;

  /**
   * @param {string} matchName
   * @param {string} methodName
   * @param {import("../StepDefinitions").StepDefinitionsClass} stepDefinitions
   */
  constructor(matchName, methodName, stepDefinitions) {
    this.#matchName = matchName;
    this.#methodName = methodName;
    this.#stepDefinitions = stepDefinitions;
  }

  async run(...args) {
    return this.#stepDefinitions[this.#methodName](...args);
  }

  getMatchName() {
    return this.#matchName;
  }

  /**
   * Throws an error because the step method is already defined.
   *
   * @param {StepMethodContext} existing
   */
  throwConflictError(existing) {
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
exports.StepMethodContext = StepMethodContext;
