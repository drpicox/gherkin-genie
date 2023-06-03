const { StepMethodContext } = require("./StepMethodContext");

/**
 * @template {import("../StepDefinitions").StepDefinitions} T
 * @typedef {(import("../StepDefinitions").StepDefinitionsClass<T>) => T} GetFn
 */

exports.StepDefinitionsContext = class StepDefinitionsContext {
  /** @type {{[matchName: string]: StepMethodContext}} */
  #stepMethods = {};

  /** @type {(() => void | Promise<void>)[]} */
  #beforeEach = [];

  /** @type {(() => void | Promise<void>)[]} */
  #afterEach = [];

  /** @type {Map<import("../StepDefinitions").StepDefinitionsClass, import("../StepDefinitions").StepDefinitions>} */
  #instances = new Map();

  /** @type {import("../StepDefinitions").StepDefinitionsClass[]} */
  #instanceStack = [];

  constructor(nestedStepDefinitionsClasses) {
    StepDefinitionsContext.get = this.#get.bind(this);

    /** @type {import("../StepDefinitions").StepDefinitionsClass[]} */
    const stepDefinitionsClasses = nestedStepDefinitionsClasses.flat(Infinity);

    stepDefinitionsClasses.forEach((StepDefinitionsClass) =>
      this.#get(StepDefinitionsClass)
    );

    StepDefinitionsContext.get = null;
  }

  /** @type {GetFn} */
  static get = null;

  getMatchNames() {
    return Object.values(this.#stepMethods).map((stepMethod) =>
      stepMethod.getMatchName()
    );
  }

  /**
   * Runs an step.
   *
   * @param {import("../ExtendedPickle").ExtendedStep} step
   * @returns {Promise<void>}
   */
  async runMethod(step, stepArgument) {
    const stepMethod = this.#stepMethods[step.matchName];

    await stepMethod.run(...step.arguments, stepArgument);
  }

  async runBeforeEach() {
    for (let i = 0; i < this.#beforeEach.length; i++) {
      const fn = this.#beforeEach[i];
      await fn();
    }
  }

  async runAfterEach() {
    let firstError;
    for (let i = 0; i < this.#afterEach.length; i++) {
      const fn = this.#afterEach[i];
      try {
        await fn();
      } catch (error) {
        if (!firstError) firstError = error;
      }
    }
    if (firstError) throw firstError;
  }

  /**
   * @template {import("../StepDefinitions").StepDefinitions} T
   * @param {new () => T} Constructor
   * @returns {void}
   */
  #instanceStepDefinitionsClass(Constructor) {
    if (this.#instances.has(Constructor)) return;

    const instance = new Constructor();
    this.#instances.set(Constructor, instance);

    const proto = Constructor.prototype;
    const methods = Object.getOwnPropertyNames(proto);

    methods.forEach((methodName) => {
      const matchName = methodName.replace(
        /^(given|when|then|and|but)([A-Z])/,
        "$2"
      );
      if (methodName === matchName) return;

      const stepMethod = new StepMethodContext(matchName, methodName, instance);
      const previousStepMethod = this.#stepMethods[matchName];

      if (previousStepMethod) stepMethod.throwConflictError(previousStepMethod);

      this.#stepMethods[matchName] = stepMethod;
    });

    if (instance.beforeEach)
      this.#beforeEach.push(instance.beforeEach.bind(instance));

    if (instance.afterEach)
      this.#afterEach.push(instance.afterEach.bind(instance));
  }

  #get(Constructor) {
    if (this.#instanceStack.includes(Constructor))
      throw new Error(
        "Circular dependency detected while creating feature tests: " +
          this.#instanceStack
            .map((Constructor) => Constructor.name)
            .join(" -> ") +
          " -> " +
          Constructor.name
      );

    this.#instanceStack.push(Constructor);
    try {
      this.#instanceStepDefinitionsClass(Constructor);
      return this.#instances.get(Constructor);
    } finally {
      this.#instanceStack.pop();
    }
  }
};
