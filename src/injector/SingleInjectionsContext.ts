export class SingleInjectionsContext {
  #instances: Map<new () => any, any> = new Map();
  #instanceStack: any[] = [];

  has<T>(InjectionClass: new () => T) {
    return this.#instances.has(InjectionClass);
  }

  get<T>(InjectionClass: new () => T): T {
    if (this.#instances.has(InjectionClass))
      return this.#instances.get(InjectionClass);

    if (this.#instanceStack.includes(InjectionClass))
      throw new Error(
        "Circular dependency detected while injecting a dependency: " +
          this.#instanceStack
            .map((InjectionClass) => InjectionClass.name)
            .join(" -> ") +
          " -> " +
          InjectionClass.name
      );

    this.#instanceStack.push(InjectionClass);
    try {
      const instance = new InjectionClass();
      this.#instances.set(InjectionClass, instance);
      return instance;
    } finally {
      this.#instanceStack.pop();
    }
  }
}
