import { InjectionContext } from "./InjectionContext";

class CurrentInjectionContext implements InjectionContext {
  #current: InjectionContext | null = null;

  has<T>(InjectionClass: new () => T): boolean {
    if (!this.#current) return false;

    return this.#current.has(InjectionClass);
  }

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
