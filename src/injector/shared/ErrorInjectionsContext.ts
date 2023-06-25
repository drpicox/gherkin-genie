import { InjectionContext } from "../InjectionContext";

export class ErrorInjectionsContext implements InjectionContext {
  #message: string;

  constructor(message: string) {
    this.#message = message;
  }

  has<T>(InjectionClass: new () => T): boolean {
    return false;
  }

  get<T>(InjectionClass: new () => T): T {
    throw new Error(this.#message);
  }
}
