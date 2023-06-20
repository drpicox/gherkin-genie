import { InjectionContext } from "./InjectionContext";

class CurrentInjectionContext implements InjectionContext {
  #current: InjectionContext | null = null;

  get<T>(InjectionClass: new () => T): T {
    if (!this.#current)
      throw new Error(
        "No current injection context. Did you forget to call wish(StepsClass) inside a step definition?"
      );

    return this.#current.get(InjectionClass);
  }

  setCurrent(current: InjectionContext) {
    this.#current = current;
  }

  resetCurrent() {
    this.#current = null;
  }
}

export const currentInjectionContext = new CurrentInjectionContext();
