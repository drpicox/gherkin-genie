import { ExtendedStep } from "../../features/ExtendedStep";
import { StepDefinitions, StepDefinitionsClass } from "../../StepDefinitions";
import { SingleInjectionsContext } from "../shared/SingleInjectionsContext";
import { InjectionContext } from "../InjectionContext";
import { StepMethodContext } from "./StepMethodContext";

export class StepDefinitionsContext implements InjectionContext {
  #stepMethods: { [matchName: string]: StepMethodContext } = {};

  #beforeEach: (() => void | Promise<void>)[] = [];

  #afterEach: (() => void | Promise<void>)[] = [];

  #injectionsContext = new SingleInjectionsContext();

  getMatchNames() {
    return Object.values(this.#stepMethods).map((stepMethod) =>
      stepMethod.getMatchName()
    );
  }

  has<T>(InjectionClass: new () => T): boolean {
    return this.#injectionsContext.has(InjectionClass);
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

  getAll(nestedStepDefinitionsClasses: any): StepDefinitions[] {
    const stepDefinitionsClasses: StepDefinitionsClass[] =
      nestedStepDefinitionsClasses.flat(Infinity);

    return stepDefinitionsClasses.map((StepDefinitionsClass) =>
      this.get(StepDefinitionsClass)
    );
  }

  get<T>(Constructor: new () => T): T {
    const hadInstance = this.#injectionsContext.has(Constructor);
    const instance = this.#injectionsContext.get(Constructor);
    if (!hadInstance) this.#registerSteps(instance as StepDefinitions);

    return instance;
  }

  #registerSteps(instance: StepDefinitions) {
    const proto = instance.constructor.prototype;
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
}
