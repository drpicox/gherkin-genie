import { ExtendedStep } from "../ExtendedPickle";
import { StepDefinitions, StepDefinitionsClass } from "../StepDefinitions";
import { StepMethodContext } from "./StepMethodContext";

type GetFn = <T>(stepDefinitionsClass: new () => T) => T;

export class StepDefinitionsContext {
  #stepMethods: { [matchName: string]: StepMethodContext } = {};

  #beforeEach: (() => void | Promise<void>)[] = [];

  #afterEach: (() => void | Promise<void>)[] = [];

  #instances: Map<StepDefinitionsClass, StepDefinitions> = new Map();

  #instanceStack: StepDefinitionsClass[] = [];

  constructor(nestedStepDefinitionsClasses: any) {
    StepDefinitionsContext.get = this.#get.bind(this);

    const stepDefinitionsClasses: StepDefinitionsClass[] =
      nestedStepDefinitionsClasses.flat(Infinity);

    stepDefinitionsClasses.forEach((StepDefinitionsClass) =>
      this.#get(StepDefinitionsClass)
    );

    StepDefinitionsContext.get = null;
  }

  static get: GetFn | null = null;

  getMatchNames() {
    return Object.values(this.#stepMethods).map((stepMethod) =>
      stepMethod.getMatchName()
    );
  }

  async runMethod(step: ExtendedStep, stepArgument: any) {
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
  #instanceStepDefinitionsClass(Constructor: StepDefinitionsClass) {
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

  #get(Constructor: StepDefinitionsClass) {
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
}
