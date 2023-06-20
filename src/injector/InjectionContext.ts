export interface InjectionContext {
  get<T>(InjectionClass: new () => T): T;
}
